import * as React from "react";
import { useState } from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useNavigate } from "react-router-dom";

import GoogleIcon from "./GoogleIcon";
import Logo from "./components/logo.png";

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === "light" ? "dark" : "light");
                onClick?.(event);
            }}
            {...other}
        >
            {mode === "light" ? (
                <DarkModeRoundedIcon />
            ) : (
                <LightModeRoundedIcon />
            )}
        </IconButton>
    );
}

export default function SignIn({ onSignIn }: { onSignIn: () => void }) {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [failedAttempts, setFailedAttempts] = useState<number | null>(null); // 로그인 실패 횟수 상태 관리
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
        null
    ); // 남은 시도 횟수 상태 관리

    const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setFailedAttempts(null);
        setRemainingAttempts(null);

        if (!loginId || !password) {
            setErrorMessage("로그인 ID와 비밀번호를 입력하세요.");
            return;
        }

        try {
            const res = await fetch(`/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loginId: loginId,
                    password: password,
                }),
            });

            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem("token", data.token); // JWT 토큰 저장
                onSignIn();
                navigate("/admin-home");
            } else {
                if (
                    data.failedAttempts !== undefined &&
                    data.remainingAttempts !== undefined
                ) {
                    setFailedAttempts(data.failedAttempts);
                    setRemainingAttempts(data.remainingAttempts);
                } else {
                    setErrorMessage("로그인 정보가 잘못되었습니다.");
                }
            }
        } catch (err) {
            setErrorMessage("서버와의 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Transition-duration": "0.4s",
                    },
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    backgroundColor: "rgba(239, 226, 254, 1)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100vh",
                        maxWidth: "500px",
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 2,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                gap: 2,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <IconButton color="primary" size="sm">
                                <img
                                    src={Logo}
                                    alt="하모나이즈"
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </IconButton>
                            <Typography level="title-lg">Harmonize</Typography>
                        </Box>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            my: "auto",
                        }}
                    >
                        <Stack gap={4} sx={{ mb: 2 }}>
                            <Stack gap={1}>
                                <Typography component="h1" level="h3">
                                    Sign in
                                </Typography>
                                <Typography level="body-sm">
                                    New to company?{" "}
                                    <Link href="/register" level="title-sm">
                                        Sign up!
                                    </Link>
                                </Typography>
                            </Stack>
                            <Button
                                variant="soft"
                                color="neutral"
                                fullWidth
                                startDecorator={<GoogleIcon />}
                            >
                                Continue with Google
                            </Button>
                        </Stack>
                        <Divider>or</Divider>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form onSubmit={handleSubmit}>
                                <FormControl>
                                    <FormLabel>Login ID</FormLabel>
                                    <Input
                                        type="text"
                                        name="loginId"
                                        value={loginId}
                                        onChange={(e) =>
                                            setLoginId(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </FormControl>
                                {errorMessage && (
                                    <Typography
                                        sx={{ color: "red", marginTop: 2 }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                )}
                                {failedAttempts !== null &&
                                    remainingAttempts !== null && (
                                        <Typography
                                            sx={{
                                                color: "orange",
                                                marginTop: 2,
                                            }}
                                        >
                                            로그인 실패 횟수: {failedAttempts},
                                            잠금까지 남은 횟수:{" "}
                                            {remainingAttempts}
                                        </Typography>
                                    )}
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Checkbox
                                            size="sm"
                                            label="Remember me"
                                            name="persistent"
                                        />
                                        <Link
                                            level="title-sm"
                                            href="#replace-with-a-link"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </Box>
                                    <Button type="submit" fullWidth>
                                        Sign in
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 2 }}>
                        <Typography level="body-xs" textAlign="center">
                            © Harmonize {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
