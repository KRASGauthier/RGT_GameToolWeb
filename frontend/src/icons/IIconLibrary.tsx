import type { ReactElement } from "react";
import { DIconLibrary, type TIconLibrary } from "../types/icons/TIconLibrary";
import type { SvgIconProps } from "@mui/material";

//LOCAL CONSTS
export const DIconLibraryTsx = Object.fromEntries(
	Object.entries(DIconLibrary).map(([key, Icon]) => [key, <Icon />]),
) as Record<TIconLibrary, ReactElement<SvgIconProps>>;
