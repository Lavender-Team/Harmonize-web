import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Link from "@mui/joy/Link";
import { alertMessage } from "../../libs/ErrorMessage";

export default function Register() {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState<string | null>(null);
    const [age, setAge] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (
            !loginId ||
            !password ||
            !confirmPassword ||
            !email ||
            !nickname ||
            !gender ||
            !age
        ) {
            setErrorMessage("모든 필드를 입력해주세요.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            let data = new FormData();
            data.append("loginId", loginId);
            data.append("password", password);
            data.append("email", email);
            data.append("nickname", nickname);
            data.append("gender", gender);
            data.append("age", age);

            const res = await fetch("/api/user", {
                method: "POST",
                body: data,
            });

            if (res.status === 201) {
                navigate("/login");
            } else {
                const errorData = await res.json();

                setErrorMessage(
                    alertMessage(errorData) || "회원가입에 실패했습니다."
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
                    height: "100vh",
                    backgroundColor: "rgba(239, 226, 254, 1)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
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
                            {/* 로고를 추가하려면 여기에 넣으세요 */}
                            <Typography level="title-lg">하모나이즈</Typography>
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
                                <Typography component="h1" level="h3">
                                    회원가입
                                </Typography>
                                <Typography level="body-sm">
                                    이미 계정이 있으신가요?{" "}
                                    <Link href="/login" level="title-sm">
                                        로그인
                                    </Link>
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack gap={2}>
                            <form onSubmit={handleRegister}>
                                <FormControl>
                                    <FormLabel>로그인 ID</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="로그인 ID"
                                        value={loginId}
                                        onChange={(e) =>
                                            setLoginId(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>비밀번호</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
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
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>닉네임</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="닉네임"
                                        value={nickname}
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>성별</FormLabel>
                                    <Select
                                        placeholder="성별 선택"
                                        value={gender}
                                        onChange={(event, newValue) =>
                                            setGender(newValue)
                                        }
                                    >
                                        <Option value="MALE">남성</Option>
                                        <Option value="FEMALE">여성</Option>
                                        <Option value="OTHER">기타</Option>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>나이</FormLabel>
                                    <Input
                                        type="number"
                                        placeholder="나이"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </FormControl>
                                {errorMessage && (
                                    <Typography
                                        sx={{ color: "red", marginTop: 2 }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                )}
                                <Button type="submit" fullWidth sx={{ mt: 3 }}>
                                    회원가입
                                </Button>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 2 }}>
                        <Typography level="body-xs" textAlign="center">
                            © 하모나이즈 by 라벤더 팀 {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
