import { createTheme, type ThemeOptions } from "@mui/material";
import type { IAppTheme } from "../../rgt/types/themeType";

export const appTheme: IAppTheme = {
	colors: {
		primary: [
			"#4A1028",
			"#64163A",
			"#821D4E",
			"#A72968",
			"#C83A7E",
			"#E05294",
			"#F074AA",
			"#FA9AC2",
			"#FFC1D8",
			"#FFE0EB",
			"#FFF2F7",
		],
		secondary: [
			"#271447",
			"#351B61",
			"#46247F",
			"#5B31A3",
			"#7344C7",
			"#8B5CE6",
			"#A07BF0",
			"#B99CF7",
			"#D2C1FB",
			"#E9DFFE",
			"#F7F1FF",
		],
		tertiary: [
			"#431407",
			"#5A1A08",
			"#7C2D12",
			"#9A3412",
			"#C2410C",
			"#EA580C",
			"#F97316",
			"#FB923C",
			"#FDBA74",
			"#FED7AA",
			"#FFF7ED",
		],
		quaternary: [
			"#3B1827",
			"#542235",
			"#6F2E46",
			"#8A3E59",
			"#A75370",
			"#C06B8A",
			"#D586A3",
			"#E5A7BD",
			"#F2C7D6",
			"#FAE1E9",
			"#FFF4F7",
		],
		quinary: [
			"#151C45",
			"#202A61",
			"#2D3B80",
			"#3C4DA3",
			"#5362C2",
			"#6E78DA",
			"#8A94EA",
			"#AAB3F5",
			"#CDD3FB",
			"#E6E9FE",
			"#F4F6FF",
		],
		greys: [
			"#171717",
			"#262626",
			"#404040",
			"#525252",
			"#737373",
			"#8A8A8A",
			"#A3A3A3",
			"#D4D4D4",
			"#E5E5E5",
			"#F5F5F5",
			"#FAFAFA",
		],
		valid: [
			"#052E16",
			"#064E24",
			"#166534",
			"#15803D",
			"#16A34A",
			"#22C55E",
			"#4ADE80",
			"#86EFAC",
			"#BBF7D0",
			"#DCFCE7",
			"#F0FDF4",
		],
		warning: [
			"#431407",
			"#7C2D12",
			"#9A3412",
			"#C2410C",
			"#EA580C",
			"#F97316",
			"#FB923C",
			"#FDBA74",
			"#FED7AA",
			"#FFEDD5",
			"#FFF7ED",
		],
		error: [
			"#450A0A",
			"#7F1D1D",
			"#991B1B",
			"#B91C1C",
			"#DC2626",
			"#EF4444",
			"#F87171",
			"#FCA5A5",
			"#FECACA",
			"#FEE2E2",
			"#FEF2F2",
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
			family: "'Bricolage Grotesque', Arial",
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
			}),
		},
	},
};
const appMUITheme = createTheme(appThemeBase);

export default appMUITheme;
