import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
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
import { api } from "../../api/shared";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_AUTH, API_AUTH_REFRESH } from "../../consts";

//--------------------------------------------------
//                      LOCAL OVERRIDE
//--------------------------------------------------
type TRetryConfig = InternalAxiosRequestConfig & {
	retry?: boolean
}

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
	const tokenRef = useRef<string | null>(null);
	const [user, setUser] = useState<IUserBase | null>(null);
	const [status, setStatus] = useState<TAuthStatus>("loading");
	const [error, setError] = useState<ReactNode | undefined>(undefined);

	//====================== FUNCTIONS ======================
	const changeToken = useCallback((token: string | null) => {
		tokenRef.current = token;
		setToken(token);
	}, [setToken, tokenRef])

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
				changeToken,
				setUser,
				setStatus,
				setRemoteError ?? setError,
			);
		},
		[changeToken],
	);

	const refresh = useCallback(async () => {
		await apiAuthRefresh(changeToken, setUser, setStatus, setError);
	}, [changeToken]);

	//====================== EFFECT ======================
	useEffect(() => {
		if (status != "loading") return;
		refresh();
	}, [status, refresh]);

	useEffect(() => {
		const requestInterceptor = api.interceptors.request.use((config) => {
			if(tokenRef.current)
				config.headers.Authorization = `Bearer ${tokenRef.current}`
			return config;
		},
		(error) => Promise.reject(error)
		)

		const responseIntercaptor = api.interceptors.response.use((response) => response, async (error?: AxiosError) => {
			if(!error || !error.config)
				return Promise.reject(error);
			const request = error.config as TRetryConfig;
			if(error.response?.status == 401 && !request.retry && request.url != API_AUTH + API_AUTH_REFRESH)
			{
 				request.retry = true;
				await refresh()
				return api(request);
			}
			return Promise.reject(error)
		})

		return () => {
			api.interceptors.request.eject(requestInterceptor);
			api.interceptors.response.eject(responseIntercaptor);
		}
	}, [refresh]);


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
