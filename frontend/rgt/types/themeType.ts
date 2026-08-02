//--------------------------------------------------
//                     TEXTS
//--------------------------------------------------
export type TFontSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export interface IThemeFont {
	size: Record<TFontSize, number>;
	family: string;
}

export interface IThemeText {
	text: IThemeFont;
	title: IThemeFont;
}

//--------------------------------------------------
//                     COLORS
//--------------------------------------------------
export interface IThemeColor {
	primary: string[];
	secondary: string[];
	tertiary: string[];
	quaternary: string[];
	quinary: string[];

	greys: string[];

	valid: string[];
	warning: string[];
	error: string[];
	black: string;
	white: string;
}

//--------------------------------------------------
//                    SHAPE
//--------------------------------------------------
export interface IThemeRadius {
	small: number | string;
	medium: number | string;
	large: number | string;
}

export interface IThemeHeader {
	height: number;
}

export interface IThemeSpacing {
	main: string;
	searchTop: string;
	grid: string;
}

export interface IThemeShape {
	radius: IThemeRadius;
	header: IThemeHeader;
	spacing: IThemeSpacing;
}

//--------------------------------------------------
//                 ANIMATION
//--------------------------------------------------
export interface IThemeAnimationTiming {
	fast: number;
	medium_fast: number;
	medium_slow: number;
	enteringScreen: number;
	leavingScreen: number;
}

export interface IThemeAnimationEasing {
	easeInOut: string;
	easeOut: string;
	easeIn: string;
	sharp: string;
}

export interface IThemeAnimation {
	timing: IThemeAnimationTiming;
	easing: IThemeAnimationEasing;
}

//--------------------------------------------------
//                   LAYERS
//--------------------------------------------------
export interface IThemeLayer {
	absolute: number;
}

//--------------------------------------------------
//                  MAIN
//--------------------------------------------------
export interface IAppTheme {
	colors: IThemeColor;
	shapes: IThemeShape;
	fonts: IThemeText;
	animations: IThemeAnimation;
	layers: IThemeLayer;
}
