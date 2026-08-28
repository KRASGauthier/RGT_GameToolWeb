import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CText from "../../../../rgt/components/text/CText";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";

export interface PProfileSecurityProps extends GCompProps {}

function PProfileSecurity({}: PProfileSecurityProps) {
	return (
		<Stack sx={{ p: 2, gap: 2 }}>
			<CText size="lg" weight="bold">Security Settings</CText>
			<CText>Last password change: 2024-01-15</CText>
			<CButtonText>Change Password</CButtonText>
			<CButtonText>Save</CButtonText>
			<CText>Active sessions: 3</CText>
		</Stack>
	);
}

export default PProfileSecurity;