import { Stack } from "@mui/material";
import type { GCompProps } from "../../../rgt/components/shared/ccommon";
import CText from "../../../rgt/components/text/CText";
import { useEffect, useState } from "react";
import { type IUserFull } from "../../../rgt/types/data/TUser";
import { apiUserGetFullSelf } from "../../../rgt/api/user/userAPI";
import { useNotif } from "../../../rgt/context/app/CAppNotifContext";

export interface PHomeProps extends GCompProps {}

function PHome({}: PHomeProps) {
	const [userFull, setUserFull] = useState<IUserFull | undefined>(undefined);
	const { push } = useNotif();

	useEffect(() => {
		apiUserGetFullSelf(setUserFull, push);
	}, [setUserFull, push]);

	if (!userFull) return <CText>No user</CText>;
	return (
		<Stack>
			<CText>{userFull.firstName}</CText>
			<CText>{userFull.lastName}</CText>
			<CText>{userFull.email}</CText>
			<CText>{userFull.username}</CText>
		</Stack>
	);
}

export default PHome;
