import type { ReactNode } from "react";
import type { IAppNotif } from "./TEvents";

export type TErrorReturnTypes = "error" | "notif";
export type TErrorReturn =
	| {
			type: Extract<TErrorReturnTypes, "error">;
			handler: React.Dispatch<React.SetStateAction<ReactNode>>;
	  }
	| {
			type: Extract<TErrorReturnTypes, "notif">;
			handler: (notif: IAppNotif) => void;
	  };
