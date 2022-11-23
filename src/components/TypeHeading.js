import { Typography } from "@mui/material";

function TypeHeading(props) {
    const { children, ...other } = props;
    return (
        <Typography variant="body1" component={"h4"} fontSize={"20px"} fontWeight={600} lineHeight={"30px"} {...other}>
            {children}
        </Typography>
    );
}

export default TypeHeading;
