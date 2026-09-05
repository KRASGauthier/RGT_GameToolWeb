import { Skeleton, type SkeletonProps } from "@mui/material";
import type { GPageProps } from "../../../pages/shared/pageCommon";
import { useMemo } from "react";
import {
	CSkeletonStyle,
	type ISkeletonStyle,
} from "../../../style/components/feedback/CSkeletonStyle";

export interface CSkeletonProps extends GPageProps, SkeletonProps {}

function CSkeleton({ ...other }: CSkeletonProps) {
	const style: ISkeletonStyle = useMemo(() => {
		return CSkeletonStyle({});
	}, []);

	return <Skeleton sx={style.main} {...other} />;
}

export default CSkeleton;
