import React, { useMemo, useRef } from "react";
import type { CDialogProps } from "./CDialog";
import CDialog from "./CDialog";
import {
	CDialogImageStyle,
	type IDialogImageStyle,
} from "../../../style/components/feedback/CDialogStyle";
import { sxMerger } from "../../../utils/UStyles";
import { Box, Stack } from "@mui/material";
import HideImageIcon from "@mui/icons-material/HideImage";

export interface CDialogImageProps extends CDialogProps {
	src: string;
	editable?: boolean;
	aspectRatio?: string;
	onEdit?: (file: File) => void;
}

function CDialogImage({
	src,
	editable = false,
	aspectRatio = "16 / 9",
	onEdit,
	sx,
	...other
}: CDialogImageProps) {
	const style: IDialogImageStyle = useMemo(() => {
		return CDialogImageStyle({ aspectRatio, editable });
	}, [aspectRatio, editable]);
	const inputRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

	const handleImageChanged = () => {
		if (!editable) return;
		inputRef.current?.click();
	};

	const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.[0]) return;
		if (onEdit) onEdit(event.target.files[0]);
	};

	//--------------------- Nodes ---------------------
	const emptyNode = (
		<Stack direction={"column"} sx={sxMerger(style.main, style.empty, sx ? sx : {})}>
			{" "}
			<Stack
				onClick={handleImageChanged}
				direction={"row"}
				sx={{
					position: "absolute",
					inset: 0,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<HideImageIcon
					fontSize="large"
					sx={{ height: "35%", width: "35%", pointerEvents: "none" }}
				/>
			</Stack>
		</Stack>
	);

	const coreNode = (
		<Box sx={sxMerger(style.main, sx ? sx : {})} onClick={handleImageChanged} {...other}>
			<Box sx={sxMerger(style.image, sx ? sx : {})} component={"img"} src={src}></Box>
		</Box>
	);

	return (
		<CDialog {...other} maxWidth={false}>
			<Stack direction={"column"}>
				{src && coreNode}
				{!src && emptyNode}
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleImageSelected}
				/>
			</Stack>
		</CDialog>
	);
}

export default CDialogImage;
