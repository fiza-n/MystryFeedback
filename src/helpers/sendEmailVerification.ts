import {resend} from "../lib/resend"
import VerificationEmail from "../emails/VerificationEmail"
import {ApiResponse} from "../types/ApiResponse"

export async function sendEmailVerification(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse> {
    try {
     await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: VerificationEmail({ username,verifyCode });
      return {success : true, message: "Verification email sent successfully!"}
    }
     catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {success : false, message: "failed sending email verification"}
    }
}