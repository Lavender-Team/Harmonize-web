import * as React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation,
} from "react-router-dom";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import { theme } from "./Theme";

import SignIn from "./Login";
import AdminHome from "./AdminHome";
import MusicManage from "./pages/music/MusicManage";
import EditMusic from "./pages/music/EditMusic";
import AddMusic from "./pages/music/AddMusic";
import AddMusicBulk from "./pages/music/AddMusicBulk";
import AnalyzeMusic from "./pages/music/AnalyzeMusic";
import SingerManage from "./pages/singer/SingerManage";
import AddSinger from "./pages/singer/AddSinger";
import EditSinger from "./pages/singer/EditSinger";
import AddGroup from "./pages/group/AddGroup";
import GroupManage from "./pages/group/GroupManage";
import EditGroup from "./pages/group/EditGroup";
import ThemeManage from "./pages/theme/ThemeManage";
import ThemeMusicManage from "./pages/theme/ThemeMusicManage";
import ManageUsers from "./pages/user/ManageUsers";
import EditUsers from "./pages/user/EditUsers";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Register from "./pages/user/Register";
import FindAccount from "./pages/user/FindAccount";
import ResetPassword from "./pages/user/ResetPassword";
import MusicRecommend from './pages/recommend/MusicRecommend';

interface AppRoutesProps {
    isAuthenticated: boolean;
    handleLogout: () => Promise<void>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

function AppRoutes({
    isAuthenticated,
    handleLogout,
    setIsAuthenticated,
}: AppRoutesProps) {
    const location = useLocation();

    React.useEffect(() => {
        const publicPaths = [
            "/login",
            "/register",
            "/find-account",
            "/reset-password/:token",
        ];
        const isPublicPath = publicPaths.some((path) =>
            location.pathname.startsWith(path)
        );

        if (isAuthenticated && isPublicPath) {
            handleLogout();
        }
    }, [location, isAuthenticated]);

    return (
        <Routes>
            <Route
                path="/login"
                element={<SignIn onSignIn={() => setIsAuthenticated(true)} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/find-account" element={<FindAccount />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {isAuthenticated ? (
                <>
                    <Route path="/admin-home" element={<AdminHome />} />
                    <Route path="/add-music" element={<AddMusic />} />
                    <Route path="/analyze-music" element={<AnalyzeMusic />} />
                    <Route path="/music-manage" element={<MusicManage />} />
                    <Route
                        path="/music-manage/edit/:id"
                        element={<EditMusic />}
                    />
                    <Route path="/add-music-bulk" element={<AddMusicBulk />} />
                    <Route path="/add-singer" element={<AddSinger />} />
                    <Route path="/singer-manage" element={<SingerManage />} />
                    <Route
                        path="/singer-manage/edit/:id"
                        element={<EditSinger />}
                    />
                    <Route path="/add-group" element={<AddGroup />} />
                    <Route path="/group-manage" element={<GroupManage />} />
                    <Route
                        path="/group-manage/edit/:id"
                        element={<EditGroup />}
                    />
                    <Route path="/theme-manage" element={<ThemeManage />} />
                    <Route
                        path="/theme-manage/:themeName"
                        element={<ThemeMusicManage />}
                    />
                    <Route path="/user-manage" element={<ManageUsers />} />
                    <Route
                        path="/user-manage/edit/:id"
                        element={<EditUsers />}
                    />
                    <Route path="/music-recommend" element={<MusicRecommend />} />
                    <Route path="*" element={<Navigate to="/admin-home" />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
        </Routes>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
        localStorage.getItem("token") ? true : false
    );

    const handleLogout = async () => {
        await fetch(`/api/user/logout`, {
            method: "GET",
            credentials: "include",
        });
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: "flex", height: "100vh" }}>
                    {isAuthenticated && <Sidebar onLogout={handleLogout} />}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {isAuthenticated && <Header />}
                        <Box sx={{ flex: 1 }}>
                            <AppRoutes
                                isAuthenticated={isAuthenticated}
                                handleLogout={handleLogout}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        </Box>
                    </Box>
                </Box>
            </Router>
        </CssVarsProvider>
    );
}
