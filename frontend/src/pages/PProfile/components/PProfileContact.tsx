import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CText from "../../../../rgt/components/text/CText";

export interface PProfileInformationProps extends GCompProps {}


function PProfileContact({}: PProfileInformationProps) {
    return (
        <Stack sx={{ p: 2, gap: 2 }}>
        <CText>Email</CText>
        </Stack>
    );
}
export default PProfileContact;