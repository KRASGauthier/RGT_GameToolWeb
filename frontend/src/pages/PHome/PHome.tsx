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
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { ROUTE_PROJECT, ROUTE_PROJECT_NEW } from "../../consts";
import { apiGetUserProject } from "../../api/project/projectAPI";
import { useNotif } from "../../../rgt/context/app/CAppNotifContext";
import type { IProject } from "../../types/data/project/TProject";
import PHomeProjectCard from "./PHomeProjectCard";
import CSkeleton from "../../../rgt/components/feedback/skeleton/CSkeleton";

export interface PHomeProps extends GCompProps {}

const GRID_COUNT = 4;

function PHome({}: PHomeProps) {
	//====================== DATA ======================
	const { user, logout } = useAuth();
	const [projects, setProjects] = useState<IProject[] | undefined>(undefined);
	const navigate = useNavigate();
	const { push } = useNotif();

	//====================== EVENT ======================
	useEffect(() => {
		apiGetUserProject(setProjects, push);
	}, [push]);

	//====================== NODE ======================
	const addButton: ReactNode = (
		<Grid size={12 / GRID_COUNT}>
			<CButtonIcon
				icon={<AddIcon />}
				onClick={() => navigate(ROUTE_PROJECT + ROUTE_PROJECT_NEW)}
				sx={{ height: "100%", width: "100%", minHeight: "300px" }}
			/>
		</Grid>
	);
	const projectList: ReactNode = useMemo(() => {
		if (!projects) {
			const skeletonList: ReactNode[] = [];
			for (let i = 0; i < 3; i++)
				skeletonList.push(
					<Grid key={i} size={12 / GRID_COUNT}>
						<CSkeleton
							variant="rectangular"
							animation="wave"
							sx={{ minHeight: "300px", borderRadius: appTheme.shapes.radius.small }}
						/>
					</Grid>,
				);
			return skeletonList;
		}

		return projects.map((project: IProject) => {
			return (
				<Grid key={project.uid} size={12 / GRID_COUNT}>
					<PHomeProjectCard project={project} />
				</Grid>
			);
		});
	}, [projects]);

	if (!user) return <>No user</>;

	return (
		<Stack sx={{ flex: 1, overflow: "hidden" }}>
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
			<Stack
				direction="row"
				sx={{ mx: appTheme.shapes.spacing.medium, flex: 1, overflow: "hidden" }}
			>
				<Stack direction={"column"} sx={{ mt: "20px", flex: 1 }}>
					<CTitle size="sm" weight={7}>
						Projects
					</CTitle>
					<Grid
						container
						spacing={appTheme.shapes.spacing.main}
						sx={{ overflow: "auto" }}
					>
						{projectList}
						{addButton}
					</Grid>
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
