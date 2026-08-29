
//--------------------------------------------------
//                     TYPES
//--------------------------------------------------
export type TTypeOf = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function";


//--------------------------------------------------
//                    VERSIONS
//--------------------------------------------------
export type TVersionType = "major" | "minor" | "patch"
export interface IVersion {
	major: number;
	minor: number;
	patch: number;
}