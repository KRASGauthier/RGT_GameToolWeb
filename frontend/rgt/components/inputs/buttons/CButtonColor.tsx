import { Input, type InputProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { sxMerger } from "../../../utils/UStyles";

export interface CButtonColorProps extends GCompProps, InputProps {}

function CButtonColor({ sx, ...other }: CButtonColorProps) {
	return (
		<Input sx={sxMerger({ minWidth: "75px" }, sx ? sx : {})} type="color" {...other}></Input>
	);
}

export default CButtonColor;
