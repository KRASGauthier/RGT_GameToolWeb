import type { CButtonIconProps } from "../CButtonIcon";
import CButtonIcon from "../CButtonIcon";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface CButtonCancelProps extends Omit<CButtonIconProps, "icon" | "styling"> {}

function CButtonCancel({ ...other }: CButtonCancelProps) {
	return <CButtonIcon styling="cancel" icon={<CloseRoundedIcon />} {...other} />;
}

export default CButtonCancel;
