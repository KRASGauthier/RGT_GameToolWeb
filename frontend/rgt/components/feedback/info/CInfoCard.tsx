import { Stack } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import CCard from "../../surfaces/CCard";
import CText from "../../text/CText";
import type { ReactNode } from "react";
import type { TCardStyling } from "../../../style/components/surfaces/CCardStyle";

export interface CInfoCardProps extends GCompProps {
	cardStyling?: TCardStyling;
	children: string | ReactNode;
}

function CInfoCard({ cardStyling, children }: CInfoCardProps) {
	return (
		<Stack direction="column" sx={{ mt: "20px", alignItems: "center" }}>
			<CCard styling={cardStyling}>
				{typeof children == "string" ? <CText>{children}</CText> : children}
			</CCard>
		</Stack>
	);
}

export default CInfoCard;
