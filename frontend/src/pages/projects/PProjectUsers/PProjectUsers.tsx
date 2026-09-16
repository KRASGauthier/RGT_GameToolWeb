import { Stack } from "@mui/material";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import { useMemo, useRef, useState } from "react";
import type { IUserBase } from "../../../../rgt/types/data/TUser";
import { useDebounced } from "../../../../rgt/hooks/useDebounced";
import { apiUserGetUserSearch } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import PProjectUsersCards from "./PProjectUsersCards";
import {
	PProjectUsersStyle,
	type IProjectUsersStyle,
} from "../../../style/pages/projects/PProjectUsersStyle";
import { useAuth } from "../../../../rgt/context/auth/CAuthContext";

export interface PProjectUsersProps {}

function PProjectUsers({}: PProjectUsersProps) {
	//====================== DATA ======================
	const search = useRef<string>("");
	const [searchedUsers, setSearchedUsers] = useState<IUserBase[]>([]);
	const { push } = useNotif();
	const style: IProjectUsersStyle = useMemo(() => {
		return PProjectUsersStyle({});
	}, []);
	const { user: selfUser } = useAuth();

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

	console.log(searchedUsers);

	//====================== NODES ======================
	return (
		<Stack sx={{ flex: 1 }} direction={"row"}>
			<Stack sx={{ flex: 3 }} direction={"column"}></Stack>
			<CSplitterRow secondSize={"95%"} sx={{ my: "auto" }} />
			<Stack sx={style.main} direction={"column"}>
				<CTextFieldOutlined
					onChange={handleSearch}
					styling="neutral"
					placeholder="Search for users"
				/>
				<Stack direction={"column"} spacing={"2px"} sx={{ flex: 1, overflow: "auto" }}>
					{searchedUsers.map((user: IUserBase) => {
						if (selfUser?.uid === user.uid) return;
						return <PProjectUsersCards key={user.uid} user={user} />;
					})}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default PProjectUsers;
