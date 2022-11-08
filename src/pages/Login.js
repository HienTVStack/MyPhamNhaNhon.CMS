// @mui
import { styled } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Page from "../components/Page";
import Logo from "../components/Logo";
// sections
import { LoginForm } from "../sections/auth/login";
// import AuthSocial from "../sections/auth/AuthSocial";
import images from "../assets/images";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    padding: theme.spacing(3),
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
        alignItems: "flex-start",
        padding: theme.spacing(7, 5, 0, 7),
    },
}));

const ContentStyle = styled("div")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
    const smUp = useResponsive("up", "sm");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard/app");
        }
    }, []);

    return (
        <Page title="Login">
            <RootStyle>
                <HeaderStyle>
                    <Logo />
                </HeaderStyle>

                <Container maxWidth="sm">
                    <ContentStyle>
                        <img src={images.logo} alt="" style={{ objectFit: "contain", height: "100%", width: "100%", padding: "50px" }} />

                        <LoginForm />

                        {!smUp && <Typography variant="body2" align="center" sx={{ mt: 3 }}></Typography>}
                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page>
    );
}
