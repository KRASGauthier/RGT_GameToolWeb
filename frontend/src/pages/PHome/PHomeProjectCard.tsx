import { Stack } from "@mui/material";
import CButton from "../../../rgt/components/inputs/buttons/CButton";
import CText from "../../../rgt/components/text/CText";
import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import {
	DProjectEngine,
	DProjectLanguages,
	type IProject,
	type TProjectEngineTypes,
	type TProjectLanguageTypes,
} from "../../types/data/project/TProject";
import { appTheme } from "../../style/theme";
import CImage from "../../../rgt/components/images/CImage";
import { PHomeProjectCardStyle, type IHomeProjectCardStyle } from "../../style/pages/PHomeStyle";
import { useMemo } from "react";
import CTitle from "../../../rgt/components/text/CTitle";
import CSplitterCollumn from "../../../rgt/components/splitters/CSplitterCollumn";
import { versionToString } from "../../../rgt/types/TShared";
import { useTab } from "../../../rgt/context/navigation/CTabProvider";
import { ROUTE_PROJECT, ROUTE_PROJECT_ID } from "../../consts";

export interface PHomeProjectCardProps extends GPageProps {
	project: IProject;
}

function PHomeProjectCard({ project }: PHomeProjectCardProps) {
	const { openTab } = useTab();

	const style: IHomeProjectCardStyle = useMemo(() => {
		return PHomeProjectCardStyle({});
	}, []);

	const getTextInfo = (
		label: string,
		key: keyof IProject,
		modifier?: (value: string) => string,
	) => {
		let value: string;
		if (typeof project[key] == "object" && project[key] instanceof Date)
			value = project[key].toLocaleString();
		else if (typeof project[key] == "object") value = versionToString(project[key]);
		else value = modifier ? modifier(project[key] ?? "") : (project[key] ?? "");

		return project[key] ? (
			<Stack direction={"row"} sx={style.textsStack}>
				<CText size="sm" sx={style.texts}>
					{label}:{" "}
				</CText>
				<CText size="sm" weight={8} sx={style.textsSub}>
					{value}
				</CText>
			</Stack>
		) : undefined;
	};

	return (
		<CButton
			padding={"0 0 10px 0"}
			styling="medium"
			sx={style.main}
			borderRadius={appTheme.shapes.radius.small}
			onClick={() => {
				openTab(
					{
						value: project.uid,
						route: ROUTE_PROJECT + ROUTE_PROJECT_ID,
						display: project.name,
						icon: "project",
					},
					true,
				);
			}}
		>
			<Stack sx={style.stack} direction={"column"}>
				<CImage
					styling="secondary-dark"
					sx={style.image}
					aspectRatio="16/9"
					src={project.picture ?? ""}
				></CImage>
				<CTitle size="sm" weight={8}>
					{project.name}
				</CTitle>
				{project.title && <CText size="sm">{project.title}</CText>}
				<CSplitterCollumn sx={{ mx: "auto" }} color={appTheme.colors.quaternary[6]} />
				{getTextInfo("Version", "version")}
				{getTextInfo("Engine", "engine", (value: string): string => {
					return DProjectEngine[value as TProjectEngineTypes].display;
				})}
				{getTextInfo("Language", "language", (value: string): string => {
					return DProjectLanguages[value as TProjectLanguageTypes].display;
				})}
				{getTextInfo("Owner", "ownerName")}
				<CSplitterCollumn sx={{ mx: "auto" }} color={appTheme.colors.quaternary[6]} />
				{getTextInfo("Created", "created")}
				{getTextInfo("Last openned", "lastOpened")}
			</Stack>
		</CButton>
	);
}

export default PHomeProjectCard;
