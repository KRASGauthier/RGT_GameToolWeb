import { SvgIcon, type SvgIconProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";

export interface CIconProps extends GCompProps, SvgIconProps {}

function CIcon({ ...other }: CIconProps) {
	return <SvgIcon viewBox="0 0 1000 1000" {...other}></SvgIcon>;
}

export default CIcon;
