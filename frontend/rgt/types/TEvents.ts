import type { AlertColor } from "@mui/material";
import type { ReactNode } from "react";

export interface IAppNotif {
	severity: AlertColor;
	message: ReactNode;
	uid?: string;
}

export interface IAppNotifContext {
	notifications: IAppNotif[];
	push: (notif: IAppNotif) => void;
}
