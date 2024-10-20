import { z } from "zod";

export const loginSchema = z.object({
    user: z
        .string({
            required_error: "User is required",
        })
        .min(1, {
            message: "User is required",
        }),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(1, {
            message: "Password is required",
        }),
});
