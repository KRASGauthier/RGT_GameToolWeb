import { Stack } from "@mui/material";
import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import CPaperTitle from "../../../rgt/components/surfaces/CPaperTitle";
import CTabs from "../../../rgt/components/navigation/tabs/CTabs";
import CForm from "../../../rgt/components/inputs/form/CForm";
import { useState } from "react";

export interface PAuthProps extends GPageProps {}
type TAuthTabs = "login" | "register";

function PAuth({}: PAuthProps) {
	//====================== DATA ======================
	const [currentTab, setCurrentTab] = useState<TAuthTabs>("login");

	//====================== NODES ======================
	const loginForm = (
		<CForm
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
			outlinedStyling="light"
			entries={[
				{
					type: "text",
					label: "First name",
					filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
					max: 100,
					field: "fname",
					required: true,
				},
				{
					type: "text",
					label: "Last name",
					filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
					max: 100,
					field: "lname",
					required: true,
				},
				{
					type: "user",
					multiLang: true,
					max: 30,
					min: 3,
					required: true,
				},
				{
					type: "email",
					required: true,
				},
				{
					type: "password",
					required: true,
				},
				{
					type: "password-confirm",
				},
			]}
			minWidth={"300px"}
			buttonMessage="Log in"
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
