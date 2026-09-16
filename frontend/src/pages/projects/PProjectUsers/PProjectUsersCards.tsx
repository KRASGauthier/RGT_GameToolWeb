import { Stack } from "@mui/material";
import CAvatar from "../../../../rgt/components/images/CAvatar";
import CCard from "../../../../rgt/components/surfaces/CCard";
import CText from "../../../../rgt/components/text/CText";
import type { IUserBase } from "../../../../rgt/types/data/TUser";
import CButtonIcon from "../../../../rgt/components/inputs/buttons/CButtonIcon";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export interface PProjectUsersCardsProps {
	user: IUserBase;
}

function PProjectUsersCards({ user }: PProjectUsersCardsProps) {
	return (
		<CCard sx={{ flexShrink: 0 }}>
			<Stack direction={"row"} sx={{ alignItems: "center" }}>
				<CAvatar user={user} />
				<CText sx={{ ml: "5px" }}>{user.username}</CText>
				<CButtonIcon sx={{ ml: "auto", mr: "5px" }} icon={<PersonAddIcon />} />
			</Stack>
		</CCard>
	);
}

export default PProjectUsersCards;
