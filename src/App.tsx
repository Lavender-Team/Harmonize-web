import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import { theme } from './Theme';

import SignIn from './Login';
import AdminHome from './AdminHome';
import MusicManage from './pages/music/MusicManage';
import EditMusic from './pages/music/EditMusic';
import AddMusic from './pages/music/AddMusic';
import AddMusicBulk from './pages/music/AddMusicBulk';
import AnalyzeMusic from './pages/music/AnalyzeMusic';
import SingerManage from './pages/singer/SingerManage';
import AddSinger from './pages/singer/AddSinger';
import EditSinger from './pages/singer/EditSinger';
import AddGroup from './pages/group/AddGroup';
import GroupManage from './pages/group/GroupManage';
import EditGroup from './pages/group/EditGroup';
import ThemeManage from './pages/theme/ThemeManage';
import ThemeMusicManage from './pages/theme/ThemeMusicManage';
import ManageUsers from './pages/user/ManageUsers';
import EditUsers from './pages/user/EditUsers';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Register from './pages/register/register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <CssVarsProvider disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {isAuthenticated && <Sidebar onLogout={handleLogout} />}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {isAuthenticated && <Header />}
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/login" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
                <Route path="/register" element={<Register />} />
                {isAuthenticated ? (
                  <>
                    <Route path="/admin-home" element={<AdminHome />} />
                    <Route path="/add-music" element={<AddMusic />} />
                    <Route path="/analyze-music" element={<AnalyzeMusic />} />
                    <Route path="/music-manage" element={<MusicManage />} />
                    <Route path="/music-manage/edit/:id" element={<EditMusic />} />
                    <Route path="/add-music-bulk" element={<AddMusicBulk />} />
                    <Route path="/add-singer" element={<AddSinger />} />
                    <Route path="/singer-manage" element={<SingerManage />} />
                    <Route path="/singer-manage/edit/:id" element={<EditSinger />} />
                    <Route path="/add-group" element={<AddGroup />} />
                    <Route path="/group-manage" element={<GroupManage />} />
                    <Route path="/group-manage/edit/:id" element={<EditGroup />} />
                    <Route path="/theme-manage" element={<ThemeManage />} />
                    <Route path="/theme-manage/:themeName" element={<ThemeMusicManage />} />
                    <Route path="/user-manage" element={<ManageUsers />} />
                    <Route path="/user-manage/edit/:id" element={<EditUsers />} />
                    <Route path="*" element={<Navigate to="/admin-home" />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </CssVarsProvider>
  );
}
