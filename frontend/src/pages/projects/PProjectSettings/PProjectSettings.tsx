import { Stack } from "@mui/material";
import type { GPageProps } from "../../../../rgt/pages/shared/pageCommon";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CForm, { type TFormDataType } from "../../../../rgt/components/inputs/form/CForm";
import { PROJECT_GAME_NAME_MAX, PROJECT_NAME_MAX, PROJECT_NAME_MIN } from "../../../consts";
import { useProject } from "../../../context/CProjectContext";
import CSplitterCollumn from "../../../../rgt/components/splitters/CSplitterCollumn";
import CText from "../../../../rgt/components/text/CText";
import { appTheme } from "../../../style/theme";
import CChip from "../../../../rgt/components/data/chip/CChip";
import { DProjectEngine, DProjectLanguages } from "../../../types/data/project/TProject";
import type { IVersion } from "../../../../rgt/types/TShared";
import CImage from "../../../../rgt/components/images/CImage";

export interface PProjectSettingsProps extends GPageProps {}

function PProjectSettings({}: PProjectSettingsProps) {
	//====================== DATA ======================
	const { project, modify, modifyPicture } = useProject();

	//====================== EVENT / HANDLERS ======================
	const handleModify = async (data: TFormDataType): Promise<boolean> => {
		return modify({
			name: data.name as string | undefined,
			title: data.title as string | undefined,
		});
	};

	const handleModifyVersion = async (data: TFormDataType): Promise<boolean> => {
		return modify({
			version: data.version as IVersion,
		});
	};

	const handleImageEdit = (file: File) => {
		modifyPicture(file);
	};

	//====================== NODE ======================
	if (!project) return;
	return (
		<Stack sx={{ flex: 1 }} direction={"row"}>
			<Stack sx={{ flex: 1, mx: "25px", mt: "40px" }} direction={"column"}>
				<CForm
					outlinedStyling="neutral"
					values={{
						name: project.name,
						title: project.title ?? "",
					}}
					entries={[
						{
							type: "text",
							label: "Name",
							field: "name",
							required: true,
							min: PROJECT_NAME_MIN,
							max: PROJECT_NAME_MAX,
						},
						{
							type: "text",
							label: "Game title",
							field: "title",
							max: PROJECT_GAME_NAME_MAX,
						},
					]}
					onSendEdit={handleModify}
					managedButtonPosition="flex-end"
				></CForm>

				<CSplitterCollumn sx={{ mx: "auto", my: appTheme.shapes.spacing.mediumLarge }} />

				<CForm
					outlinedStyling="neutral"
					values={{
						version: project.version,
					}}
					entries={[
						{
							type: "version",
							field: "version",
							required: true,
						},
					]}
					onSendEdit={handleModifyVersion}
					managedButtonPosition="flex-end"
				></CForm>

				<CSplitterCollumn sx={{ mx: "auto", my: appTheme.shapes.spacing.mediumLarge }} />

				<Stack direction={"row"} sx={{ alignItems: "center" }}>
					<CText>Language: </CText>
					<CChip
						sx={{ ml: "10px" }}
						label={DProjectLanguages[project.language].display}
					/>
				</Stack>

				<Stack direction={"row"} sx={{ alignItems: "center", mt: "5px" }}>
					<CText>Engine: </CText>
					<CChip sx={{ ml: "10px" }} label={DProjectEngine[project.engine].display} />
				</Stack>
			</Stack>
			<CSplitterRow sx={{ my: "auto" }} />
			<Stack sx={{ flex: 1, mx: "25px", mt: "40px" }} direction={"column"}>
				<CImage onEdit={handleImageEdit} src={project.cover ?? ""} styled editable />
			</Stack>
		</Stack>
	);
}

export default PProjectSettings;
