import { Stack } from "@mui/material";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import { useMemo, useRef, useState } from "react";
import type { IUserBase } from "../../../../rgt/types/data/TUser";
import { useDebounced } from "../../../../rgt/hooks/useDebounced";
import { apiUserGetUserSearch } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import PProjectUsersSearchCards from "./PProjectUsersSearchCards";
import {
	PProjectUsersStyle,
	type IProjectUsersStyle,
} from "../../../style/pages/projects/PProjectUsersStyle";
import { useAuth } from "../../../../rgt/context/auth/CAuthContext";
import CText from "../../../../rgt/components/text/CText";
import PProjectUsersCards from "./PProjectUsersCards";
import { useProject } from "../../../context/CProjectContext";
import type { IProjectUser } from "../../../types/data/project/TProjectUser";
import { appTheme } from "../../../style/theme";

export interface PProjectUsersProps {}

function PProjectUsers({}: PProjectUsersProps) {
	//====================== DATA ======================
	const { push } = useNotif();

	const style: IProjectUsersStyle = useMemo(() => {
		return PProjectUsersStyle({});
	}, []);

	const search = useRef<string>("");
	const [searchedUsers, setSearchedUsers] = useState<IUserBase[]>([]);
	const { user: selfUser } = useAuth();

	const { users } = useProject();
	const owner: IProjectUser | undefined = users?.find((user: IProjectUser) => user.isOwner);

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

	//====================== NODES ======================
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
				{owner && <PProjectUsersCards user={owner} />}
				<CText size="xl" weight={8} sx={{ mt: appTheme.shapes.spacing.mediumLarge }}>
					User
				</CText>
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
						return <PProjectUsersSearchCards key={user.uid} user={user} />;
					})}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default PProjectUsers;
