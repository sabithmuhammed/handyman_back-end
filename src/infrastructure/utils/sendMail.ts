import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { OTP_TIMER } from "../constants/constants";

export default class SendMail {
    constructor(
        private transporter: nodemailer.Transporter = nodemailer.createTransport(
            {
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            }
        )
    ) {}
    sendMail(emailId: string, subject: string, content: string): void {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.MAIL_USERNAME,
            to: emailId,
            subject,
            html: content,
        };

        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log("Mail error: ", err);
            } else {
                console.log("Mail sent successfully");
            }
        });
    }

    generateMailTemplate(email: Mailgen.Content): string {
        // Configure mailgen by setting a theme and your product info
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                // Appears in header & footer of e-mails
                name: "handyMan",
                link: process.env.CORS_URL || "",
            },
        });

        // Generate an HTML email with the provided contents
        const emailBody = mailGenerator.generate(email);
        return emailBody;
    }
    sendOtpMail(emailId: string,name:string, otp: string): void {
        const subject = "handyMan email verification";

        const email = {
            body: {
                name:name,
                intro: "Welcome to handyMan! We're very excited to have you on board.",
                action: {
                    instructions: `Use this otp to verify your account. It will expire after ${(OTP_TIMER/60)/1000} minutes`,
                    button: {
                        color: "#22BC66", // Optional action button color
                        text: otp,
                        link: "#",
                    },
                },
                outro: "Do not share this otp with anyone.",
            },
        };
        const content = this.generateMailTemplate(email);
        this.sendMail(emailId, subject, content);
    }
}
