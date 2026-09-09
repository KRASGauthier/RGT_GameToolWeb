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
import type { TFontSize } from "../../types/themeType";

export interface CAvatarProps extends GCompProps, AvatarProps {
	user: IUserBase;

	styling?: TAvatarStyling;
	fontSize?: TFontSize;
}

function CAvatar({ user, styling = "light", fontSize, ...other }: CAvatarProps) {
	const style: IAvatarStyle = useMemo(() => {
		return CAvatarStyle({ styling });
	}, [styling]);

	return (
		<Avatar sx={style.main} src={user.avatar} {...other}>
			<CText size={fontSize ?? "lg"} weight={7}>
				{user.initials}
			</CText>
		</Avatar>
	);
}

export default CAvatar;
