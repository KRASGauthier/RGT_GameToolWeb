import { Stack } from "@mui/material";
import type { GPageProps } from "../shared/pageCommon";
import CPaperTitle from "../../components/surfaces/CPaperTitle";
import CTabs from "../../components/navigation/tabs/CTabs";
import CForm, { type TFromDataType } from "../../components/inputs/form/CForm";
import { useState, type ReactNode } from "react";
import { apiUserCheckAvailable, apiUserRegister } from "../../api/user/userAPI";
import type { IUserRegister } from "../../types/data/TUser";
import { useNotif } from "../../context/app/CAppNotifContext";
import type { TErrorInfo } from "../../types/api/TAPI";
import { AUTH_MAX_USER, AUTH_MIN_USER } from "../../../src/consts";
import { useAuth } from "../../context/auth/CAuthContext";

export interface PAuthProps extends GPageProps {}
type TAuthTabs = "login" | "register";

function PAuth({}: PAuthProps) {
	//====================== DATA ======================
	const [currentTab, setCurrentTab] = useState<TAuthTabs>("login");

	const [isLogin, setIsLogin] = useState<boolean>(false);
	const [errorInfo, setErrorInfo] = useState<TErrorInfo | undefined>(undefined);
	const [loginError, setLoginError] = useState<ReactNode | undefined>(undefined);

	const { push } = useNotif();
	const { login } = useAuth();

	//====================== HANDLERS ======================
	const handleLogin = async (data: TFromDataType) => {
		setIsLogin(true);
		await login(data, setLoginError);
		setIsLogin(false);
	};

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
			disable={isLogin}
			globalError={loginError}
			onSend={handleLogin}
			outlinedStyling="light"
			entries={[
				{
					type: "email",
					required: true,
					field: "email",
					login: true,
				},
				{
					type: "password",
					required: true,
					field: "password",
					login: true,
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
					max: AUTH_MAX_USER,
					min: AUTH_MIN_USER,
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
