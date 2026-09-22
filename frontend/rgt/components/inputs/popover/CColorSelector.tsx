import { Grid, Input, Stack } from "@mui/material";
import type { CPopoverProps } from "../../feedback/popover/CPopover";
import CPopover from "../../feedback/popover/CPopover";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { appTheme } from "../../../../src/style/theme";
import CButton from "../buttons/CButton";
import {
	CColorSelectorStyle,
	type IColorSelectorStyle,
} from "../../../style/components/inputs/popover/CColorSelectorStyle";
import { sxMerger } from "../../../utils/UStyles";
import CText from "../../text/CText";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import CButtonValidate from "../buttons/pre-made/CButtonValidate";
import CButtonCancel from "../buttons/pre-made/CButtonCancel";
import { useDebounced } from "../../../hooks/useDebounced";

export interface CColorSelectorProps extends Omit<CPopoverProps, "onClose" | "value"> {
	defaultColor: string;
	onSelected: (color: string) => void;
	onCancelled: () => void;
}

function CColorSelector({
	defaultColor,
	onSelected,
	onCancelled,
	sx,
	...other
}: CColorSelectorProps) {
	//====================== DATA ======================
	const [color, setColor] = useState<string>(defaultColor);
	const debouncedColor = useRef<string>(defaultColor);
	const style: IColorSelectorStyle = useMemo(() => {
		return CColorSelectorStyle({});
	}, []);

	//====================== FUNCTIONS ======================
	const correctString = (input: string): string => {
		input = input.trim();
		if (input.length == 0) input = "#";
		if (input.charAt(0) != "#") input = "#" + input;
		if (input.length > 7) input = input.slice(0, 7);
		input = "#" + input.replace(/[^0-9a-fA-F]/g, "");
		return input;
	};

	const isValid = (): boolean => {
		const trimmed = color.trim();
		if (trimmed.length != 7) return false;
		if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return false;
		return true;
	};

	//====================== HANDLERS ======================
	const { call: colorSelect } = useDebounced(() => {
		setColor(debouncedColor.current);
	}, 50);
	const handleColorChange = (color: string) => {
		debouncedColor.current = correctString(color);
		colorSelect();
	};

	const handleSelected = () => {
		onSelected(color);
	};
	const handleCancel = () => {
		setColor(defaultColor);
		onCancelled();
	};

	//====================== NODES ======================
	const grid: ReactNode[] = useMemo((): ReactNode[] => {
		const finalNodes: ReactNode[] = [];
		Object.values(appTheme.colors).forEach((colors: string[] | string) => {
			if (typeof colors == "string") return;
			colors.forEach((color) => {
				finalNodes.push(
					<Grid sx={style.gridContent} size={1}>
						<CButton
							onClick={() => {
								setColor(color);
							}}
							sx={style.button(color)}
						></CButton>
					</Grid>,
				);
			});
		});
		return finalNodes;
	}, [style]);

	return (
		<CPopover onClose={handleCancel} sx={sxMerger(style.main, sx ?? {})} {...other}>
			<Stack direction={"column"}>
				<Grid sx={style.grid} container columns={11}>
					{grid}
				</Grid>
				<CText size="lg" weight={8} sx={{ mt: appTheme.shapes.spacing.small }}>
					Custom
				</CText>
				<Stack spacing={"5px"} sx={{ alignItems: "center" }} direction={"row"}>
					<Input
						sx={{ flex: 1 }}
						value={color}
						onChange={(e) => {
							handleColorChange(e.target.value);
						}}
						type="color"
					/>
					<CTextFieldOutlined
						yPadding={4}
						onChange={(e) => {
							handleColorChange(e.target.value);
						}}
						value={color}
					/>
				</Stack>
				<Stack
					direction={"row"}
					sx={{ justifyContent: "center", mt: appTheme.shapes.spacing.small }}
					spacing={appTheme.shapes.spacing.medium}
				>
					<CButtonValidate onClick={handleSelected} disabled={!isValid()} padding={3} />
					<CButtonCancel onClick={handleCancel} padding={3} />
				</Stack>
			</Stack>
		</CPopover>
	);
}

export default CColorSelector;
