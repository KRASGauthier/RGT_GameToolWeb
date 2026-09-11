import { createContext, useCallback, useContext, useEffect, useState, type Context, type ReactNode } from "react";
import type { IProject } from "../types/data/project/TProject";
import { useParams } from "react-router";
import CInfoCard from "../../rgt/components/feedback/info/CInfoCard";
import { apiGetProject, apiProjectModify, apiProjectSetImage } from "../api/project/projectAPI";
import type { TAPIProjectModify } from "../types/api/project/TAPIProject";
import { useNotif } from "../../rgt/context/app/CAppNotifContext";

//--------------------------------------------------
//                      CONTEXT
//--------------------------------------------------
export interface IProjectContext {
	project: IProject | undefined
	modify: (data: TAPIProjectModify) => Promise<boolean>
	modifyPicture: (file: File) => Promise<boolean>
}

const projectContext: Context<IProjectContext> = createContext<IProjectContext>({
	project: undefined,
	modify: async () => { return true },
	modifyPicture: async () => { return true }
});

export const useProject = (): IProjectContext => {
	return useContext(projectContext);
}

//--------------------------------------------------
//                     COMPONENT
//--------------------------------------------------
export interface CProjectProviderProps {
	children: ReactNode;
} 

function CProjectProvider({children}: CProjectProviderProps) {

	//====================== DATA ======================
	const [project, setProject] = useState<IProject | undefined>()
	const [error, setError] = useState<ReactNode | undefined>()
	const { tab } = useParams();
	const { push } = useNotif();

	//====================== EVENT ======================
	useEffect(() => {
		if(tab)
			apiGetProject(tab, setProject, setError)
	}, [tab])

	const modify = useCallback(async (data: TAPIProjectModify): Promise<boolean> => {
		if(!tab)
			return false;
		const nProject: IProject | undefined = await apiProjectModify(tab, data, push);
		if(!nProject)
			return false;
		setProject(nProject);
		return true;
	}, [tab, push])

	const modifyPicture = useCallback(async (file: File): Promise<boolean> => {
		if(!tab)
			return false;
		const nProject: IProject | undefined = await apiProjectSetImage(tab, file, push);
		if(!nProject)
			return false;
		setProject(nProject);
		return true;
	}, [tab, push])

	//====================== NODES ======================	
	if(!tab)
		return <CInfoCard>No opened project</CInfoCard>	
	if(error)
		return <CInfoCard cardStyling="grey-light">{error}</CInfoCard>	
	if(!project)
		return <CInfoCard>Loading...</CInfoCard>	

	return <projectContext.Provider value={{ project, modify, modifyPicture}}>
		{children}
	</projectContext.Provider>
}

export default CProjectProvider;