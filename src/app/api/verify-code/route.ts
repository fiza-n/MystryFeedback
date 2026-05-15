import UserModel from "../../../model/User";
import { z } from "zod";
import dbConnect from "../../../lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
   const { username, code } = await request.json();



const codeValidation = z.string().length(6).safeParse(code)


if(!codeValidation.success){
    console.log("Zod errors:", codeValidation.error.format())
    return Response.json({
        success: false,
        message: 'Invalid code'
    },{ status: 400 })
}

const decodedUsername = decodeURIComponent(username);
const user = await UserModel.findOne({ username: decodedUsername });

console.log("=== CODE COMPARISON ===")
console.log("DB code:", user?.verifyCode)
console.log("DB code type:", typeof user?.verifyCode)
console.log("Entered code:", code)
console.log("Entered code type:", typeof code)
console.log("Strict equal ===:", user?.verifyCode === code)
console.log("Loose equal ==:", user?.verifyCode == code)
console.log("=======================")


    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.codeExpiration) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified!",
        },
        {
          status: 200,
        },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please signup again to get a new one.",
        },
        {
          status: 400,
        },
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid verification code. Please check the code and try again.",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      },
    );
  }
}
