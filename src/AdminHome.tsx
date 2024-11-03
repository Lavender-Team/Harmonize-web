import * as React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom"; // Link를 RouterLink로 변경하여 경로 연결
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import IconButton from "@mui/joy/IconButton";
import PeopleIcon from "@mui/icons-material/People";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

export default function AdminHome() {
    const [userCount, setUserCount] = useState(0);
    const [musicCount, setMusicCount] = useState(0);
    const [artistCount, setArtistCount] = useState(0);
    const [logCount, setLogCount] = useState(0);

    useEffect(() => {
        axios.get("/api/user/count").then((response) => {
            setUserCount(response.data.count);
        });

        axios.get("/api/music/count").then((response) => {
            setMusicCount(response.data.count);
        });

        axios.get("/api/artist/count").then((response) => {
            setArtistCount(response.data.count);
        });

        axios.get("/api/log/count").then((response) => {
            setLogCount(response.data.count);
        });
    }, []);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "240px",
                    padding: 2
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
                        gap: 4,
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
                                color="primary"
                                fontWeight={500}
                                fontSize={12}
                            >
                                관리자 홈
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            padding: 4,
                        }}
                    >
                        <Typography level="h2" component="h1">
                            대시보드
                        </Typography>

                        {/* 카드 레이아웃 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={4}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    padding: 5,
                                    position: "relative",
                                }}
                            >
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        top: 25,
                                        right: 25,
                                    }}
                                >
                                    <PeopleIcon fontSize="large" />
                                </IconButton>

                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "medium",
                                        }}
                                    >
                                        전체 회원
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "32px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {userCount}명
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* 등록된 음악 수 카드 */}
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 5,
                                    position: 'relative',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 25,
                                        right: 25,
                                    }}
                                >
                                    <MusicNoteIcon fontSize="large" />
                                </IconButton>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'medium',
                                        }}
                                    >
                                        등록된 음악 수
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '32px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {musicCount}개
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* 등록된 가수 수 카드 */}
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 5,
                                    position: 'relative',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 25,
                                        right: 25,
                                    }}
                                >
                                    <PersonIcon fontSize="large" />
                                </IconButton>

                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'medium',
                                        }}
                                    >
                                        등록된 가수 수
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '32px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {artistCount}명
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* 금일 생성된 로그 카드 */}
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 5,
                                    position: 'relative',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 25,
                                        right: 25,
                                    }}
                                >
                                    <PeopleIcon fontSize="large" />
                                </IconButton>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'medium',
                                        }}
                                    >
                                        금일 생성된 로그
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '32px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {logCount}개
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <p></p>

                        <Typography level="h2" component="h1">
                            관리자 메뉴
                        </Typography>

                        {/* 관리자 메뉴 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(3, 1fr)"
                            gap={4}
                        >
                            {/* 음악 관리 메뉴 */}
                            <Card
                                sx={{
                                    // width: "200px", // 좁은 너비
                                    height: "250px", // 높은 높이
                                }}
                            >
                                <CardContent
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "medium",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography>음악 관리</Typography>
                                    <ul style={{ padding: 0 }}>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/add-music"
                                            >
                                                음악 등록
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/analyze-music"
                                            >
                                                음악 분석
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/music-manage"
                                            >
                                                음악 관리
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/add-music-bulk"
                                            >
                                                음악 일괄 업로드
                                            </Link>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* 가수 관리 메뉴 */}
                            <Card>
                                <CardContent
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "medium",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography>가수 관리</Typography>
                                    <ul style={{ padding: 0 }}>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/add-singer"
                                            >
                                                가수 추가
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/singer-manage"
                                            >
                                                가수 관리
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/add-group"
                                            >
                                                그룹 추가
                                            </Link>
                                        </li>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/group-manage"
                                            >
                                                그룹 관리
                                            </Link>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* 회원 관리 메뉴 */}
                            <Card>
                                <CardContent
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "medium",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography>회원 관리</Typography>
                                    <ul style={{ padding: 0 }}>
                                        <li style={{ listStyle: "none", marginBottom: 10 }}>
                                            <Link
                                                component={RouterLink}
                                                to="/user-manage"
                                            >
                                                회원 관리
                                            </Link>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
