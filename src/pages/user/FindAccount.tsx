import * as React from "react";
import { useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import { useNavigate } from "react-router-dom";

export default function FindAccount() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loginId, setLoginId] = useState("");
    const [errorMessageId, setErrorMessageId] = useState("");
    const [successMessageId, setSuccessMessageId] = useState("");
    const [errorMessagePw, setErrorMessagePw] = useState("");
    const [successMessagePw, setSuccessMessagePw] = useState("");

    const handleFindId = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessageId("");
        setSuccessMessageId("");

        if (!email) {
            setErrorMessageId("이메일을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("/api/user/find-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (res.status === 200) {
                setSuccessMessageId("등록된 이메일로 아이디를 전송하였습니다.");
            } else {
                const data = await res.json();
                setErrorMessageId(
                    data.message || "아이디 찾기에 실패했습니다."
                );
            }
        } catch (err) {
            setErrorMessageId("서버와의 통신 중 오류가 발생했습니다.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessagePw("");
        setSuccessMessagePw("");

        if (!loginId || !email) {
            setErrorMessagePw("아이디와 이메일을 모두 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("/api/user/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ loginId, email }),
            });

            if (res.status === 200) {
                setSuccessMessagePw(
                    "비밀번호 재설정 링크를 이메일로 전송하였습니다."
                );
            } else {
                const data = await res.json();
                setErrorMessagePw(
                    data.message || "비밀번호 재설정에 실패했습니다."
                );
            }
        } catch (err) {
            setErrorMessagePw("서버와의 통신 중 오류가 발생했습니다.");
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
                    minHeight: "100vh",
                    backgroundColor: "rgba(239, 226, 254, 1)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "800px",
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
                            {/* 로고를 추가하려면 여기에 넣으세요 */}
                            <Typography
                                sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                            >
                                하모나이즈
                            </Typography>
                        </Box>
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
                                <Typography
                                    component="h1"
                                    sx={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    아이디 / 비밀번호 찾기
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.875rem",
                                        textAlign: "center",
                                    }}
                                >
                                    로그인 페이지로 돌아가기{" "}
                                    <Link href="/login" underline="none">
                                        로그인
                                    </Link>
                                </Typography>
                            </Stack>
                        </Stack>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 4,
                            }}
                        >
                            {/* 아이디 찾기 폼 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: "1.25rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    아이디 찾기
                                </Typography>
                                <Stack gap={2} sx={{ mt: 2 }}>
                                    <form onSubmit={handleFindId}>
                                        <FormControl>
                                            <FormLabel>이메일</FormLabel>
                                            <Input
                                                type="email"
                                                placeholder="이메일"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </FormControl>
                                        {errorMessageId && (
                                            <Typography
                                                sx={{
                                                    color: "red",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {errorMessageId}
                                            </Typography>
                                        )}
                                        {successMessageId && (
                                            <Typography
                                                sx={{
                                                    color: "green",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {successMessageId}
                                            </Typography>
                                        )}
                                        <Button
                                            type="submit"
                                            fullWidth
                                            sx={{ mt: 3 }}
                                        >
                                            아이디 찾기
                                        </Button>
                                    </form>
                                </Stack>
                            </Box>

                            {/* 수직 구분선 */}
                            <Box
                                sx={{
                                    width: "1px",
                                    backgroundColor: "#e0e0e0",
                                    mx: { xs: 0, md: 2 },
                                    my: { xs: 2, md: 0 },
                                }}
                            />

                            {/* 비밀번호 재설정 폼 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: "1.25rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    비밀번호 재설정
                                </Typography>
                                <Stack gap={2} sx={{ mt: 2 }}>
                                    <form onSubmit={handleResetPassword}>
                                        <FormControl>
                                            <FormLabel>아이디</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="아이디"
                                                value={loginId}
                                                onChange={(e) =>
                                                    setLoginId(e.target.value)
                                                }
                                            />
                                        </FormControl>
                                        <FormControl sx={{ mt: 2 }}>
                                            <FormLabel>이메일</FormLabel>
                                            <Input
                                                type="email"
                                                placeholder="이메일"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </FormControl>
                                        {errorMessagePw && (
                                            <Typography
                                                sx={{
                                                    color: "red",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {errorMessagePw}
                                            </Typography>
                                        )}
                                        {successMessagePw && (
                                            <Typography
                                                sx={{
                                                    color: "green",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {successMessagePw}
                                            </Typography>
                                        )}
                                        <Button
                                            type="submit"
                                            fullWidth
                                            sx={{ mt: 3 }}
                                        >
                                            비밀번호 재설정
                                        </Button>
                                    </form>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                    <Box component="footer" sx={{ py: 2 }}>
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            © 하모나이즈 by 라벤더 팀 {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
