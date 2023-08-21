import { User } from "firebase/auth"
import { atom } from "jotai"
import { ToastInterface, zodPoints, zodProviders } from "./utils"
import { z } from "zod"

export const userAtom = atom<User | null | undefined>(undefined)
export const hiddenTabsAtom = atom<boolean>(false)
export const toastAtom = atom<ToastInterface | undefined>(undefined)

export const pointsAtom = atom<z.infer<typeof zodPoints> | undefined>(undefined)

export const providersAtom = atom<z.infer<typeof zodProviders> | undefined>(
	undefined,
)
