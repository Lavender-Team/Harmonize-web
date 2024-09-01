import * as React from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Checkbox from "@mui/joy/Checkbox";
import Grid from "@mui/joy/Grid";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const ROLELIST = {
    User: "USER",
    Admin: "ADMIN",
    Moderator: "MODERATOR",
};

export default function EditUsers() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        nickname: "",
        email: "",
        role: "",
        gender: "",
        age: "",
        isDeleted: false,
        isBanned: false,
        isLocked: false,
    });

    useEffect(() => {
        fetchUser(id);
    }, [id]);

    async function fetchUser(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
                const res = await response.json();
                setUser({
                    nickname: res.nickname,
                    email: res.email,
                    role: res.role,
                    gender: res.gender,
                    age: res.age,
                    isDeleted: res.isDeleted,
                    isBanned: res.isBanned,
                    isLocked: res.isLocked,
                });
            } else {
                console.error("Failed to fetch user");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    const handleInputChange = (e) => {
        if (e && e.target) {
            const { name, value, checked, type } = e.target;
            setUser((prevUser) => ({
                ...prevUser,
                [name]: type === "checkbox" ? checked : value,
            }));
        } else {
            console.error("Invalid event object in handleInputChange:", e);
        }
    };

    const handleRoleChange = (value) => {
        setUser((prevUser) => ({
            ...prevUser,
            role: value,
        }));
    };

    const handleGenderChange = (value) => {
        setUser((prevUser) => ({
            ...prevUser,
            gender: value,
        }));
    };

    const isUserValid = (user) => {
        return user.nickname && user.email && user.role;
    };

    const handleUserSubmit = async () => {
        if (!isUserValid(user)) {
            alert("사용자 정보를 모두 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (res.ok) {
                alert("사용자 정보가 성공적으로 업데이트되었습니다.");
                navigate("/user-manage");
            } else {
                const errors = await res.json();
                alert("사용자 정보 업데이트에 실패했습니다.");
                console.error("Error:", errors);
            }
        } catch (error) {
            console.error("Error submitting user:", error);
        }
    };

    const handleUserDelete = async () => {
        const confirmDelete = window.confirm(
            "정말로 이 사용자를 삭제하시겠습니까?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("사용자가 성공적으로 삭제되었습니다.");
                navigate("/user-manage");
            } else {
                alert("사용자 삭제에 실패했습니다.");
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "240px",
                }}
            >
                <Box
                    component="main"
                    sx={{
                        padding: 2,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Breadcrumbs
                            size="sm"
                            aria-label="breadcrumbs"
                            separator={
                                <ChevronRightRoundedIcon fontSize="small" />
                            }
                            sx={{ pl: 0 }}
                        >
                            <Link
                                underline="none"
                                color="neutral"
                                href="/admin-home"
                                aria-label="Home"
                            >
                                <HomeRoundedIcon />
                            </Link>
                            <Typography
                                color="neutral"
                                fontWeight={500}
                                fontSize={12}
                            >
                                사용자 관리
                            </Typography>
                            <Link component={RouterLink} to="/user-manage">
                                <Typography
                                    color="neutral"
                                    fontWeight={500}
                                    fontSize={12}
                                >
                                    사용자 관리
                                </Typography>
                            </Link>
                            <Typography
                                color="primary"
                                fontWeight={500}
                                fontSize={12}
                            >
                                사용자 편집
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography level="h2" component="h1">
                            사용자 편집
                        </Typography>

                        <div
                            className="user-edit"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div className="section">
                                <Typography level="h5" fontWeight={500}>
                                    사용자 정보
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            닉네임
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Input
                                            type="text"
                                            placeholder="닉네임 입력"
                                            name="nickname"
                                            value={user.nickname}
                                            onChange={handleInputChange}
                                            sx={{
                                                width: "100%",
                                                maxWidth: 400,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            이메일
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Input
                                            type="email"
                                            placeholder="이메일 입력"
                                            name="email"
                                            value={user.email}
                                            onChange={handleInputChange}
                                            sx={{
                                                width: "100%",
                                                maxWidth: 400,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            역할
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Select
                                            placeholder="역할 선택"
                                            value={user.role}
                                            onChange={(e, newValue) =>
                                                handleRoleChange(newValue)
                                            }
                                            sx={{
                                                width: "100%",
                                                maxWidth: 200,
                                            }}
                                        >
                                            {Object.keys(ROLELIST).map(
                                                (role, index) => (
                                                    <Option
                                                        key={index}
                                                        value={ROLELIST[role]}
                                                    >
                                                        {role}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            성별
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Select
                                            placeholder="성별 선택"
                                            value={user.gender}
                                            onChange={(e, newValue) =>
                                                handleGenderChange(newValue)
                                            }
                                            sx={{
                                                width: "100%",
                                                maxWidth: 200,
                                            }}
                                        >
                                            <Option value="MALE">남성</Option>
                                            <Option value="FEMALE">여성</Option>
                                            <Option value="OTHER">기타</Option>
                                        </Select>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            나이
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Input
                                            type="number"
                                            placeholder="나이 입력"
                                            name="age"
                                            value={user.age}
                                            onChange={handleInputChange}
                                            sx={{
                                                width: "100%",
                                                maxWidth: 200,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>

                            <div
                                className="section"
                                style={{ marginTop: "16px" }}
                            >
                                <Typography level="h5" fontWeight={500}>
                                    계정 상태 설정
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            삭제됨
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Checkbox
                                            label="삭제됨"
                                            name="isDeleted"
                                            checked={user.isDeleted}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            차단됨
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Checkbox
                                            label="차단됨"
                                            name="isBanned"
                                            checked={user.isBanned}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Typography
                                            level="body1"
                                            fontWeight={500}
                                        >
                                            잠금
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Checkbox
                                            label="잠금"
                                            name="isLocked"
                                            checked={user.isLocked}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </div>

                            <div
                                className="action"
                                style={{
                                    marginTop: "16px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    gap: "16px",
                                }}
                            >
                                <Button
                                    variant="solid"
                                    onClick={handleUserSubmit}
                                    sx={{ width: 120, height: 40 }}
                                >
                                    사용자 편집
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/user-manage")}
                                    sx={{ width: 120, height: 40 }}
                                >
                                    취소
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="danger"
                                    onClick={handleUserDelete}
                                    sx={{ width: 120, height: 40 }}
                                >
                                    사용자 삭제
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
