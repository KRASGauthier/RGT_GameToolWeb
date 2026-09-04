import type { ReactElement } from "react";
import type { SvgIconProps } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

//LOCAL CONSTS
export const DIconLibrary = {
	project: <SportsEsportsIcon />,
} satisfies Record<string, ReactElement<SvgIconProps>>;
export type TIconLibrary = keyof typeof DIconLibrary;
