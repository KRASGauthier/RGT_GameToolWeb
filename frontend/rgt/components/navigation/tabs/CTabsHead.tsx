import { Tab, Tabs, type SvgIconProps, type TabsProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { cloneElement, useMemo, type ReactElement, type ReactNode } from "react";
import { CTabsHeadStyle } from "../../../style/components/navigation/tabs/CTabsHeadStyles";
import { sxMerger } from "../../../utils/UStyles";
import CText from "../../text/CText";
import type { TFontSize } from "../../../types/themeType";
import { appTheme } from "../../../../src/style/theme";

export interface ITabEntry {
	value: string;
	display?: string;
	icon?: ReactElement<SvgIconProps>;

	content?: ReactNode;
}
export interface CTabsHeadProps extends GCompProps, Omit<TabsProps, "onChange"> {
	tabs: ITabEntry[];
	onChange?: (value: string, entry: ITabEntry) => void;

	fontSize?: TFontSize;
	iconSize?: TFontSize;
	elevation?: number;
	color?: string;
	selectedColor?: string;
}

function CTabsHead({
	tabs,
	sx,
	fontSize = "sm",
	iconSize = "xs",
	elevation = 30,
	color = appTheme.colors.white,
	selectedColor = appTheme.colors.primary[7],
	onChange,
	...other
}: CTabsHeadProps) {
	const style = useMemo(() => {
		return CTabsHeadStyle({ color, selectedColor, elevation });
	}, [color, selectedColor, elevation]);

	return (
		<Tabs
			onChange={(_, value: string) => {
				const foundEntry: ITabEntry | undefined = tabs.find(
					(tab: ITabEntry) => tab.value == value,
				);
				if (!foundEntry) return;
				onChange?.(value, foundEntry);
			}}
			sx={sxMerger(style.main, sx ? sx : {})}
			{...other}
		>
			{tabs.map((tab: ITabEntry) => {
				let currentIcon: ReactElement<SvgIconProps> | undefined = undefined;
				if (tab.icon) {
					currentIcon = cloneElement(tab.icon, {
						sx: { fontSize: appTheme.fonts.title.size[iconSize] },
					});
				}

				return (
					<Tab
						key={tab.value}
						value={tab.value}
						label={
							<CText sx={style.label} size={fontSize ? fontSize : "sm"}>
								{tab.display}
							</CText>
						}
						icon={currentIcon}
						iconPosition="start"
						sx={style.tab}
					/>
				);
			})}
		</Tabs>
	);
}

export default CTabsHead;
