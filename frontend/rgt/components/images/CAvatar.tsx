import { Avatar, type AvatarProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import type { IUserBase } from "../../types/data/TUser";
import { useMemo } from "react";
import {
	CAvatarStyle,
	type IAvatarStyle,
	type TAvatarStyling,
} from "../../style/components/images/CAvatarStyle";
import CText from "../text/CText";

export interface CAvatarProps extends GCompProps, AvatarProps {
	user: IUserBase;

	styling?: TAvatarStyling;
}

function CAvatar({ user, styling = "light", ...other }: CAvatarProps) {
	const style: IAvatarStyle = useMemo(() => {
		return CAvatarStyle({ styling });
	}, [styling]);

	return (
		<Avatar sx={style.main} {...other}>
			<CText size="lg" weight={7}>
				{user.initials}
			</CText>
		</Avatar>
	);
}

export default CAvatar;
