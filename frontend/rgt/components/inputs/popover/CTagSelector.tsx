import { Stack } from "@mui/material";
import CPopover, { type CPopoverProps } from "../../feedback/popover/CPopover";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import CStack from "../../layout/CStack";
import CSplitterRow from "../../splitters/CSplitterRow";
import { useMemo, useState } from "react";
import {
	CTagSelectorStyle,
	type ITagSelectorStyle,
} from "../../../style/components/inputs/popover/CTagSelectorStyle";
import { appTheme } from "../../../../src/style/theme";
import CIconButton from "../buttons/popovers/CIconButton";
import CButtonColor from "../buttons/CButtonColor";
import { type ITag } from "../../../types/data/TTag";
import type { TColorEntry } from "../../../types/TStyles";
import CButtonIcon from "../buttons/CButtonIcon";
import { TAG_MAX_LEN } from "../../../consts";
import CTagSelectorNode from "./CTagSelectorNode";
import type { TUID } from "../../../types/TShared";

export interface CTagSelectorProps extends CPopoverProps {
	tags: ITag[];
	values: string[];
	addTag: (tag: Partial<ITag>) => Promise<boolean>;
	editTag: (tag: ITag) => Promise<boolean>;
	activateTag: (uid: TUID) => void;
	deactivateTag: (uid: TUID) => void;
}

function CTagSelector({
	tags,
	values,
	addTag,
	editTag,
	activateTag,
	deactivateTag,
	...other
}: CTagSelectorProps) {
	const style: ITagSelectorStyle = useMemo(() => {
		return CTagSelectorStyle({});
	}, []);
	const [currentEdit, setCurrentEdit] = useState<Partial<ITag> | undefined>(undefined);

	const [searchActive, setSearchActive] = useState<string>("");
	const [searchUnactive, setSearchUnactive] = useState<string>("");

	//====================== HELPERS ======================
	const isTagValid = (): boolean => {
		if (!currentEdit || !currentEdit.name) return false;
		const trimmed = currentEdit.name.trim();
		if (!trimmed || trimmed.length > TAG_MAX_LEN) return false;
		return true;
	};

	//====================== HANDLERS ======================
	const handleTagEdit = async () => {
		if (!addTag || !currentEdit) return;
		if (!isTagValid()) return;
		if (!currentEdit.uid && (await addTag(currentEdit))) setCurrentEdit(undefined);
		else if (currentEdit.uid && (await editTag(currentEdit as ITag))) setCurrentEdit(undefined);
	};

	const handleCancelEdit = async () => {
		setCurrentEdit(undefined);
	};

	const handleEditTag = async (tag: ITag) => {
		setCurrentEdit({ ...tag });
	};

	//====================== NODES ======================
	const getActives = () => {
		const tagsSorted = tags
			.filter((tag) => !values.find((id) => id == tag.uid))
			.filter(
				(tag) =>
					!searchActive ||
					tag.name.toLocaleLowerCase().includes(searchActive.toLocaleLowerCase()),
			)
			.sort((tag1, tag2) => {
				if (tag1.name.toLocaleLowerCase() < tag2.name.toLocaleLowerCase()) return -1;
				if (tag1.name.toLocaleLowerCase() > tag2.name.toLocaleLowerCase()) return 1;
				return 0;
			});
		return tagsSorted.map((tag: ITag) => {
			return (
				<CTagSelectorNode
					key={tag.uid}
					onEdit={handleEditTag}
					onActivate={activateTag}
					onDeactivate={deactivateTag}
					tag={tag}
				/>
			);
		});
	};
	const getUnactives = () => {
		const tagsSorted = tags
			.filter((tag) => values.find((id) => id == tag.uid))
			.filter(
				(tag) =>
					!searchUnactive ||
					tag.name.toLocaleLowerCase().includes(searchUnactive.toLocaleLowerCase()),
			)
			.sort((tag1, tag2) => {
				if (tag1.name.toLocaleLowerCase() < tag2.name.toLocaleLowerCase()) return -1;
				if (tag1.name.toLocaleLowerCase() > tag2.name.toLocaleLowerCase()) return 1;
				return 0;
			});
		return tagsSorted.map((tag: ITag) => {
			return (
				<CTagSelectorNode
					key={tag.uid}
					isActive
					onEdit={handleEditTag}
					onActivate={activateTag}
					onDeactivate={deactivateTag}
					tag={tag}
				/>
			);
		});
	};

	return (
		<CPopover {...other}>
			<Stack direction={"column"}>
				<Stack direction={"row"}>
					<Stack direction={"column"}>
						<Stack direction={"column"}>
							<CTextFieldOutlined
								xPadding={"10px"}
								yPadding={"7px"}
								value={searchActive}
								onChange={(e) => setSearchActive(e.target.value)}
							/>
							<CStack
								borderRadius={appTheme.shapes.radius.small}
								styling="deep"
								sx={style.tagStack}
							>
								{getActives()}
							</CStack>
						</Stack>
					</Stack>
					<CSplitterRow />
					<Stack direction={"column"}>
						<Stack direction={"column"}>
							<CTextFieldOutlined
								xPadding={"10px"}
								yPadding={"7px"}
								value={searchUnactive}
								onChange={(e) => setSearchUnactive(e.target.value)}
							/>
							<CStack
								borderRadius={appTheme.shapes.radius.small}
								styling="deep"
								sx={style.tagStack}
							>
								{getUnactives()}
							</CStack>
						</Stack>
					</Stack>
				</Stack>
				<Stack direction={"row"} sx={{ mt: "10px", alignItems: "center" }}>
					<CIconButton
						padding={"4px"}
						onSelected={(value) => {
							setCurrentEdit((prev) => {
								return {
									...(prev ?? {}),
									icon: value,
								};
							});
						}}
						value={currentEdit?.icon ?? "tag"}
					></CIconButton>
					<CTextFieldOutlined
						xPadding={"10px"}
						yPadding={"7px"}
						sx={{ flex: 1 }}
						value={currentEdit?.name ?? ""}
						onChange={(value) => {
							setCurrentEdit((prev) => {
								return {
									...(prev ?? {}),
									name: value.target.value,
								};
							});
						}}
					/>
					<CButtonColor
						sx={{ minHeight: "30px" }}
						onChange={(color) => {
							setCurrentEdit((prev) => {
								return {
									...(prev ?? {}),
									color: color as TColorEntry,
								};
							});
						}}
						color={currentEdit?.color ?? appTheme.colors.primary[5]}
					/>
					{currentEdit && !currentEdit.uid && (
						<CButtonIcon
							disabled={!isTagValid()}
							icon="add"
							sx={{ ml: "15px" }}
							padding={"4px"}
							styling="secondary-medium"
							onClick={handleTagEdit}
						/>
					)}
					{currentEdit?.uid && (
						<CButtonIcon
							disabled={!isTagValid()}
							icon="tick"
							sx={{ ml: "15px" }}
							padding={"4px"}
							styling="validate"
							onClick={handleTagEdit}
						/>
					)}
					{currentEdit && (
						<CButtonIcon
							icon="clear"
							sx={{ ml: "3px" }}
							padding={"4px"}
							styling="cancel"
							onClick={handleCancelEdit}
						/>
					)}
				</Stack>
			</Stack>
		</CPopover>
	);
}

export default CTagSelector;
