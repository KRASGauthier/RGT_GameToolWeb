export function utilGetEntries<_T extends object>(data: unknown) {
	return Object.entries(data as _T) as [keyof _T, _T[keyof _T]][];
}
