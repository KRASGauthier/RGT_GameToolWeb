import { Stack } from "@mui/material";
import type { GPageProps } from "../../../../rgt/pages/shared/pageCommon";
import AddIcon from "@mui/icons-material/Add";
import CTitle from "../../../../rgt/components/text/CTitle";
import CButtonIconText from "../../../../rgt/components/inputs/buttons/CButtonIconText";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { appTheme } from "../../../style/theme";
import { PProjectNewStyle, type IProjectNewStyle } from "../../../style/pages/projects/PProjectNewStyle";
import { useMemo, useState } from "react";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CVersionFieldOutlined from "../../../../rgt/components/inputs/text/CVersionFieldOutlined";
import type { IVersion } from "../../../../rgt/types/TShared";
import CToggle from "../../../../rgt/components/inputs/toggle/CToggle";
import { DProjectEngine, type TProjectEngineTypes, type TProjectLanguage, type TProjectLanguageTypes } from "../../../types/data/project/TProject";
import DoneIcon from '@mui/icons-material/Done';
import CText from "../../../../rgt/components/text/CText";

export interface PProjectNewProps extends GPageProps{
	
}

function PProjectNew({}: PProjectNewProps) {


	//====================== DATA ======================
	const [name, setName] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [version, setVersion] = useState<IVersion>({major: 1, minor: 0, patch: 0});
	const [engine, setEngine] = useState<TProjectEngineTypes>("godot");
	const [lang, setLang] = useState<TProjectLanguageTypes>("cs");
	const style: IProjectNewStyle = useMemo(() => {
		return PProjectNewStyle({});
	}, [])

	//====================== CHECK ======================
	const checkValid = (): boolean => {
		if(name.trim().length < 3)
			return false;
		return true;
	}


	//====================== NODES ======================
	return <Stack  sx={{ flex: 1 }}>
		<Stack sx={{ mx: appTheme.shapes.spacing.medium, mt: appTheme.shapes.spacing.small, alignItems: "center" }}  direction={"row"}>
			<AddIcon sx={style.addIcon} />
			<CTitle weight={7} size="sm">New project</CTitle>

			<CButtonIconText sx={{ml: "auto"}} styling="cancel" startIcon={<ArrowBackIcon />}>Back</CButtonIconText>
		</Stack>
		<Stack direction="row" sx={{ mx: appTheme.shapes.spacing.medium, flex: 1 }}>
			<Stack spacing={appTheme.shapes.spacing.medium} direction={"column"} sx={{ mt: "20px", mr: appTheme.shapes.spacing.medium,  flex: 1 }}>
				<CTitle size="sm" weight={6}>
					Informations
				</CTitle>
				<Stack>
					<CTextFieldOutlined error={(name && name.length < 3) ? true : false} styling="neutral" value={name} onChange={(e) => setName(e.target.value)} label={"Name"} required/>
					{name && name.length < 3 && <CText size="xs" sx={{ml: "10px", color: appTheme.colors.error}} weight={8}>Min 3 characters</CText>}
				</Stack>
				<CTextFieldOutlined styling="neutral" value={title} onChange={(e) => setTitle(e.target.value)} label={"Game title"} />
				<CVersionFieldOutlined styling="neutral"  value={version} onChange={setVersion} required filled/>
			</Stack>
			<CSplitterRow
				color={appTheme.colors.primary[2]}
				elevation={20}
				sx={{ my: "auto" }}
			/>
			<Stack spacing={appTheme.shapes.spacing.medium} direction={"column"} sx={{ mt: "20px", ml: appTheme.shapes.spacing.medium,  flex: 1 }}>
				<CTitle size="sm" weight={6}>
					Settings
				</CTitle>
				<CToggle label="Engine:" styling="medium" checkedStyling="checkedLight" entries={[
					{...DProjectEngine.unrealEngine},
					{...DProjectEngine.godot},
				]} value={engine} onChange={(value: string) => {
					setEngine(value as TProjectEngineTypes)
					if(!DProjectEngine[value as TProjectEngineTypes].langs.find((language: TProjectLanguage) => language.value == lang))
						setLang(DProjectEngine[value as TProjectEngineTypes].langs[0].value)
				}}/>
				<CToggle label="Language:" styling="medium" checkedStyling="checkedLight" entries={DProjectEngine[engine].langs} value={lang} onChange={(value: string) => setLang(value as TProjectLanguageTypes)}/>
			</Stack>
		</Stack>
		<CButtonIconText disabled={!checkValid()} styling="validate" startIcon={<DoneIcon />} sx={{mx: "auto", mb: "50px"}}>Create</CButtonIconText>
	</Stack>
}

export default PProjectNew;