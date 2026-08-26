import { Stack, type SxProps, type Theme } from "@mui/material";
import type { CButtonIconProps } from "../CButtonIcon";
import CButtonIcon from "../CButtonIcon";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useMemo, useRef, useState } from "react";
import {
	CButtonCopyStyle,
	type IButtonCopyStyle,
} from "../../../../style/components/inputs/CButtonStyle";
import { sxMerger } from "../../../../utils/UStyles";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

const COPIED_TIMED = 5000;

export interface CButtonCopyProps extends Omit<CButtonIconProps, "icon" | "onClick"> {
	onCopy: () => Promise<string>;

	buttonStyle?: SxProps<Theme>;
	iconStyle?: SxProps<Theme>;
}

function CButtonCopy({ onCopy, iconStyle, buttonStyle, disabled, sx, ...other }: CButtonCopyProps) {
	//====================== DATA ======================
	const [copying, setCopying] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const to = useRef<number>(-1);
	const style: IButtonCopyStyle = useMemo(() => {
		return CButtonCopyStyle({ copied });
	}, [copied]);

	//====================== Handlers ======================
	const handleCopied = () => {
		setCopied(true);
		if (to.current > -1) {
			clearTimeout(to.current);
			to.current = -1;
		}
		to.current = setTimeout(() => {
			setCopied(false);
		}, COPIED_TIMED);
	};
	const handleCopy = async () => {
		if (to.current > -1) {
			clearTimeout(to.current);
			to.current = -1;
		}
		setCopying(true);
		const data: string = await onCopy();
		await navigator.clipboard.writeText(data);
		setCopying(false);
		handleCopied();
	};

	return (
		<Stack sx={sxMerger(style.main, sx ? sx : {})} direction={"column"}>
			<CButtonIcon
				disabled={disabled || copying}
				sx={sxMerger(style.button, buttonStyle ? buttonStyle : {})}
				onClick={handleCopy}
				icon={<ContentCopyIcon sx={iconStyle} />}
				{...other}
			/>
			<CButtonIcon
				disabled={disabled || copying}
				sx={sxMerger(style.over, buttonStyle ? buttonStyle : {})}
				styling="validate"
				onClick={handleCopy}
				icon={<DoneRoundedIcon sx={iconStyle} />}
			/>
		</Stack>
	);
}

export default CButtonCopy;
