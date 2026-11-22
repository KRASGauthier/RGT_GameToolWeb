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
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";
import type { TIconLibrary } from "../../../../src/types/icons/TIconLibrary";

export interface CIconSelectorProps extends CPopoverProps {
	onSelected?: (value: TIconLibrary) => void;
}

function CIconSelector({ onSelected, ...other }: CIconSelectorProps) {
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
					{(
						Object.entries(DIconLibraryTsx) as [
							TIconLibrary,
							ReactElement<SvgIconProps>,
						][]
					).map(([key, icon]) => {
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
					})}
				</Grid>
			</Stack>
		</CPopover>
	);
}

export default CIconSelector;
