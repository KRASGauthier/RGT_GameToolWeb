import { Grid, Stack } from "@mui/material";
import type { CPopoverProps } from "../../feedback/popover/CPopover";
import CPopover from "../../feedback/popover/CPopover";
import CButtonIcon from "../buttons/CButtonIcon";
import CButtonText from "../buttons/CButtonText";
import { useMemo, useState, type ReactNode } from "react";
import {
	CDateSelectorStyle,
	type IDateSelectorStyle,
} from "../../../style/components/inputs/popover/CDateSelectorStyle";
import { TIME_LARGE_MONTHS, TIME_TINY_DAYS } from "../../../consts";
import CText from "../../text/CText";
import { sxMerger } from "../../../utils/UStyles";
import CStack from "../../layout/CStack";
import { appTheme } from "../../../../src/style/theme";

const EEditType = {
	DATE: "DATE",
	YEAR: "YEAR",
	MONTH: "MONTH",
} as const satisfies Record<string, string>;
type TEditType = keyof typeof EEditType;

export interface CDateSelectorProps extends Omit<CPopoverProps, "onChange"> {
	value: Date;
	minYear?: number;
	maxYear?: number;

	onChange?: (date: Date) => void;
}

function CDateSelector({ value, minYear = 20, maxYear = 20, onChange, ...other }: CDateSelectorProps) {
	const style: IDateSelectorStyle = useMemo(() => {
		return CDateSelectorStyle({});
	}, []);

	const [edit, setEdit] = useState<TEditType>(EEditType.DATE);
	const [displayDate, setDisplayDate] = useState<Date>(
		() => new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0),
	);
	const [today] = useState<Date>(() => new Date(Date.now()));

	//====================== HANDLERS ======================
	const checkDate = (date: Date) => {
		if(date.getFullYear() < today.getFullYear() - minYear)
		{
			date.setMonth(0);
			date.setFullYear(today.getFullYear() - minYear)
		}
		else if(date.getFullYear() > today.getFullYear() + maxYear)
		{
			date.setMonth(11);
			date.setFullYear(today.getFullYear() + maxYear)
		}
	}
	const handleShiftMonth = (shift: number) => {
		setDisplayDate((prev) => {
			const nDate = new Date(prev.getTime())
			nDate.setMonth(nDate.getMonth() + shift);
			checkDate(nDate);
			return nDate;
		})
	}

	const handleShiftYears = (shift: number) => {
		setDisplayDate((prev) => {
			const nDate = new Date(prev.getTime())
			nDate.setFullYear(nDate.getFullYear() + shift);
			checkDate(nDate);
			return nDate;
		})
	}

	//====================== NODES ======================
	const getDaysLine = (): ReactNode => {
		const output: ReactNode[] = [];
		const endDate = new Date(displayDate.getTime());
		endDate.setMonth(endDate.getMonth() + 1);
		endDate.setDate(endDate.getDate() - 1);

		for (const day of TIME_TINY_DAYS) {
			output.push(
				<Grid size={1} sx={{ textAlign: "center" }}>
					<CText size="sm" weight={8}>
						{day}
					</CText>
				</Grid>,
			);
		}
		for (
			let i = displayDate.getDate() - ((displayDate.getDay() || 7) - 1);
			i <= endDate.getDate() + (6 - ((endDate.getDay() || 7) - 1));
			i++
		) {
			const currentDate = new Date(displayDate);
			currentDate.setDate(i);
			output.push(
				<Grid size={1} sx={{display: "flex", justifyContent: "center"}}>
					<CButtonText
						styling={value.getTime() == today.getTime() ? "light" : "transparent"}
						textProps={{ size: "sm" }}
						padding={0}
						sx={style.dayButton(currentDate, displayDate.getMonth())}
						onClick={() => onChange?.(currentDate)}
					>
						{currentDate.getDate()}
					</CButtonText>
				</Grid>,
			);
		}
		return output;
	};
	const getMonthButtons = (): ReactNode => {
		return TIME_LARGE_MONTHS.map((month, index) => {
			return (
				<CButtonText
					styling="medium"
					checkedStyling="light"
					borderRadius={appTheme.shapes.radius.small}
					checked={displayDate.getMonth() == index}
					onClick={() => {
						setDisplayDate((prev) => {
							const nDate = new Date(prev.getTime());
							nDate.setMonth(index);
							checkDate(nDate);
							return nDate;
						})
						setEdit(EEditType.DATE)
					}}
				>
					{month}
				</CButtonText>
			);
		});
	};
	const getYearsButtons = (): ReactNode => {
		const out: ReactNode[] = [];
		console.log();
		for (
			let year = new Date(today).getFullYear() - minYear;
			year <= new Date(today).getFullYear() + maxYear;
			year++
		) {
			out.push(
				<CButtonText
					styling="medium"
					checkedStyling="light"
					checked={displayDate.getFullYear() == year}
					onClick={() => {
						setDisplayDate((prev) => {
							const nDate = new Date(prev.getTime());
							nDate.setFullYear(year);
							checkDate(nDate);
							return nDate;
						})
						setEdit(EEditType.DATE)
					}}
				>
					{year}
				</CButtonText>,
			);
		}
		return out;
	};

	return (
		<CPopover sx={style.main} {...other}>
			<Stack direction={"column"}>
				<Stack direction={"row"} sx={{ mb: "20px" }}>
					<CButtonIcon icon={"leftArrowSmall"} sx={style.arrowLeftButtons}  onClick={() => handleShiftYears(-1)}/>
					<CButtonText
						borderRadius={0}
						checkedStyling="secondary-light"
						styling="light"
						checked={edit == EEditType.YEAR}
						onClick={() => setEdit((prev) => prev == EEditType.YEAR ? EEditType.DATE : EEditType.YEAR)}
					>
						{displayDate.getFullYear()}
					</CButtonText>
					<CButtonIcon
						icon={"rightArrowSmall"}
						sx={sxMerger(style.arrowRightButtons, { mr: " 15px" })}
						 onClick={() => handleShiftYears(1)}
					/>

					<CButtonIcon icon={"leftArrowSmall"} sx={style.arrowLeftButtons} onClick={() => handleShiftMonth(-1)} />
					<CButtonText borderRadius={0}
					sx={{minWidth: "110px"}}
						checkedStyling="secondary-light"
						styling="light"
						checked={edit == EEditType.MONTH}
						onClick={() => setEdit((prev) => prev == EEditType.MONTH ? EEditType.DATE : EEditType.MONTH)}>
						{new Intl.DateTimeFormat("en-US", { month: "long" }).format(displayDate)}
					</CButtonText>
					<CButtonIcon icon={"rightArrowSmall"} sx={style.arrowRightButtons} onClick={() => handleShiftMonth(1)} />
				</Stack>
				{edit == EEditType.DATE && (
					<Grid sx={style.dayGrid} container columns={7}>
						{getDaysLine()}
					</Grid>
				)}
				{edit == EEditType.MONTH && (
					<CStack spacing={"4px"} sx={style.monthYearStack}>
						{getMonthButtons()}
					</CStack>
				)}
				{edit == EEditType.YEAR && (
					<CStack spacing={"4px"} sx={style.monthYearStack}>
						{getYearsButtons()}
					</CStack>
				)}
			</Stack>
		</CPopover>
	);
}

export default CDateSelector;
