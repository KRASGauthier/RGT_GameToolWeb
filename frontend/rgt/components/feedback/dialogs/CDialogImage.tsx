import React, { useMemo, useRef, type ReactNode } from "react";
import type { CDialogProps } from "./CDialog";
import CDialog from "./CDialog";
import {
	CDialogImageStyle,
	type IDialogImageStyle,
} from "../../../style/components/feedback/CDialogStyle";
import { sxMerger } from "../../../utils/UStyles";
import { Box, Stack } from "@mui/material";
import HideImageIcon from "@mui/icons-material/HideImage";
import CSkeleton from "../skeleton/CSkeleton";
export interface CDialogImageProps extends CDialogProps {
	//MANAGEMENT
	src: string;
	editable?: boolean;
	aspectRatio?: string;
	onEdit?: (file: File) => void;

	//PARENT
	protectedRoute?: boolean;
	imageUrl?: string;
	parentError?: boolean;

	//STYLING
	styled?: boolean;
	styling?: TImageStyling;

	//ADDON
	extras?: ReactNode | ReactNode[];
}
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import type { TImageStyling } from "../../../style/components/images/CImageStyle";

function CDialogImage({
	//MANAGEMENT
	src,
	open,
	editable = false,
	aspectRatio = "16 / 9",
	onEdit,
	//PARENT
	protectedRoute,
	imageUrl,
	parentError,
	//STYLING
	styled,
	styling,
	//ADDON
	extras,
	sx,
	...other
}: CDialogImageProps) {
	const style: IDialogImageStyle = useMemo(() => {
		return CDialogImageStyle({ aspectRatio, editable, styled, styling });
	}, [aspectRatio, editable, styled, styling]);
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
			{((protectedRoute && imageUrl && !parentError) || !protectedRoute) && (
				<Box
					sx={sxMerger(style.image, sx ? sx : {})}
					component={"img"}
					src={protectedRoute ? imageUrl : src}
				></Box>
			)}
			{protectedRoute && !imageUrl && !parentError && (
				<CSkeleton sx={sxMerger(style.image, sx ? sx : {})} />
			)}
			{parentError && (
				<Stack direction={"row"} sx={style.brokenStack}>
					<BrokenImageIcon fontSize="large" sx={style.brokenImage} />
				</Stack>
			)}
		</Box>
	);

	return (
		<>
			<CDialog marginPaper={0} open={open} {...other} maxWidth={false}>
				{extras}
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
		</>
	);
}

export default CDialogImage;
