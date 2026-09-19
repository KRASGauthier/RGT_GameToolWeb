import type { SxProps } from "@mui/material";
import type { TFilterEntrySize } from "../../../components/inputs/filters/CFilter";

export interface IFilterStyle {
	main: SxProps;
}

export interface CFilterStyleProps {}

export const CFilterStyle = ({}: CFilterStyleProps): IFilterStyle => {
	return {
		main: {},
	};
};

export interface IFilterEntryStyle {
	main: SxProps;
}

export interface CFilterStyleEntryProps {
	size?: TFilterEntrySize;
}

export const CFilterEntryStyle = ({ size }: CFilterStyleEntryProps): IFilterEntryStyle => {
	let currentSize: string | undefined;
	switch (size) {
		case "dafault":
			currentSize = undefined;
			break;
		case "flex":
			currentSize = undefined;
			break;
		case "small":
			currentSize = "100px";
			break;
		case "medium":
			currentSize = "175px";
			break;
		case "long":
			currentSize = "300px";
			break;
		case "xlong":
			currentSize = "450px";
			break;
	}

	return {
		main: {
			width: currentSize,
			flex: size == "flex" ? 1 : undefined,
		},
	};
};
