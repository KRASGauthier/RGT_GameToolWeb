import { Tab, Tabs, type SvgIconProps, type TabsProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { useMemo, useState, type ReactElement, type ReactNode } from "react";
import {
	CTabsStyle,
	type ITabsStyle,
	type TTabsStyling,
} from "../../../style/components/navigation/tabs/CTabsStyle";
import { sxMerger } from "../../../utils/UStyles";
import CText from "../../text/CText";

export interface ITabEntry {
	value: string;
	display?: string;
	icon?: ReactElement<SvgIconProps>;

	content?: ReactNode;
}

export interface CTabsProps extends GCompProps, TabsProps {
	tabs: ITabEntry[];

	styling?: TTabsStyling;
}

function CTabs({ tabs, value, defaultValue, styling = "light", sx, ...other }: CTabsProps) {
	const [local, setLocal] = useState<string>(
		value ?? defaultValue ?? (tabs.length != 0 ? tabs[0].value : ""),
	);
	const current: string = value ?? local;

	const style: ITabsStyle = useMemo(() => {
		return CTabsStyle({ styling });
	}, [styling]);

	return (
		<>
			<Tabs
				value={current}
				onChange={(_, value) => {
					setLocal(value);
				}}
				sx={sxMerger(style.main, sx ? sx : {})}
				{...other}
			>
				{tabs.map((tab: ITabEntry) => {
					return (
						<Tab
							sx={style.tab}
							key={tab.value}
							value={tab.value}
							label={
								<CText sx={style.text} size="md" weight={5}>
									{tab.display}
								</CText>
							}
						/>
					);
				})}
			</Tabs>
			{tabs.map((tab: ITabEntry) => {
				return tab.value != current ? null : tab.content;
			})}
		</>
	);
}

export default CTabs;
