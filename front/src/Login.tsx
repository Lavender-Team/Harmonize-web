import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useNavigate } from 'react-router-dom';

import GoogleIcon from './GoogleIcon';
import Logo from './components/logo.png';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const data = {
      email: formElements.email.value,
      password: formElements.password.value,
      persistent: formElements.persistent.checked,
    };
    alert(JSON.stringify(data, null, 2));
    onSignIn();
    navigate('/admin-home');  // Navigate to AdminHome after login
  };

  return (
    <CssVarsProvider defaultMode="light" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '400px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#F0EAFB',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <img src={Logo} alt="하모나이즈" style={{ marginBottom: '16px', width: '50px', height: '50px' }} />
          <Typography component="h1" level="h3" sx={{ mb: 1.5 }}>
            로그인
          </Typography>
          <Typography level="body-sm" sx={{ mb: 3 }}>
            아이디와 비밀번호를 입력하여 로그인하세요.
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel>아이디</FormLabel>
              <Input type="email" name="email" placeholder="아이디 입력" />
            </FormControl>
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel>비밀번호</FormLabel>
              <Input type="password" name="password" placeholder="비밀번호 입력" />
            </FormControl>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Checkbox size="sm" label="Remember me" name="persistent" />
              <Link level="title-sm" href="#replace-with-a-link">
                Forgot your password?
              </Link>
            </Stack>
            <Button type="submit" fullWidth sx={{ mb: 2 }}>
              로그인
            </Button>
          </form>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
