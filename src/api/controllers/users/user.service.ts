import {
  IGetStartedRequest,
  ILoginRequest,
  ILoginResponse,
} from "../../typing/IUser";
import bcrypt from "bcrypt";
import Logger from "../../utils/logger";
import Customer, { ICustomer } from "../../models/customers";
import PortalUser from "../../models/portalUser";
import { generateRandomString } from "../../utils";
import { Mailing } from "../../contrib/mailing";
import redis from "../../contrib/cache";

export class UserService {
  private readonly logger: Logger = new Logger(
    "mono-portal:controllers/user/user.service"
  );

  constructor() {}

  public async login(requestBody: ILoginRequest): Promise<ILoginResponse> {
    let user;
    try {
      user = await PortalUser.findOne(
        { email: requestBody.email },
        "_id firstName lastName name email name phone bvn password customer"
      ).lean();
    } catch (error) {
      if (error instanceof Error) this.logger.log(error);

      return {
        error: true,
        message: error instanceof Error ? error.message : "An Error Occured",
      };
    }

    if (!user)
      return {
        error: true,
        message: "Invalid email or password",
      };

    const passwordIsValid = bcrypt.compareSync(
      requestBody.password,
      user.password
    );
    user.password = undefined; // unset password hash from response data;
    return passwordIsValid
      ? {
          error: false,
          message: "Login Successful",
          data: user,
        }
      : {
          error: true,
          message: "Invalid email or password",
        };
  }

  public async getStarted(
    requestBody: IGetStartedRequest
  ): Promise<ICustomer | null> {
    const { phone, bvn } = requestBody;

    // last four digits for bvn
    const customer = await Customer.findOne({
      bvn: { $regex: `${bvn}$` },
      phone,
    });
    const isExistsOnPortal = await PortalUser.findOne({
      bvn: { $regex: `${bvn}$` },
      phone,
    });

    if (!customer) return null;

    if (isExistsOnPortal) return null;

    const id = `getstarted-otp-${phone}`;
    let session = await redis.getAsync(id);

    if (session) return null;

    const emailOTP = generateRandomString(6, "numbers");

    const portalUser = this.formatNewPortalUserFromCustomerData(
      emailOTP,
      customer
    );

    const newPortalUser = new PortalUser(portalUser);
    await newPortalUser.save();

    if (!session) {
      const new_session = {
        count: 0,
        emailOTP,
        email: portalUser.email,
        firstName: portalUser.firstName,
        expiresAt: new Date().getTime() + 1 * 60 * 60 * 1000,
      };

      redis.set(id, JSON.stringify(new_session));
      redis.expire(id, 3600); // expires in 1hr
    }

    this.sendVerifcationCode(emailOTP, portalUser.email, portalUser.firstName);

    return customer;
  }

  public async resendOTP(
    requestBody: IGetStartedRequest
  ): Promise<{ error: boolean; message: string }> {
    const portalUser = await PortalUser.findOne({
      bvn: { $regex: `${requestBody.bvn}$` },
      phone: requestBody.phone,
    });

    if (portalUser?.emailVerified)
      return {
        error: true,
        message: "Email already verified",
      };

    const id = `getstarted-otp-${requestBody.phone}`;
    let session = await redis.getAsync(id);

    if (session) {
      session = JSON.parse(session);
      if (session.count === 3) {
        return {
          error: true,
          message:
            "Exceed 3 trials to resend OTP, please contact Mono Support Team",
        };
      }

      session.count = session.count + 1;
      redis.set(id, JSON.stringify(session));

      this.sendVerifcationCode(
        session.emailOTP,
        session.email,
        session.firstName
      );

      return {
        error: false,
        message: `OTP Successfully resent to ${session.email}, ${
          3 - session.count
        } resends left`,
      };
    }

    return {
      error: true,
      message: "Invalid Credentials",
    };
  }

  public async confirmEmail(otp: string, email: string): Promise<boolean> {
    const customer = await PortalUser.findOneAndUpdate(
      { emailOTP: otp, email },
      {
        emailVerified: true,
        $unset: {
          emailOTP: 1,
        },
      }
    );

    if (!customer) return false;
    // confirm what todo when account is confirmed (send email probably)
    return true;
  }

  public async createPassword(
    password: string,
    email: string
  ): Promise<boolean> {
    const passwordHash = bcrypt.hashSync(password, 10);

    const customer = await PortalUser.findOneAndUpdate(
      {
        emailVerified: true,
        email,
      },
      {
        password: passwordHash,
      }
    );

    if (!customer) return false;

    return true;
  }

  public async updatePassword(
    newPassword: string,
    oldPassword: string,
    email: string
  ): Promise<boolean> {
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    const oldCustomerData = await PortalUser.findOne({ email });

    const oldPasswordIsValid = bcrypt.compareSync(
      oldPassword,
      // @ts-ignore
      oldCustomerData.password
    );
    if (!oldPasswordIsValid) return false;

    const user = await PortalUser.findOneAndUpdate(
      {
        emailVerified: true,
        email,
      },
      {
        password: passwordHash,
      }
    );

    if (!user) return false;

    return true;
  }

  private formatNewPortalUserFromCustomerData(
    emailOTP: string,
    customer: ICustomer
  ) {
    return {
      firstName: customer.firstName,
      lastName: customer.lastName,
      name: customer.name,
      scope: customer.scope,
      email: customer.email,
      phone: customer.phone,
      bvn: customer.bvn,
      emailOTP,
      emailVerified: false,
    };
  }

  private async sendVerifcationCode(
    code: string,
    email: string,
    firstName: string
  ) {
    // TODO: Confirm mailing template for OTP
    await new Mailing()
      .send({
        from: `Mono <hi@mono.co>`,
        to: email,
        subject: `Please verify your email`,
        text: "Confirm your email to continue with Mono Portal",
        template: "confirm_account",
        templateVariables: {
          firstName,
          email,
          code,
        },
      })
      .catch((e) => {
        this.logger.log(e);
      });
  }
}
