import { Box, Stack, type BoxProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CImageStyle,
	type IImageStyle,
	type TImageStyling,
} from "../../style/components/images/CImageStyle";
import { useMemo, useState, type ReactNode } from "react";
import { sxMerger } from "../../utils/UStyles";
import HideImageIcon from "@mui/icons-material/HideImage";
import CDialogImage from "../feedback/dialogs/CDialogImage";

export interface CImageProps extends GCompProps, BoxProps {
	src: string;

	aspectRatio?: string;
	styled?: boolean;
	styling?: TImageStyling;

	editable?: boolean;
	onEdit?: (file: File) => void;
	expandable?: boolean;
	extras?: ReactNode | ReactNode[];
}

function CImage({
	src,

	styled,
	styling,
	aspectRatio = "16 / 9",

	editable = false,
	expandable = false,

	onEdit,
	extras,
	sx,
	...other
}: CImageProps) {
	const [expended, setExpended] = useState<boolean>(false);
	const style: IImageStyle = useMemo(() => {
		return CImageStyle({ aspectRatio, styled, styling });
	}, [aspectRatio, styled, styling]);

	//====================== NODE ======================
	const emptyNode = (
		<Box sx={sxMerger(style.main, style.empty, sx ? sx : {})} {...other}>
			<Stack
				direction={"row"}
				sx={{
					position: "absolute",
					inset: 0,
					justifyContent: "center",
					alignItems: "center",
				}}
				onClick={() => {
					if (expandable || editable) setExpended(true);
				}}
			>
				<HideImageIcon fontSize="large" sx={{ height: "35%", width: "35%" }} />
			</Stack>
		</Box>
	);
	const coreNode = (
		<Box
			sx={sxMerger(style.main, sx ? sx : {})}
			onClick={() => {
				if (expandable || editable) setExpended(true);
			}}
			{...other}
		>
			<Box sx={sxMerger(style.image, sx ? sx : {})} component={"img"} src={src}></Box>
		</Box>
	);
	const expandePopup = (
		<CDialogImage
			aspectRatio={aspectRatio}
			src={src}
			editable={editable}
			onEdit={onEdit}
			onClose={() => {
				setExpended(false);
			}}
			open={expended}
			extras={extras}
		></CDialogImage>
	);

	if (!src) {
		return (
			<>
				{emptyNode}
				{expandePopup}
			</>
		);
	}
	return (
		<>
			{coreNode}
			{expandePopup}
		</>
	);
}

export default CImage;
