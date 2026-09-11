import { Popover, type PopoverProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CPopoverStyle,
	type IPopoverStyle,
} from "../../../style/components/feedback/CPopoverStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import CPaper from "../../surfaces/CPaper";

export interface CPopoverProps extends GCompProps, PopoverProps {}

function CPopover({ children, sx, ...other }: CPopoverProps) {
	const style: IPopoverStyle = useMemo(() => {
		return CPopoverStyle({});
	}, []);

	return (
		<Popover
			slotProps={{
				paper: {
					sx: {
						background: "transparent",
						boxShadow: "none",
						overflow: "visible",
					},
				},
			}}
			sx={sxMerger(style.main, sx ? sx : {})}
			{...other}
		>
			<CPaper>{children}</CPaper>
		</Popover>
	);
}

export default CPopover;
