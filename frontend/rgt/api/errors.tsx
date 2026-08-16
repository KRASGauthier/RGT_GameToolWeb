import { Stack } from "@mui/material";
import CText from "../../rgt/components/text/CText";
import type { IAPIData, IAPIErrors } from "../types/api/TAPI";
import { appTheme } from "../../src/style/theme";
import type { IErrorReturnOptions, TErrorReturnTypes } from "../types/TError";

export const apiMakeError = <_T,>(
	status: number | undefined,
	data: IAPIErrors | undefined,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): IAPIData<_T> => {
	if (data == undefined) data = { error: ["Unknown error"] };
	if (typeof data == "string") data = { error: [data] };

	return {
		status: status ?? -1,
		error: (
			<Stack
				sx={{
					color:
						type == undefined || type == "error"
							? appTheme.colors.error[5]
							: appTheme.colors.white,
				}}
			>
				{!options?.noStatus && (
					<CText
						sx={{
							fontWeight: 800,
						}}
						size="sm"
					>
						{"Status: " + (status == undefined ? -1 : status)}
					</CText>
				)}
				{data.error.map((error: string, index: number) => {
					return (
						<CText
							sx={{
								fontWeight: 600,
							}}
							size="xs"
							key={"error-" + index}
						>
							{error}
						</CText>
					);
				})}
			</Stack>
		),
		errorInfo: data.errorInfo,
	};
};
