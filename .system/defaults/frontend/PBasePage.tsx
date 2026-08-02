import type { ReactNode } from "react";
import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Box } from "@mui/material";

export interface PBasePageProps extends GPageProps {
	children: ReactNode | ReactNode[];
}

function PBasePage({ children }: PBasePageProps) {
	return (
		<Box>
			{children}
		</Box>
	);
}

export default PBasePage;
