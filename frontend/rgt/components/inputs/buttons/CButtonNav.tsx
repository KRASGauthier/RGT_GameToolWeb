import { useMemo } from "react";
import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import CButtonIcon, { type CButtonIconProps } from "./CButtonIcon";
import { sxMerger } from "../../../utils/UStyles";
import { useLocation, useNavigate } from "react-router";
import { appTheme } from "../../../../src/style/theme";

interface CButtonNavProps extends CButtonIconProps {
	path: string;
}

function CButtonNav({ path, sx, ...other }: CButtonNavProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const checked = pathname == path;

	const style: IButtonStyle = useMemo(() => {
		return CButtonStyle({ checked });
	}, [checked]);

	return (
		<CButtonIcon
			onClick={() => {
				navigate(path);
			}}
			checked={checked}
			sx={sxMerger(style.nav, sx ? sx : {})}
			textColor={appTheme.colors.black}
			textHoverColor={appTheme.colors.black}
			{...other}
		/>
	);
}

export default CButtonNav;
