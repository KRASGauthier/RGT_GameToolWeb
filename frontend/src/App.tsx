import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import PBasePage from "./pages/shared/PBasePage";
import { BrowserRouter, Routes, Route } from "react-router";
import { EAppMenus, ROUTE_AUTH } from "./consts";
import PAuth from "../rgt/pages/PAuth/PAuth";
import CAuthContext from "../rgt/context/auth/CAuthContext";
import CProtectedRoute from "../rgt/components/routes/CProtectedRoute";
import PHome from "./pages/PHome/PHome";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={appMUITheme}>
				<CssBaseline />
				<CAuthContext>
					<Routes>
						<Route path={ROUTE_AUTH} element={<PAuth />} />
						<Route element={<CProtectedRoute />}>
							<Route element={<PBasePage />}>
								<Route index element={<PHome />} />
								<Route path={EAppMenus.MANAGEMENT_TODO} />
								<Route path={EAppMenus.MANAGEMENT_ROADMAP} />
								<Route path={EAppMenus.MANAGEMENT_BUGS} />
							</Route>
						</Route>
					</Routes>
				</CAuthContext>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
