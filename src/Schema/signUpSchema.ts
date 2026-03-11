import {z} from "zod";

export const usernameValidation = z
.string()
.min(2, "Username must be atleast 2 characters")
.max(20, "Username must be less than 20 characters");

export const passwordValidation = z
.string()
.min(6 , "Password must be atleast 6 characters")
.max(10, "Password must be less than 10 characters");