export default function CMSPage() {
  const heroBanners = [
    { id: 1, title: "Hero Banner 1", image: "/images/hero-model-1.jpg" },
    { id: 2, title: "Hero Banner 2", image: "/images/hero-model-2.jpg" },
    { id: 3, title: "Hero Banner 3", image: "/images/hero-model-3.jpg" },
  ];

  const subBanners = [
    { id: 1, title: "Sub Banner 1", image: "/images/sub-banner-1.jpg" },
    { id: 2, title: "Sub Banner 2", image: "/images/sub-banner-2.jpg" },
    { id: 3, title: "Sub Banner 3", image: "/images/sub-banner-3.jpg" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banners */}
      <div>
        <h1 className="text-2xl font-bold mb-8">CMS - Manage Hero Banners</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroBanners.map((banner) => (
            <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-black/10">
              <h3 className="font-bold mb-2">{banner.title}</h3>
              <div className="h-40 bg-gray-100 mb-4 rounded flex items-center justify-center text-ink/40">
                <span>{banner.image}</span>
              </div>
              <button className="w-full bg-brand text-white py-2 rounded font-bold hover:opacity-90">
                Change Image
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Banners */}
      <div>
        <h2 className="text-2xl font-bold mb-8">CMS - Manage Sub Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subBanners.map((banner) => (
            <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-black/10">
              <h3 className="font-bold mb-2">{banner.title}</h3>
              <div className="h-40 bg-gray-100 mb-4 rounded flex items-center justify-center text-ink/40">
                <span>{banner.image}</span>
              </div>
              <button className="w-full bg-brand text-white py-2 rounded font-bold hover:opacity-90">
                Change Image
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
