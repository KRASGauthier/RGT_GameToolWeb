//--------------------------------------------------
//                   VARIANTS
//--------------------------------------------------
export type TLighingType = "dark" | "medium" | "light";

//--------------------------------------------------
//                    CSS
//--------------------------------------------------
export type TDropShadow = {
	offsetX: number | string;
	offsetY: number | string;
	blur?: number | string;
	color: string;
};

export type TQuadStyle<_T> = {
	normal: _T;
	hovered?: _T;
	pressed?: _T;
	disabled?: _T;
};

//--------------------------------------------------
//                    COLORING
//--------------------------------------------------
export type TColor = {
	r: number;
	g: number;
	b: number;

	rFloat: number;
	gFloat: number;
	bFloat: number;

	rBase: number;
	gBase: number;
	bBase: number;

	major: string;
	majorValue: number;
	minor: string;
	minorValue: number;

	hue: number;
	saturation: number;
	brightness: number;
};
export type TColorSimple = {
	r: number;
	g: number;
	b: number;
};
export type TColorAlteration = "shift-saturation" | "shift-brightness" | "shift-hue";
