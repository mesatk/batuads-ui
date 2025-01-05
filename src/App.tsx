import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline, AppBar, Toolbar, Typography, Button, Paper, Grid } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px 4px rgba(0, 0, 0, .08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 600 
            }}>
              Batu Ads
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              sx={{
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Giriş
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* AppBar için boşluk */}
        <Container maxWidth="lg" sx={{ 
          mt: 4,
          mb: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={10} lg={8}>
              <Paper sx={{ 
                p: { xs: 3, md: 6 },
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}>
                <Typography variant="h4" gutterBottom sx={{
                  background: 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Hoş Geldiniz
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Modern ve kullanıcı dostu reklam yönetim platformuna hoş geldiniz. Hemen başlamak için giriş yapın.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    Başla
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
