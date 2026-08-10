import { Stack } from "@mui/material";
import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import CPaperTitle from "../../../rgt/components/surfaces/CPaperTitle";
import CTabs from "../../../rgt/components/navigation/tabs/CTabs";
import CForm, { type TFromDataType } from "../../../rgt/components/inputs/form/CForm";
import { useState } from "react";
import { apiUserCheckAvailable, apiUserRegister } from "../../../rgt/api/user/userAPI";
import type { IUserRegister } from "../../../rgt/types/data/TUser";
import { useNotif } from "../../../rgt/context/app/CAppNotifContext";
import type { TErrorInfo } from "../../../rgt/types/api/TAPI";

export interface PAuthProps extends GPageProps {}
type TAuthTabs = "login" | "register";

function PAuth({}: PAuthProps) {
	//====================== DATA ======================
	const [currentTab, setCurrentTab] = useState<TAuthTabs>("login");
	const { push } = useNotif();
	const [errorInfo, setErrorInfo] = useState<TErrorInfo | undefined>(undefined);

	//====================== HANDLERS ======================
	const handleRegister = (data: TFromDataType) => {
		apiUserRegister(data as unknown as IUserRegister, push, setErrorInfo);
	};

	const handleUserCheck = async (username: string): Promise<boolean> => {
		return await apiUserCheckAvailable(username, push);
	};

	//====================== NODES ======================
	const loginForm = (
		<CForm
			key={"login"}
			outlinedStyling="light"
			entries={[
				{
					type: "email",
				},
				{
					type: "password",
				},
			]}
			minWidth={"300px"}
			buttonMessage="Log in"
		></CForm>
	);

	const registerForm = (
		<CForm
			fieldExists={errorInfo}
			key={"register"}
			onSend={handleRegister}
			outlinedStyling="light"
			entries={[
				{
					type: "text",
					label: "First name",
					filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
					max: 100,
					field: "firstName",
					required: true,
				},
				{
					type: "text",
					label: "Last name",
					filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
					max: 100,
					field: "lastName",
					required: true,
				},
				{
					type: "user",
					multiLang: true,
					max: 30,
					min: 3,
					field: "username",
					required: true,
				},
				{
					type: "email",
					required: true,
					field: "email",
				},
				{
					type: "password",
					required: true,
					field: "password",
				},
				{
					type: "password-confirm",
				},
			]}
			minWidth={"300px"}
			buttonMessage="Register"
			onUsernameCheck={handleUserCheck}
		></CForm>
	);

	return (
		<Stack direction={"column"} sx={{ alignItems: "center" }}>
			<CPaperTitle
				padding={"30px"}
				styling="normal-wavy"
				title={currentTab == "login" ? "Welcome back" : "Create your account"}
				sx={{ mt: "50px" }}
			>
				<CTabs
					tabs={[
						{
							value: "login",
							display: "login",

							content: loginForm,
						},
						{
							value: "register",
							display: "Register",

							content: registerForm,
						},
					]}
					value={currentTab}
					onChange={(_, value: TAuthTabs) => setCurrentTab(value)}
					variant="fullWidth"
					styling="light-ter"
				></CTabs>
			</CPaperTitle>
		</Stack>
	);
}

export default PAuth;
