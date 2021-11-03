import { IGetStartedRequest, ILoginRequest, ILoginResponse } from '../../typing/IUser';
import bcrypt from 'bcrypt';
import Logger from '../../utils/logger';
import Customer, { ICustomer } from '../../models/customers';
import { generateRandomString } from '../../utils';
import { Mailing } from '../../contrib/mailing';


export class UserService {

  private readonly logger: Logger = new Logger('mono-portal:controllers/user/user.service');

  constructor() {}

  public async login(requestBody: ILoginRequest): Promise<ILoginResponse> {

    let customer;
    try {

      customer = await Customer.findOne({ email: requestBody.email }).populate({
        path: 'businesses',
        select:
          '_id firstName lastName name scope app email name phone business estimatedIncome bvn identity password',
        populate: 'app',
      })
      .lean();
      
    } catch (error) {
      return { error: true, message: error instanceof Error ? error.message : error }
    }

    if (!customer) return { error: true, message: 'Invalid email or password' };

    const passwordIsValid = bcrypt.compareSync(requestBody.password, customer.password);
    customer.password = undefined; // unset password hash from response data;
    return passwordIsValid 
    ? {
      error: false,
      message: 'Login Successful',
      data: customer
    } : {
      error: true,
      message: 'Invalid email or password',
    }
  }

  public async getStarted(requestBody: IGetStartedRequest): Promise<ICustomer | null> {

    try {
      const { phone, bvn } = requestBody;

      const customer = await Customer.findOne({ bvn, phone });
  
      if(!customer) return null;
  
      const emailOTP = generateRandomString(6, 'numbers');
      await Customer.findByIdAndUpdate(customer.id, { emailOTP });
  
      this.sendVerifcationCode(emailOTP, customer);
      return customer;
    } catch (error) {
      throw new Error(error);
    }


  }

  public async confirmEmail(otp: string, email: string): Promise<boolean> {
    const customer = await Customer.findOneAndUpdate(
      { emailOTP: otp, email },
      {
        emailVerified: true,
        $unset: {
          emailOTP: 1,
        },
      },
    );

    if(!customer) return false;
    // confirm what todo when account is confirmed (send email probably)
    return true;
  }

  public async createPassword(password: string, email: string): Promise<boolean> {

    const passwordHash = bcrypt.hashSync(password, 10);

    const customer = await Customer.findOneAndUpdate({
      emailVerified: true,
      email
    }, {
      password: passwordHash,
      canAccessPortal: true
    });
 
    if (!customer) return false;

    return true;

  }

  private async sendVerifcationCode(emailOTP: string, customer: ICustomer) {
    // TODO: Confirm mailing template for OTP
    await new Mailing()
      .send({
        from: `Mono <hi@mono.co>`,
        to: customer.email,
        subject: `Please verify your email`,
        text: 'Confirm your email to continue with Mono Portal',
        template: 'confirm_account',
        templateVariables: {
          firstName: customer.firstName,
          email: customer.email,
          code: emailOTP
        },
      })
      .catch(e => {
        this.logger.log(e)
      });

  }


}