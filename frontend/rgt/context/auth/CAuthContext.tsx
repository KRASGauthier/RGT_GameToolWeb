import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type Context,
	type ReactNode,
} from "react";
import type { IUserBase } from "../../types/data/TUser";
import { apiAuthLogin, apiAuthRefresh } from "../../api/auth/authAPI";
import CText from "../../components/text/CText";
import CCard from "../../components/surfaces/CCard";
import { Stack } from "@mui/material";
import type { TFromDataType } from "../../components/inputs/form/CForm";

//--------------------------------------------------
//                      CONTEXT
//--------------------------------------------------
export type TAuthStatus = "loading" | "logged-out" | "authed";
export interface IAuthContext {
	token: string | null;
	user: IUserBase | null;
	status: TAuthStatus;
	login: (
		data: TFromDataType,
		setRemoteError?: React.Dispatch<React.SetStateAction<ReactNode>>,
	) => Promise<void>;
	refresh: () => Promise<void>;
}

const authContext: Context<IAuthContext> = createContext<IAuthContext>({
	token: null,
	user: null,
	status: "loading",
	login: async ({}) => {},
	refresh: async () => {},
});

export const useAuth = (): IAuthContext => {
	return useContext(authContext);
};

//--------------------------------------------------
//                     COMPONENT
//--------------------------------------------------
export interface CAuthContextProps {
	children: ReactNode;
}

function CAuthContext({ children }: CAuthContextProps) {
	//====================== DATA ======================
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<IUserBase | null>(null);
	const [status, setStatus] = useState<TAuthStatus>("loading");
	const [error, setError] = useState<ReactNode | undefined>(undefined);

	//====================== FUNCTIONS ======================
	const login = useCallback(
		async (
			data: TFromDataType,
			setRemoteError?: React.Dispatch<React.SetStateAction<ReactNode>>,
		) => {
			let email: string | boolean | undefined = data.email;
			if (typeof email == "string") email = email.trim();
			let password: string | boolean | undefined = data.password;
			if (typeof password == "string") password = password.trim();
			if (!email || !password || typeof email != "string" || typeof password != "string")
				return;
			if (!("password" in data) || !data.password) return;
			await apiAuthLogin(
				email,
				password,
				setToken,
				setUser,
				setStatus,
				setRemoteError ?? setError,
			);
		},
		[],
	);

	const refresh = useCallback(async () => {
		await apiAuthRefresh(setToken, setUser, setStatus, setError);
	}, []);

	useEffect(() => {
		if (status != "loading") return;
		refresh();
	}, [status, refresh]);

	return (
		<authContext.Provider value={{ token, user, status, login, refresh }}>
			{status == "loading" && (
				<Stack direction="column" sx={{ mt: "20px", alignItems: "center" }}>
					<CCard>
						<CText>Loading...</CText>
					</CCard>
				</Stack>
			)}
			{error && (
				<Stack direction="column" sx={{ mt: "20px", alignItems: "center" }}>
					<CCard styling="grey-light">{error}</CCard>
				</Stack>
			)}
			{status != "loading" && !error && children}
		</authContext.Provider>
	);
}

export default CAuthContext;
