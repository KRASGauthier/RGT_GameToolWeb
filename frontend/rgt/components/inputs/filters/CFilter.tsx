import { Stack } from "@mui/material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import CPaper, { type CPaperProps } from "../../surfaces/CPaper";
import CButtonIconText from "../buttons/CButtonIconText";
import CButtonIcon from "../buttons/CButtonIcon";
import CButtonText from "../buttons/CButtonText";
import CSplitterRow from "../../splitters/CSplitterRow";
import { appTheme } from "../../../../src/style/theme";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import {
	CFilterEntryStyle,
	CFilterStyle,
	type IFilterStyle,
} from "../../../style/components/inputs/CFilterStyle";
import { sxMerger } from "../../../utils/UStyles";
import CSelectOutlined, { type ISelectOutlinedValues } from "../select/CSelectOutlined";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";
import type { TIconLibrary } from "../../../../src/types/icons/TIconLibrary";
import CSelectorButtonIcon from "../selectors/CSelectorButtonIcon";
import type { ISelectorEntry } from "../popover/CSelector";

//--------------------------------------------------
//                     CONST
//--------------------------------------------------
export const CFILTER_INVERSE_SUFFIX = "_inverse";

//--------------------------------------------------
//                     TYPES
//--------------------------------------------------
export interface IFilterAction {
	name: string;
	icon?: TIconLibrary;
	display?: string;
}

export type TFilterEntryType = "text" | "sort" | "toggle" | "selectorIcon";
export type TFilterEntrySize = "dafault" | "flex" | "small" | "medium" | "long" | "xlong";
export interface IFilterEntry {
	type: TFilterEntryType;
	selectValues?: ISelectOutlinedValues[];
	field: string;
	label?: string;
	placeHolder?: string;
	icon?: TIconLibrary;
	size?: TFilterEntrySize;

	//Selector
	selectorEntries?: ISelectorEntry[];
}
export type TFilterOut = Record<string, string | boolean | string[]>;

//--------------------------------------------------
//                   LIBRARY
//--------------------------------------------------
const actionsLibrary: Record<string, IFilterAction> = {
	add: {
		name: "add",
		icon: "add",
		display: "Add",
	},
};

//--------------------------------------------------
//                     NODE
//--------------------------------------------------
export interface CFilterProps extends Omit<CPaperProps, "onChange"> {
	actions?: (IFilterAction | string)[];
	entries?: IFilterEntry[];
	resetButton?: boolean;

	onEvent?: (event: string) => void;
	onChange?: (filter: TFilterOut) => void;
}

function CFilter({
	actions,
	entries,
	resetButton,
	onChange,
	onEvent,
	sx,
	...other
}: CFilterProps) {
	//====================== DATA ======================
	const [filter, setFilter] = useState<TFilterOut>({});
	const style: IFilterStyle = useMemo(() => {
		return CFilterStyle({});
	}, []);

	//====================== HANDLERS ======================]
	useEffect(() => {
		onChange?.(filter);
	}, [filter, onChange]);

	//====================== NODES ======================
	const getEvent = (action: IFilterAction): ReactNode => {
		const click = () => {
			onEvent?.(action.name);
		};

		if (action.icon && action.display)
			return (
				<CButtonIconText onClick={click} key={action.name} startIcon={DIconLibraryTsx[action.icon]}>
					{action.display}
				</CButtonIconText>
			);
		if (action.icon)
			return <CButtonIcon onClick={click} key={action.name} icon={DIconLibraryTsx[action.icon]} />;
		return (
			<CButtonText onClick={click} key={action.name}>
				{action.display ?? action.name}
			</CButtonText>
		);
	};

	const getEntry = (entry: IFilterEntry): ReactNode => {
		if (entry.type == "sort") {
			if (!entry.selectValues) return;
			return (
				<Stack direction={"row"} key={entry.field} sx={{ alignItems: "Center" }}>
					<CSelectOutlined
						sx={CFilterEntryStyle({ size: entry.size }).main}
						value={filter[entry.field] ?? entry.selectValues[0].value}
						selection={entry.selectValues}
						onChange={(e) => {
							setFilter((prev) => {
								return {
									...prev,
									[entry.field]: e.target.value as string,
								};
							});
						}}
					/>
					<CButtonIcon
						size="lg"
						onClick={() => {
							setFilter((prev) => {
								return {
									...prev,
									[entry.field + CFILTER_INVERSE_SUFFIX]:
										!prev[entry.field + CFILTER_INVERSE_SUFFIX],
								};
							});
						}}
						icon={
							DIconLibraryTsx[
								(filter[entry.field + CFILTER_INVERSE_SUFFIX]
									? "upArrow"
									: "downArrow") as TIconLibrary
							]
						}
					/>
				</Stack>
			);
		}
		else if (entry.type == "toggle") {
			return <CButtonText sx={{alignSelf: "center", textTransform: "none"}}   borderRadius={appTheme.shapes.radius.small} onClick={() => {
				setFilter((prev) => {
					return {
						...prev,
						[entry.field]: filter[entry.field] ? false : true,
					};
				});
			}} checkedStyling="light" styling="grey-dark" checked={filter[entry.field] ? true : false}>
				{entry.label ?? entry.field}
			</CButtonText>
		}
		else if (entry.type == "selectorIcon") {
			if(entry.selectorEntries == undefined)
				return;
			let values = filter[entry.field];
			if(!Array.isArray(values))
				values = [];
			return <CSelectorButtonIcon 
				values={values}
				entries={entry.selectorEntries}
				onSelected={(value) => {
					setFilter((prev) => {
						let prevArr = prev[entry.field];
						if(!Array.isArray(prevArr))
							prevArr = [];
						prevArr = [...(prevArr), value];
						return {
							...prev,
							[entry.field]: prevArr,
						};
					});
				}}
				onUnselected={(value) => {
					setFilter((prev) => {
						let prevArr = prev[entry.field];
						if(!Array.isArray(prevArr))
							prevArr = [];
						prevArr = prevArr.filter(
							(valueCheck) => valueCheck != value,
						);
						return {
							...prev,
							[entry.field]: prevArr,
						};
					});
				}}/>
		}
		return (
			<CTextFieldOutlined
				key={entry.field}
				startIcon={entry.icon ? DIconLibraryTsx[entry.icon] : undefined}
				label={entry.label}
				placeholder={entry.placeHolder}
				sx={CFilterEntryStyle({ size: entry.size }).main}
				value={filter[entry.field] ?? ""}
				onChange={(e) => {
					setFilter((prev) => {
						return {
							...prev,
							[entry.field]: e.target.value,
						};
					});
				}}
			/>
		);
	};

	return (
		<CPaper sx={sxMerger(style.main, sx ? sx : {})} {...other}>
			<Stack spacing={appTheme.shapes.spacing.medium} direction={"row"}>
				{actions?.map((action: IFilterAction | string | undefined) => {
					if (typeof action == "string")
						action = actionsLibrary[action] as IFilterAction;
					if (!action) return;
					return getEvent(action);
				})}
				{(actions && actions.length > 0) && <CSplitterRow sx={{ mx: "10px" }} color={appTheme.colors.primary[2]} />}
				{entries?.map((entry: IFilterEntry) => {
					return getEntry(entry);
				})}
				{resetButton && <CSplitterRow sx={{ mx: "10px" }} color={appTheme.colors.primary[2]} />}
				{resetButton && <CButtonIcon onClick={() => setFilter({})} size="lg" sx={{alignSelf: "center"}} icon={DIconLibraryTsx["reset"]} />}
			</Stack>
		</CPaper>
	);
}

export default CFilter;
