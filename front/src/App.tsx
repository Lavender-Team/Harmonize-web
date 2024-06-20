import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import Box from '@mui/joy/Box';

import SignIn from './Login';
import AdminHome from './AdminHome';
import MusicManage from './pages/music/MusicManage';
import EditMusic from './pages/music/EditMusic';
import AddMusic from './pages/music/AddMusic';
import AnalyzeMusic from './pages/music/AnalyzeMusic';
import SingerManage from './SingerManage';
import AddSinger from './pages/singer/AddSinger';
import ThemeManage from './pages/theme/ThemeManage';
import ThemeMusicManage from './pages/theme/ThemeMusicManage';
import ManageUsers from './ManageUsers';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {isAuthenticated && <Sidebar onLogout={handleLogout} />}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {isAuthenticated && <Header />}
            <Box sx={{ flex: 1, padding: 2 }}>
              <Routes>
                <Route
                  path="/login"
                  element={<SignIn onSignIn={() => setIsAuthenticated(true)} />}
                />
                {isAuthenticated ? (
                  <>
                    <Route path="/admin-home" element={<AdminHome />} />
                    <Route path="/music-manage" element={<MusicManage />} />
                    <Route path="/music-manage/edit/:id" element={<EditMusic />} />
                    <Route path="/singer-manage" element={<SingerManage />} />
                    <Route path="/add-music" element={<AddMusic />} />
                    <Route path="/analyze-music" element={<AnalyzeMusic />} />
                    <Route path="/add-singer" element={<AddSinger />} />
                    <Route path="/theme-manage" element={<ThemeManage />} />
                    <Route path="/theme-manage/:themeName" element={<ThemeMusicManage />} />
                    <Route path="/user-manage" element={<ManageUsers />} />
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
