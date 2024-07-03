import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import "./singer.css";

const GENDERLIST = { 남성: "MALE", 여성: "FEMALE", 기타: "OTHER" };

export default function AddSinger() {
    const navigate = useNavigate();

    const [singer, setSinger] = useState({
        artistName: "",
        gender: "",
        activityPeriod: "",
        nation: "",
        agency: "",
        profileImage: null,
        profileImageFile: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSinger({
            ...singer,
            [name]: value,
        });
    };

    const handleGenderChange = (value) => {
        setSinger({
            ...singer,
            gender: value,
        });
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSinger({
                    ...singer,
                    profileImage: reader.result,
                    profileImageFile: file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const isSingerValid = (singer) => {
        if (
            !singer.artistName ||
            !singer.gender ||
            !singer.activityPeriod ||
            !singer.nation ||
            !singer.agency ||
            !singer.profileImage
        ) {
            return false;
        }
        return true;
    };

    // 가수 등록 요청
    const handleSingerSubmit = async () => {
        if (!isSingerValid(singer)) {
            alert("가수 정보를 모두 입력해주세요.");
            return;
        }

        let data = new FormData();
        data.append("artistName", singer.artistName);
        data.append("gender", singer.gender);
        data.append("activityPeriod", singer.activityPeriod);
        data.append("nation", singer.nation);
        data.append("agency", singer.agency);
        data.append("profileImage", singer.profileImageFile);

        try {
            const res = await fetch(`/api/artist`, {
                method: "POST",
                credentials: "include",
                body: data,
            });

            if (res.ok) {
                navigate("/singer-manage");
            } else {
                const errorText = await res.text();
                alert("가수 등록 중 오류가 발생하였습니다: " + errorText);
            }
        } catch (error) {
            alert("가수 등록 중 오류가 발생하였습니다: " + error.message);
        }
    };

    const clearSinger = () => {
        setSinger({
            artistName: "",
            gender: "",
            activityPeriod: "",
            nation: "",
            agency: "",
            profileImage: null,
            profileImageFile: null,
        });
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
                        gap: 1,
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
                                가수 관리
                            </Typography>
                            <Typography
                                color="primary"
                                fontWeight={500}
                                fontSize={12}
                            >
                                가수 등록
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
                            가수 등록
                        </Typography>

                        <div className="singer">
                            <div className="horizontal">
                                <div>
                                    <div
                                        className={
                                            singer.profileImage ? "none" : ""
                                        }
                                    >
                                        <input
                                            type="file"
                                            id="profileImage"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            className="inputfile"
                                        />
                                        <label
                                            htmlFor="profileImage"
                                            className="plus-button"
                                        >
                                            +
                                            <span className="name">
                                                프로필 이미지
                                            </span>
                                        </label>
                                    </div>
                                    {singer.profileImage && (
                                        <label htmlFor="profileImage">
                                            <img
                                                src={singer.profileImage}
                                                alt="프로필 이미지"
                                                className="preview"
                                            />
                                        </label>
                                    )}
                                </div>
                                <div style={{ margin: "0 0 0 12px" }}>
                                    <Input
                                        type="text"
                                        placeholder="가수 이름 입력"
                                        name="artistName"
                                        value={singer.artistName}
                                        onChange={handleInputChange}
                                        sx={{ width: 400 }}
                                    />
                                </div>
                            </div>
                            <div className="section">
                                <p className="sectionTitle">가수 정보</p>
                                <div className="item">
                                    <span>성별</span>
                                    <Select
                                        placeholder="성별 선택"
                                        sx={{ width: 180 }}
                                    >
                                        {Object.keys(GENDERLIST).map(
                                            (gender, index) => (
                                                <Option
                                                    key={index}
                                                    value={gender}
                                                    onClick={() => {
                                                        handleGenderChange(
                                                            GENDERLIST[gender]
                                                        );
                                                    }}
                                                >
                                                    {gender}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                </div>
                                <div className="item">
                                    <span>활동 연대</span>
                                    <Input
                                        type="text"
                                        placeholder="활동 연대 입력"
                                        name="activityPeriod"
                                        value={singer.activityPeriod}
                                        onChange={handleInputChange}
                                        sx={{ width: 180 }}
                                    />
                                </div>
                                <div className="item">
                                    <span>국적</span>
                                    <Input
                                        type="text"
                                        placeholder="국적 입력"
                                        name="nation"
                                        value={singer.nation}
                                        onChange={handleInputChange}
                                        sx={{ width: 180 }}
                                    />
                                </div>
                                <div className="item">
                                    <span>소속사</span>
                                    <Input
                                        type="text"
                                        placeholder="소속사 입력"
                                        name="agency"
                                        value={singer.agency}
                                        onChange={handleInputChange}
                                        sx={{ width: 180 }}
                                    />
                                </div>
                            </div>
                            <div className="action">
                                <Button
                                    variant="outlined"
                                    onClick={clearSinger}
                                    sx={{ width: 80, height: 40, mr: "12px" }}
                                >
                                    초기화
                                </Button>
                                <Button
                                    variant="solid"
                                    onClick={handleSingerSubmit}
                                    sx={{ width: 120, height: 40 }}
                                >
                                    가수 등록
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
