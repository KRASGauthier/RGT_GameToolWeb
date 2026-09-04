import type { SxProps, Theme } from "@mui/material";

export interface ISkeletonStyle {
	main: SxProps<Theme>;
}

export interface CSkeletonStyleProps {}

export const CSkeletonStyle = ({}: CSkeletonStyleProps): ISkeletonStyle => {
	return {
		main: {},
	};
};
