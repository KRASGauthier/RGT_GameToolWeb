import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type Context,
	type ReactNode,
} from "react";
import type { ITabEntry } from "../../components/navigation/tabs/CTabs";
import { generatePath, Navigate, useNavigate, useParams } from "react-router";

//--------------------------------------------------
//                    CONTEXT
//--------------------------------------------------
export interface ITabEntryContext extends Omit<ITabEntry, "icon"> {
	route: string;
	icon: string;
}
export interface ITabContext {
	tabs: ITabEntryContext[];
	activeTab: string | null;

	openTab: (entry: ITabEntryContext, open?: boolean) => void;
	setTab: (entry: string | null) => void;
	closeTab: (entry: string) => Promise<boolean>;
}

const tabContext: Context<ITabContext> = createContext<ITabContext>({
	tabs: [],
	activeTab: null,

	openTab: () => {},
	setTab: () => {},
	closeTab: async () => {
		return false;
	},
});

export const useTab = (): ITabContext => {
	return useContext(tabContext);
};

const LS_TAB_PROVIDER_SAVE = "CTabProvider-Save";

//--------------------------------------------------
//                     NODE
//--------------------------------------------------
export interface CTabProviderProps {
	children: ReactNode;
}

function CTabProvider({ children }: CTabProviderProps) {
	//====================== DATA ======================
	const [tabs, setTabs] = useState<ITabEntryContext[]>(
		JSON.parse(localStorage.getItem(LS_TAB_PROVIDER_SAVE) ?? "[]") as ITabEntryContext[],
	);
	const activeTab: string | null = useParams().tab ?? null;
	const navigate = useNavigate();

	//====================== FUNCTIONS ======================
	useEffect(() => {
		localStorage.setItem(LS_TAB_PROVIDER_SAVE, JSON.stringify(tabs));
	}, [tabs]);

	const navigateTo = useCallback(
		(entry: ITabEntryContext | null) => {
			if (entry == null) {
				navigate("/");
				return;
			}
			navigate(generatePath(entry.route + "/", { tab: entry.value }));
		},
		[navigate],
	);

	const openTab = useCallback(
		(entry: ITabEntryContext, open?: boolean) => {
			if (tabs.find((check: ITabEntryContext) => check.value == entry.value)) return;
			setTabs((prev: ITabEntryContext[]) => {
				return [...prev, entry];
			});
			if (open) navigateTo(entry);
		},
		[tabs, navigateTo],
	);
	const setTab = useCallback(
		(entry: string | null) => {
			if (
				(entry != null && !tabs.find((tab: ITabEntryContext) => tab.value == entry)) ||
				activeTab == entry
			)
				return;
			navigateTo(
				entry == null
					? null
					: (tabs.find((tab: ITabEntryContext) => tab.value == entry) ?? null),
			);
		},
		[tabs, activeTab, navigateTo],
	);

	const closeTab = useCallback(
		async (entry: string): Promise<boolean> => {
			const pos: number = tabs.findIndex((tab: ITabEntryContext) => tab.value == entry);
			if (pos < 0) return false;
			setTabs((prev: ITabEntryContext[]) => {
				const nArray = [...prev];
				nArray.splice(pos, 1);
				return nArray;
			});
			if (entry == activeTab) navigate("/");
			return true;
		},
		[tabs, navigate, activeTab],
	);

	//====================== PROVIDER ======================
	if (activeTab && !tabs.find((entry: ITabEntryContext) => entry.value == activeTab))
		return <Navigate to="/" />;

	return (
		<tabContext.Provider
			value={{
				tabs,
				activeTab: activeTab ?? null,

				openTab,
				setTab,
				closeTab,
			}}
		>
			{children}
		</tabContext.Provider>
	);
}

export default CTabProvider;
