import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import PBasePage from "./pages/shared/PBasePage";
import { BrowserRouter, Routes, Route} from "react-router";
import { EAppMenus } from "./consts";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={appMUITheme}>
				<CssBaseline />
				<Routes>
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
