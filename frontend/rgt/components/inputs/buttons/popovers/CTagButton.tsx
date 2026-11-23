import { useTagSelector } from "../../../../context/popover/CTagSelectorProvider";
import CButtonIconList, { type CButtonIconListProps } from "../CButtonIconList";
import type { ITag } from "../../../../types/data/TTag";

export interface CTagButtonProps extends Omit<CButtonIconListProps, "onChange" | "entries"> {
	values: string[];
	onChange: (values: string[]) => void;
}

function CTagButton({ onChange, values, ...other }: CTagButtonProps) {
	const { tags, open } = useTagSelector();

	return (
		<>
			<CButtonIconList
				entries={tags.map((tag: ITag) => {
					return {
						value: tag.uid,
						display: tag.name,
						icon: tag.icon,
						color: tag.color,
					};
				})}
				values={values}
				onClick={(e) => open(e.currentTarget, values, onChange)}
				{...other}
			>
				Tags
			</CButtonIconList>
		</>
	);
}

export default CTagButton;
