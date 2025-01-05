import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col space-y-16">
          {/* Hero Section */}
          <section className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Yatırımlarınızı Akıllıca Yönetin
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Paranızı en verimli şekilde değerlendirin, yatırımlarınızı takip edin
            </p>
          </section>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-700 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}

const stats = [
  {
    value: "50K+",
    label: "Aktif Yatırımcı"
  },
  {
    value: "₺100M+",
    label: "Toplam Yatırım"
  },
  {
    value: "%25",
    label: "Ortalama Yıllık Getiri"
  }
];

const features = [
  {
    title: "Getiri Hesaplayıcı",
    description: "Yatırımınızın potansiyel getirisini anlık olarak hesaplayın"
  },
  {
    title: "Portföy Takibi",
    description: "Tüm yatırımlarınızı tek bir yerden izleyin ve yönetin"
  },
  {
    title: "Akıllı Öneriler",
    description: "Size özel yatırım tavsiyeleri ve fırsatları yakalayın"
  },
  {
    title: "Detaylı Raporlar",
    description: "Yatırımlarınızın performansını grafiklerle analiz edin"
  },
  {
    title: "Anlık Bildirimler",
    description: "Önemli değişikliklerden anında haberdar olun"
  },
  {
    title: "Güvenli Altyapı",
    description: "En son güvenlik teknolojileriyle korunan sistem"
  }
];
