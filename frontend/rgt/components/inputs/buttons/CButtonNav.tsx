import { useMemo } from "react";
import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import CButtonIcon, { type CButtonIconProps } from "./CButtonIcon";
import { sxMerger } from "../../../utils/UStyles";
import { useLocation, useNavigate } from "react-router";

interface CButtonNavProps extends CButtonIconProps {
	path: string;
	isGeneral?: boolean;
}

function CButtonNav({ path, isGeneral, sx, ...other }: CButtonNavProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const checked = !isGeneral
		? pathname == path
		: pathname.toLowerCase().includes(path.toLocaleLowerCase());

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
			{...other}
		/>
	);
}

export default CButtonNav;
