import type { CSSObject } from "@mui/material/styles";

import BricolageExtraLight from "./BricolageGrotesque-ExtraLight.ttf";
import BricolageLight from "./BricolageGrotesque-Light.ttf";
import BricolageRegular from "./BricolageGrotesque-Regular.ttf";
import BricolageMedium from "./BricolageGrotesque-Medium.ttf";
import BricolageSemiBold from "./BricolageGrotesque-SemiBold.ttf";
import BricolageBold from "./BricolageGrotesque-Bold.ttf";
import BricolageExtraBold from "./BricolageGrotesque-ExtraBold.ttf";

import DMSansThin from "./DMSans-Thin.ttf";
import DMSansThinItalic from "./DMSans-ThinItalic.ttf";
import DMSansExtraLight from "./DMSans-ExtraLight.ttf";
import DMSansExtraLightItalic from "./DMSans-ExtraLightItalic.ttf";
import DMSansLight from "./DMSans-Light.ttf";
import DMSansLightItalic from "./DMSans-LightItalic.ttf";
import DMSansRegular from "./DMSans-Regular.ttf";
import DMSansItalic from "./DMSans-Italic.ttf";
import DMSansMedium from "./DMSans-Medium.ttf";
import DMSansMediumItalic from "./DMSans-MediumItalic.ttf";
import DMSansSemiBold from "./DMSans-SemiBold.ttf";
import DMSansSemiBoldItalic from "./DMSans-SemiBoldItalic.ttf";
import DMSansBold from "./DMSans-Bold.ttf";
import DMSansBoldItalic from "./DMSans-BoldItalic.ttf";
import DMSansExtraBold from "./DMSans-ExtraBold.ttf";
import DMSansExtraBoldItalic from "./DMSans-ExtraBoldItalic.ttf";
import DMSansBlack from "./DMSans-Black.ttf";
import DMSansBlackItalic from "./DMSans-BlackItalic.ttf";

import RobotoThin from "./Roboto-Thin.ttf";
import RobotoThinItalic from "./Roboto-ThinItalic.ttf";
import RobotoExtraLight from "./Roboto-ExtraLight.ttf";
import RobotoExtraLightItalic from "./Roboto-ExtraLightItalic.ttf";
import RobotoLight from "./Roboto-Light.ttf";
import RobotoLightItalic from "./Roboto-LightItalic.ttf";
import RobotoRegular from "./Roboto-Regular.ttf";
import RobotoItalic from "./Roboto-Italic.ttf";
import RobotoMedium from "./Roboto-Medium.ttf";
import RobotoMediumItalic from "./Roboto-MediumItalic.ttf";
import RobotoSemiBold from "./Roboto-SemiBold.ttf";
import RobotoSemiBoldItalic from "./Roboto-SemiBoldItalic.ttf";
import RobotoBold from "./Roboto-Bold.ttf";
import RobotoBoldItalic from "./Roboto-BoldItalic.ttf";
import RobotoExtraBold from "./Roboto-ExtraBold.ttf";
import RobotoExtraBoldItalic from "./Roboto-ExtraBoldItalic.ttf";
import RobotoBlack from "./Roboto-Black.ttf";
import RobotoBlackItalic from "./Roboto-BlackItalic.ttf";

function makeFontFace(name: string, target: string, weight: number, style: string): CSSObject {
	return {
		"@font-face": {
			fontFamily: name,
			src: `url(${target}) format('truetype')`,
			fontWeight: weight,
			fontStyle: style,
		},
	};
}

function makeFontFaceMW(
	name: string,
	targets: string[],
	weights: number[],
	style: string,
): CSSObject[] {
	if (targets.length !== weights.length) return [];

	return targets.map((target, index) => makeFontFace(name, target, weights[index], style));
}

export function getFontRegistry(): CSSObject[] {
	return [
		...makeFontFaceMW(
			"TitleFont",
			[
				BricolageExtraLight,
				BricolageLight,
				BricolageRegular,
				BricolageMedium,
				BricolageSemiBold,
				BricolageBold,
				BricolageExtraBold,
			],
			[200, 300, 400, 500, 600, 700, 800],
			"normal",
		),
		...makeFontFaceMW(
			"TextFont",
			[
				DMSansThin,
				DMSansExtraLight,
				DMSansLight,
				DMSansRegular,
				DMSansMedium,
				DMSansSemiBold,
				DMSansBold,
				DMSansExtraBold,
				DMSansBlack,
			],
			[100, 200, 300, 400, 500, 600, 700, 800, 900],
			"normal",
		),
		...makeFontFaceMW(
			"TextFont",
			[
				DMSansThinItalic,
				DMSansExtraLightItalic,
				DMSansLightItalic,
				DMSansItalic,
				DMSansMediumItalic,
				DMSansSemiBoldItalic,
				DMSansBoldItalic,
				DMSansExtraBoldItalic,
				DMSansBlackItalic,
			],
			[100, 200, 300, 400, 500, 600, 700, 800, 900],
			"italic",
		),
		...makeFontFaceMW(
			"TextFontSub",
			[
				RobotoThin,
				RobotoExtraLight,
				RobotoLight,
				RobotoRegular,
				RobotoMedium,
				RobotoSemiBold,
				RobotoBold,
				RobotoExtraBold,
				RobotoBlack,
			],
			[100, 200, 300, 400, 500, 600, 700, 800, 900],
			"normal",
		),
		...makeFontFaceMW(
			"TextFontSub",
			[
				RobotoThinItalic,
				RobotoExtraLightItalic,
				RobotoLightItalic,
				RobotoItalic,
				RobotoMediumItalic,
				RobotoSemiBoldItalic,
				RobotoBoldItalic,
				RobotoExtraBoldItalic,
				RobotoBlackItalic,
			],
			[100, 200, 300, 400, 500, 600, 700, 800, 900],
			"italic",
		),
	];
}
