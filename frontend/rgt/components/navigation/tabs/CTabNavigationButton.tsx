import { cloneElement, useMemo, type ReactElement } from "react";
import {
	CTabNavigationButtonStyle,
	type ITabNavigationButtonStyle,
} from "../../../style/components/navigation/tabs/CTabNavigationStyle";
import type { CButtonProps } from "../../inputs/buttons/CButton";
import CButton from "../../inputs/buttons/CButton";
import type { GCompProps } from "../../shared/ccommon";
import { sxMerger } from "../../../utils/UStyles";
import { Stack, type SvgIconProps } from "@mui/material";
import CText from "../../text/CText";
import CButtonIcon from "../../inputs/buttons/CButtonIcon";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import type { ITabEntryContext } from "../../../context/navigation/CTabProvider";

export interface CTabNavigationButtonProps extends GCompProps, CButtonProps {
	isActive: boolean;
	entry: ITabEntryContext;
	icon?: ReactElement<SvgIconProps>;

	onDelete: () => void;
}

function CTabNavigationButton({
	entry,
	isActive,
	icon,
	onDelete,
	sx,
	...other
}: CTabNavigationButtonProps) {
	const style: ITabNavigationButtonStyle = useMemo(() => {
		return CTabNavigationButtonStyle({});
	}, []);

	const iconFinal: ReactElement | undefined =
		icon == undefined
			? undefined
			: cloneElement(icon, {
					sx: sxMerger(style.icon, icon.props.sx ? icon.props.sx : {}),
				});

	return (
		<Stack sx={style.main} direction={"row"}>
			<CButton
				styling={isActive ? "medium" : "dark"}
				sx={sxMerger(style.button, sx ? sx : {})}
				{...other}
			/>
			<Stack
				sx={{ alignItems: "center", zIndex: 1, pointerEvents: "none" }}
				direction={"row"}
				spacing={"5px"}
			>
				{iconFinal}
				<CText weight={4} size="sm" sx={style.text}>
					{entry.display ?? entry.value}
				</CText>
				<CButtonIcon
					styling="transparent"
					sx={style.close}
					onClick={onDelete}
					icon={<ClearRoundedIcon sx={style.closeIcon} />}
				></CButtonIcon>
			</Stack>
		</Stack>
	);
}

export default CTabNavigationButton;
