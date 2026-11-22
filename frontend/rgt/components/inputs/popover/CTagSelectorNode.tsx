import { cloneElement, useMemo } from "react";
import {
	CTagSelectorNodeStyle,
	type ITagSelectorNodeStyle,
} from "../../../style/components/inputs/popover/CTagSelectorStyle";
import { type ITag } from "../../../types/data/TTag";
import CCard from "../../surfaces/CCard";
import { Stack } from "@mui/material";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";
import { sxMerger } from "../../../util/UStyles";
import CText from "../../text/CText";
import CButtonIcon from "../buttons/CButtonIcon";
import { appTheme } from "../../../../src/style/theme";
import type { TUID } from "../../../types/TShared";

export interface CTagSelectorNodeProps {
	tag: ITag;
	isActive?: boolean;
	onEdit: (tag: ITag) => void;
	onActivate: (uid: TUID) => void;
	onDeactivate: (uid: TUID) => void;
}

function CTagSelectorNode({
	tag,
	isActive,
	onEdit,
	onActivate,
	onDeactivate,
}: CTagSelectorNodeProps) {
	const style: ITagSelectorNodeStyle = useMemo(() => {
		return CTagSelectorNodeStyle({ color: tag.color });
	}, [tag]);
	const icon = cloneElement(DIconLibraryTsx[tag.icon], {
		sx: sxMerger(DIconLibraryTsx[tag.icon].props.sx ?? {}, {
			fontSize: appTheme.fonts.text.size["sm"],
		}),
	});

	//====================== NAME ======================
	return (
		<CCard sx={style.main}>
			<Stack direction={"row"} sx={{ alignItems: "center" }}>
				{icon}
				<CText size="sm" sx={{ flex: 1, mx: "5px" }}>
					{tag.name}
				</CText>
				<CButtonIcon
					size="md"
					borderRadius={appTheme.shapes.radius.tiny}
					padding={"3px"}
					icon="edit"
					onClick={() => onEdit(tag)}
				/>
				{!isActive && (
					<CButtonIcon
						size="md"
						borderRadius={appTheme.shapes.radius.tiny}
						padding={"3px"}
						sx={{ ml: "3px" }}
						icon="add"
						onClick={() => onActivate(tag.uid)}
					/>
				)}
				{isActive && (
					<CButtonIcon
						size="md"
						borderRadius={appTheme.shapes.radius.tiny}
						padding={"3px"}
						sx={{ ml: "3px" }}
						icon="clear"
						onClick={() => onDeactivate(tag.uid)}
					/>
				)}
			</Stack>
		</CCard>
	);
}

export default CTagSelectorNode;
