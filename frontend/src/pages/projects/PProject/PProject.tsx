import CText from "../../../../rgt/components/text/CText";
import { useTab } from "../../../../rgt/context/navigation/CTabProvider";
import type { GPageProps } from "../../../../rgt/pages/shared/pageCommon";

export interface PProjectProps extends GPageProps {}

function PProject({}: PProjectProps) {
	const { activeTab } = useTab();

	return <CText>{activeTab}</CText>;
}

export default PProject;
