import Mailgun from 'mailgun-js';
declare const mailgun: Mailgun.Mailgun;
export interface ISendMailInterface {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    templateVariables?: any;
}
export declare class Mailing {
    private readonly mailgun;
    constructor();
    send(data: ISendMailInterface): Promise<Mailgun.messages.SendResponse>;
}
export default mailgun;
