import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserTable from "../../components/UserTable";
import { User } from "TYPES";

const rows_def: User[] = [
    {
        userId: 1,
        loginId: "로드 중",
        password: "-",
        email: "-",
        nickname: "-",
        role: "-",
        gender: "-",
        age: 0,
        createdAt: "-",
        deletedAt: "-",
        isDeleted: false,
        isBanned: false,
        isLocked: false,
        profileImage: "",
    },
];

export default function ManageUsers() {

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [rows, setRows] = React.useState<User[]>(rows_def);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalElements, setTotalElements] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        fetchUserList(currentPage, 12);
    }, [currentPage]);

    async function fetchUserList(page: number, size: number) {
        const response = await fetch(
            `/api/user?page=${page - 1}&size=${size}&query=${query}`,
            { credentials: "include" }
        );

        if (response.ok) {
            const data = await response.json();
            setRows(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } else {
            console.error("Failed to fetch user list");
        }
    }

    function deleteUser(userId: number) {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            fetch(`/api/user/${userId}`, {
                method: "DELETE",
                credentials: "include",
            }).then((response) => {
                if (response.ok) {
                    fetchUserList(currentPage, 12);
                } else {
                    console.error("Failed to delete user");
                }
            });
        }
    }

    function navigatePage(page : number) {
        setCurrentPage(page);
        navigate({
          pathname: location.pathname,
          search: "?page=" + page + "&query=" + query,
        });
      }
    
      function search() {
        navigatePage(1);
        fetchUserList(1, 12);
      }

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
                                회원 관리
                            </Typography>
                            <Typography
                                color="primary"
                                fontWeight={500}
                                fontSize={12}
                            >
                                회원 관리
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
                            회원 관리
                        </Typography>

                        <UserTable
                            rows={rows}
                            currentPage={currentPage}
                            totalElements={totalElements}
                            totalPages={totalPages}
                            navigatePage={navigatePage}
                            deleteUser={deleteUser}
                            query={query}
                            setQuery={setQuery}
                            search={search}
                        />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
