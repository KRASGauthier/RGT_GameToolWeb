import type { CButtonIconProps } from "../CButtonIcon";
import CButtonIcon from "../CButtonIcon";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

export interface CButtonValidateProps extends Omit<CButtonIconProps, "icon" | "styling"> {}

function CButtonValidate({ ...other }: CButtonValidateProps) {
	return <CButtonIcon styling="validate" icon={<DoneRoundedIcon />} {...other} />;
}

export default CButtonValidate;
