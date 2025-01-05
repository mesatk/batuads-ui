'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Container, Typography, Grid, Box, Modal, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import io, { Socket } from 'socket.io-client';

interface Interest {
  id: number;
  minAmount: string;
  maxAmount: string;
  rate: number;
  createdAt: string;
}

interface Yatirim {
  id: number;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: number;
  interestId: number;
  interest: Interest;
}

interface Investment {
    investId: number;
    originalAmount: number;
    currentReturn: number;
    totalAmount: number;
    dailyRate: number;
    daysElapsed: number;
    monthlyRate: number;
  }
  
interface InvestmentReturns {
userId: number;
investments: Investment[];
totalReturn: number;
totalInvestment: number;
}

export const useInvestmentSocket = (token: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [returns, setReturns] = useState<InvestmentReturns | null>(null);
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      if (!token) return;
  
      // Socket.io bağlantısını kur
      const socketInstance = io('http://localhost:3000', {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Bağlantı durumunu dinle
      socketInstance.on('connect', () => {
        setIsConnected(true);
      });
  
      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });
  
      // Yatırım getirilerini dinle
      socketInstance.on('investmentReturns', (data: InvestmentReturns) => {
        setReturns(data);
      });
  
      setSocket(socketInstance);
  
      // Component unmount olduğunda bağlantıyı kapat
      return () => {
        socketInstance.disconnect();
      };
    }, [token]);
  
    return { isConnected, returns };
  };

export default function YatirimlarimPage() {
  const [yatirimlar, setYatirimlar] = useState<Yatirim[]>([]);
  const [toplamButce, setToplamButce] = useState<number>(0);
  const [modalAcik, setModalAcik] = useState(false);
  const [yatirimMiktari, setYatirimMiktari] = useState('');
  const [yukleniyorMu, setYukleniyorMu] = useState(false);
  const [hata, setHata] = useState('');

  const tokent = localStorage.getItem('access_token') || '';
  const { isConnected, returns } = useInvestmentSocket(tokent);

  console.log(returns);

  useEffect(() => {
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setToplamButce(userData.balance || 0);
    }

    const fetchYatirimlar = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.error('Token bulunamadı');
          return;
        }

        const response = await fetch('http://localhost:3000/invest/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setYatirimlar(data);
        } else {
          console.error('API yanıtı beklenen formatta değil:', data);
          setYatirimlar([]);
        }
      } catch (error) {
        console.error('Yatırımlar yüklenirken hata oluştu:', error);
        setYatirimlar([]);
      }
    };

    fetchYatirimlar();
  }, []);

  const yeniYatirimOlustur = () => {
    setModalAcik(true);
  };

  const modalKapat = () => {
    setModalAcik(false);
    setYatirimMiktari('');
    setHata('');
  };

  const yatirimGonder = async () => {
    try {
      setYukleniyorMu(true);
      setHata('');
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setHata('Oturum bulunamadı');
        return;
      }

      const response = await fetch('http://localhost:3000/invest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          amount: parseFloat(yatirimMiktari)
        })
      });

      if (!response.ok) {
        throw new Error('Yatırım oluşturulurken bir hata oluştu');
      }

      // Yatırımları yeniden yükle
      const yatirimlarResponse = await fetch('http://localhost:3000/invest/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (yatirimlarResponse.ok) {
        const data = await yatirimlarResponse.json();
        if (Array.isArray(data)) {
          setYatirimlar(data);
        }
      }

      modalKapat();
    } catch (error) {
      setHata('Yatırım oluşturulurken bir hata oluştu');
      console.error('Yatırım oluşturma hatası:', error);
    } finally {
      setYukleniyorMu(false);
    }
  };

  const getDurumRengi = (durum: string) => {
    switch (durum) {
      case 'approved':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'rejected':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const getDurumText = (durum: string) => {
    switch (durum) {
      case 'approved':
        return 'ONAYLANDI';
      case 'pending':
        return 'BEKLEMEDE';
      case 'rejected':
        return 'REDDEDİLDİ';
      default:
        return durum.toUpperCase();
    }
  };

  const beklemedekiYatirimlar = yatirimlar.filter(y => y.status === 'pending');
  const onaylananYatirimlar = yatirimlar.filter(y => y.status === 'approved');
  const reddedilenYatirimlar = yatirimlar.filter(y => y.status === 'rejected');

  const YatirimListesi = ({ yatirimlar, baslik }: { yatirimlar: Yatirim[], baslik: string }) => (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {baslik}
      </Typography>
      <Grid container spacing={3}>
        {yatirimlar.map((yatirim) => (
          <Grid item xs={12} md={6} key={yatirim.id}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Yatırım #{yatirim.id}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Miktar: {parseFloat(yatirim.amount).toLocaleString('tr-TR')} ₺
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faiz Oranı: %{yatirim.interest.rate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tarih: {new Date(yatirim.createdAt).toLocaleDateString('tr-TR')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: getDurumRengi(yatirim.status),
                  mt: 1
                }}
              >
                Durum: {getDurumText(yatirim.status)}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Yatırımlarım
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={yeniYatirimOlustur}
        >
          Yeni Yatırım
        </Button>
      </Box>

      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Toplam Bütçe
        </Typography>
        <Typography variant="h3" color="primary">
          {toplamButce.toLocaleString('tr-TR')} ₺
        </Typography>
      </Card>

      {beklemedekiYatirimlar.length > 0 && (
        <YatirimListesi yatirimlar={beklemedekiYatirimlar} baslik="Beklemedeki Yatırımlar" />
      )}

      {onaylananYatirimlar.length > 0 && (
        <YatirimListesi yatirimlar={onaylananYatirimlar} baslik="Onaylanan Yatırımlar" />
      )}

      {reddedilenYatirimlar.length > 0 && (
        <YatirimListesi yatirimlar={reddedilenYatirimlar} baslik="Reddedilen Yatırımlar" />
      )}

      <Modal
        open={modalAcik}
        onClose={modalKapat}
        aria-labelledby="yatirim-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="yatirim-modal-title" variant="h6" component="h2" gutterBottom>
            Yeni Yatırım Oluştur
          </Typography>
          <TextField
            fullWidth
            label="Yatırım Miktarı (₺)"
            type="number"
            value={yatirimMiktari}
            onChange={(e) => setYatirimMiktari(e.target.value)}
            sx={{ mt: 2 }}
          />
          {hata && (
            <Typography color="error" sx={{ mt: 2 }}>
              {hata}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={yatirimGonder}
              disabled={!yatirimMiktari || yukleniyorMu}
            >
              {yukleniyorMu ? 'Yükleniyor...' : 'Yatırım Yap'}
            </Button>
            <Button onClick={modalKapat}>
              İptal
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
} 