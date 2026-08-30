import { Grid, Stack } from "@mui/material";
import type { GCompProps } from "../../../rgt/components/shared/ccommon";
import CAvatar from "../../../rgt/components/images/CAvatar";
import CButtonIcon from "../../../rgt/components/inputs/buttons/CButtonIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { appTheme } from "../../style/theme";
import CTitle from "../../../rgt/components/text/CTitle";
import { useAuth } from "../../../rgt/context/auth/CAuthContext";
import CSplitterRow from "../../../rgt/components/splitters/CSplitterRow";
import AddIcon from "@mui/icons-material/Add";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ROUTE_PROJECT, ROUTE_PROJECT_NEW } from "../../consts";

export interface PHomeProps extends GCompProps {}

function PHome({}: PHomeProps) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const addButton: ReactNode = (
		<Grid>
			<CButtonIcon
				icon={<AddIcon />}
				onClick={() => navigate(ROUTE_PROJECT + ROUTE_PROJECT_NEW)}
			/>
		</Grid>
	);

	if (!user) return <>No user</>;

	return (
		<Stack sx={{ flex: 1 }}>
			<Stack
				sx={{
					mx: appTheme.shapes.spacing.medium,
					mt: appTheme.shapes.spacing.small,
					alignItems: "center",
				}}
				spacing={appTheme.shapes.spacing.main}
				direction={"row"}
			>
				<CAvatar user={user} />
				<CTitle size="sm" weight={5}>
					Welcome back:{" "}
				</CTitle>
				<CTitle size="sm" weight={7} sx={{ color: appTheme.colors.tertiary[7] }}>
					{user.username}{" "}
				</CTitle>
				<CButtonIcon
					styling="light"
					sx={{ ml: "auto !important" }}
					padding={"5px"}
					icon={<PersonIcon sx={{ fontSize: appTheme.fonts.title.size.sm }} />}
				/>
				<CButtonIcon
					styling="cancel"
					onClick={logout}
					padding={"5px"}
					icon={<LogoutIcon sx={{ fontSize: appTheme.fonts.title.size.sm }} />}
				/>
			</Stack>
			<Stack direction="row" sx={{ mx: appTheme.shapes.spacing.medium, flex: 1 }}>
				<Stack direction={"column"} sx={{ mt: "20px", flex: 1 }}>
					<CTitle size="sm" weight={7}>
						Projects
					</CTitle>
					<Grid sx={{ flex: 1 }}>{addButton}</Grid>
				</Stack>
				<CSplitterRow
					color={appTheme.colors.primary[2]}
					elevation={20}
					sx={{ my: "auto" }}
				/>
				<Stack sx={{ flex: 1 }} direction={"row"}></Stack>
			</Stack>
		</Stack>
	);
}

export default PHome;
