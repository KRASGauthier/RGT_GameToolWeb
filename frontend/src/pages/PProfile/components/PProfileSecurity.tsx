import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CText from "../../../../rgt/components/text/CText";
import CForm from "../../../../rgt/components/inputs/form/CForm";
import type { IFormEntry, TFormDataType } from "../../../../rgt/components/inputs/form/CForm";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import { apiChangePassword } from "../../../../rgt/api/user/userAPI";

export interface PProfileSecurityProps extends GCompProps {}

function PProfileSecurity({}: PProfileSecurityProps) {
	const { push } = useNotif();

	const profilePass: IFormEntry[] = [
		{
			type: "password",
			field: "currentPassword",
			label: "Current password",
			required: true,
			login: true,
		},
		{
			type: "password",
			field: "newPassword",
			label: "New password",
			required: true,
		},
		{
			type: "password-confirm",
			field: "confirmPassword",
			label: "Confirm password",
			required: true,
			checkTarget: "newPassword",
		},
	];

	const handleSendEdit = async (data: TFormDataType): Promise<boolean> => {
		return apiChangePassword(
			data.currentPassword as string,
			data.newPassword as string,
			push,
		);
	};

	return (
		<Stack sx={{ p: 2, gap: 2 }}>
			<CText size="lg" weight={6}>
				Security settings
			</CText>

			<CForm
				entries={profilePass}
				values={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
				onSendEdit={handleSendEdit}
				buttonStyling="validate"
				managedButtonPosition="flex-end"
			/>
		</Stack>
	);
}

export default PProfileSecurity;
