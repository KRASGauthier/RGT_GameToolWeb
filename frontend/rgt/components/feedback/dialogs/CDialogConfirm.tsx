import type { ReactNode } from "react";
import CText from "../../text/CText";
import type { CDialogProps } from "./CDialog";
import CDialog from "./CDialog";
import { appTheme } from "../../../../src/style/theme";

export interface CDialogConfirmProps extends CDialogProps {
	type?: string;
	name?: string;
}

function CDialogConfirm({ type, name, ...other }: CDialogConfirmProps) {
	const getText = (): ReactNode => {
		if (!type && !name) return <CText>Are you sure you want to delete this ?</CText>;
		if (!type && name)
			return (
				<CText>
					Are you sure you want to delete '
					<span style={{ color: appTheme.colors.primary[5] }}>{name}</span>' ?
				</CText>
			);
		if (type && !name)
			return (
				<CText>
					Are you sure you want to delete this{" "}
					<span style={{ color: appTheme.colors.secondary[5] }}>{type}</span> ?
				</CText>
			);
		if (type && name)
			return (
				<CText>
					Are you sure you want to delete this{" "}
					<span style={{ color: appTheme.colors.secondary[5] }}>{type}</span> named: '
					<span style={{ color: appTheme.colors.primary[5] }}>{name}</span>' ?
				</CText>
			);
	};

	return <CDialog {...other}>{getText()}</CDialog>;
}

export default CDialogConfirm;
