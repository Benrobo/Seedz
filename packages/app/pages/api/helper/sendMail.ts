import { ReactElement } from "react";
import resend from "../config/resend";
import { ProductCheckoutTemp } from "@/components/EmailTemplate";

interface SendMailProps {
  from?: string;
  to: string | string[];
  subject: string;
  template: ReactElement<any, any> | null;
}

const sendMail = async ({ from, to, subject, template }: SendMailProps) => {
  try {
    const data = await resend.emails.send({
      from: from ?? "Seedz <noreply@zlyst.site>",
      to,
      subject,
      react: template,
    });

    if (typeof (data as any)?.statusCode !== "undefined") {
      return { data, success: false };
    }

    console.log(`Email sent to: ${to}`);
    // You can return the response or perform any other actions
    return { data, success: true };
  } catch (e: any) {
    console.log(e);
    console.log(`Failed to send email: ${e.message}`);
    return { data: null, success: false };
  }
};

export default sendMail;
