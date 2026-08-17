import type { ReactNode } from "react";
import { API_AUTH, API_AUTH_REFRESH } from "../../consts";
import type { IAPIData } from "../../types/api/TAPI";
import { apiCheckReponse, apiGetData, apiPostData } from "../shared";
import type { IAPIAccess, IAPIAuthLogin } from "../../types/api/auth/TAPIAuth";
import type { TAuthStatus } from "../../context/auth/CAuthContext";
import type { IUserBase } from "../../types/data/TUser";

const handleAuthAnswer = (
	data: IAPIData<IAPIAccess>,
	setToken: (token: string | null) => void,
	setUser: React.Dispatch<React.SetStateAction<IUserBase | null>>,
	setStatus: React.Dispatch<React.SetStateAction<TAuthStatus>>,
	setError: React.Dispatch<React.SetStateAction<ReactNode>>,
	no401?: boolean,
) => {
	if (data.status == 401 && !no401) {
		setToken(null);
		setUser(null);
		setStatus("logged-out");
		return;
	}
	if (
		!apiCheckReponse(data, "token", { type: "error", handler: setError }) ||
		!apiCheckReponse(data, "user", { type: "error", handler: setError })
	) {
		setToken(null);
		setUser(null);
		setStatus("logged-out");
		return;
	}

	if (!data.data) return;

	setToken(data.data.token);
	setUser(data.data.user);
	setStatus("authed");
};

export const apiAuthLogin = async (
	email: string,
	password: string,
	setToken: (token: string | null) => void,
	setUser: React.Dispatch<React.SetStateAction<IUserBase | null>>,
	setStatus: React.Dispatch<React.SetStateAction<TAuthStatus>>,
	setError: React.Dispatch<React.SetStateAction<ReactNode>>,
) => {
	const data: IAPIData<IAPIAccess> = await apiPostData<IAPIAuthLogin, IAPIAccess>(
		API_AUTH,
		{ email, password },
		"error",
		{ noStatus: true },
	);
	handleAuthAnswer(data, setToken, setUser, setStatus, setError, true);
};

export const apiAuthRefresh = async (
	setToken: (token: string | null) => void,
	setUser: React.Dispatch<React.SetStateAction<IUserBase | null>>,
	setStatus: React.Dispatch<React.SetStateAction<TAuthStatus>>,
	setError: React.Dispatch<React.SetStateAction<ReactNode>>,
) => {
	const data: IAPIData<IAPIAccess> = await apiGetData<IAPIAccess>(
		API_AUTH + API_AUTH_REFRESH,
		"error",
	);
	handleAuthAnswer(data, setToken, setUser, setStatus, setError);
};
