import { Alert, type AlertProps } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { appTheme } from "../../../../src/style/theme";
import type { GCompProps } from "../../shared/ccommon";
import { CAlertStyle, type ICAlertStyle } from "../../../style/components/feedback/CAlertStyle";
import type { IAppNotif } from "../../../types/TEvents";
import { sxMerger } from "../../../utils/UStyles";

interface CAlertProps extends GCompProps, AlertProps {
	notif: IAppNotif;
	time: number;
	fadeSpeed?: number;
}

function CAlert({
	notif,
	time,
	fadeSpeed = appTheme.animations.timing.medium_slow,
	sx,
	...other
}: CAlertProps) {
	const [visible, setVisible] = useState<boolean>(true);
	const [opacity, setOpacity] = useState<number>(1);
	const [to, setTO] = useState<number>(-1);

	console.log(notif);
	const closeAlert = useCallback(() => {
		setOpacity(0);
		setTimeout(() => {
			setVisible(false);
		}, fadeSpeed);
	}, [fadeSpeed]);

	useEffect(() => {
		async function start() {
			if (to >= 0) return;
			setTO(
				setTimeout(() => {
					closeAlert();
				}, time),
			);
		}
		start();
	}, [to, time, closeAlert]);

	const style: ICAlertStyle = useMemo(() => {
		return CAlertStyle(fadeSpeed);
	}, [fadeSpeed]);

	return (
		<Alert
			sx={sxMerger(style.main, sx ? sx : {}, {
				opacity,
				display: !visible ? "none" : undefined,
			})}
			variant="filled"
			severity={notif.severity}
			onClose={closeAlert}
			{...other}
		>
			{notif.message}
		</Alert>
	);
}

export default CAlert;
