import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import appMUITheme from "./style/theme";
import PBasePage from "./pages/shared/PBasePage";
import { BrowserRouter, Routes } from "react-router";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={appMUITheme}>
				<CssBaseline />
				<PBasePage>
					<Routes>
					</Routes>
				</PBasePage>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
