import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import PBasePage from "./pages/shared/PBasePage";
import { BrowserRouter, Routes, Route } from "react-router";
import { EAppMenus, ROUTE_AUTH } from "./consts";
import PAuth from "./pages/PAuth/PAuth";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={appMUITheme}>
				<CssBaseline />
				<Routes>
					<Route path={ROUTE_AUTH} element={<PAuth />} />
					<Route element={<PBasePage />}>
						<Route index />
						<Route path={EAppMenus.MANAGEMENT_TODO} />
						<Route path={EAppMenus.MANAGEMENT_ROADMAP} />
						<Route path={EAppMenus.MANAGEMENT_BUGS} />
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
