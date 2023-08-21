import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { useAtomValue, useSetAtom } from "jotai"
import { QRCodeSVG } from "qrcode.react"
import { useEffect } from "react"
import { hiddenTabsAtom, userAtom } from "../utils/store"

const Home = () => {
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	const user = useAtomValue(userAtom)
	useEffect(() => {
		setHiddenTabs(false)
	}, [setHiddenTabs])
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>QrCode</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-4 flex flex-col gap-y-8">
					<div className="flex flex-col gap-y-4 my-auto">
						{user && (
							<QRCodeSVG
								className="mx-auto"
								value={user.uid}
								size={300}
								includeMargin={true}
							/>
						)}
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Home
