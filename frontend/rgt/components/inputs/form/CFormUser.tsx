import CFormComponent, { type CFormSubComponentProps } from "./CFormComponent";

function CFormUser({ entry, ...other }: CFormSubComponentProps) {
	return (
		<CFormComponent
			type="text"
			localFilter={{
				filter: entry.multiLang ? /^[\p{L}\p{M}\p{N}_]+$/u : /^[A-Za-z0-9_]+$/,
				message: "Unallowed character is being used",
			}}
			entry={entry}
			{...other}
		/>
	);
}

export default CFormUser;
