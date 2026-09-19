import { Stack } from "@mui/material";
import { appTheme } from "../../../style/theme";
import {
	apiGroupCreate,
	apiGroupDelete,
	apiGroupGet,
	apiGroupModify,
} from "../../../api/project/groupsAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import { useProject } from "../../../context/CProjectContext";
import { useEffect, useState } from "react";
import type { IGroup } from "../../../types/data/project/TGroups";
import PProjectGroupsEntry from "./PProjectGroupsEntry";
import CStack from "../../../../rgt/components/layout/CStack";
import type { TAPIGroupEdit } from "../../../types/api/project/TAPIGroups";
import CFilter, {
	CFILTER_INVERSE_SUFFIX,
	type TFilterOut,
} from "../../../../rgt/components/inputs/filters/CFilter";
import { DIconLibraryTsx } from "../../../icons/IIconLibrary";
import CDialogConfirm from "../../../../rgt/components/feedback/dialogs/CDialogConfirm";

export interface PProjectGroupsProps {}

function PProjectGroups({}: PProjectGroupsProps) {
	//====================== DATA ======================
	const [filters, setFilters] = useState<TFilterOut>({});
	const [groups, setGroups] = useState<(IGroup & { new?: boolean })[]>([]);
	const [toDelete, setToDelete] = useState<string | undefined>(undefined);
	const { push } = useNotif();
	const { project } = useProject();

	//====================== HANDLERS ======================
	const handleNew = async () => {
		if (!project) return;
		const group: IGroup | undefined = await apiGroupCreate(project.uid, push);
		if (!group) return;
		setGroups((prev: IGroup[]) => {
			return [...prev, { ...group, new: true }];
		});
	};
	const handleEvent = (event: string) => {
		switch (event) {
			case "add":
				handleNew();
		}
	};
	const handleDeleteConfirmed = async () => {
		if (!project) {
			setToDelete(undefined);
			return;
		}
		const res: IGroup[] | boolean = await apiGroupDelete(project.uid, toDelete ?? "", push);
		if (typeof res != "object") return;
		setGroups(res);
		setToDelete(undefined);
	};
	const handleDeleteCancelled = () => {
		setToDelete(undefined);
	};
	const handleDelete = (target: string) => {
		setToDelete(target);
	};

	const onEdit = async (target: string, edit: TAPIGroupEdit): Promise<boolean> => {
		if (!project) return false;
		const res: IGroup[] | boolean = await apiGroupModify(project.uid, target, edit, push);
		if (typeof res != "object") return res;
		setGroups(res);
		return true;
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

	//====================== EVENTS ======================
	useEffect(() => {
		if (!project) return;
		apiGroupGet(project.uid, push).then((groups: IGroup[]) => {
			setGroups(groups);
		});
	}, [project, push]);

	//====================== HANDLERS ======================

	return (
		<Stack
			sx={{ flex: 1, m: appTheme.shapes.spacing.main, overflow: "hidden" }}
			direction={"column"}
		>
			<CFilter
				library={DIconLibraryTsx}
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
