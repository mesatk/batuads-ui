'use client';
import { useState, useEffect } from 'react';

interface Investment {
  id: number;
  userId: number;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface InterestRate {
  id: number;
  rate: number;
  minAmount: string;
  maxAmount: string;
  createdAt: string;
}

interface RateUpdate {
  rate: number;
  minAmount: number;
  maxAmount: number;
}

interface NewRate {
  rate: number;
  minAmount: number;
  maxAmount: number;
}

export default function DashboardPage() {
  const [pendingInvestments, setPendingInvestments] = useState<Investment[]>([]);
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [rateUpdates, setRateUpdates] = useState<Record<number, RateUpdate>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRate, setNewRate] = useState<NewRate>({
    rate: 0,
    minAmount: 0,
    maxAmount: 0
  });
  const [showNewRateForm, setShowNewRateForm] = useState(false);

  // Bekleyen yatırımları getir
  const fetchPendingInvestments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/invest/status/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Yatırımlar getirilemedi');
      
      const data = await response.json();
      setPendingInvestments(data);
    } catch (err: any) {
      setError('Yatırımlar yüklenirken bir hata oluştu');
      console.error(err);
    }
  };

  // Faiz oranlarını getir
  const fetchInterestRates = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/interests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Faiz oranları getirilemedi');
      
      const data = await response.json();
      setInterestRates(data);
    } catch (err: any) {
      setError('Faiz oranları yüklenirken bir hata oluştu');
      console.error(err);
    }
  };

  // Yatırım onaylama/reddetme
  const handleInvestmentStatus = async (investmentId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/invest/${investmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('İşlem başarısız');

      // Listeyi güncelle
      fetchPendingInvestments();
    } catch (err: any) {
      setError('İşlem sırasında bir hata oluştu');
      console.error(err);
    }
  };

  // Faiz oranı güncelleme
  const handleInterestRateUpdate = async (rateId: number) => {
    try {
      const updates = rateUpdates[rateId];
      if (!updates) return;
      console.log(updates);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/interests/${rateId}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minAmount: updates.minAmount,
          maxAmount: updates.maxAmount, 
          rate: updates.rate
        })
      });

      if (!response.ok) throw new Error('Güncelleme başarısız');

      // Güncellemeleri temizle ve oranları yeniden yükle
      setRateUpdates(prev => {
        const next = { ...prev };
        delete next[rateId];
        return next;
      });
      fetchInterestRates();
    } catch (err: any) {
      setError('Güncelleme sırasında bir hata oluştu');
      console.error(err);
    }
  };

  const handleRateChange = (rateId: number, field: keyof RateUpdate, value: number) => {
    setRateUpdates(prev => ({
      ...prev,
      [rateId]: {
        ...prev[rateId] || {
          rate: parseFloat(interestRates.find(r => r.id === rateId)?.rate.toString() || '0'),
          minAmount: parseFloat(interestRates.find(r => r.id === rateId)?.minAmount || '0'),
          maxAmount: parseFloat(interestRates.find(r => r.id === rateId)?.maxAmount || '0')
        },
        [field]: value
      }
    }));
  };

  // Yeni faiz oranı ekleme
  const handleAddNewRate = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/interests', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minAmount: newRate.minAmount,
          maxAmount: newRate.maxAmount,
          rate: newRate.rate
        })
      });

      if (!response.ok) throw new Error('Faiz oranı eklenemedi');

      // Formu sıfırla ve listesi güncelle
      setNewRate({
        rate: 0,
        minAmount: 0,
        maxAmount: 0
      });
      setShowNewRateForm(false);
      fetchInterestRates();
    } catch (err: any) {
      setError('Faiz oranı eklenirken bir hata oluştu');
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingInvestments(), fetchInterestRates()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Yönetim Paneli</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Faiz Oranları Bölümü */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-700">Faiz Oranları</h2>
          <button
            onClick={() => setShowNewRateForm(!showNewRateForm)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            {showNewRateForm ? 'İptal' : 'Yeni Faiz Oranı Ekle'}
          </button>
        </div>

        {showNewRateForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-4">
            <h3 className="font-medium mb-4 text-slate-700">Yeni Faiz Oranı Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-slate-600">Faiz Oranı (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newRate.rate}
                  onChange={(e) => setNewRate(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="border border-slate-200 rounded px-3 py-2 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-slate-600">Minimum Tutar (₺)</label>
                <input
                  type="number"
                  step="100"
                  value={newRate.minAmount}
                  onChange={(e) => setNewRate(prev => ({ ...prev, minAmount: parseFloat(e.target.value) }))}
                  className="border border-slate-200 rounded px-3 py-2 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-slate-600">Maksimum Tutar (₺)</label>
                <input
                  type="number"
                  step="100"
                  value={newRate.maxAmount}
                  onChange={(e) => setNewRate(prev => ({ ...prev, maxAmount: parseFloat(e.target.value) }))}
                  className="border border-slate-200 rounded px-3 py-2 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddNewRate}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Faiz Oranını Ekle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interestRates.map((rate) => (
            <div key={rate.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-medium mb-2 text-slate-700">Aylık</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 w-16">Oran:</span>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={rate.rate}
                    className="border border-slate-200 rounded px-3 py-2 w-24 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                    onChange={(e) => handleRateChange(rate.id, 'rate', parseFloat(e.target.value))}
                  />
                  <span className="text-slate-600">%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 w-16">Min:</span>
                  <input
                    type="number"
                    step="100"
                    defaultValue={parseFloat(rate.minAmount)}
                    className="border border-slate-200 rounded px-3 py-2 w-32 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                    onChange={(e) => handleRateChange(rate.id, 'minAmount', parseFloat(e.target.value))}
                  />
                  <span className="text-slate-600">₺</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 w-16">Max:</span>
                  <input
                    type="number"
                    step="100"
                    defaultValue={parseFloat(rate.maxAmount)}
                    className="border border-slate-200 rounded px-3 py-2 w-32 text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                    onChange={(e) => handleRateChange(rate.id, 'maxAmount', parseFloat(e.target.value))}
                  />
                  <span className="text-slate-600">₺</span>
                </div>
                {rateUpdates[rate.id] && (
                  <button
                    onClick={() => handleInterestRateUpdate(rate.id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
                  >
                    Değişiklikleri Onayla
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bekleyen Yatırımlar Bölümü */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Bekleyen Yatırımlar</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm border border-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Yatırımcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingInvestments.map((investment) => (
                <tr key={investment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-700">{investment.user.name}</div>
                    <div className="text-sm text-slate-500">{investment.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(investment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">
                      {new Date(investment.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleInvestmentStatus(investment.id, 'approved')}
                      className="text-emerald-600 hover:text-emerald-700 mr-4 transition-colors"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => handleInvestmentStatus(investment.id, 'rejected')}
                      className="text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      Reddet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 