//====================== ROOTING ======================
export const EAppMenus: Record<string, string> = {
	HOME: "home",
	PROFILE: "profile",

	MANAGEMENT_TODO: "todo",
	MANAGEMENT_ROADMAP: "roadmap",
	MANAGEMENT_BUGS: "bugs",
};

//Auth
export const ROUTE_AUTH = "/auth";

//Project
export const ROUTE_PROJECT = "/project";
export const ROUTE_PROJECT_NEW = "/new";

//Users
export const ROUTE_USERS_ME = "/users/me";

//====================== API ======================
export const API_BASE = "http://localhost:8082/API/";
export const API_BASE_SIMPLE = "/API";

//--------------------- Users ---------------------
//Profile
export const ROUTE_PROFILE = "/profile";

//--------------------- Shared ---------------------
export const STATIC_IMAGES = "/images";

//====================== CONSTS ======================
export const AUTH_MIN_USER = 3;
export const AUTH_MAX_USER = 30;
export const AUTH_USER_MULTI_LANG = true;
export const AUTH_FIRST_NAME_MAX = 100;
export const AUTH_LAST_NAME_MAX = 100;

export const PROJECT_NAME_MIN = 3;
export const PROJECT_NAME_MAX = 30;
export const PROJECT_GAME_NAME_MAX = 256;
