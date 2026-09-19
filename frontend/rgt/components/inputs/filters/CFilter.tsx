import { Stack, type SvgIconProps } from "@mui/material";
import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
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

//--------------------------------------------------
//                     CONST
//--------------------------------------------------
export const CFILTER_INVERSE_SUFFIX = "_inverse";

//--------------------------------------------------
//                     TYPES
//--------------------------------------------------
export interface IFilterAction<_T> {
	name: string;
	icon?: _T;
	display?: string;
}

export type TFilterEntryType = "text" | "sort";
export type TFilterEntrySize = "dafault" | "flex" | "small" | "medium" | "long" | "xlong";
export interface IFilterEntry<_T> {
	type: TFilterEntryType;
	selectValues?: ISelectOutlinedValues[];
	field: string;
	label?: string;
	placeHolder?: string;
	icon?: _T;
	size?: TFilterEntrySize;
}
export type TFilterOut = Record<string, string | boolean>;

//--------------------------------------------------
//                   LIBRARY
//--------------------------------------------------
const actionsLibrary: Record<string, IFilterAction<unknown>> = {
	add: {
		name: "add",
		icon: "add",
		display: "Add",
	},
};

//--------------------------------------------------
//                     NODE
//--------------------------------------------------
export interface CFilterProps<_T extends string> extends Omit<CPaperProps, "onChange"> {
	library: Record<_T, ReactElement<SvgIconProps>>;
	actions?: (IFilterAction<_T> | string)[];
	entries?: IFilterEntry<_T>[];

	onEvent?: (event: string) => void;
	onChange?: (filter: TFilterOut) => void;
}

function CFilter<_T extends string>({
	library,
	actions,
	entries,
	onChange,
	onEvent,
	sx,
	...other
}: CFilterProps<_T>) {
	//====================== DATA ======================
	const [filter, setFilter] = useState<TFilterOut>({});
	const style: IFilterStyle = useMemo(() => {
		return CFilterStyle({});
	}, []);

	//====================== HANDLERS ======================]
	useEffect(() => {
		if (Object.keys(filter).length == 0) return;
		onChange?.(filter);
	}, [filter, onChange]);

	//====================== NODES ======================
	const getEvent = (action: IFilterAction<_T>): ReactNode => {
		const click = () => {
			onEvent?.(action.name);
		};

		if (action.icon && action.display)
			return (
				<CButtonIconText onClick={click} key={action.name} startIcon={library[action.icon]}>
					{action.display}
				</CButtonIconText>
			);
		if (action.icon)
			return <CButtonIcon onClick={click} key={action.name} icon={library[action.icon]} />;
		return (
			<CButtonText onClick={click} key={action.name}>
				{action.display ?? action.name}
			</CButtonText>
		);
	};

	const getEntry = (entry: IFilterEntry<_T>): ReactNode => {
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
							library[
								(filter[entry.field + CFILTER_INVERSE_SUFFIX]
									? "upArrow"
									: "downArrow") as _T
							]
						}
					/>
				</Stack>
			);
		}
		return (
			<CTextFieldOutlined
				key={entry.field}
				startIcon={entry.icon ? library[entry.icon] : undefined}
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
				{actions?.map((action: IFilterAction<_T> | string | undefined) => {
					if (typeof action == "string")
						action = actionsLibrary[action] as IFilterAction<_T>;
					if (!action) return;
					return getEvent(action);
				})}
				<CSplitterRow sx={{ mx: "10px" }} color={appTheme.colors.primary[2]} />
				{entries?.map((entry: IFilterEntry<_T>) => {
					return getEntry(entry);
				})}
			</Stack>
		</CPaper>
	);
}

export default CFilter;
