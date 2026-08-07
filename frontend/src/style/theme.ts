import { createTheme, type ThemeOptions } from "@mui/material";
import type { IAppTheme } from "../../rgt/types/themeType";
import { colorGetBackground } from "../../rgt/utils/UStyles";

export const appTheme: IAppTheme = {
	colors: {
		primary: [
			"#00274A",
			"#003967",
			"#004F8A",
			"#0065B0",
			"#007DD6",
			"#1795FA",
			"#60B0FF",
			"#8FC6FF",
			"#B4D8FF",
			"#D7EAFF",
			"#EEF6FF",
		],
		secondary: [
			"#291852",
			"#3C2474",
			"#52339B",
			"#6946BF",
			"#805DDF",
			"#9778F5",
			"#AD98FF",
			"#C2B5FF",
			"#D4CDFF",
			"#E8E4FF",
			"#F5F3FF",
		],
		tertiary: [
			"#002E2B",
			"#00413F",
			"#005956",
			"#00736E",
			"#008D87",
			"#00A8A2",
			"#2AC3BB",
			"#6AD6CF",
			"#9EE4DE",
			"#CBF1EE",
			"#E7FAF8",
		],
		quaternary: [
			"#0B293F",
			"#123B5A",
			"#1D5178",
			"#2E6896",
			"#4280B2",
			"#5A98CB",
			"#79B1E0",
			"#98C7EF",
			"#B7D9F7",
			"#D5EBFE",
			"#EDF6FF",
		],
		quinary: [
			"#421B50",
			"#5F2672",
			"#82319D",
			"#A43FC6",
			"#BA66D6",
			"#CD8AE3",
			"#DDA8EF",
			"#E7BFF5",
			"#F0D3FA",
			"#F7E6FD",
			"#FCF3FE",
		],
		greys: [
			"#252729",
			"#36383B",
			"#4A4D51",
			"#606468",
			"#767B80",
			"#8E9398",
			"#A7ABB0",
			"#BEC1C5",
			"#D1D5D8",
			"#E6E8EA",
			"#F4F5F6",
		],
		valid: [
			"#043009",
			"#084511",
			"#135D1D",
			"#1E7729",
			"#33903C",
			"#4EA954",
			"#73C076",
			"#98D299",
			"#B8E1B8",
			"#D8EFD8",
			"#EDF9ED",
		],
		warning: [
			"#3C1D00",
			"#552C00",
			"#733E00",
			"#925000",
			"#B36300",
			"#D57700",
			"#F28F29",
			"#FEAC65",
			"#FFC79B",
			"#FFE2CB",
			"#FFF3E9",
		],
		error: [
			"#4C070A",
			"#6C0910",
			"#90101A",
			"#B32228",
			"#D73337",
			"#F4514F",
			"#FF7E77",
			"#FFA59E",
			"#FFC3BD",
			"#FFDFDC",
			"#FFF2F0",
		],
		black: "#000000",
		white: "#ffffff",
	},

	shapes: {
		radius: {
			small: "10px",
			medium: "20px",
			large: "30px",
		},

		header: {
			height: 45,
		},

		spacing: {
			main: "5px",
			grid: "5px",
			searchTop: "5px",
			medium: "15px",
		},
	},

	fonts: {
		text: {
			size: {
				"3xs": 8,
				"2xs": 10,
				xs: 12,
				sm: 14,
				md: 16,
				lg: 20,
				xl: 22,
				"2xl": 24,
				"3xl": 26,
			},
			family: "Roboto, 'DM Sans', Arial",
		},

		title: {
			size: {
				"3xs": 14,
				"2xs": 16,
				xs: 20,
				sm: 24,
				md: 34,
				lg: 44,
				xl: 54,
				"2xl": 64,
				"3xl": 72,
			},
			family: "'Montserrat', Arial",
		},
	},

	animations: {
		timing: {
			fast: 100,
			medium_fast: 150,
			medium_slow: 500,
			enteringScreen: 225,
			leavingScreen: 195,
		},
		easing: {
			easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
			easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
			easeIn: "cubic-bezier(0.4, 0, 1, 1)",
			sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
		},
	},

	layers: {
		absolute: 10000,
	},
};

//--------------------------------------------------
//               MUI THEME OVERRIDE
//		   **Above theme should be prefered**
//--------------------------------------------------
const appThemeBase: ThemeOptions = {
	palette: {
		/* Color Theme Swatches in Hex */

		primary: {
			main: appTheme.colors.primary[5],
			light: appTheme.colors.primary[7],
			dark: appTheme.colors.primary[3],
			contrastText: "#fff",
		},
		secondary: {
			main: appTheme.colors.secondary[5],
			light: appTheme.colors.secondary[7],
			dark: appTheme.colors.secondary[3],
			contrastText: "#fff",
		},

		background: {
			default: appTheme.colors.greys[2],
			paper: appTheme.colors.greys[5],
		},
		text: {
			primary: "#fff",
		},
	},

	shape: {
		borderRadius: appTheme.shapes.radius.medium,
	},

	components: {
		MuiCssBaseline: {
			styleOverrides: () => ({
				backgroundColor: "red",

				"*::-webkit-scrollbar": {
					width: "3px",
				},
				"*::-webkit-scrollbar-thumb": {
					backgroundColor: "rgba(255,255,255,0.3)",
					borderRadius: "100px",
				},
				"*::-webkit-scrollbar-track": {
					backgroundColor: "transparent",
				},

				body: {
					background:
						colorGetBackground(
							[appTheme.colors.primary[5] + "14", "transparent"],
							[0, 40],
							"radial",
							180,
							{ x: 100, y: 100 },
						) +
						", " +
						colorGetBackground(
							[appTheme.colors.quinary[5] + "14", "transparent"],
							[0, 50],
							"radial",
							180,
							{ x: 0, y: 0 },
						) +
						", " +
						colorGetBackground(
							[
								appTheme.colors.greys[1],
								appTheme.colors.quaternary[1],
								appTheme.colors.quaternary[1],
								appTheme.colors.quinary[0],
							],
							[0, 46, 60, 100],
							"linear",
							150,
						),
					backgroundAttachment: "fixed",
				},
			}),
		},
	},
};
const appMUITheme = createTheme(appThemeBase);

export default appMUITheme;
