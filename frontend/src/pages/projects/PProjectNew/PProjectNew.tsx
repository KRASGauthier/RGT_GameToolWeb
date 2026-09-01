import { Stack } from "@mui/material";
import type { GPageProps } from "../../../../rgt/pages/shared/pageCommon";
import AddIcon from "@mui/icons-material/Add";
import CTitle from "../../../../rgt/components/text/CTitle";
import CButtonIconText from "../../../../rgt/components/inputs/buttons/CButtonIconText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { appTheme } from "../../../style/theme";
import {
	PProjectNewStyle,
	type IProjectNewStyle,
} from "../../../style/pages/projects/PProjectNewStyle";
import { useMemo, useState } from "react";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CToggle from "../../../../rgt/components/inputs/toggle/CToggle";
import {
	DProjectEngine,
	type TProjectEngineTypes,
	type TProjectLanguage,
	type TProjectLanguageTypes,
} from "../../../types/data/project/TProject";
import DoneIcon from "@mui/icons-material/Done";
import CForm, { type TFormDataType } from "../../../../rgt/components/inputs/form/CForm";
import { PROJECT_GAME_NAME_MAX, PROJECT_NAME_MAX, PROJECT_NAME_MIN } from "../../../consts";
import type { TAPIProjectCreate } from "../../../types/api/project/TAPIProject";
import { apiProjectCreate } from "../../../api/project/projectAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import type { IVersion } from "../../../../rgt/types/TShared";

export interface PProjectNewProps extends GPageProps {}

function PProjectNew({}: PProjectNewProps) {
	//====================== DATA ======================
	const [formData, setFormData] = useState<TFormDataType>({});
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [engine, setEngine] = useState<TProjectEngineTypes>("godot");
	const [lang, setLang] = useState<TProjectLanguageTypes>("cs");
	const style: IProjectNewStyle = useMemo(() => {
		return PProjectNewStyle({});
	}, []);
	const {push} = useNotif();

	//====================== FUNCTIONS ======================
	const handleCreate = () => {
		const data: TAPIProjectCreate = {
			...formData as {name: string, version: IVersion, title?: string},
			engine: engine,
    		language: lang,
		}
		apiProjectCreate(data, push)
	}

	//====================== NODES ======================
	return (
		<Stack sx={{ flex: 1 }}>
			<Stack
				sx={{
					mx: appTheme.shapes.spacing.medium,
					mt: appTheme.shapes.spacing.small,
					alignItems: "center",
				}}
				direction={"row"}
			>
				<AddIcon sx={style.addIcon} />
				<CTitle weight={7} size="sm">
					New project
				</CTitle>

				<CButtonIconText sx={{ ml: "auto" }} styling="cancel" startIcon={<ArrowBackIcon />}>
					Back
				</CButtonIconText>
			</Stack>
			<Stack direction="row" sx={{ mx: appTheme.shapes.spacing.medium, flex: 1 }}>
				<Stack
					spacing={appTheme.shapes.spacing.medium}
					direction={"column"}
					sx={{ mt: "20px", mr: appTheme.shapes.spacing.medium, flex: 1 }}
				>
					<CTitle size="sm" weight={6}>
						Informations
					</CTitle>
					<CForm
						outlinedStyling="neutral"
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
							{
								type: "version",
								required: true,
							},
						]}
						onChange={(data: TFormDataType, valid: boolean) => {
							setFormData(data);
							setIsFormValid(valid);
						}}
						deallocateButton
					></CForm>
				</Stack>
				<CSplitterRow
					color={appTheme.colors.primary[2]}
					elevation={20}
					sx={{ my: "auto" }}
				/>
				<Stack
					spacing={appTheme.shapes.spacing.medium}
					direction={"column"}
					sx={{ mt: "20px", ml: appTheme.shapes.spacing.medium, flex: 1 }}
				>
					<CTitle size="sm" weight={6}>
						Settings
					</CTitle>
					<CToggle
						label="Engine:"
						styling="medium"
						checkedStyling="checkedLight"
						entries={[{ ...DProjectEngine.unrealEngine }, { ...DProjectEngine.godot }]}
						value={engine}
						onChange={(value: string) => {
							setEngine(value as TProjectEngineTypes);
							if (
								!DProjectEngine[value as TProjectEngineTypes].langs.find(
									(language: TProjectLanguage) => language.value == lang,
								)
							)
								setLang(
									DProjectEngine[value as TProjectEngineTypes].langs[0].value,
								);
						}}
					/>
					<CToggle
						label="Language:"
						styling="medium"
						checkedStyling="checkedLight"
						entries={DProjectEngine[engine].langs}
						value={lang}
						onChange={(value: string) => setLang(value as TProjectLanguageTypes)}
					/>
				</Stack>
			</Stack>
			<CButtonIconText
				disabled={!isFormValid}
				styling="validate"
				startIcon={<DoneIcon />}
				sx={{ mx: "auto", mb: "50px" }}
				onClick={handleCreate}
			>
				Create
			</CButtonIconText>
		</Stack>
	);
}

export default PProjectNew;
