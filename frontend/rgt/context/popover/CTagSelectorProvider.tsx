import {
	createContext,
	useContext,
	useEffect,
	useState,
	type Context,
	type ReactNode,
} from "react";
import type { ITag } from "../../types/data/TTag";
import CTagSelector from "../../components/inputs/popover/CTagSelector";
import { apiTagGet, apiTagsAdd, apiTagsEdit } from "../../api/tags/tagsAPI";
import { useNotif } from "../app/CAppNotifContext";
import { generatePath } from "react-router";
import type { TUID } from "../../types/TShared";

//--------------------------------------------------
//                   CONTEXT
//--------------------------------------------------
export interface ITagSelectorContext {
	tags: ITag[];
	values: string[];
	open: (
		el: HTMLButtonElement | null,
		values: string[],
		onChange: (valuesInput: string[]) => void,
	) => void;
}

const tagSelectorContext: Context<ITagSelectorContext> = createContext<ITagSelectorContext>({
	tags: [],
	values: [],

	open: () => {},
});

export const useTagSelector = (): ITagSelectorContext => {
	return useContext(tagSelectorContext);
};

//--------------------------------------------------
//                      NODES
//--------------------------------------------------
export interface CTagSelectorProviderProps {
	children: ReactNode;
	path: string;
	pathBuilder: Record<string, string>;
}

function CTagSelectorProvider({ path, pathBuilder, children }: CTagSelectorProviderProps) {
	const [tags, setTags] = useState<ITag[]>([]);
	const [values, setValues] = useState<string[]>([]);

	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
	const [onChange, setOnChange] = useState<((valuesInput: string[]) => void) | null>(null);

	const { push } = useNotif();

	//====================== EVENTS ======================
	useEffect(() => {
		apiTagGet(generatePath(path, pathBuilder), setTags, push);
	}, [path, pathBuilder, push]);

	//====================== HANDLERS ======================
	const handleOpen = (
		el: HTMLButtonElement | null,
		values: string[],
		onChange: (valuesInput: string[]) => void,
	) => {
		setButtonRef(el);
		setValues(values);
		setOnChange(() => onChange);
	};

	const addTag = async (tag: Partial<ITag>): Promise<boolean> => {
		return apiTagsAdd(generatePath(path, pathBuilder), tag, setTags, push);
	};

	const editTag = async (tag: ITag): Promise<boolean> => {
		return apiTagsEdit(generatePath(path, pathBuilder), tag, setTags, push);
	};

	const activateTag = async (uid: TUID) => {
		if (values.find((id) => id == uid)) return;
		onChange?.([...values, uid]);
		setValues((prev) => [...prev, uid]);
	};
	const deactivateTag = async (uid: TUID) => {
		onChange?.(values.filter((id) => id != uid));
		setValues((prev) => prev.filter((id) => id != uid));
	};

	return (
		<>
			<CTagSelector
				anchorEl={buttonRef}
				anchorOrigin={{
					vertical: -4,
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={buttonRef != null}
				onClose={() => {
					setButtonRef(null);
					setOnChange(null);
				}}
				tags={tags}
				values={values}
				addTag={addTag}
				editTag={editTag}
				activateTag={activateTag}
				deactivateTag={deactivateTag}
			/>
			<tagSelectorContext.Provider value={{ tags, values, open: handleOpen }}>
				{children}
			</tagSelectorContext.Provider>
		</>
	);
}

export default CTagSelectorProvider;
