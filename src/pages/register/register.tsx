import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

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
            const data = {
                loginId: loginId,
                password: password,
                email: email,
                nickname: nickname,
                gender: gender,
                age: age,
            };

            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // 데이터를 JSON으로 보냄
                },
                body: JSON.stringify(data),
            });

            if (res.status === 201) {
                navigate("/login");
            } else {
                const errorData = await res.json();
                setErrorMessage(
                    errorData.message || "회원가입에 실패했습니다."
                );
            }
        } catch (err) {
            setErrorMessage("서버와의 통신 중 오류가 발생했습니다.");
        }
    };


    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: "auto",
                padding: 4,
                textAlign: "center",
            }}
        >
            <Card variant="outlined" sx={{ padding: 3 }}>
                <Typography
                    component="h2"
                    sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                    회원가입
                </Typography>
                <form onSubmit={handleRegister}>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="text"
                            placeholder="로그인 ID"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="text"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Select
                            placeholder="성별 선택"
                            value={gender}
                            onChange={(event, newValue) => setGender(newValue)}
                            sx={{ width: "100%" }}
                        >
                            <Option value="MALE">남성</Option>
                            <Option value="FEMALE">여성</Option>
                            <Option value="OTHER">기타</Option>
                        </Select>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                        <Input
                            type="number"
                            placeholder="나이"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>
                    {errorMessage && (
                        <Typography sx={{ color: "red", marginTop: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Button type="submit" sx={{ marginTop: 2, width: "100%" }}>
                        회원가입
                    </Button>
                </form>
            </Card>
        </Box>
    );
}
