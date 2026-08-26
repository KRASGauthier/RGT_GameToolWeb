import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type Context,
	type ReactNode,
} from "react";
import type { IAppNotif, IAppNotifContext } from "../../types/TEvents";
import { Stack } from "@mui/material";
import { appTheme } from "../../../src/style/theme";
import CAlertNotif from "../../components/feedback/alerts/CAlertNotif";

//====================== CONTEXT ======================
const notifContext: Context<IAppNotifContext> = createContext<IAppNotifContext>({
	notifications: [],
	push: () => {},
});

export const useNotif = (): IAppNotifContext => {
	return useContext(notifContext);
};

//====================== STRUCT ======================
interface CAppNotifContextProps {
	children: ReactNode;
}

function CAppNotifContext({ children }: CAppNotifContextProps) {
	const [notifications, setNotifications] = useState<IAppNotif[]>([]);

	const notifs: ReactNode[] = useMemo((): ReactNode[] => {
		return notifications.map((notif: IAppNotif) => {
			if (!notif.uid) notif.uid = crypto.randomUUID();
			return <CAlertNotif sx={{ mt: "5px" }} time={6000} key={notif.uid} notif={notif} />;
		});
	}, [notifications]);

	const pushNotif = useCallback(
		(notif: IAppNotif) => {
			setNotifications((prev: IAppNotif[]) => [...prev, notif]);
		},
		[setNotifications],
	);

	return (
		<>
			<Stack
				direction={"column-reverse"}
				sx={{
					position: "fixed",
					bottom: "10px",
					left: "10px",
					zIndex: appTheme.layers.absolute,
				}}
			>
				{notifs}
			</Stack>
			<notifContext.Provider value={{ notifications, push: pushNotif }}>
				{children}
			</notifContext.Provider>
		</>
	);
}

export default CAppNotifContext;
