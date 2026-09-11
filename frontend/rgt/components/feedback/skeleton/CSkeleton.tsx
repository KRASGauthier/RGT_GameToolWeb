import { Skeleton, type SkeletonProps } from "@mui/material";
import type { GPageProps } from "../../../pages/shared/pageCommon";
import { useCallback, useMemo } from "react";
import {
	CSkeletonStyle,
	type ISkeletonStyle,
	type TSkeletonStyleStyling,
} from "../../../style/components/feedback/CSkeletonStyle";

export interface CSkeletonProps extends GPageProps, SkeletonProps {
	styling?: TSkeletonStyleStyling;
}

function CSkeleton({ styling = "rectangle", ...other }: CSkeletonProps) {
	const getVariant = useCallback((): SkeletonProps["variant"] => {
		if (styling == "text") return "text";
		return "rectangular";
	}, [styling]);

	const style: ISkeletonStyle = useMemo(() => {
		return CSkeletonStyle({ styling });
	}, [styling]);

	return <Skeleton variant={getVariant()} sx={style.main} {...other} />;
}

export default CSkeleton;
