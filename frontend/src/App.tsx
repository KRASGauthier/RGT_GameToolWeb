import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTE_AUTH } from "./consts";
import PAuth from "../rgt/pages/PAuth/PAuth";
import CAuthContext from "../rgt/context/auth/CAuthContext";
import CProtectedRoute from "../rgt/components/routes/CProtectedRoute";
import PHome from "./pages/PHome/PHome";
import PBaseTabPage from "../rgt/pages/shared/PBaseTabPage";

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
							</Route>
						</Route>
					</Routes>
				</CAuthContext>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
