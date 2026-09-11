import { useMemo, useState, type ReactElement } from "react";
import type { CPopoverProps } from "../../feedback/popover/CPopover";
import CPopover from "../../feedback/popover/CPopover";
import {
	CIconSelectorStyle,
	type IIconSelectorStyle,
} from "../../../style/components/inputs/CIconSelectorStyle";
import { Grid, Stack, type SvgIconProps } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import CButtonIcon from "../buttons/CButtonIcon";

export interface CIconSelectorProps<_T extends string> extends CPopoverProps {
	library: Record<_T, ReactElement<SvgIconProps>>;
	onSelected?: (value: _T) => void;
}

export function CIconSelector<_T extends string>({
	library,
	onSelected,
	...other
}: CIconSelectorProps<_T>) {
	const [filter, setFilter] = useState<string>("");
	const style: IIconSelectorStyle = useMemo(() => {
		return CIconSelectorStyle({});
	}, []);

	return (
		<CPopover sx={style.main} {...other}>
			<Stack sx={style.stack} direction={"column"} spacing={"4px"}>
				<CTextFieldOutlined
					value={filter}
					onChange={(e) => {
						setFilter(e.target.value);
					}}
					xPadding={"7px"}
					yPadding={"5px"}
				/>
				<Grid container columns={7} direction={"row"} sx={style.stackButton}>
					{(Object.entries(library) as [_T, ReactElement<SvgIconProps>][]).map(
						([key, icon]) => {
							if (key.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
								return (
									<Grid size={1}>
										<CButtonIcon
											onClick={() => {
												onSelected?.(key);
											}}
											styling="dark"
											key={key}
											icon={icon}
										/>
									</Grid>
								);
						},
					)}
				</Grid>
			</Stack>
		</CPopover>
	);
}

export default CIconSelector;
