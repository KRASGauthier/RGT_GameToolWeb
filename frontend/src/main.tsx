import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CAppNotifContext from "../rgt/context/app/CAppNotifContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CAppNotifContext>
			<App />
		</CAppNotifContext>
	</StrictMode>,
);
