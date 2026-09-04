import { Outlet } from "react-router";
import type { GPageProps } from "./pageCommon";
import CTabNavigation, {
	type TTabProviderIconLibrary,
} from "../../components/navigation/tabs/CTabNavigation";
import CTabProvider, { useTab } from "../../context/navigation/CTabProvider";
import { Stack } from "@mui/material";

export interface PBaseTabPageProps extends GPageProps {
	iconLibrary?: TTabProviderIconLibrary;
	forceHome?: boolean;
}
function PBaseTabPageSub({ iconLibrary }: PBaseTabPageProps) {
	const { tabs, activeTab, setTab, closeTab } = useTab();

	return (
		<Stack sx={{ position: "absolute", inset: "0" }} direction={"column"}>
			<CTabNavigation
				iconLibrary={iconLibrary}
				onChange={setTab}
				onClose={closeTab}
				value={activeTab}
				tabs={tabs}
			/>
			<Outlet />
		</Stack>
	);
}

function PBaseTabPage({ forceHome, ...other }: PBaseTabPageProps) {
	return (
		<CTabProvider forceHome={forceHome}>
			<PBaseTabPageSub {...other} />
		</CTabProvider>
	);
}

export default PBaseTabPage;
