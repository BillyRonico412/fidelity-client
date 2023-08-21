import PasswordValidator from "password-validator"
import { z } from "zod"

export interface ToastInterface {
	message: string
	color: "danger" | "success" | "warning"
}

export const passwordSchema = new PasswordValidator()
	.is()
	.min(8)
	.is()
	.max(100)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits()
	.has()
	.not()
	.spaces()

export const zodPoints = z.record(z.number())
export const zodProviders = z.record(
	z.object({
		businessName: z.string(),
	}),
)
