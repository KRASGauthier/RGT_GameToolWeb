import { cloneElement, type ReactElement } from "react";
import { DIconLibrary, type TIconLibrary } from "../types/icons/TIconLibrary";
import type { SvgIconProps, SxProps } from "@mui/material";
import { sxMerger } from "../../rgt/utils/UStyles";

//LOCAL CONSTS
export const DIconLibraryTsx = Object.fromEntries(
	Object.entries(DIconLibrary).map(([key, Icon]) => [key, <Icon />]),
) as Record<TIconLibrary, ReactElement<SvgIconProps>>;

export const iconApplySx = (
	icon: ReactElement<SvgIconProps> | TIconLibrary,
	sx: SxProps,
): ReactElement<SvgIconProps> => {
	if (typeof icon == "string") icon = DIconLibraryTsx[icon];

	return cloneElement(icon, {
		sx: sxMerger(icon.props.sx ?? {}, sx),
	});
};
