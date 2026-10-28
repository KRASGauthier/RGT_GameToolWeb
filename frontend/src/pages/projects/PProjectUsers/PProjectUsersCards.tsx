import { Stack } from "@mui/material";
import CAvatar from "../../../../rgt/components/images/CAvatar";
import CCard from "../../../../rgt/components/surfaces/CCard";
import CText from "../../../../rgt/components/text/CText";
import CButtonIcon from "../../../../rgt/components/inputs/buttons/CButtonIcon";
import type { IProjectUser } from "../../../types/data/project/TProjectUser";
import { iconApplySx } from "../../../icons/IIconLibrary";
import { useProject } from "../../../context/CProjectContext";
import type { ISelectorEntry } from "../../../../rgt/components/inputs/popover/CSelector";
import { useMemo, useState } from "react";
import CSelectorButtonIcon from "../../../../rgt/components/inputs/selectors/CSelectorButtonIcon";
import { appTheme } from "../../../style/theme";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";

export interface PProjectUsersCardsProps {
	user: IProjectUser;
}

function PProjectUsersCards({ user }: PProjectUsersCardsProps) {
	//====================== DATA ======================
	const { groups } = useProject();
	const entries: ISelectorEntry[] = useMemo(() => {
		return groups.map((group): ISelectorEntry => ({
			value: group.uid,
			display: group.name,
			icon: group.icon,
			color: group.color,
		}));
	}, [groups]);

	const [selectedGroups, setSelectedGroups] = useState<string[] | undefined>(undefined);

	//====================== HANDLERS ======================
	const handleCancel = () => {
		setSelectedGroups(undefined);
	};

	//====================== NODES ======================
	return (
		<CCard sx={{ flexShrink: 0 }}>
			<Stack direction={"row"} sx={{ alignItems: "center" }}>
				<CAvatar user={user} />
				<CText size="md" sx={{ flex: 1, ml: "5px" }}>
					{user.username}
				</CText>
				<CSplitterRow color={appTheme.colors.quaternary[5]} />
				<CSelectorButtonIcon
					values={selectedGroups ?? user.groups}
					entries={entries}
					onSelected={(value) => {
						setSelectedGroups((prev) => {
							return [...(prev ?? user.groups), value];
						});
					}}
					onUnselected={(value) => {
						setSelectedGroups((prev) => {
							return (prev ?? user.groups).filter(
								(valueCheck) => valueCheck != value,
							);
						});
					}}
				/>
				<CSplitterRow color={appTheme.colors.quaternary[5]} />
				{selectedGroups && (
					<CButtonIcon
						styling="validate"
						padding={"5px"}
						borderRadius={"small"}
						sx={{ ml: "5px", mr: "5px" }}
						icon={iconApplySx("tick", { fontSize: appTheme.fonts.text.size["lg"] })}
					/>
				)}
				{selectedGroups && (
					<CButtonIcon
						styling="cancel"
						onClick={handleCancel}
						padding={"5px"}
						borderRadius={"small"}
						sx={{ ml: "5px", mr: "5px" }}
						icon={iconApplySx("clear", { fontSize: appTheme.fonts.text.size["lg"] })}
					/>
				)}
				{!selectedGroups && (
					<CButtonIcon
						styling="cancel"
						padding={"5px"}
						borderRadius={"small"}
						sx={{ ml: "5px", mr: "5px" }}
						icon={iconApplySx("delete", { fontSize: appTheme.fonts.text.size["lg"] })}
					/>
				)}
			</Stack>
		</CCard>
	);
}

export default PProjectUsersCards;
