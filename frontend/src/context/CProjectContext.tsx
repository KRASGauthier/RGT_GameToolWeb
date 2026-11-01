import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type Context,
	type ReactNode,
} from "react";
import type { IProject } from "../types/data/project/TProject";
import { useParams } from "react-router";
import CInfoCard from "../../rgt/components/feedback/info/CInfoCard";
import { apiGetProject, apiProjectModify, apiProjectSetImage } from "../api/project/projectAPI";
import type { TAPIProjectModify } from "../types/api/project/TAPIProject";
import { useNotif } from "../../rgt/context/app/CAppNotifContext";
import type { IProjectUser } from "../types/data/project/TProjectUser";
import type { IGroup } from "../types/data/project/TGroups";
import type { TUID } from "../../rgt/types/TShared";
import {
	apiProjectUserAdd,
	apiProjectUserRemove,
	apiProjectUserSetGroup,
} from "../api/project/projectUserAPI";

//--------------------------------------------------
//                      CONTEXT
//--------------------------------------------------
export interface IProjectContext {
	project: IProject | undefined;
	users: IProjectUser[];
	groups: IGroup[];

	//====================== COMMON HANDLERS ======================
	modify: (data: TAPIProjectModify) => Promise<boolean>;
	modifyPicture: (file: File) => Promise<boolean>;

	//====================== USERS HANDLERS ======================
	addUser: (user: TUID) => Promise<void>;
	deleteUser: (user: TUID) => Promise<void>;
	modifyUserGroup: (user: TUID, groups: TUID[]) => Promise<boolean>;
}

const projectContext: Context<IProjectContext> = createContext<IProjectContext>({
	project: undefined,
	users: [],
	groups: [],
	modify: async () => {
		return true;
	},
	modifyPicture: async () => {
		return true;
	},
	addUser: async () => {},
	deleteUser: async () => {},
	modifyUserGroup: async () => {
		return true;
	},
});

export const useProject = (): IProjectContext => {
	return useContext(projectContext);
};

//--------------------------------------------------
//                     COMPONENT
//--------------------------------------------------
export interface CProjectProviderProps {
	children: ReactNode;
}

function CProjectProvider({ children }: CProjectProviderProps) {
	//====================== DATA ======================
	const [project, setProject] = useState<IProject | undefined>();
	const [users, setUsers] = useState<IProjectUser[]>([]);
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [error, setError] = useState<ReactNode | undefined>();
	const { tab } = useParams();
	const { push } = useNotif();

	//====================== EVENT ======================
	useEffect(() => {
		if (tab) apiGetProject(tab, setProject, setUsers, setGroups, setError);
	}, [tab]);

	//====================== COMMON HANDLERS ======================
	const modify = useCallback(
		async (data: TAPIProjectModify): Promise<boolean> => {
			if (!tab) return false;
			const nProject: IProject | undefined = await apiProjectModify(tab, data, push);
			if (!nProject) return false;
			setProject(nProject);
			return true;
		},
		[tab, push],
	);

	const modifyPicture = useCallback(
		async (file: File): Promise<boolean> => {
			if (!tab) return false;
			const nProject: IProject | undefined = await apiProjectSetImage(tab, file, push);
			if (!nProject) return false;
			setProject(nProject);
			return true;
		},
		[tab, push],
	);

	//====================== USERS HANDLERS ======================
	const addUser = useCallback(
		async (user: TUID): Promise<void> => {
			if (!project) return;
			await apiProjectUserAdd(project.uid, user, setProject, setUsers, push);
		},
		[project, setProject, setUsers, push],
	);
	const deleteUser = useCallback(
		async (user: TUID): Promise<void> => {
			if (!project) return;
			await apiProjectUserRemove(project.uid, user, setProject, setUsers, push);
		},
		[project, setProject, setUsers, push],
	);

	const modifyUserGroup = useCallback(
		async (target: TUID, groups: TUID[]): Promise<boolean> => {
			if (!project) return false;
			const user: IProjectUser | undefined = await apiProjectUserSetGroup(
				project.uid,
				target,
				groups,
				push,
			);
			if (!user) return false;
			setUsers((prev) => {
				const index = prev.findIndex((user: IProjectUser) => user.uid == target);
				if (index == -1) return prev;
				const nArray = [...prev];
				nArray[index] = user;
				return nArray;
			});
			return true;
		},
		[project, push],
	);

	//====================== NODES ======================
	if (!tab) return <CInfoCard>No opened project</CInfoCard>;
	if (error) return <CInfoCard cardStyling="grey-light">{error}</CInfoCard>;
	if (!project) return <CInfoCard>Loading...</CInfoCard>;

	return (
		<projectContext.Provider
			value={{
				project,
				users,
				groups,
				modify,
				modifyPicture,
				addUser,
				deleteUser,
				modifyUserGroup,
			}}
		>
			{children}
		</projectContext.Provider>
	);
}

export default CProjectProvider;
