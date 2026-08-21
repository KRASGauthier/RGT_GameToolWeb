//====================== API ROUTES ======================
//AUTH
export const API_AUTH = "/auth";
export const API_AUTH_REFRESH = "/refresh";
export const API_AUTH_LOGOUT = "/logout";
export const API_AUTH_LOGOUT_EVERYWHERE = "/logout-everywhere";

//USER
export const API_USER = "/users";
export const API_USER_SELF = "/self";
export const API_USER_CHECK_AVAILABLE = "/available";

//====================== COMMON ======================
export const TIME_1S = 1000;
export const TIME_1M = 60 * TIME_1S;
export const TIME_1H = 60 * TIME_1M;
export const TIME_1D = 24 * TIME_1H;
export const TIME_1W = 7 * TIME_1D;
export const TIME_1Y = 365 * TIME_1D;

//====================== CONST ======================
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 20;

export const DEFAULT_DEBOUNCED_TIME = 300;

export const LIMITER_LOGIN = TIME_1M;
