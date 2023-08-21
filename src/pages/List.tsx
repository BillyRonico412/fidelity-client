import {
	IonContent,
	IonHeader,
	IonPage,
	IonSearchbar,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import PointItem from "../components/PointItem"
import { hiddenTabsAtom, pointsAtom, providersAtom } from "../utils/store"

const List = () => {
	const points = useAtomValue(pointsAtom)
	const providers = useAtomValue(providersAtom)
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	const [search, setSearch] = useState("")

	useEffect(() => {
		setHiddenTabs(false)
	}, [setHiddenTabs])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Liste</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-4 flex flex-col gap-y-8">
					<IonSearchbar
						onIonInput={(e) => {
							if (typeof e.detail.value === "string") {
								setSearch(e.detail.value)
							}
						}}
						value={search}
					/>
					<div className="flex flex-col gap-y-4">
						{providers &&
							points &&
							Object.entries(points)
								.filter(([key]) => {
									return providers[key].businessName
										.toLowerCase()
										.includes(search.toLowerCase())
								})
								.sort(([key1], [key2]) => {
									return providers[key1].businessName <
										providers[key2].businessName
										? -1
										: 1
								})
								.map(([key, value]) => (
									<PointItem
										key={key}
										businessName={providers[key].businessName}
										nbPoints={value}
									/>
								))}
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default List
