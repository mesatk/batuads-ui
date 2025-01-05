import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Hero Section */}
        <section className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            BatuAds ile Reklamlarınız
            <span className="text-blue-600"> Güvende</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Modern ve güvenilir reklam çözümleri için doğru adrestesiniz
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Hemen Başla
          </button>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

const features = [
  {
    title: "Hedefli Reklamlar",
    description: "Doğru kitleye ulaşın ve reklam bütçenizi verimli kullanın"
  },
  {
    title: "Detaylı Analitik",
    description: "Reklam performansınızı gerçek zamanlı olarak takip edin"
  },
  {
    title: "7/24 Destek",
    description: "Teknik ekibimiz her zaman yanınızda"
  },
  {
    title: "Güvenli Ödeme",
    description: "SSL korumalı güvenli ödeme altyapısı"
  },
  {
    title: "Esnek Planlar",
    description: "İhtiyacınıza uygun reklam paketleri"
  },
  {
    title: "Kolay Kullanım",
    description: "Kullanıcı dostu arayüz ile hızlı reklam yönetimi"
  }
];
