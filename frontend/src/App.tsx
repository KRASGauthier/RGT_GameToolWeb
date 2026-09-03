import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import { BrowserRouter, Routes, Route } from "react-router";
import {
	ROUTE_AUTH,
	ROUTE_PROFILE,
	ROUTE_PROJECT,
	ROUTE_PROJECT_NEW,
} from "./consts";
import PAuth from "../rgt/pages/PAuth/PAuth";
import CAuthContext from "../rgt/context/auth/CAuthContext";
import CProtectedRoute from "../rgt/components/routes/CProtectedRoute";
import PHome from "./pages/PHome/PHome";
import PBaseTabPage from "../rgt/pages/shared/PBaseTabPage";
import PProjectNew from "./pages/projects/PProjectNew/PProjectNew";
import PProfile from "./pages/PProfile/PProfile";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={appMUITheme}>
				<CssBaseline />
				<CAuthContext>
					<Routes>
						<Route path={ROUTE_AUTH} element={<PAuth />} />
						<Route element={<CProtectedRoute />}>
							<Route element={<PBaseTabPage />}>
								<Route index element={<PHome />} />
								<Route path={ROUTE_PROFILE} element={<PProfile />} />
								<Route
									path={ROUTE_PROJECT + ROUTE_PROJECT_NEW}
									element={<PProjectNew />}
								/>
							</Route>
						</Route>
					</Routes>
				</CAuthContext>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
