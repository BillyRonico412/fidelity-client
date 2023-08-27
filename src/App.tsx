import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonToast,
	setupIonicReact,
	useIonAlert,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Redirect, Route } from "react-router-dom"
import Login from "./pages/login/Login"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/padding.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"

/* Tailwind css */
import "./tailwind.css"

/* Theme variables */
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, off, onValue, ref } from "firebase/database"
import { cogSharp, list, qrCodeSharp } from "ionicons/icons"
import { useAtom, useAtomValue } from "jotai"
import { Fragment, useCallback, useEffect } from "react"
import Home from "./pages/Home"
import List from "./pages/List"
import Setting from "./pages/Setting"
import CreateAccount from "./pages/login/CreateAccount"
import ForgotPassword from "./pages/login/ForgotPassword"
import "./theme/variables.css"
import {
	hiddenTabsAtom,
	pointsAtom,
	providersAtom,
	toastAtom,
	userAtom,
} from "./utils/store"
import { zodPoints, zodProviders } from "./utils/utils"

setupIonicReact()

const App = () => {
	const [user, setUser] = useAtom(userAtom)
	const [toast, setToast] = useAtom(toastAtom)
	const auth = getAuth()
	const hiddenTabs = useAtomValue(hiddenTabsAtom)
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUser(user)
		})
	}, [setUser, auth])

	const [present] = useIonAlert()

	const [providers, setProviders] = useAtom(providersAtom)
	const [, setPoints] = useAtom(pointsAtom)
	useEffect(() => {
		if (!user) {
			return
		}
		const db = getDatabase()
		const pointsRef = ref(db, `users/${user.uid}/points`)
		onValue(pointsRef, (snapshot) => {
			setPoints((points) => {
				const pointsParsed = zodPoints.nullable().parse(snapshot.val())
				if (pointsParsed === null) {
					return
				}
				const diff = Object.entries(pointsParsed).find(
					([key, value]) =>
						points === undefined ||
						(points !== undefined && points[key] !== value),
				)
				if (diff && providers) {
					const [key, value] = diff
					const pointDiff = (() => {
						if (points === undefined) {
							return value
						} else {
							return value - points[key]
						}
					})()
					present({
						header: `${providers[key].businessName}`,
						message: `Vous avez ${
							pointDiff < 0 ? "perdu" : "gagner"
						} ${Math.abs(pointDiff)} points`,
					})
				}
				return pointsParsed
			})
		})
		return () => {
			off(pointsRef)
		}
	}, [user, setPoints, providers, present])

	useEffect(() => {
		if (!user) {
			return
		}
		const db = getDatabase()
		const providersRef = ref(db, "providers")
		onValue(providersRef, (snapshot) => {
			const providersParsed = zodProviders.nullable().parse(snapshot.val())
			if (providersParsed === null) {
				return
			}
			setProviders(providersParsed)
		})
		return () => {
			off(providersRef)
		}
	}, [user, setProviders])

	const getComponentByAuthenticatedStatus = useCallback(
		(component: JSX.Element, showComponentWhenAuthenticated: boolean) => {
			if (user === undefined) {
				return <></>
			}
			if (user === null && showComponentWhenAuthenticated) {
				return <Redirect to="/login" />
			}
			if (user && !showComponentWhenAuthenticated) {
				return <Redirect to="/home" />
			}
			return component
		},
		[user],
	)

	return (
		<IonApp>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<Route
							exact={true}
							path="/login"
							render={() => getComponentByAuthenticatedStatus(<Login />, false)}
						/>
						<Route
							exact={true}
							path="/create-account"
							render={() =>
								getComponentByAuthenticatedStatus(<CreateAccount />, false)
							}
						/>
						<Route
							exact={true}
							path="/forgot-password"
							render={() =>
								getComponentByAuthenticatedStatus(<ForgotPassword />, false)
							}
						/>
						<Route
							exact={true}
							path="/home"
							render={() => getComponentByAuthenticatedStatus(<Home />, true)}
						/>
						<Route
							exact={true}
							path="/list"
							render={() => getComponentByAuthenticatedStatus(<List />, true)}
						/>
						<Route
							exact={true}
							path="/setting"
							render={() =>
								getComponentByAuthenticatedStatus(<Setting />, true)
							}
						/>
						<Route
							exact={true}
							path="/"
							render={() => {
								if (user === undefined) {
									return <Fragment />
								}
								if (user === null) {
									return <Redirect to="/login" />
								}
								return <Redirect to="/home" />
							}}
						/>
					</IonRouterOutlet>
					<IonTabBar slot="bottom" hidden={hiddenTabs}>
						<IonTabButton tab="qrCode" href="/home">
							<IonIcon icon={qrCodeSharp} />
							<IonLabel class="font-semibold">QrCode</IonLabel>
						</IonTabButton>
						<IonTabButton tab="list" href="/list">
							<IonIcon icon={list} />
							<IonLabel class="font-semibold">Liste</IonLabel>
						</IonTabButton>
						<IonTabButton tab="paramètre" href="/setting">
							<IonIcon icon={cogSharp} />
							<IonLabel class="font-semibold">Paramètre</IonLabel>
						</IonTabButton>
					</IonTabBar>
				</IonTabs>
			</IonReactRouter>
			<IonToast
				isOpen={toast !== undefined}
				message={toast?.message}
				onDidDismiss={() => {
					setToast(undefined)
				}}
				color={toast?.color}
				duration={3000}
			/>
		</IonApp>
	)
}

export default App
