import { Stack, type SvgIconProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CTabNavigationStyle,
	type ITabNavigationStyle,
} from "../../../style/components/navigation/tabs/CTabNavigationStyle";
import { useMemo, type ReactElement } from "react";
import { sxMerger } from "../../../utils/UStyles";
import CButtonIcon from "../../inputs/buttons/CButtonIcon";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CTabNavigationButton from "./CTabNavigationButton";
import { appTheme } from "../../../../src/style/theme";
import type { ITabEntryContext } from "../../../context/navigation/CTabProvider";

//====================== TYPES ======================
export type TTabProviderIconLibrary = Record<string, ReactElement<SvgIconProps>>;

//====================== NODES ======================
export interface CTabNavigationProps extends GCompProps {
	tabs?: ITabEntryContext[];
	value: string | null;
	iconLibrary?: TTabProviderIconLibrary;

	onChange: (value: string | null) => void;
	onClose: (value: string) => Promise<boolean>;
}

function CTabNavigation({ tabs = [], value, iconLibrary, onChange, onClose }: CTabNavigationProps) {
	const style: ITabNavigationStyle = useMemo(() => {
		return CTabNavigationStyle({});
	}, []);

	return (
		<Stack spacing={"2px"} direction={"row"} sx={sxMerger(style.main)}>
			<CButtonIcon
				onClick={() => {
					onChange(null);
				}}
				styling={!value ? "medium" : "dark"}
				sx={style.home}
				icon={<HomeRoundedIcon sx={{ fontSize: appTheme.fonts.text.size["lg"] }} />}
			/>
			{tabs.map((entry: ITabEntryContext) => {
				return (
					<CTabNavigationButton
						onDelete={() => {
							onClose(entry.value);
						}}
						onClick={() => {
							onChange(entry.value);
						}}
						isActive={entry.value == value}
						entry={entry}
						key={entry.value}
						icon={iconLibrary?.[entry.icon]}
					></CTabNavigationButton>
				);
			})}
		</Stack>
	);
}

export default CTabNavigation;
