import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Box } from "@mui/material";
import images from "src/assets/images";

// ----------------------------------------------------------------------

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
    // OR
    const logo = <Box component="img" src={images.logo} style={{ objectFit: "contain" }} sx={{ width: 150, height: 75, ...sx }} />;

    if (disabledLink) {
        return <>{logo}</>;
    }

    return <RouterLink to="/">{logo}</RouterLink>;
}
