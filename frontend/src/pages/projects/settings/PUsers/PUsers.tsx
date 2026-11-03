import { Stack } from "@mui/material";
import CSplitterRow from "../../../../../rgt/components/splitters/CSplitterRow";
import CTextFieldOutlined from "../../../../../rgt/components/inputs/text/CTextFieldOutlined";
import { useMemo, useRef, useState, type ReactNode } from "react";
import type { IUserBase } from "../../../../../rgt/types/data/TUser";
import { useDebounced } from "../../../../../rgt/hooks/useDebounced";
import { apiUserGetUserSearch } from "../../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../../rgt/context/app/CAppNotifContext";
import PUsersSearchCards from "./PUsersSearchCards";
import {
	PUsersStyle,
	type IProjectUsersStyle,
} from "../../../../style/pages/projects/PUsersStyle";
import { useAuth } from "../../../../../rgt/context/auth/CAuthContext";
import CText from "../../../../../rgt/components/text/CText";
import PUsersCards from "./PUsersCards";
import { useProject } from "../../../../context/CProjectContext";
import type { IProjectUser } from "../../../../types/data/project/TProjectUser";
import { appTheme } from "../../../../style/theme";
import CDialogConfirm from "../../../../../rgt/components/feedback/dialogs/CDialogConfirm";
import CFilter, {
	CFILTER_INVERSE_SUFFIX,
	type TFilterOut,
} from "../../../../../rgt/components/inputs/filters/CFilter";
import type { ISelectorEntry } from "../../../../../rgt/components/inputs/popover/CSelector";

export interface PUsersProps {}

function PUsers({}: PUsersProps) {
	//====================== DATA ======================
	const { push } = useNotif();

	const style: IProjectUsersStyle = useMemo(() => {
		return PUsersStyle({});
	}, []);

	const search = useRef<string>("");
	const [searchedUsers, setSearchedUsers] = useState<IUserBase[]>([]);
	const { user: selfUser } = useAuth();

	const { project, users, groups, deleteUser } = useProject();
	const owner: IProjectUser | undefined = users?.find((user: IProjectUser) => user.isOwner);
	const [deletingUser, setDeletingUser] = useState<IProjectUser | null>(null);

	//FILETR
	const [filters, setFilters] = useState<TFilterOut>({});
	const groupEntries: ISelectorEntry[] = useMemo(() => {
		return groups.map((group): ISelectorEntry => ({
			value: group.uid,
			display: group.name,
			icon: group.icon,
			color: group.color,
		}));
	}, [groups]);

	//====================== EVENTS ======================
	const { call: callSearch, stop: stopSearch } = useDebounced(async () => {
		setSearchedUsers(await apiUserGetUserSearch(search.current, push));
	});
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		search.current = e.target.value.trim();
		if (!search.current) {
			stopSearch();
			setSearchedUsers([]);
			return;
		}

		callSearch();
	};

	//====================== HANDLERS ======================
	const handleDeleteUser = async () => {
		if (!deletingUser) return;
		await deleteUser(deletingUser.uid);
		setDeletingUser(null);
	};

	//====================== NODES ======================
	const getUsersNode = (): ReactNode => {
		if (!project) return;
		const finalUsers: (IProjectUser | undefined)[] = project.users.map(
			(projectUser: string): IProjectUser | undefined => {
				return users.find((userCheck) => userCheck.uid == projectUser);
			},
		);
		return (
			finalUsers.filter((user: IProjectUser | undefined) => {
				if (!user) return false;
				if (
					typeof filters.name == "string" &&
					filters.name != "" &&
					!user.username.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase())
				)
					return false;
				if (Array.isArray(filters.groups) && filters.groups.length > 0) {
					const count = filters.groups.filter((group: string) =>
						user.groups.includes(group),
					).length;
					if (filters.exclusive && count == 0) return false;
					if (!filters.exclusive && count != filters.groups.length) return false;
				}
				return true;
			}) as IProjectUser[]
		)
			.sort((user1: IProjectUser, user2: IProjectUser) => {
				if (user1.username.toLocaleLowerCase() < user2.username.toLocaleLowerCase())
					return filters["sort" + CFILTER_INVERSE_SUFFIX] ? 1 : -1;
				else if (user1.username.toLocaleLowerCase() > user2.username.toLocaleLowerCase())
					return filters["sort" + CFILTER_INVERSE_SUFFIX] ? -1 : 1;
				return 0;
			})
			.map((user: IProjectUser): ReactNode => {
				return (
					<PUsersCards
						onUserDelete={(user) => setDeletingUser(user)}
						user={user}
					/>
				);
			});
	};

	return (
		<Stack sx={{ flex: 1 }} direction={"row"}>
			<Stack
				sx={{
					flex: 3,
					px: appTheme.shapes.spacing.medium,
					py: appTheme.shapes.spacing.small,
				}}
				direction={"column"}
			>
				<CText size="xl" weight={8}>
					Owner
				</CText>
				{owner && <PUsersCards user={owner} />}
				<CText size="xl" weight={8} sx={{ mt: appTheme.shapes.spacing.mediumLarge }}>
					Users
				</CText>
				<CFilter
					sx={{ mb: "10px" }}
					entries={[
						{
							type: "text",
							field: "name",
							icon: "search",
							size: "flex",
						},
						{
							type: "selectorIcon",
							field: "groups",
							selectorEntries: groupEntries,
						},
						{
							type: "toggle",
							field: "exclusive",
							label: "Exclusive",
							selectorEntries: groupEntries,
						},
						{
							type: "sort",
							field: "sort",
							selectValues: [
								{
									value: "name",
									display: "Name",
								},
							],
							size: "medium",
						},
					]}
					onChange={setFilters}
					resetButton
				/>
				<Stack spacing={appTheme.shapes.spacing.tiny}>{getUsersNode()}</Stack>
			</Stack>
			<CSplitterRow secondSize={"95%"} sx={{ my: "15px" }} />
			<Stack sx={style.main} direction={"column"}>
				<CTextFieldOutlined
					onChange={handleSearch}
					styling="neutral"
					placeholder="Search for users"
				/>
				<Stack direction={"column"} spacing={"2px"} sx={{ flex: 1, overflow: "auto" }}>
					{searchedUsers.map((user: IUserBase) => {
						if (selfUser?.uid === user.uid) return;
						return <PUsersSearchCards key={user.uid} user={user} />;
					})}
				</Stack>
			</Stack>
			<CDialogConfirm
				type="user"
				name={deletingUser?.username}
				open={deletingUser ? true : false}
				onNo={() => setDeletingUser(null)}
				onYes={handleDeleteUser}
			/>
		</Stack>
	);
}

export default PUsers;
