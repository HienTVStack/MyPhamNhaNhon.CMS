import { useState } from "react";
import { useNavigate } from "react-router-dom";
// form
// @mui
import { Box, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import authApi from "src/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "src/redux/actions";
import { useEffect } from "react";
// components

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData(e.target);

        const username = data.get("username");
        const password = data.get("password");

        let err = false;
        if (username === "") {
            err = true;
            setUsernameErr("Trường này không được để trống");
        }
        if (password === "") {
            err = true;
            setPasswordErr("Trường này không được để trống");
        }
        setLoading(false);
        if (err) return;

        try {
            setLoading(true);
            const res = await authApi.login({ username, password });

            if (res.message === "OK") {
                localStorage.setItem("token", res.token);
                dispatch(setUser(res.user));
                navigate("/dashboard/app");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            const errors = error.data.errors;

            errors.forEach((e) => {
                if (e.param === "username") {
                    setUsernameErr(e.msg);
                }
                if (e.param === "password") {
                    setPasswordErr(e.msg);
                }
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
                <TextField
                    margin={"normal"}
                    fullWidth
                    placeholder={"Tên đăng nhâp"}
                    label={"Tên đăng nhập"}
                    name={"username"}
                    id={"username"}
                    required
                    disabled={loading}
                    error={usernameErr !== ""}
                    helperText={usernameErr}
                />
                <TextField
                    margin={"normal"}
                    fullWidth
                    placeholder={"Mật khẩu"}
                    label={"Mật khẩu"}
                    name={"password"}
                    id={"password"}
                    type="password"
                    required
                    disabled={loading}
                    error={passwordErr !== ""}
                    helperText={passwordErr}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}></Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
                Đăng nhập
            </LoadingButton>
        </Box>
    );
}
