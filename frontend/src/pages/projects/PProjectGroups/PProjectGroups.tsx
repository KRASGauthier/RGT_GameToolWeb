import { Stack } from "@mui/material";
import { appTheme } from "../../../style/theme";
import { useProject } from "../../../context/CProjectContext";
import { useState } from "react";
import type { IGroup } from "../../../types/data/project/TGroups";
import PProjectGroupsEntry from "./PProjectGroupsEntry";
import CStack from "../../../../rgt/components/layout/CStack";
import type { TAPIGroupEdit } from "../../../types/api/project/TAPIGroups";
import CFilter, {
	CFILTER_INVERSE_SUFFIX,
	type TFilterOut,
} from "../../../../rgt/components/inputs/filters/CFilter";
import CDialogConfirm from "../../../../rgt/components/feedback/dialogs/CDialogConfirm";

export interface PProjectGroupsProps {}

function PProjectGroups({}: PProjectGroupsProps) {
	//====================== DATA ======================
	const [filters, setFilters] = useState<TFilterOut>({});
	const [toDelete, setToDelete] = useState<string | undefined>(undefined);
	const { groups, addGroup, editGroup, deleteGroup } = useProject();

	//====================== HANDLERS ======================
	const handleEvent = (event: string) => {
		switch (event) {
			case "add":
				addGroup();
		}
	};
	const handleDeleteConfirmed = async () => {
		if (!toDelete) return;
		await deleteGroup(toDelete);
		setToDelete(undefined);
	};
	const handleDeleteCancelled = () => {
		setToDelete(undefined);
	};
	const handleDelete = (target: string) => {
		setToDelete(target);
	};

	const onEdit = async (target: string, edit: TAPIGroupEdit): Promise<boolean> => {
		return await editGroup(target, edit);
	};

	const getFilteredGroups = (): IGroup[] => {
		return groups
			.filter((group: IGroup) => {
				if (
					typeof filters.name == "string" &&
					filters.name.trim() &&
					!group.name
						.toLocaleLowerCase()
						.includes(filters.name.trim().toLocaleLowerCase())
				)
					return false;
				return true;
			})
			.sort((group1: IGroup, group2: IGroup) => {
				if (group1.name.toLocaleLowerCase() < group2.name.toLocaleLowerCase())
					return filters["sort" + CFILTER_INVERSE_SUFFIX] ? 1 : -1;
				else if (group1.name.toLocaleLowerCase() > group2.name.toLocaleLowerCase())
					return filters["sort" + CFILTER_INVERSE_SUFFIX] ? -1 : 1;
				return 0;
			});
	};

	//====================== HANDLERS ======================

	return (
		<Stack
			sx={{ flex: 1, m: appTheme.shapes.spacing.main, overflow: "hidden" }}
			direction={"column"}
		>
			<CFilter
				actions={["add"]}
				entries={[
					{
						type: "text",
						field: "name",
						icon: "search",
						size: "flex",
					},
					{
						type: "sort",
						field: "sort",
						selectValues: [
							{
								value: "name",
								display: "Name",
							},
							{
								value: "users",
								display: "Users",
							},
						],
						size: "medium",
					},
				]}
				onChange={setFilters}
				onEvent={handleEvent}
			/>
			<CStack
				styling="deep"
				spacing={appTheme.shapes.spacing.tiny}
				sx={{ flex: 1, p: appTheme.shapes.spacing.tiny, mt: appTheme.shapes.spacing.small }}
				direction={"column"}
			>
				{getFilteredGroups().map((group: IGroup) => {
					return (
						<PProjectGroupsEntry
							onDelete={handleDelete}
							onEdit={onEdit}
							key={group.uid}
							group={group}
						/>
					);
				})}
			</CStack>
			<CDialogConfirm
				name={groups.find((group) => group.uid == toDelete)?.name}
				open={toDelete ? true : false}
				onYes={handleDeleteConfirmed}
				onNo={handleDeleteCancelled}
			/>
		</Stack>
	);
}

export default PProjectGroups;
