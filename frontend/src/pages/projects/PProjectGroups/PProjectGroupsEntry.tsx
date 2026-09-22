import { Stack, type SvgIconProps } from "@mui/material";
import CCard from "../../../../rgt/components/surfaces/CCard";
import CText from "../../../../rgt/components/text/CText";
import { DIconLibraryTsx } from "../../../icons/IIconLibrary";
import type { IGroup } from "../../../types/data/project/TGroups";
import CButtonIcon from "../../../../rgt/components/inputs/buttons/CButtonIcon";
import { cloneElement, useMemo, useState, type ReactElement } from "react";
import {
	PProjectGroupsEntryStyle,
	type IProjectGroupsEntryStyle,
} from "../../../style/pages/projects/PProjectGroupsStyle";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CIconButton from "../../../../rgt/components/inputs/buttons/pre-made/CIconButton";
import CButtonColor from "../../../../rgt/components/inputs/buttons/CButtonColor";
import { PROJECT_GROUP_NAME_MAX } from "../../../consts";
import type { TIconLibrary } from "../../../types/icons/TIconLibrary";
import type { TColorEntry } from "../../../../rgt/types/TStyles";
import type { TAPIGroupEdit } from "../../../types/api/project/TAPIGroups";
import { sxMerger } from "../../../../rgt/utils/UStyles";

export interface PProjectGroupsEntryProps {
	group: IGroup & { new?: boolean };
	onEdit: (target: string, edit: TAPIGroupEdit) => Promise<boolean>;
	onDelete: (target: string) => void;
}

function PProjectGroupsEntry({ group, onEdit, onDelete }: PProjectGroupsEntryProps) {
	//====================== DATA ======================
	const style: IProjectGroupsEntryStyle = useMemo(() => {
		return PProjectGroupsEntryStyle({ color: group.color });
	}, [group]);

	const [editMode, setEditMode] = useState<boolean>(group.new ?? false);
	const [edit, setEdit] = useState<TAPIGroupEdit>({});
	const isEditValid = (): boolean => {
		if (Object.keys(edit).length == 0) return false;
		if (edit.name) {
			const nameTrimmed = edit.name.trim();
			if (!nameTrimmed || nameTrimmed.length >= PROJECT_GROUP_NAME_MAX) return false;
		}
		return true;
	};

	//====================== HANDLERS ======================
	const onValidate = async () => {
		if (!isEditValid()) return;
		if (await onEdit(group.uid, edit)) {
			setEdit({});
			setEditMode(false);
		}
	};

	const onCancel = () => {
		setEdit({});
		setEditMode(false);
	};

	//====================== DATA ======================
	const icon: ReactElement<SvgIconProps> = cloneElement(DIconLibraryTsx[group.icon], {
		sx: sxMerger(style.text, DIconLibraryTsx[group.icon].props.sx ?? {}),
	});

	if (editMode) {
		return (
			<CCard sx={style.main}>
				<Stack spacing={"3px"} direction={"row"} sx={{ alignItems: "center" }}>
					<CIconButton
						size="lg"
						padding={"4px"}
						value={edit.icon ?? group.icon}
						library={DIconLibraryTsx}
						onSelected={(value: TIconLibrary) => {
							setEdit((prev) => {
								return {
									...prev,
									icon: value,
								};
							});
						}}
					/>
					<CTextFieldOutlined
						xPadding={"10px"}
						yPadding={"4px"}
						fontSize="sm"
						sx={{ flex: 1 }}
						value={edit.name ?? group.name}
						onChange={(e) => {
							setEdit((prev) => {
								return {
									...prev,
									name: e.target.value,
								};
							});
						}}
					/>
					<CSplitterRow secondSize={"auto"} sx={style.splitters} />
					<CButtonColor
						sx={style.colorButton}
						onChange={(color) => {
							setEdit((prev) => {
								return {
									...prev,
									color: color as TColorEntry,
								};
							});
						}}
						color={edit.color ?? group.color}
					/>
					<CSplitterRow secondSize={"auto"} sx={style.splitters} />
					<CButtonIcon
						styling="validate"
						size="lg"
						padding={"4px"}
						disabled={!isEditValid()}
						onClick={onValidate}
						icon={DIconLibraryTsx["tick"]}
					/>
					<CButtonIcon
						styling="cancel"
						size="lg"
						padding={"4px"}
						onClick={onCancel}
						icon={DIconLibraryTsx["clear"]}
					/>
				</Stack>
			</CCard>
		);
	}

	return (
		<CCard sx={style.main}>
			<Stack spacing={"3px"} direction={"row"} sx={{ alignItems: "center" }}>
				{icon}
				<CText sx={sxMerger(style.text, { ml: "15px !important", flex: 1 })}>
					{group.name}
				</CText>
				<CSplitterRow secondSize={"auto"} sx={style.splitters} />
				<CText sx={sxMerger(style.text, { minWidth: "75px", textAlign: "center" })}>
					0 users
				</CText>
				<CSplitterRow secondSize={"auto"} sx={style.splitters} />
				<CButtonIcon
					size="lg"
					padding={"4px"}
					icon={DIconLibraryTsx["edit"]}
					onClick={() => setEditMode(true)}
				/>
				<CButtonIcon
					styling="cancel"
					size="lg"
					padding={"4px"}
					icon={DIconLibraryTsx["delete"]}
					onClick={() => onDelete(group.uid)}
				/>
			</Stack>
		</CCard>
	);
}

export default PProjectGroupsEntry;
