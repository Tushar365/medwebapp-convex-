// For a more customized implementation
import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

export const ResendProvider = Email({
  id: "resend",
  apiKey: process.env.AUTH_RESEND_KEY,
  async sendVerificationRequest({ identifier: email, provider, url }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "tusharthokdar10@gmail.com",
      to: [email],
      subject: `Sign in to Your App`,
      text: `Click this link to sign in: ${url}`,
    });

    if (error) {
      console.error(error);
      throw new Error("Could not send verification email");
    }
  },
});