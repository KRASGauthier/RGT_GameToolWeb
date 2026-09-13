import { Box, Stack, type BoxProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CImageStyle,
	type IImageStyle,
	type TImageStyling,
} from "../../style/components/images/CImageStyle";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { sxMerger } from "../../utils/UStyles";
import HideImageIcon from "@mui/icons-material/HideImage";
import CDialogImage from "../feedback/dialogs/CDialogImage";
import { apiGetImageBlob } from "../../api/shared";
import { useNotif } from "../../context/app/CAppNotifContext";
import CSkeleton from "../feedback/skeleton/CSkeleton";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

export interface CImageProps extends GCompProps, BoxProps {
	src: string;

	aspectRatio?: string;
	styled?: boolean;
	styling?: TImageStyling;

	editable?: boolean;
	onEdit?: (file: File) => void;
	expandable?: boolean;
	extras?: ReactNode | ReactNode[];

	protectedRoute?: boolean;
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
	protectedRoute,
	sx,
	...other
}: CImageProps) {
	const [expended, setExpended] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const [error, setError] = useState<boolean>(false);
	const style: IImageStyle = useMemo(() => {
		return CImageStyle({ aspectRatio, styled, styling });
	}, [aspectRatio, styled, styling]);
	const oldSource = useRef<string | undefined>(undefined);
	const { push } = useNotif();

	//====================== EVENT ======================
	useEffect(() => {
		if (!protectedRoute || (imageUrl && oldSource.current === src)) return;
		oldSource.current = src;
		apiGetImageBlob(src, push).then((res: Blob | undefined) => {
			if (!res) {
				setError(true);
				return;
			}
			setError(false);
			setImageUrl(URL.createObjectURL(res));
		});
	}, [protectedRoute, imageUrl, src, push]);

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
			{!error && imageUrl && (
				<Box
					sx={sxMerger(style.image, sx ? sx : {})}
					component={"img"}
					src={protectedRoute ? imageUrl : src}
				></Box>
			)}
			{!error && protectedRoute && !imageUrl && (
				<CSkeleton sx={sxMerger(style.image, sx ? sx : {})} />
			)}
			{error && (
				<Stack
					direction={"row"}
					sx={style.brokenStack}
					onClick={() => {
						if (expandable || editable) setExpended(true);
					}}
				>
					<BrokenImageIcon fontSize="large" sx={style.brokenImage} />
				</Stack>
			)}
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
			protectedRoute={protectedRoute}
			imageUrl={imageUrl}
			styled={styled}
			styling={styling}
			parentError={error}
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
