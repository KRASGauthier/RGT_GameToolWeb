import type { SxProps, Theme } from "@mui/material";
import type {
	TColor,
	TColorAlteration,
	TColorSimple,
	TDropShadow,
	TQuadStyle,
	TSize,
} from "../types/TStyles";
import { appTheme } from "../../src/style/theme";

//--------------------------------------------------
//                     COMMON
//--------------------------------------------------
export function getQuadStyle<_T>(
	style?: TQuadStyle<_T>,
	target?: keyof TQuadStyle<_T>,
): _T | undefined {
	if (!style) return undefined;
	if (!target) return style.normal;
	if (target == "normal") return style.normal;
	if (!style[target]) return style.normal;
	return style[target];
}

export function sizeToString(value?: TSize, fallback?: string, sufix?: string): string | undefined {
	if (value == undefined) return fallback;
	if (typeof value == "number") return value.toString() + (sufix ?? "px");
	return value;
}

//--------------------------------------------------
//                    SX
//--------------------------------------------------
export function sxMerger(...sx: SxProps<Theme>[]): SxProps<Theme> | undefined {
	if (sx.length == 0) return undefined;
	if (sx.length == 1) return sx[0];
	const sx0 = sx.splice(0, 1)[0];
	const sx1 = sx.splice(0, 1)[0];
	if (sx.length == 0)
		return [
			...(Array.isArray(sx0) ? sx0 : sx0 ? [sx0] : []),
			...(Array.isArray(sx1) ? sx1 : sx1 ? [sx1] : []),
		];
	else
		return sxMerger(
			[
				...(Array.isArray(sx0) ? sx0 : sx0 ? [sx0] : []),
				...(Array.isArray(sx1) ? sx1 : sx1 ? [sx1] : []),
			],
			...sx,
		);
}

//--------------------------------------------------
//                    CSS
//--------------------------------------------------
export function TDropShadowToString(Input: TDropShadow | string): string {
	if (typeof Input == "string") return Input;
	let finalSTR = "";
	finalSTR += (typeof Input.offsetX == "number" ? Input.offsetX + "px" : Input.offsetX) + " ";
	finalSTR += (typeof Input.offsetY == "number" ? Input.offsetY + "px" : Input.offsetY) + " ";
	if (Input.blur != undefined && Input.blur != null)
		finalSTR += (typeof Input.blur == "number" ? Input.blur + "px" : Input.blur) + " ";
	finalSTR += Input.color;
	return finalSTR;
}

export function cssAddSizes(value1?: number | string, value2?: number | string) {
	if (!value1 && !value2) return "inherit";
	if (!value1) return sizeMakeString(value2);
	if (!value2) return sizeMakeString(value1);

	return "calc(" + sizeMakeString(value1) + " + " + sizeMakeString(value2) + ")";
}
export function sizeMakeString(value?: string | number) {
	return value ? (typeof value == "string" ? value : value + "px") : "inherit";
}

export function getScaledRadius(borderRadius: number | string, divisor = 1) {
	return typeof borderRadius === "number" ? `${borderRadius / divisor}px` : borderRadius;
}

//--------------------------------------------------
//               COLOR MANAGEMENT
//--------------------------------------------------
export function colorGetBackground(
	colors: string | string[],
	positions?: number[],
	type?: "linear" | "radial",
	angle?: number | string,
	position?: { x: string | number; y: string | number },
): string {
	if (typeof colors == "string") return colors;

	if (!type) type = "linear";
	if (!angle) angle = 0;
	if (!positions) {
		positions = [];
		colors.forEach((_: string, index: number) => {
			positions?.push((1 / (colors.length - 1)) * index * 100);
		});
	}

	let finalStr = type + "-gradient(";
	if (type == "linear") finalStr += typeof angle == "string" ? angle : angle + "deg";
	if (type == "radial" && position) {
		finalStr += "circle at ";
		finalStr += typeof position.x == "string" ? position.x : position.x + "% ";
		finalStr += typeof position.y == "string" ? position.y : position.y + "%";
	}
	colors.forEach((item, index) => {
		if (finalStr.lastIndexOf("(") != finalStr.length - 1) finalStr += ", ";
		finalStr += item + " " + positions[index] + "%";
	});
	finalStr += ")";

	return finalStr;
}

export function colorAlterColor(
	color: string,
	alter: TColorAlteration | TColorAlteration[],
	value: number | number[],
): string {
	if (Array.isArray(alter) && !Array.isArray(value)) return color;
	if (!Array.isArray(alter) && Array.isArray(value)) return color;
	if (Array.isArray(alter) && Array.isArray(value)) {
		alter.forEach((item: TColorAlteration, index: number) => {
			color = colorAlterColor(color, item, value[index]);
		});
		return color;
	}

	const colorOut = colorHexToColor(color);
	if (alter == "shift-saturation") {
		colorOut.saturation += Array.isArray(value) ? 0 : value;
		colorOut.saturation = Math.max(Math.min(colorOut.saturation, 1), 0);
	} else if (alter == "shift-brightness") {
		colorOut.brightness += Array.isArray(value) ? 0 : value;
		colorOut.brightness = Math.max(Math.min(colorOut.brightness, 1), 0);
	} else if (alter == "shift-hue") {
		colorOut.hue += Array.isArray(value) ? 0 : value;
		colorOut.brightness = Math.max(Math.min(colorOut.brightness, 360), 0);
		colorSetBase(colorOut);
	}
	colorOut.r = Math.round(
		colorOut.brightness *
			(255 * (1 - colorOut.saturation) + colorOut.saturation * colorOut.rBase),
	);
	colorOut.g = Math.round(
		colorOut.brightness *
			(255 * (1 - colorOut.saturation) + colorOut.saturation * colorOut.gBase),
	);
	colorOut.b = Math.round(
		colorOut.brightness *
			(255 * (1 - colorOut.saturation) + colorOut.saturation * colorOut.bBase),
	);
	return colorColorToHex(colorOut);
}

export function colorGetAtPos(colorStart: string, colorEnd: string, per: number): string {
	const colorStartObj = colorHexToColor(colorStart);
	const colorEndObj = colorHexToColor(colorEnd);
	const colorOut: TColorSimple = {
		r: Math.trunc(colorStartObj.r + (colorEndObj.r - colorStartObj.r) * per),
		g: Math.trunc(colorStartObj.g + (colorEndObj.g - colorStartObj.g) * per),
		b: Math.trunc(colorStartObj.b + (colorEndObj.b - colorStartObj.b) * per),
	};
	return colorColorToHex(colorOut);
}

export function colorGetTextColor(color: string, white?: string, black?: string): string {
	const colorOut = colorHexToColor(color);
	const avr: number = Math.trunc((colorOut.r + colorOut.g + colorOut.b) / 3);
	if (avr > 127) return black == undefined ? appTheme.colors.black : black;
	return white == undefined ? appTheme.colors.white : white;
}

//--------------------------------------------------
//                    UTILS
//--------------------------------------------------
function colorSetBase(color: TColor) {
	const secondaryComponent = 1 - Math.abs(((color.hue / 60) % 2) - 1);

	if (color.hue < 60) [color.rBase, color.gBase, color.bBase] = [1, secondaryComponent, 0];
	else if (color.hue < 120) [color.rBase, color.gBase, color.bBase] = [secondaryComponent, 1, 0];
	else if (color.hue < 180) [color.rBase, color.gBase, color.bBase] = [0, 1, secondaryComponent];
	else if (color.hue < 240) [color.rBase, color.gBase, color.bBase] = [0, secondaryComponent, 1];
	else if (color.hue < 300) [color.rBase, color.gBase, color.bBase] = [secondaryComponent, 0, 1];
	else [color.rBase, color.gBase, color.bBase] = [1, 0, secondaryComponent];
	color.rBase = Math.trunc(color.rBase * 255);
	color.gBase = Math.trunc(color.gBase * 255);
	color.bBase = Math.trunc(color.bBase * 255);
}

export function colorHexToColor(hexa: string): TColor {
	if (hexa.charAt(0) != "#") hexa = "#" + hexa;
	const color: TColor = {
		r: parseInt(hexa.slice(1, 3), 16),
		g: parseInt(hexa.slice(3, 5), 16),
		b: parseInt(hexa.slice(5, 7), 16),

		rFloat: parseInt(hexa.slice(1, 3), 16) / 255,
		gFloat: parseInt(hexa.slice(3, 5), 16) / 255,
		bFloat: parseInt(hexa.slice(5, 7), 16) / 255,

		rBase: 0,
		gBase: 0,
		bBase: 0,

		major: "",
		majorValue: 0,
		minor: "",
		minorValue: 0,

		hue: 0,
		saturation: 0,
		brightness: 0,
	};

	//Major / Minor
	color.major = color.r >= color.g && color.r >= color.b ? "r" : color.g >= color.b ? "g" : "b";
	color.majorValue = color[`${color.major}Float` as keyof TColor] as number;
	color.minor = color.r <= color.g && color.r <= color.b ? "r" : color.g <= color.b ? "g" : "b";
	color.minorValue = color[`${color.minor}Float` as keyof TColor] as number;

	//Hue
	if (color.majorValue - color.minorValue == 0) color.hue = 0;
	else if (color.major == "r")
		color.hue = (color.gFloat - color.bFloat) / (color.majorValue - color.minorValue);
	else if (color.major == "g")
		color.hue = 2 + (color.bFloat - color.rFloat) / (color.majorValue - color.minorValue);
	else if (color.major == "b")
		color.hue = 4 + (color.rFloat - color.gFloat) / (color.majorValue - color.minorValue);
	color.hue *= 60;
	if (color.hue < 0) color.hue += 360;

	//BaseColor
	colorSetBase(color);

	//Saturation
	color.saturation =
		color.majorValue === 0 ? 0 : (color.majorValue - color.minorValue) / color.majorValue;

	//Brightness
	color.brightness = color.majorValue;
	return color;
}

export function colorColorToHex(color: TColor | TColorSimple): string {
	return (
		"#" +
		(color.r.toString(16).length == 1 ? "0" : "") +
		color.r.toString(16) +
		(color.g.toString(16).length == 1 ? "0" : "") +
		color.g.toString(16) +
		(color.b.toString(16).length == 1 ? "0" : "") +
		color.b.toString(16)
	);
}

//--------------------------------------------------
//                     SHADOW
//--------------------------------------------------
export function shadowGenerate(value: number, inset?: boolean, invert?: boolean) {
	value = value / 100;

	return (
		`${inset ? "inset" : ""} 0px ${(invert ? -1 : 1) * 10 * value}px ${24 * value}px -2px rgba(0, 0, 0, ${value}), ` +
		`${inset ? "inset" : ""} 0px ${(invert ? -1 : 1) * 6 * value}px ${42 * value}px 0px rgba(0, 0, 0, ${0.45 * value}), ` +
		`${inset ? "inset" : ""} 0px ${(invert ? -1 : 1) * 2 * value}px ${70 * value}px 0px rgba(0, 0, 0, ${0.35 * value})`
	);
}
