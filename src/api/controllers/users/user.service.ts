import { IGetStartedRequest } from '../../typing/IUser';
import Logger from '../../utils/logger';
import Customer, { ICustomer } from '../../models/customers';
import { generateRandomString } from '../../utils';
import { Mailing } from '../../contrib/mailing';


export class UserService {

  private readonly logger: Logger = new Logger('mono-portal:controllers/user/user.service');

  constructor() {}

  public async getStarted(requestBody: IGetStartedRequest): Promise<ICustomer | boolean{

    const { phone, bvn } = requestBody;

    const customer = await Customer.findOne({ bvn, phone });

    if(!customer) return false;

    const emailOTP = generateRandomString(6, 'numbers');
    await Customer.findByIdAndUpdate(customer.id, { emailOTP });

    this.sendVerifcationLink(emailOTP, customer);
    return customer;
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

  private async sendVerifcationLink(emailOTP: string, customer: ICustomer) {
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