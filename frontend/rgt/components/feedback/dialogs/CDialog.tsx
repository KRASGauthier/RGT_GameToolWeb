import { Dialog, DialogActions, DialogContent, type DialogProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { sxMerger } from "../../../utils/UStyles";
import { CDialogStyle, type IDialogStyle } from "../../../style/components/feedback/CDialogStyle";
import { useMemo } from "react";
import CButtonText from "../../inputs/buttons/CButtonText";
import { appTheme } from "../../../../src/style/theme";
import type { TSize } from "../../../types/TStyles";

export interface CDialogProps extends GCompProps, DialogProps {
	actions?: ("yes" | "no")[];

	onYes?: () => void;
	onNo?: () => void;

	marginPaper?: TSize;
}

function CDialog({ actions, onYes, onNo, children, marginPaper, sx, ...other }: CDialogProps) {
	const style: IDialogStyle = useMemo(() => {
		return CDialogStyle({ marginPaper });
	}, [marginPaper]);

	return (
		<Dialog sx={sxMerger(style.main, sx ? sx : {})} {...other}>
			<DialogContent sx={style.content}>{children}</DialogContent>
			{actions && actions.length > 0 && (
				<DialogActions sx={style.action}>
					{actions.findIndex((action) => action == "yes") != -1 && (
						<CButtonText
							onClick={() => {
								if (onYes) onYes();
							}}
							bgColor={[appTheme.colors.valid[4], appTheme.colors.valid[5]]}
						>
							Yes
						</CButtonText>
					)}
					{actions.findIndex((action) => action == "no") != -1 && (
						<CButtonText
							onClick={() => {
								if (onNo) onNo();
							}}
							bgColor={[appTheme.colors.error[4], appTheme.colors.error[5]]}
						>
							No
						</CButtonText>
					)}
				</DialogActions>
			)}
		</Dialog>
	);
}

export default CDialog;
