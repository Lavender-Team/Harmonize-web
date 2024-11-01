import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [loginId, setLoginId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 토큰을 이용해 loginId 가져오기
    useEffect(() => {
        const fetchLoginId = async () => {
            try {
                const res = await fetch(`/api/user/get-user-by-token/${token}`);
                if (res.ok) {
                    const data = await res.json();
                    setLoginId(data.loginId); // loginId 상태 업데이트
                } else {
                    setErrorMessage("유효하지 않은 토큰입니다.");
                }
            } catch (error) {
                setErrorMessage("서버와의 통신 중 오류가 발생했습니다.");
            }
        };

        if (token) {
            fetchLoginId();
        }
    }, [token]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!newPassword || !confirmPassword) {
            setErrorMessage("모든 필드를 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch(`/api/user/reset-password/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (res.ok) {
                setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                const data = await res.json();
                setErrorMessage(
                    data.message || "비밀번호 재설정에 실패했습니다."
                );
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
                    minHeight: "100vh",
                    backgroundColor: "rgba(239, 226, 254, 1)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "600px",
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            mb: 2,
                        }}
                    >
                        비밀번호 재설정
                    </Typography>
                    {loginId && (
                        <Typography sx={{ textAlign: "center", mb: 2 }}>
                            {`아이디: ${loginId}`}
                        </Typography>
                    )}
                    <Stack gap={2}>
                        <form onSubmit={handleResetPassword}>
                            <FormControl sx={{ mt: 2 }}>
                                <FormLabel>새 비밀번호</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="새 비밀번호"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ mt: 2 }}>
                                <FormLabel>비밀번호 확인</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </FormControl>
                            {errorMessage && (
                                <Typography
                                    sx={{
                                        color: "red",
                                        marginTop: 2,
                                    }}
                                >
                                    {errorMessage}
                                </Typography>
                            )}
                            {successMessage && (
                                <Typography
                                    sx={{
                                        color: "green",
                                        marginTop: 2,
                                    }}
                                >
                                    {successMessage}
                                </Typography>
                            )}
                            <Button type="submit" fullWidth sx={{ mt: 3 }}>
                                비밀번호 재설정
                            </Button>
                        </form>
                    </Stack>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button onClick={() => navigate("/login")}>
                            로그인 페이지로 돌아가기
                        </Button>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
