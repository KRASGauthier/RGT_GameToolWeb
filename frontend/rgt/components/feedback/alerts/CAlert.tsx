import { Alert, type AlertProps } from "@mui/material";
import { useMemo } from "react";
import type { GCompProps } from "../../shared/ccommon";
import { CAlertStyle, type ICAlertStyle } from "../../../style/components/feedback/CAlertStyle";
import { sxMerger } from "../../../utils/UStyles";

interface CAlertProps extends GCompProps, AlertProps {}

function CAlert({ sx, ...other }: CAlertProps) {
	const style: ICAlertStyle = useMemo(() => {
		return CAlertStyle();
	}, []);

	return <Alert sx={sxMerger(style.main, sx ? sx : {})} {...other}></Alert>;
}

export default CAlert;
