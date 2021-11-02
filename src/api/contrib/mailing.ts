import Mailgun from 'mailgun-js';

const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});

export interface ISendMailInterface {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateVariables?: any;
}

export class Mailing {
  private readonly mailgun: Mailgun.Mailgun;

  constructor() {
    this.mailgun = mailgun;
  }

  send(data: ISendMailInterface) {
    let { templateVariables, ...rest} = data;
    if(templateVariables) {
      templateVariables = JSON.stringify(templateVariables);
    }

    return this.mailgun.messages().send({
      ...rest,
      "h:X-Mailgun-Variables": templateVariables ?? undefined,
    });
  }
}

export default mailgun;
