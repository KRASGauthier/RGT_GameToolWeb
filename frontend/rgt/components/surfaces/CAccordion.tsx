import { Collapse, Stack } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import CCard from "./CCard";
import { useMemo, useState, type ReactNode } from "react";
import CText from "../text/CText";
import CButtonIcon from "../inputs/buttons/CButtonIcon";
import { appTheme } from "../../../src/style/theme";
import { CAccordionStyle, type IAccordionStyle } from "../../style/components/surfaces/CAccordionStyle";
import type { TSize } from "../../types/TStyles";
import type { TCardStyling } from "../../style/components/surfaces/CCardStyle";

export interface CAccordionProps extends GCompProps {
	header: string | ReactNode;
	children: ReactNode;

	openOnButton?: boolean;

	styling?: TCardStyling
	borderRadius?: TSize
}

function CAccordion({ header, children, openOnButton, styling, borderRadius = appTheme.shapes.radius.medium }: CAccordionProps) {
	
	const [open, setOpen] = useState<boolean>(false);
	const style: IAccordionStyle = useMemo(() => {
		return CAccordionStyle({borderRadius, open})
	}, [open, borderRadius])

	return (
		<Stack>
			<CCard styling={styling} sx={style.header}>
				<Stack direction={"row"} sx={{ flex: 1 }}>
					{openOnButton && (
						<CButtonIcon
							size="lg"
							styling="transparent"
							borderRadius={appTheme.shapes.radius.small}
							padding={"3px"}
							sx={{ alignSelf: "center" }}
							icon={open ? "upArrowSmall" : "downArrowSmall"}
							onClick={() => setOpen((prev) => !prev)}
						/>
					)}
					{typeof header == "string" && <CText>{header}</CText>}
					{typeof header != "string" && header}
				</Stack>
			</CCard>
			<Collapse in={open}>
				<CCard styling="glass-dark" sx={style.bottom}>
					{children}
				</CCard>
			</Collapse>
		</Stack>
	);
}

export default CAccordion;
