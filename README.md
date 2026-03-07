# DoubleShot v1.0 ☕

DoubleShot, kahve dükkanları ve baristalar için tasarlanmış kapsamlı bir şube yönetimi, eğitim ve personel takip platformudur. Modern web teknolojileri kullanılarak geliştirilmiş olan bu uygulama, hem yeni başlayan baristaların eğitim süreçlerini oyunlaştırarak (gamification) hızlandırır hem de şube içi iletişimi tek bir noktada toplar.

## 🚀 Özellikler

- **Eğitim Akademisi (Gamified Training):**
  - A1 (Çaylak) seviyesinden C2 (Eğitmen Barista) seviyesine kadar uzanan dinamik bir eğitim haritası.
  - Video ve makale tabanlı ders içerikleri.
  - Her eğitim sonunda rastgele sorulardan oluşan 5 soruluk havuz bazlı Quiz testleri.
  - Sınavları başarıyla tamamladıkça kazanılan Puanlar (PT) ve kilitleri açılan üst seviye eğitimler (B1, B2 vb.).
  - Tamamlanan eğitimlerin arşivlendiği özel geçmiş modülü.
  - Puan ve seviye verilerinin `LocalStorage` ile tarayıcı belleğinde kalıcı hale getirilmesi.

- **Ekip ve Vardiya Yönetimi:**
  - Aktif çalışan personelleri ve tüm ekibi listeleyebilme.
  - Vardiya saatleri ve personel iletişim bilgileri.

- **Shot Bildirim Sistemi (Push Notifications):**
  - Sadece o an mesaide olan (aktif) personele veya tüm ekibe anlık bildirim gönderebilme.

- **Makine ve Ekipman Rehberi:**
  - Baristaların kahve makineleri ve değirmenler (öğütücüler) hakkında arıza çözümlerini veya kalibrasyon ayarlarını bulabildiği dijital rehber.

- **Tarifler (Recipes):**
  - Mağazanın standart kahve tariflerine (Espresso, V60, Latte vb.) hızlı erişim ve reçete detayları (TDS bilgileri dahil).

- **Kişiselleştirilebilir Profil:**
  - Kullanıcı adı ve e-posta bilgilerinin yerel cihazda güncellenebildiği ve istatistiklerin takip edildiği profil arayüzü.

## 💻 Kullanılan Teknolojiler

- **[React 19](https://react.dev/):** Kullanıcı arayüzü bileşenleri.
- **[Vite](https://vitejs.dev/):** Hızlı geliştirme ortamı ve build aracı.
- **[React Router DOM](https://reactrouter.com/):** Sayfalar arası dinamik geçişler (Routing).
- **[Lucide React](https://lucide.dev/):** Modern ve tutarlı ikon seti.
- **State Management:** React `useState` & Tarayıcı `localStorage`.
- **CSS / Styling:** "Glassmorphism" odaklı modern görünüm ve özel CSS değişkenleri.

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda (localhost) çalıştırmak için aşağıdaki adımları izleyin:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Uygulama [http://localhost:5173/](http://localhost:5173/) adresinde çalışmaya başlayacaktır.

## 📁 Proje Yapısı

```text
src/
├── components/       # Tekrar kullanılabilir arayüz bileşenleri (Header, Layout, vb.)
├── pages/            # Ana uygulama sayfaları (Home, Academy, Profile, Recipes vb.)
├── index.css         # Temel CSS kuralları ve Glassmorphism tasarım tokenları
├── App.jsx           # Ana Router (yönlendirme) tanımlamaları
└── main.jsx          # React uygulamasının başlangıç noktası
```

## 🎯 Hedef Kitle

Bu proje, üçüncü nesil (3rd wave) kahve dükkanları yönetimi için özel olarak kurgulanmıştır. Zincir mağazalardaki standart eğitim kalitesini artırmayı, yeni personelin adaptasyon sürecini (onboarding) kısaltmayı hedeflemektedir.

---
*Bu sistem, DoubleShot ekibi için özenle tasarlanıp kodlanmıştır.*
