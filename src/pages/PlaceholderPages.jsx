import React, { useState, useEffect } from 'react';
import { Users, Calendar, Megaphone, Star, Send, Plus, X, Edit2, CheckCircle2, Clock, PlayCircle, BookOpen, Lock, Award, ChevronRight, ChevronLeft, Copy, Bell, MessageSquare, Inbox, Trash2 } from 'lucide-react';

export const Training = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    // Quiz Modals & States
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isExamMode, setIsExamMode] = useState(false);
    const [quizStep, setQuizStep] = useState(1);
    const [quizScore, setQuizScore] = useState(0);
    const [currentQuestions, setCurrentQuestions] = useState([]);

    // Eğitim Sekmeleri (Aktif Görevler vs Tamamlananlar)
    const [activeCourseTab, setActiveCourseTab] = useState('active');

    // Dinamik Progress (Kayıtlı puan varsa onu al, yoksa varsayılanı kullan)
    const [points, setPoints] = useState(() => {
        const savedPoints = localStorage.getItem('doubleshot_points');
        return savedPoints ? parseInt(savedPoints) : 100;
    });

    // Kaba Seviye Algoritması (PT Puanına Göre) - Yeni Matematiksel Model
    const getLevelInfo = (pt) => {
        if (pt >= 1000) return { level: 'Eğitmen Barista', grade: 'C2', min: 1000, next: 1000, nextLevel: 'Max' };
        if (pt >= 700) return { level: 'Usta Barista', grade: 'C1', min: 700, next: 1000, nextLevel: 'C2' };
        if (pt >= 450) return { level: 'İleri Seviye (Upper)', grade: 'B2', min: 450, next: 700, nextLevel: 'C1' };
        if (pt >= 250) return { level: 'Orta Seviye', grade: 'B1', min: 250, next: 450, nextLevel: 'B2' };
        if (pt >= 100) return { level: 'Junior Barista', grade: 'A2', min: 100, next: 250, nextLevel: 'B1' };
        return { level: 'Çaylak (Beginner)', grade: 'A1', min: 0, next: 100, nextLevel: 'A2' };
    };

    const currentLevel = getLevelInfo(points);
    const percentage = points >= 500 ? 100 : Math.floor(((points - currentLevel.min) / (currentLevel.next - currentLevel.min)) * 100);

    // Taslak Veriler: Eğitim Kategorileri
    const categories = [
        { id: 'all', label: 'Tümü' },
        { id: 'espresso', label: 'Espresso Temelleri' },
        { id: 'milk', label: 'Süt Sanatı' },
        { id: 'brew', label: 'Filtre & Demleme' },
    ];

    // İlerleme, Puanlar ve Seviye Barajları (A2 bitişi 250, B1 bitişi 450, B2 bitişi 700)
    // A2'de 100 ile başlayıp derslerden 50+50=100 alır, 200'de sınava girer 50 alır.
    // B1'de 250 ile başlar derslerden 75+75=150 alır, 400'de sınava girer 50 alır.
    // İlerleme, Puanlar ve Seviye Barajları
    const initialCourses = [
        // --- A1 Seviye Kurslar ---
        {
            id: 7, type: 'video', category: 'espresso', courseLevel: 'A1', title: 'Kahve Makinesi Temelleri',
            duration: '8 Dk', points: 30, isCompleted: false, reqPoints: 0,
            img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
            content: 'Öncelikle espresso makinesini tanımalıyız. Buhar çubuğu ne işe yarar? Portafiltre nereye takılır? Makineyi sabahları nasıl açarız?'
        },
        {
            id: 8, type: 'article', category: 'brew', courseLevel: 'A1', title: 'Filtre Kahve Demlerken Yapılan Hatalar',
            duration: '5 Dk', points: 30, isCompleted: false, reqPoints: 30,
            img: 'https://images.unsplash.com/photo-1495474472205-51e7d23a6bfa?w=500&q=80',
            content: 'Öğütmek ve kaynar su koymak tek başına yeterli değildir! Kağıdı yıkamayı unuttuğunuzda kahvenin tadı kağıdı anımsatabilir. Suyun ısısı ne çok sıcak ne çok soğuk olmalıdır.'
        },
        {
            id: 9, type: 'video', category: 'milk', courseLevel: 'A1', title: 'Misafirle İletişim',
            duration: '10 Dk', points: 40, isCompleted: false, reqPoints: 60,
            img: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=500&q=80',
            content: 'İlk seviyenin son aşaması! Bir Barista öncelikle misafirperver olmalıdır. Gelen misafiri gülümseyerek karşılamak teknik beceri kadar kritiktir.'
        },

        // --- A2 Seviye Kurslar ---
        {
            id: 1, type: 'video', category: 'espresso', courseLevel: 'A2', title: 'Mükemmel Espresso Ekstraksiyonu',
            duration: '8 Dk', points: 50, isCompleted: false, reqPoints: 0,
            img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80',
            content: 'Espresso yapımında 4 M kuralı çok kritiktir: Macinazione (Öğütme), Miscela (Harman), Macchina (Makine) ve Mano (El/Barista yeteneği). Her bir shot; iyi tamp, doğru basınç ve stabil su sıcaklığı ister.'
        },
        {
            id: 2, type: 'article', category: 'milk', courseLevel: 'A2', title: 'Latte Art: Kalp Deseni Çizimi',
            duration: '5 Dk', points: 50, isCompleted: false, reqPoints: 0,
            img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
            content: 'Latte art dökümünde amaç mikrokremalı sütü (60°C cıvarı) elde edip kahvenin kreması üzerinde kontrast yaratmaktır. Kalp çizimi için merkezden yüksekte başlayın, fincan dolunca alçalın.'
        },
        {
            id: 3, type: 'video', category: 'brew', courseLevel: 'B1', title: 'V60 Döküm (Pour) Teknikleri',
            duration: '12 Dk', points: 75, isCompleted: false, reqPoints: 250,
            img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80',
            content: 'Pour Over tekniklerinde Blooming çok önemlidir. CO2 tahliyesi için kahvenin miktarının iki katı suyla ön demleme yapın ve 30saniye kadar bekleyin.'
        },
        {
            id: 4, type: 'article', category: 'espresso', courseLevel: 'B1', title: 'Dial-in: Farklı Çekirdeklerin Ayarı',
            duration: '10 Dk', points: 75, isCompleted: false, reqPoints: 250,
            img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80',
            content: 'Dial-in süreci ince veya kalın çekim yapıp yapmamakla ilgilidir. Saniyeyi, verimi ve dozu tartar üzerinden ölçerek mükemmel çözünme hedeflenir.'
        },
        {
            id: 5, type: 'video', category: 'milk', courseLevel: 'B2', title: 'Rosetta ve Kuğu Desenleri',
            duration: '15 Dk', points: 100, isCompleted: false, reqPoints: 450,
            img: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=500&q=80',
            content: 'İleri düzey süt sanatı için bilek hareketleri ve döküm hızı kontrolü temel alınır. Süt akışını çok ince tutup kontrast sağlamak kritiktir.'
        },
        {
            id: 6, type: 'article', category: 'brew', courseLevel: 'B2', title: 'Demleme Reçetesi (TDS) Çıkarma',
            duration: '12 Dk', points: 100, isCompleted: false, reqPoints: 450,
            img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
            content: 'Kahvenin yoğunluğu, suyun TDS değeri ve çözünme oranı (Extraction Yield) gibi ileri düzey değişkenlerin ayarlanmasıyla standart tutturulur.'
        },

        // --- C1 Seviye Kurslar ---
        {
            id: 10, type: 'video', category: 'espresso', courseLevel: 'C1', title: 'Basınç Profili (Pressure Profiling)',
            duration: '20 Dk', points: 150, isCompleted: false, reqPoints: 700,
            img: 'https://images.unsplash.com/photo-1524350876685-274059332615?w=500&q=80',
            content: 'Klasik 9 bar basınç sınırını aşarak pre-infusion süresini oynama ve çözünmeyi mükemmelleştirme teknikleridir. Deneyimli baristalar için tasarlanmıştır.'
        },
        {
            id: 11, type: 'article', category: 'brew', courseLevel: 'C1', title: 'Kavurma Çekirdeği Seçimi (Roasting)',
            duration: '15 Dk', points: 150, isCompleted: false, reqPoints: 850,
            img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
            content: 'C1 seviyesinde bir barista sadece demleyici değil, aynı zamanda tadımcıdır (Cupper). Açık ve koyu kavurum arasındaki asidite farkını inceleyeceksiniz.'
        }
    ];

    const [courses, setCourses] = useState(() => {
        const savedCourses = localStorage.getItem('doubleshot_courses');
        return savedCourses ? JSON.parse(savedCourses) : initialCourses;
    });

    // İlerleme ve Sınav Hesabı
    const currentLevelCourses = courses.filter(c => c.courseLevel === currentLevel.grade);
    const completedCurrentLevel = currentLevelCourses.filter(c => c.isCompleted).length;
    const isExamReady = currentLevelCourses.length > 0 && completedCurrentLevel === currentLevelCourses.length;
    const computedPercentage = currentLevelCourses.length === 0 ? 100 : Math.floor((completedCurrentLevel / currentLevelCourses.length) * 100);

    // Ders İçi Soru Havuzu (Course ID Bazlı)
    const allQuizQuestions = {
        1: [ // Espresso Temelleri Modülü (ID: 1)
            { q: 'Espresso kaç saniyede demlenmelidir?', options: ['10-15s', '25-30s', '45-60s', '1dk+'], answer: 1 },
            { q: 'Standart bir Single Espresso kaç ml/gram civarıdır?', options: ['15-20 ml', '30 ml', '60 ml', '100 ml'], answer: 1 },
            { q: 'Mükemmel shot için kahve dozu ne kadar olmalıdır (Double Sepet)?', options: ['7-9 gr', '11-13 gr', '16-20 gr', '35 gr'], answer: 2 },
            { q: 'Tamping basıncı ortalama kaç kg olmalıdır?', options: ['1-2 kg', '10-15 kg (Sabit bir baskı)', '30+ kg', 'Basınca gerek yok'], answer: 1 },
            { q: 'Espresso kremasının esnek ve altın rengi rengi olması neyi gösterir?', options: ['Yanık olduğunu', 'Aroma kayıplarını', 'İyi bir ekstraksiyonu', 'Bayat çekirdekleri'], answer: 2 },
            { q: 'Kısa sürede akan sulu bir espresso hatasına ne ad verilir?', options: ['Over-extraction', 'Under-extraction', 'Dial in', 'Channelling'], answer: 1 }
        ],
        2: [ // Latte Art Eğitimi (ID: 2)
            { q: 'Latte Art için süt ne çok sıcak ne çok soğuk olmalıdır. İdeal sıcaklık nedir?', options: ['40-45°C', '60-65°C', '80°C+', 'Kaynama Noktası'], answer: 1 },
            { q: 'Latte Art\'ta kalbi çizerken pitcher nasıl hareket ettirilir?', options: ['Hızlıca dairesel', 'Önce yüksekten, sonra yaklaşıp bitişte ileri keserek', 'Olduğu yerde sabit', 'Sadece yukarı aşağı'], answer: 1 },
            { q: 'Sütü kremalaştırırken duyulan "cızbız" (kağıt yırtılma) sesinin anlamı nedir?', options: ['Pompada arıza var', 'Süte hava (köpük) giriyor', 'Süt yanıyor', 'Süt çok soğuk'], answer: 1 },
            { q: 'Süt köpürtüldükten sonra pitcher\'ı tezgaha hafifçe vurmanın amacı nedir?', options: ['Sütü soğutmak', 'Isıyı ölçmek', 'Büyük baloncukları patlatmak', 'Sütü karıştırmak'], answer: 2 },
            { q: 'Latte ve Cappuccino arasındaki en temel köpük farkı nedir?', options: ['Latte daha köpüklüdür', 'İkisi de aynıdır', 'Cappuccino kalın köpüklüdür', 'Latte hiç köpüksüzdür'], answer: 2 }
        ],
        3: [ // V60 Döküm (ID: 3)
            { q: 'V60 ve Chemex hangi demleme türüne girer?', options: ['Cold Brew', 'Espresso', 'Pour Over', 'Kapsül'], answer: 2 },
            { q: 'V60 demlemesinde suyun akış hızını temel olarak ne belirler?', options: ['Sadece suyun sıcaklığı', 'Sadece filtrenin kalınlığı', 'Öğütüm inceliği ve dökme hızı', 'Bardağın boyutu'], answer: 2 },
            { q: 'V60 demlemede ilk döküme (kahvenin ıslatılıp gazını atması) ne ad verilir?', options: ['Blooming (Çiçeklenme)', 'Extraction', 'Tamping', 'Dialing'], answer: 0 },
            { q: 'Standart bir V60 demlemesinde su sıcaklığı genelde hangi aralıkta olmalıdır?', options: ['70-75°C', '90-95°C', '100°C Kaynar', '60-65°C'], answer: 1 },
            { q: 'V60 dökümünde suyu nerelere dökmemeye özen göstermeliyiz?', options: ['Sadece ortasına', 'Sadece en kenarlara (kağıda)', 'Dairesel her yere', 'Hiç fark etmez'], answer: 1 }
        ],
        4: [ // Dial in (ID: 4)
            { q: 'Dial-in sürecinde "Over-extracted" (Aşırı demlenmiş) kahve nasıl tadar?', options: ['Ekşi', 'Acı ve Kurutucu', 'Çok tatlı', 'Meyvemsi'], answer: 1 },
            { q: 'Espresso 15 saniyede akıyorsa makine veya değirmende ne yapılmalıdır?', options: ['Daha kalın öğütülmeli', 'Daha ince öğütülmeli', 'Su ısısı artırılmalı', 'Bıçak değiştirilmeli'], answer: 1 },
            { q: 'Kahve akışı 45 saniye sürüyorsa (çok yavaşsa) sorunun nedeni nedir?', options: ['Under-extraction', 'Boy oranı', 'Çok ince öğütüm veya fazla doz', 'Su basıncı eksikliği'], answer: 2 },
            { q: 'Dial-in yaparken parametrelerden (doz, verim, süre) hangisi sabit tutulmalıdır?', options: ['Doz (Kahve Miktarı)', 'Süre', 'Sıcaklık', 'Basınç'], answer: 0 },
            { q: 'Sabah ilk ayarı yaparken (Dial in) atılan ilk shot genellikle niye servis edilmez?', options: ['Soğuktur', 'Değirmende kalan bayat kahveleri içerdiği için', 'Öğütücü ısınmamıştır', 'Sadece test içindir'], answer: 1 }
        ],
        5: [ // B2 Süt Sanatı (ID: 5)
            { q: 'Rosetta deseninin en alt yaprağı nasıl oluşturulur?', options: ['Pitcher çok yavaş sallanarak', 'Süt çok yukarıdan dökülerek', 'Pitcher kahveye çok yaklaşıp hızlı sağ-sol yapılarak', 'Fincan çevrilerek'], answer: 2 },
            { q: 'Kuğu (Swan) deseninde boyun kısmı nasıl çizilir?', options: ['İnce bir süt akışıyla yukarı doğru keserek', 'Kalın dökerek', 'Fincanı sallayarak', 'Sadece merkezde durarak'], answer: 0 },
            { q: 'İleri seviye latte art için süt sıcaklığı aşırı artarsa ne olur?', options: ['Daha kolay şekil alır', 'Köpük elastikiyetini kaybeder ve kalınlaşır', 'Espresso tadı güzelleşir', 'Bir şey değişmez'], answer: 1 },
            { q: 'Rosetta çizerken geriye doğru çekilme adımında süt akışı nasıl olmalıdır?', options: ['Yavaş ve ince', 'Çok hızlı ve kalın', 'Kesikli', 'Akış durdurulmalı'], answer: 0 },
            { q: 'Contrast (kontrast) artırmak için tasarımın kenarlarında nasıl bir renk hedeflenir?', options: ['Beyaz', 'Kahverengi (Krema)', 'Siyah', 'Sarı'], answer: 1 }
        ],
        6: [ // B2 Reçete Çıkarma (ID: 6)
            { q: 'TDS (Total Dissolved Solids) neyi ifade eder?', options: ['Suyun sıcaklığını', 'Kahvenin kavrulma derecesini', 'Suda çözünmüş katı madde miktarını', 'Basıncı'], answer: 2 },
            { q: 'Refraktometre ne ölçmek için kullanılır?', options: ['Makine basıncını', 'Demlenen kahvedeki çözünme oranını (Extraction yield)', 'Süt sıcaklığını', 'Öğütme derecesini'], answer: 1 },
            { q: 'Standart bir filtre kahve demlemesinde (SCA) ideal ekstraksiyon oranı % kaçtır?', options: ['%10-15', '%18-22', '%30-35', '%50'], answer: 1 },
            { q: 'Demlenen kahve "Ekşi" ve zayıf gövdeli ise kuvvetle muhtemel sorun nedir?', options: ['Fazla demlenmiş (Over-extracted)', 'Az demlenmiş (Under-extracted)', 'Su çok sıcaktır', 'Filtre kağıdı kalitesizdir'], answer: 1 },
            { q: 'Bypass (demlenen kahveye su ekleme) ne amaçla yapılır?', options: ['Ekstraksiyonu artırmak', 'TDS\'i düşürerek sertliği (strength) azaltmak', 'Kahveyi soğutmak', 'Rengi koyulaştırmak'], answer: 1 }
        ],
        7: [ // A1 Makine Temelleri
            { q: 'Portafiltre nedir?', options: ['Kahvenin çekildiği değirmen', 'Espresso makinesine takılan kahve süzgeci/kolu', 'Buhar çubuğu', 'Süt köpürtme cezvesi'], answer: 1 },
            { q: 'Buhar çubuğu (Steam Wand) ne işe yarar?', options: ['Süt köpürtmek ve ısıtmak için', 'Kahve öğütmek için', 'Filtre kahve demlemek için', 'Fincanı yıkamak için'], answer: 0 },
            { q: 'Makine ilk açıldığında ilk iş ne yapılmalıdır?', options: ['Hemen kahve yapılmalıdır', 'Makinenin ve suyun ısınması beklenmelidir', 'Tamping yapılmalıdır', 'Makine temizlenmelidir'], answer: 1 },
            { q: 'Knockbox ne için kullanılır?', options: ['Taze kahveyi saklamak için', 'Sütü soğutmak için', 'Kullanılmış kahve posasını dökmek için', 'Fincanları yerleştirmek için'], answer: 2 },
            { q: 'Group Head (Grup Başlığı) temizliği ne sıklıkla yapılmalıdır?', options: ['Sadece ayda bir', 'Gün sonunda boş bırakarak', 'Günlük ve periyodik olarak Backflush yapılarak', 'Hiç temizlenmez'], answer: 2 }
        ],
        8: [ // A1 Demleme Temelleri
            { q: 'Kağıt filtreyi demleme öncesi niçin sıcak suyla ıslatırız (yıkarız)?', options: ['Islanması daha kolay olsun diye', 'Kağıt tadını yok etmek ve ekipmanı ısıtmak için', 'Kahvenin rengini değiştirmek için', 'Yapmana gerek yoktur'], answer: 1 },
            { q: 'Filtre kahve yaparken su sıcaklığı genelde nasıl olmalıdır?', options: ['100 derece (tam kaynarken)', 'Kaynadıktan sonra 1-2 dakika dinlenmiş (90-95 derece)', 'Soğuk su', '50 derece'], answer: 1 },
            { q: 'Kahvenizi hazırladınız ama tadı çok acı (bitter) oldu. Neden olabilir?', options: ['Çok kalındı öğütüm', 'Sıcak su ile fazla demlendi (Over-extraction)', 'Çok az kahve kullanıldı', 'Hiçbiri'], answer: 1 },
            { q: 'Demlenen filtre kahvenin ideal bekletme süresi termo potlarda tahmini nedir?', options: ['1 gün', '3-4 saat', 'Maksimum 1-2 saat', 'Sınırsız'], answer: 2 },
            { q: 'Filtre kahvedeki acılığı almanın en basit yolu nedir?', options: ['Şeker atmak', 'Biraz daha kalın öğütmek', 'Tuzu denemek', 'Filtreyi kesmek'], answer: 1 }
        ],
        9: [ // A1 İletişim
            { q: 'Misafir mekana girdiğinde ilk yapılması gereken nedir?', options: ['Kahveyi hazırlamaya başlamak', 'Göz teması kurup hafif tebessümle hoş geldiniz demek', 'Telefona bakmak', 'Beklemesini söylemek'], answer: 1 },
            { q: 'Müşteri kahvenin çok sıcak olduğundan şikayet ederse ne yapmalısınız?', options: ['Hatalı hissettirmek', 'Kahveyi atmak', 'Nazikçe özür dileyip uygun sıcaklıkta yenisini hazırlamayı teklif etmek', 'Sıcak olması gerektiğini söylemek'], answer: 2 },
            { q: 'Günde 100 kişiyle de görüşseniz son kişinin alacağı enerji nasıl olmalıdır?', options: ['Yorgun hissettirmeli', 'İlk kişiye verilen enerjiyle aynı pozitiflikte olmalı', 'Sinirli', 'Uykulu'], answer: 1 },
            { q: 'Misafir beklerken onlara karşı en etkili vücut dili hangisidir?', options: ['Kollar bağlı, asık suratlı', 'Dik duruşlu ve yüzleri onlara dönük, ilgili', 'Sırtı dönük', 'Eller cebide'], answer: 1 },
            { q: 'Şikayet eden müşteriye karşı ilk adım nedir?', options: ['Tartışmak', 'Sorunu dikkatle dinleyip anlamaya çalışmak', 'Görmezden gelmek', 'Müdürü çağırmadan cevap vermemek'], answer: 1 }
        ],
        10: [ // C1 Basınç Profilleri
            { q: 'Pre-infusion (Ön Demleme) aşamasında basınç genelde nerededir?', options: ['9 Bar', '0 Bar', '1-3 Bar arası', '15 Bar'], answer: 2 },
            { q: 'Basınç profillemede "Flow Rate" (Akış Hızı) düşürülerek ne hedeflenir?', options: ['Süreyi kısaltmak', 'Over-extractionı (Aşırı çözünme) önleyip tatlılığı almak', 'Ekşiliği artırmak', 'Kremayı azaltmak'], answer: 1 },
            { q: 'Düşük basınçlı shotların (Örn. 6 bar) temel karakteristikleri nedir?', options: ['Çok acı', 'Daha az krema fakat yüksek tatlılık ve gövde dengesi', 'Kahve akmaz', 'Çok sulu'], answer: 1 },
            { q: 'Çok açık kavrulmuş (Light Roast) çekirdeklerde extraction oranını artırmak için ne yapılabilir?', options: ['Daha kalın öğütülmeli', 'Isı artırılıp uzun bir pre-infusion süresi verilebilir', '60 derecede demlenmeli', 'Hızlı basarak 10s\'de alınmalı'], answer: 1 },
            { q: 'Aynı kahveyi tamamen aynı derecede öğüttünüz ancak pompanın basıncı 9 bardan 6 bara düşürdünüz. Süre ortalama nasıl değişir?', options: ['Hızlanır', 'Aynı kalır', 'Yavaşlar (Uzar)', 'Kesilir'], answer: 2 }
        ],
        11: [ // C1 Kavrum
            { q: 'Light Roast (Açık Kavrum) çekirdeklerin en belirgin tat karakteristiği nedir?', options: ['Acı', 'Kömürümsü', 'Meyvemsi ve Yüksek Asiditeli', 'Tuzlu'], answer: 2 },
            { q: 'Kahve kavrulurken çekirdeğin ilk defa genişleyip çatladığı ana ne ad verilir?', options: ['First Crack', 'Second Crack', 'Blooming', 'Maillard Reaksiyonu'], answer: 0 },
            { q: 'Dark Roast (Koyu Kavrum) kahvedeki "Kavrum Tadı" (Acılık ve İsli Tatlar) sebebiyle kahvenin asıl originine ait aroma nasıl değişim gösterir?', options: ['Artar', 'Kapanır (Maskelenir)', 'Aynı kalır', 'Tatlılaşır'], answer: 1 },
            { q: 'Maillard Reaksiyonu (Kahverengileşme) işlemi kahvenin neresine etki eder?', options: ['Rengine ve Asiditesine', 'Meyvesine', 'Boyutuna', 'Sadece kokusuna'], answer: 0 },
            { q: 'Kavrulmuş bir çekirdek demlendikten sonra yüzeyde çok fazla yağ varsa (Oily Beans) bu muhtemelen ne kavrumdur?', options: ['Açık Kavrum', 'Tarçın (Cinnamon) Kavrum', 'Orta Kavrum', 'İleri (Koyu/Dark) Kavrum'], answer: 3 }
        ]
    };

    const openCourse = (course) => {
        if (course.locked) return;
        setIsExamMode(false);
        setSelectedCourse(course);
        setShowQuiz(false); // Önce eğitim metni
        setQuizStep(1);
        setQuizScore(0);
    };

    const startQuiz = () => {
        // Seçili kursun kendi havuzundan soruları getir
        const courseQuestions = allQuizQuestions[selectedCourse.id] || [];
        const shuffled = [...courseQuestions].sort(() => 0.5 - Math.random());
        // Aynı konudan rastgele 5 soru (ya da havuzda ne kadar varsa max 5 seçer)
        setCurrentQuestions(shuffled.slice(0, 5));
        setShowQuiz(true);
    };

    const startLevelExam = () => {
        setIsExamMode(true);
        // Sınav kurgusu: Tüm havuzdan rastgele 5 soru (Seviye atlama testi için)
        const combinedQ = [
            ...(allQuizQuestions[1] || []), ...(allQuizQuestions[2] || []),
            ...(allQuizQuestions[3] || []), ...(allQuizQuestions[4] || []),
            ...(allQuizQuestions[5] || []), ...(allQuizQuestions[6] || [])
        ];
        const shuffled = combinedQ.sort(() => 0.5 - Math.random());
        setCurrentQuestions(shuffled.slice(0, 5));
        setSelectedCourse({ title: `${currentLevel.grade} Seviye Bitirme Sınavı`, points: (currentLevel.next - points) });
        setShowQuiz(true);
        setQuizStep(1);
        setQuizScore(0);
    };

    const handleAnswer = (idx) => {
        const isCorrect = idx === currentQuestions[quizStep - 1].answer;
        if (isCorrect) setQuizScore(score => score + 1);

        if (quizStep < 5) {
            setQuizStep(step => step + 1);
        } else {
            setQuizStep('result');
            // Sonuçta 3 doğru ve üstüyse başarılı say
            if ((quizScore + (isCorrect ? 1 : 0)) >= 3) {
                if (isExamMode) {
                    // Seviye Sınavını Kazanma Durumu
                    const nextPt = currentLevel.next;
                    setPoints(nextPt);
                    localStorage.setItem('doubleshot_points', nextPt);

                    const currentUserEmail = localStorage.getItem('profileEmail');
                    const currentUserFullName = localStorage.getItem('profileName') || 'Barista';

                    // Kullanıcı listesini güncelle
                    const users = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
                    const updatedUsers = users.map(u => u.email === currentUserEmail ? { ...u, points: nextPt } : u);
                    localStorage.setItem('doubleshot_users', JSON.stringify(updatedUsers));

                    // Ekip üyeleri listesini güncelle (Leaderboard Senkronizasyonu)
                    const teamMembers = JSON.parse(localStorage.getItem('doubleshot_team_members') || '[]');
                    const updatedTeamMembers = teamMembers.map(m => (m.email === currentUserEmail || m.name === currentUserFullName) ? { ...m, points: nextPt } : m);
                    localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedTeamMembers));

                } else {
                    // Normal Eğitim Sınavını Kazanma Durumu
                    let newPt = points;
                    if (!selectedCourse.isCompleted) {
                        newPt = points + selectedCourse.points;
                        setPoints(newPt);
                        localStorage.setItem('doubleshot_points', newPt);

                        const currentUserEmail = localStorage.getItem('profileEmail');
                        const currentUserFullName = localStorage.getItem('profileName') || 'Barista';

                        // Kullanıcı listesini güncelle
                        const users = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
                        const updatedUsers = users.map(u => u.email === currentUserEmail ? { ...u, points: newPt } : u);
                        localStorage.setItem('doubleshot_users', JSON.stringify(updatedUsers));

                        // Ekip üyeleri listesini güncelle (Leaderboard Senkronizasyonu)
                        const teamMembers = JSON.parse(localStorage.getItem('doubleshot_team_members') || '[]');
                        const updatedTeamMembers = teamMembers.map(m => (m.email === currentUserEmail || m.name === currentUserFullName) ? { ...m, points: newPt } : m);
                        localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedTeamMembers));
                    }
                    // Kursu Tamamlandı Yap
                    const updatedCourses = courses.map(c =>
                        c.id === selectedCourse.id ? { ...c, isCompleted: true } : c
                    );
                    setCourses(updatedCourses);
                    localStorage.setItem('doubleshot_courses', JSON.stringify(updatedCourses));
                }
            }
        }
    };

    const closeQuiz = () => {
        setSelectedCourse(null);
        setShowQuiz(false);
        setIsExamMode(false);
    };

    // Filtreleme ve Dinamik Kilit Algoritması (Aktif/Tamamlanan Tab'a Göre)
    const baseCourses = activeCourseTab === 'active'
        ? courses.filter(c => c.courseLevel === currentLevel.grade && !c.isCompleted)
        : courses.filter(c => c.isCompleted);

    const processedCourses = baseCourses.map(c => ({
        ...c,
        locked: activeCourseTab === 'active' && points < c.reqPoints
    }));

    // Alt Kategori Filtresi
    const filteredCourses = activeFilter === 'all' ? processedCourses : processedCourses.filter(c => c.category === activeFilter);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>

            {/* Üst Başlık */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Eğitim <span className="text-accent">Akademisi</span></h2>
                <p className="text-secondary" style={{ fontSize: '13px' }}>Uzmanlık yolculuğunuza devam edin.</p>
            </div>

            {/* İlerleme (Progress) Kartı */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                {/* Arka Plan Süsü */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, color: 'var(--color-accent)' }}>
                    <Star size={120} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold', letterSpacing: '1px' }}>MEVCUT SEVİYE</span>
                        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            {currentLevel.level}
                            <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'var(--color-surface-light)', borderRadius: '4px', border: '1px solid var(--color-accent)' }}>
                                {currentLevel.grade}
                            </span>
                        </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{points}</span>
                        <span className="text-secondary" style={{ fontSize: '10px', display: 'block' }}>Eğitim Puanı</span>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {isExamReady ? 'Seviye sınavınız hazır!' : `${currentLevel.grade} derslerinin tamamlama oranı`}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: isExamReady ? 'var(--color-accent)' : '#fff' }}>
                            %{computedPercentage}
                        </span>
                    </div>
                    {/* Bar Dış Kasa */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-light)', borderRadius: '4px', overflow: 'hidden' }}>
                        {/* Bar Dolum */}
                        <div style={{ width: `${computedPercentage}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                    </div>
                </div>
            </div>

            {/* Orta Menü (Eğitim Modu vs Arşiv Modu) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: 'var(--color-surface)', padding: '6px', borderRadius: 'var(--radius-lg)' }}>
                <button
                    onClick={() => setActiveCourseTab('active')}
                    style={{
                        flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                        backgroundColor: activeCourseTab === 'active' ? 'var(--color-accent)' : 'transparent',
                        color: activeCourseTab === 'active' ? '#000' : 'var(--color-text-secondary)',
                        fontWeight: activeCourseTab === 'active' ? '600' : '500', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <BookOpen size={16} /> Aktif Eğitimler
                </button>
                <button
                    onClick={() => setActiveCourseTab('completed')}
                    style={{
                        flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                        backgroundColor: activeCourseTab === 'completed' ? 'var(--color-accent)' : 'transparent',
                        color: activeCourseTab === 'completed' ? '#000' : 'var(--color-text-secondary)',
                        fontWeight: activeCourseTab === 'completed' ? '600' : '500', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <CheckCircle2 size={16} /> Tamamlananlar
                </button>
            </div>

            {/* İçerik Kategorileri */}
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Kaldığın Yerden Devam Et</h3>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '12px', marginBottom: '28px', cursor: 'pointer', borderLeft: '3px solid var(--color-accent)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', backgroundImage: `url(${courses[1].img})`, backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '16px' }} />
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10px', color: '#ffb976', marginBottom: '2px', fontWeight: 'bold' }}>MAKALE</p>
                    <h4 style={{ fontSize: '14px', lineHeight: '1.2' }}>{courses[1].title}</h4>
                </div>
                <ChevronRight size={20} color="var(--color-text-secondary)" />
            </div>

            {/* Seviye Atlama Sınavı Modülü (Özel Kart) */}
            {activeCourseTab === 'active' && (
                <div style={{
                    marginBottom: '28px', padding: '20px', borderRadius: 'var(--radius-lg)',
                    background: isExamReady ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 100%)' : 'var(--color-surface)',
                    border: isExamReady ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid var(--color-border)', position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isExamReady ? 'var(--color-accent)' : 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isExamReady ? '#000' : '#888' }}>
                            <Award size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', color: isExamReady ? '#fff' : '#888' }}>{currentLevel.grade} Seviye Bitirme Sınavı</h4>
                            <p className="text-secondary" style={{ fontSize: '12px' }}>
                                {isExamReady ? 'Tebrikler, tüm dersleri tamamladın! Sınav aktif!' : 'Bu sınava girmek için mevcut seviyenizdeki tüm eğitimleri tamamlayın.'}
                            </p>
                        </div>
                    </div>
                    <button
                        disabled={!isExamReady}
                        onClick={startLevelExam}
                        style={{
                            width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 'bold',
                            backgroundColor: isExamReady ? 'var(--color-accent)' : 'var(--color-surface-light)',
                            color: isExamReady ? '#000' : 'var(--color-text-secondary)',
                            cursor: isExamReady ? 'pointer' : 'not-allowed',
                            border: isExamReady ? '1px solid var(--color-accent)' : 'none', transition: 'all 0.2s'
                        }}
                    >
                        {isExamReady ? 'Seviyeyi Tamamla ve Sınava Başla' : 'Sınav Şu An Kilitli'}
                    </button>
                </div>
            )}

            {/* İçerik Kategorileri */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveFilter(cat.id)}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', whiteSpace: 'nowrap',
                            backgroundColor: activeFilter === cat.id ? 'var(--color-accent)' : 'var(--color-surface)',
                            color: activeFilter === cat.id ? '#000' : 'var(--color-text-secondary)',
                            border: activeFilter === cat.id ? 'none' : '1px solid var(--color-border)',
                            fontWeight: activeFilter === cat.id ? 'bold' : 'normal', transition: 'all 0.2s'
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Eğitim Dersleri (Kartlar Yaklaşımı) */}
            {filteredCourses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        {activeCourseTab === 'active' ? 'Bu alanda açık veya yeni bir ders görünmüyor.' : 'Henüz tamamlanmış bir kursunuz bulunmamakta.'}
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {filteredCourses.map(course => (
                    <div key={course.id} onClick={() => openCourse(course)} className="glass-panel" style={{
                        overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
                        opacity: course.locked ? 0.6 : 1, cursor: course.locked ? 'not-allowed' : 'pointer',
                        border: course.isCompleted ? '1px solid var(--color-accent)' : 'none'
                    }}>

                        {/* Kilit İkonu (Erişim Yoksa) */}
                        {course.locked && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={28} color="#fff" />
                            </div>
                        )}

                        {/* Tamamlandı İşareti */}
                        {course.isCompleted && !course.locked && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 5, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px' }}>
                                <CheckCircle2 size={16} color="var(--color-accent)" fill="#000" />
                            </div>
                        )}

                        <div style={{ height: '110px', backgroundImage: `url(${course.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                            {/* Video veya Makale İkonu */}
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: '#fff' }}>
                                {course.type === 'video' ? <PlayCircle size={12} /> : <BookOpen size={12} />}
                                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{course.duration}</span>
                            </div>
                        </div>

                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '13px', lineHeight: '1.3', marginBottom: '8px' }}>
                                {course.title}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-secondary" style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                                    {categories.find(c => c.id === course.category)?.label}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>+{course.points} PT</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* DERS İÇERİK & QUİZ MODALI */}
            {selectedCourse && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', position: 'relative', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                        {/* SABİT BAŞLIK & KAPATMA BUTONU */}
                        <div style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            flexShrink: 0
                        }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {isExamMode ? 'Seviye Sınavı Modu' : 'Eğitim Modülü'}
                            </span>
                            <button
                                onClick={closeQuiz}
                                style={{
                                    color: '#EF4444',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: '6px',
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={14} strokeWidth={3} /> Çıkış
                            </button>
                        </div>

                        {/* İÇERİK (Kaydırılabilir Alana Dönüştürüldü) */}
                        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

                            {!showQuiz ? (
                                isExamMode ? (
                                    /* Seviye Atlama Sınavı İntro */
                                    <div>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Award size={32} />
                                        </div>
                                        <h3 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>{selectedCourse.title}</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: '1.6', marginBottom: '24px' }}>
                                            Bu seviyedeki tüm eğitim görevlerini tamamladınız. Bir üst dereceye çıkmak için genel yeteneklerinizi test edecek karışık sınava hazırsınız. Kazanmanız durumunda direkt seviye atlayacaksınız!
                                        </p>

                                        <button onClick={startQuiz} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            Sınavı Başlat
                                        </button>
                                    </div>
                                ) : (
                                    /* Sınıf / Eğitim Detay Görünümü */
                                    <div>
                                        <img src={selectedCourse.img} alt="Course" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />
                                        <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{selectedCourse.type === 'video' ? 'VİDEO EĞİTİMİ' : 'MAKALE'} - {selectedCourse.duration}</span>
                                        <h3 style={{ fontSize: '18px', marginTop: '4px', marginBottom: '12px' }}>{selectedCourse.title}</h3>

                                        <div style={{ backgroundColor: 'var(--color-surface-light)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                                            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#ffb976' }}>Eğitim İçeriği</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                                {selectedCourse.content}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button
                                                onClick={startQuiz}
                                                className="btn-primary"
                                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                            >
                                                Okudum ve Anladım, Sınava Geç <CheckCircle2 size={18} />
                                            </button>
                                            <button
                                                onClick={startQuiz}
                                                style={{
                                                    width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px',
                                                    background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)',
                                                    borderRadius: 'var(--radius-md)', fontSize: '12px'
                                                }}
                                            >
                                                Biliyorum, Eğitimi Atla ve Sınava Geç
                                            </button>
                                        </div>
                                    </div>
                                )
                            ) : (
                                /* Quiz Test Görünümü */
                                <div>
                                    {typeof quizStep === 'number' && quizStep <= 5 ? (
                                        <div className="animate-fade-in">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Soru {quizStep} / 5</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{selectedCourse.title}</span>
                                            </div>

                                            <h3 style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '24px' }}>
                                                {currentQuestions[quizStep - 1].q}
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {currentQuestions[quizStep - 1].options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAnswer(idx)}
                                                        className="btn-secondary"
                                                        style={{ textAlign: 'left', padding: '12px', fontSize: '14px', marginBottom: '4px' }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Sonuç Görünümü */
                                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                                            <div style={{
                                                width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px',
                                                backgroundColor: quizScore >= 3 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                border: quizScore >= 3 ? '2px solid var(--color-accent)' : '2px solid #ef4444',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: quizScore >= 3 ? 'var(--color-accent)' : '#ef4444'
                                            }}>
                                                {quizScore >= 3 ? <CheckCircle2 size={32} /> : <X size={32} />}
                                            </div>

                                            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                                                {quizScore >= 3 ? (isExamMode ? 'Tebrikler, Seviye Atladınız!' : 'Sınavı Geçtiniz!') : 'Sınavı Geçemediniz'}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                                                5 Sorudan <strong>{quizScore}</strong> doğru yaptınız. <br />
                                                {quizScore >= 3 ? (isExamMode ? 'Artık bir üst seviyenin yeni derslerine erişebilirsiniz.' : `+${selectedCourse.points} PT Puan Kazanıldı.`) : 'Geçmek için en az 3 doğru yapmalısınız.'}
                                            </p>

                                            <button
                                                onClick={closeQuiz}
                                                className="btn-primary"
                                                style={{ width: '100%', backgroundColor: quizScore >= 3 ? 'var(--color-accent)' : 'var(--color-surface)', color: quizScore >= 3 ? '#000' : '#fff' }}
                                            >
                                                {quizScore >= 3 ? 'Eğitim Paneline Dön' : 'Kapat ve Tekrar Çalış'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

        </div >
    );
};

export const Team = () => {
    const [activeTab, setActiveTab] = useState('personnel');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);

    // Düzenlenmekte olan asıl Shift verisi
    const [editingShiftDay, setEditingShiftDay] = useState(null);

    // Form States
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('Barista');
    const [newGrade, setNewGrade] = useState('A1');



    // Shift Edit States (Kişiler)
    const [tempMorning, setTempMorning] = useState([]);
    const [tempMid, setTempMid] = useState([]);
    const [tempEvening, setTempEvening] = useState([]);

    // Shift Edit States (Saatler)
    const [tempMorningTime, setTempMorningTime] = useState('08:00 - 16:00');
    const [tempMidTime, setTempMidTime] = useState('12:00 - 20:00');
    const [tempEveningTime, setTempEveningTime] = useState('16:00 - 00:00');

    // Hedef Kitle (Shot Type)
    const [shotTarget, setShotTarget] = useState('active');

    // Kullanıcının yetki durumu ve Ekip Kodları
    const [isLeader, setIsLeader] = useState(() => localStorage.getItem('doubleshot_is_leader') === 'true');
    const [teamCode, setTeamCode] = useState(() => localStorage.getItem('doubleshot_team_code') || null);

    // Barista için katılım
    const [joinCodeInput, setJoinCodeInput] = useState('');

    // joinStatus state'ini teamMembers listesine göre doğrula
    const [joinStatus, setJoinStatus] = useState(() => {
        const initialStatus = localStorage.getItem('doubleshot_team_status');
        const myEmail = localStorage.getItem('profileEmail');
        const myName = localStorage.getItem('profileName');
        const savedMembers = JSON.parse(localStorage.getItem('doubleshot_team_members') || '[]');

        // 1. Önce kesin E-posta eşleşmesi arıyoruz
        let isActuallyInTeam = savedMembers.some(m => m.email && m.email === myEmail);

        // 2. Güvenli Geriye Dönük Eşleşme (Soft-Claim)
        // Eğer lider kişiyi "Manuel" eklediyse (e-postası boşsa) ve isim uyuşuyorsa, e-postayı o slota KAZI.
        if (!isActuallyInTeam && myName) {
            const manualIndex = savedMembers.findIndex(m => !m.email && m.name === myName);
            if (manualIndex !== -1) {
                savedMembers[manualIndex].email = myEmail; // Slotu bu kullanıcıya mühürle
                localStorage.setItem('doubleshot_team_members', JSON.stringify(savedMembers));
                isActuallyInTeam = true;
            }
        }

        if (isActuallyInTeam) return 'approved';
        return initialStatus || null;
    });

    // Ekipten Ayrılma İşlemi
    const handleLeaveTeam = () => {
        if (window.confirm('Bu ekipten ayrılmak istediğinize emin misiniz? Puanlarınız korunacak ancak ekip listesinden silineceksiniz.')) {
            const myEmail = localStorage.getItem('profileEmail');
            const members = JSON.parse(localStorage.getItem('doubleshot_team_members') || '[]');
            const updatedMembers = members.filter(m => m.email !== myEmail);

            localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));
            localStorage.removeItem('doubleshot_team_status');
            localStorage.removeItem('doubleshot_team_code');
            localStorage.removeItem('doubleshot_team_leader');

            setJoinStatus(null);
            setTeamMembers(updatedMembers);
            alert('Ekipten başarıyla ayrıldınız.');
        }
    };

    // Ekip Üyesi Çıkarma İşlemi (Sadece Lider)
    const handleRemoveMember = (member) => {
        if (!isLeader) return;
        if (window.confirm(`${member.name} adlı üyeyi ekipten çıkarmak istediğinize emin misiniz?`)) {
            const updatedMembers = teamMembers.filter(m => m.id !== member.id);
            setTeamMembers(updatedMembers);
            localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));

            // Üyeye "ekipten çıkarıldınız" bildirimi at
            if (member.email) {
                const newNotif = {
                    id: Date.now(),
                    title: 'Ekipten Çıkarıldınız',
                    message: 'Ekip lideriniz sizi mevcut ekipten çıkardı.',
                    type: 'urgent',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isRead: false,
                    sender: localStorage.getItem('profileEmail'),
                    target: member.email
                };
                const existingNotifs = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
                localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...existingNotifs]));
            }

            alert(`${member.name} ekipten çıkarıldı.`);
        }
    };

    // Ekip Üyesi Rol Düzenleme İşlemi (Sadece Lider)
    const handleEditMemberRole = (member) => {
        if (!isLeader) return;
        setEditingRoleMember(member);
    };

    // Lider için gelen istekler
    const [joinRequests, setJoinRequests] = useState(() => {
        return JSON.parse(localStorage.getItem('doubleshot_team_requests') || '[]');
    });

    // Profil Modal
    const [selectedProfile, setSelectedProfile] = useState(null);

    // Rol Düzenleme Modal
    const [editingRoleMember, setEditingRoleMember] = useState(null);

    // Kaba/Anlık Yetkilendirme Kontrolü (Oturum önceden açılmışsa devreye girsin diye)
    useEffect(() => {
        const myEmail = localStorage.getItem('profileEmail');
        if (myEmail === 'bca@test.com') {
            localStorage.setItem('doubleshot_is_leader', 'true');
            localStorage.setItem('doubleshot_super_admin', 'true');
            localStorage.setItem('doubleshot_team_status', 'approved');

            // Lider bilgisini sakla (baristalar için)
            const leaderInfo = { id: 'leader', name: 'Batuhan Çağatay', role: 'Head Barista', grade: 'C2', points: 1000, avatar: 'B', email: 'bca@test.com' };
            localStorage.setItem('doubleshot_team_leader', JSON.stringify(leaderInfo));

            if (!localStorage.getItem('doubleshot_points') || parseInt(localStorage.getItem('doubleshot_points')) < 1000) {
                localStorage.setItem('doubleshot_points', '1000');
            }
            setIsLeader(true);
            setJoinStatus('approved');
        } else {
            // bca@test.com değilse, ekip listesinde olup olmadığını kontrol et
            const myName = localStorage.getItem('profileName');
            const savedMembers = JSON.parse(localStorage.getItem('doubleshot_team_members') || '[]');

            let isApproved = savedMembers.some(m => m.email && m.email === myEmail);

            if (!isApproved && myName) {
                const manualIndex = savedMembers.findIndex(m => !m.email && m.name === myName);
                if (manualIndex !== -1) {
                    savedMembers[manualIndex].email = myEmail;
                    localStorage.setItem('doubleshot_team_members', JSON.stringify(savedMembers));
                    isApproved = true;
                }
            }
            if (isApproved) {
                setJoinStatus('approved');
                localStorage.setItem('doubleshot_team_status', 'approved');
            } else if (localStorage.getItem('doubleshot_super_admin') === 'true') {
                localStorage.setItem('doubleshot_super_admin', 'false');
                localStorage.setItem('doubleshot_is_leader', 'false');
                setIsLeader(false);
            }
        }
    }, []);

    // Kodu Üret (Lider)
    const generateInviteCode = () => {
        const code = 'DS-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        setTeamCode(code);
        setIsLeader(true);
        localStorage.setItem('doubleshot_team_code', code);
        localStorage.setItem('doubleshot_is_leader', 'true');

        // Lider bilgisini sakla
        const leaderInfo = {
            id: 'leader',
            name: localStorage.getItem('profileName') || 'Ekip Lideri',
            role: 'Head Barista',
            grade: 'C1',
            points: parseInt(localStorage.getItem('doubleshot_points')) || 500,
            avatar: (localStorage.getItem('profileName') || 'E').charAt(0).toUpperCase(),
            email: localStorage.getItem('profileEmail')
        };
        localStorage.setItem('doubleshot_team_leader', JSON.stringify(leaderInfo));

        alert(`Ekip kodunuz oluşturuldu: ${code}\nBaristalarınız bu kodu kullanarak ekibinize katılabilir.`);
    };

    // Ekibe Katılma İsteği Yolla (Barista)
    const handleJoinRequest = () => {
        if (!joinCodeInput.trim()) {
            alert('Lütfen geçerli bir ekip kodu girin.');
            return;
        }

        const myName = localStorage.getItem('profileName') || 'Barista';
        const myEmail = localStorage.getItem('profileEmail') || '';
        const myPoints = parseInt(localStorage.getItem('doubleshot_points')) || 0;

        // Simüle edilmiş LocalStorage Request Eklemesi
        const newReq = {
            id: Date.now(),
            name: myName,
            email: myEmail,
            points: myPoints,
            code: joinCodeInput.toUpperCase(),
            timestamp: new Date().toLocaleDateString()
        };

        const currentRequests = JSON.parse(localStorage.getItem('doubleshot_team_requests') || '[]');
        currentRequests.push(newReq);
        localStorage.setItem('doubleshot_team_requests', JSON.stringify(currentRequests));

        // Kendi statüsünü pending yap
        setJoinStatus('pending');
        localStorage.setItem('doubleshot_team_status', 'pending');

        // Lidere bildirim yolla
        const newNotif = {
            id: Date.now() + 1, // Cakismamasi icin +1
            title: 'Yeni Katılım İsteği',
            message: `${myName} adlı kullanıcı ekibinize katılmak istiyor. Personel sekmesinden onaylayabilirsiniz.`,
            type: 'urgent',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            sender: myEmail,
            target: 'leader'
        };

        const existingNotifs = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
        localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...existingNotifs]));

        alert('Katılım isteğiniz liderinize başarıyla iletildi! Onay bekleniyor.');
    };

    // İstek Onayla/Reddet (Lider)
    const handleRequestDecision = (reqId, approved) => {
        const approvedReq = joinRequests.find(r => r.id === reqId);
        const updatedReqs = joinRequests.filter(r => r.id !== reqId);
        setJoinRequests(updatedReqs);
        localStorage.setItem('doubleshot_team_requests', JSON.stringify(updatedReqs));

        if (approved && approvedReq) {
            alert('Kullanıcı başarıyla ekibinize eklendi!');

            const newMember = {
                id: approvedReq.id || Date.now(),
                name: approvedReq.name,
                email: approvedReq.email,
                role: 'Barista',
                grade: 'A1',
                points: approvedReq.points || 0,
                avatar: approvedReq.name.charAt(0).toUpperCase()
            };

            const updatedMembers = [...teamMembers, newMember];
            setTeamMembers(updatedMembers);
            localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));
        } else {
            alert('Katılım isteği reddedildi.');
        }
    };

    // Dinamik State: Personel Listesi
    const [teamMembers, setTeamMembers] = useState(() => {
        const savedMembers = localStorage.getItem('doubleshot_team_members');
        return savedMembers ? JSON.parse(savedMembers) : [];
    });

    // Dinamik State: Destek Biletleri
    const [tickets, setTickets] = useState(() => {
        return JSON.parse(localStorage.getItem('doubleshot_tickets') || '[]');
    });

    // Destek mesajı için state
    const [contactMsg, setContactMsg] = useState('');

    // Biletleri ve diğer verileri yüklemek için useEffect
    useEffect(() => {
        // Biletleri yükle
        const savedTickets = JSON.parse(localStorage.getItem('doubleshot_tickets') || '[]');
        setTickets(savedTickets);

        // Eğitim puanlarını global user listesinden senkronize et (Geçmiş hataları düzeltmek için)
        const globalUsers = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
        setTeamMembers(prevMembers => {
            if (!prevMembers || prevMembers.length === 0) return prevMembers;

            let changed = false;
            const updatedMembers = prevMembers.map(member => {
                const globalMatch = globalUsers.find(u => (u.email && u.email === member.email) || (u.name && u.name === member.name));
                if (globalMatch && typeof globalMatch.points !== 'undefined' && globalMatch.points !== member.points) {
                    changed = true;
                    return { ...member, points: parseInt(globalMatch.points) || 0 };
                }
                return member;
            });

            if (changed) {
                localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));
                return updatedMembers;
            }
            return prevMembers;
        });
    }, []);

    const submitTicket = () => {
        if (!contactMsg.trim()) {
            alert("Lütfen yöneticiye iletmek istediğiniz mesajı girin.");
            return;
        }

        const newTicket = {
            id: Date.now(),
            senderName: localStorage.getItem('profileName') || 'İsimsiz Üye',
            senderEmail: localStorage.getItem('profileEmail'),
            message: contactMsg,
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'open',
            reply: ''
        };

        const updatedTickets = [newTicket, ...tickets];
        setTickets(updatedTickets);
        localStorage.setItem('doubleshot_tickets', JSON.stringify(updatedTickets));

        // Lidere bildirim yolla
        const newNotif = {
            id: Date.now() + 2,
            title: 'Yeni Talep / Mesaj',
            message: `${newTicket.senderName} kişisinden yeni bir mesajınız var: "${contactMsg.substring(0, 30)}${contactMsg.length > 30 ? '...' : ''}"`,
            type: 'info',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            sender: newTicket.senderEmail,
            target: 'leader'
        };
        const allNotifs = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
        localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...allNotifs]));

        setContactMsg('');
        alert("Mesajınız yöneticiye başarıyla iletildi.");
    };

    const replyToTicket = (ticketId, leaderReply) => {
        if (!leaderReply.trim()) return;

        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return;

        const t = tickets[ticketIndex];
        const updatedTickets = [...tickets];
        // Sadece yanıtı ekle, statüyü kapatma
        updatedTickets[ticketIndex] = { ...t, reply: leaderReply };

        setTickets(updatedTickets);
        localStorage.setItem('doubleshot_tickets', JSON.stringify(updatedTickets));

        // Üyeye cevap bildirimi yolla
        const newNotif = {
            id: Date.now() + 3,
            title: 'Talebiniz Yanıtlandı',
            message: `Yönetici mesajınıza yanıt verdi: "${leaderReply}"`,
            type: 'info',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            sender: localStorage.getItem('profileEmail'),
            target: t.senderEmail
        };

        const allNotifs = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
        localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...allNotifs]));

        alert("Yanıtınız başarıyla gönderildi.");
    };

    const closeTicket = (ticketId) => {
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return;

        if (window.confirm("Bu talebi kapatmak istediğinize emin misiniz?")) {
            const updatedTickets = [...tickets];
            updatedTickets[ticketIndex] = { ...updatedTickets[ticketIndex], status: 'closed' };

            setTickets(updatedTickets);
            localStorage.setItem('doubleshot_tickets', JSON.stringify(updatedTickets));
            alert("Talep başarıyla kapatıldı.");
        }
    };

    const cancelTicket = (ticketId) => {
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return;

        if (window.confirm("Bu talebi iptal etmek istediğinize emin misiniz?")) {
            const updatedTickets = [...tickets];
            updatedTickets[ticketIndex] = { ...updatedTickets[ticketIndex], status: 'cancelled' };

            setTickets(updatedTickets);
            localStorage.setItem('doubleshot_tickets', JSON.stringify(updatedTickets));
            alert("Talep iptal edildi.");
        }
    };

    const deleteTicket = (ticketId) => {
        if (window.confirm("Bu talebi tamamen silmek istediğinize emin misiniz?")) {
            const updatedTickets = tickets.filter(t => t.id !== ticketId);
            setTickets(updatedTickets);
            localStorage.setItem('doubleshot_tickets', JSON.stringify(updatedTickets));
            alert("Talep kalıcı olarak silindi.");
        }
    };

    // Dinamik State: Vardiya Planı (Saatleriyle Beraber)
    const [shifts, setShifts] = useState(() => {
        const savedShifts = localStorage.getItem('doubleshot_shifts');
        if (savedShifts) return JSON.parse(savedShifts);
        return [
            { id: '1', day: 'Pazartesi', morning: [], morningTime: '08:00 - 16:00', mid: [], midTime: '12:00 - 20:00', evening: [], eveningTime: '16:00 - 00:00' },
            { id: '2', day: 'Salı', morning: [], morningTime: '08:00 - 16:00', mid: [], midTime: '12:00 - 20:00', evening: [], eveningTime: '16:00 - 00:00' },
            { id: '3', day: 'Çarşamba', morning: [], morningTime: '08:00 - 16:00', mid: [], midTime: '12:00 - 20:00', evening: [], eveningTime: '16:00 - 00:00' },
            { id: '4', day: 'Perşembe', morning: [], morningTime: '08:00 - 16:00', mid: [], midTime: '12:00 - 20:00', evening: [], eveningTime: '16:00 - 00:00' },
            { id: '5', day: 'Cuma', morning: [], morningTime: '08:00 - 18:00', mid: [], midTime: '14:00 - 22:00', evening: [], eveningTime: '18:00 - 02:00' },
            { id: '6', day: 'Cumartesi', morning: [], morningTime: '09:00 - 17:00', mid: [], midTime: '12:00 - 20:00', evening: [], eveningTime: '17:00 - 01:00' }
        ];
    });

    const getMemberName = (id) => {
        const member = teamMembers.find(m => m.id === id);
        return member ? member.name.split(' ')[0] : 'Bilinmeyen';
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const newMember = {
            id: Date.now(),
            name: newName,
            email: '', // Manuel eklemede email boş kalabilir ama join için artık alan var
            role: newRole,
            grade: newGrade,
            points: 0,
            avatar: newName.charAt(0).toUpperCase()
        };

        const newTeam = [...teamMembers, newMember];
        setTeamMembers(newTeam);
        localStorage.setItem('doubleshot_team_members', JSON.stringify(newTeam));

        setNewName('');
        setShowAddModal(false);
    };

    const openShiftEditor = (shift) => {
        setEditingShiftDay(shift.id);

        // Kişileri Load Et
        setTempMorning([...shift.morning]);
        setTempMid([...(shift.mid || [])]);
        setTempEvening([...shift.evening]);

        // Saatleri Load Et
        setTempMorningTime(shift.morningTime || '08:00 - 16:00');
        setTempMidTime(shift.midTime || '12:00 - 20:00');
        setTempEveningTime(shift.eveningTime || '16:00 - 00:00');

        setShowShiftModal(true);
    };

    const toggleShiftMember = (memberId, targetShift) => {
        if (targetShift === 'morning') {
            if (tempMorning.includes(memberId)) {
                setTempMorning(tempMorning.filter(id => id !== memberId));
            } else { setTempMorning([...tempMorning, memberId]); }
        } else if (targetShift === 'mid') {
            if (tempMid.includes(memberId)) {
                setTempMid(tempMid.filter(id => id !== memberId));
            } else { setTempMid([...tempMid, memberId]); }
        } else {
            if (tempEvening.includes(memberId)) {
                setTempEvening(tempEvening.filter(id => id !== memberId));
            } else { setTempEvening([...tempEvening, memberId]); }
        }
    };

    const saveShiftChanges = () => {
        const updatedShifts = shifts.map(s => {
            if (s.id === editingShiftDay) {
                return {
                    ...s,
                    morning: tempMorning,
                    mid: tempMid,
                    evening: tempEvening,
                    morningTime: tempMorningTime,
                    midTime: tempMidTime,
                    eveningTime: tempEveningTime
                };
            }
            return s;
        });
        setShifts(updatedShifts);
        localStorage.setItem('doubleshot_shifts', JSON.stringify(updatedShifts));
        setShowShiftModal(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>

            {selectedProfile ? (
                <div className="animate-fade-in" style={{ minHeight: '100vh' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => setSelectedProfile(null)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>Profil <span className="text-accent">Özeti</span></h2>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 20px',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '2px solid var(--color-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '40px', fontWeight: 'bold', color: 'var(--color-accent)'
                        }}>
                            {selectedProfile.avatar}
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{selectedProfile.name}</h2>
                        <p className="text-secondary" style={{ fontSize: '15px' }}>{selectedProfile.role}</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '4px' }}>Kahve Seviyesi</p>
                                <h4 style={{ fontSize: '18px' }}>{selectedProfile.grade} Grade</h4>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: '24px', display: 'block', color: 'var(--color-accent)' }}>{selectedProfile.points}</strong>
                            <span className="text-secondary" style={{ fontSize: '13px' }}>PT Puanı</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Modal: Yeni Personel */}
                    {showAddModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                        }}>
                            <div className="glass-panel animate-fade-in" style={{ width: '100%', padding: '24px', position: 'relative' }}>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    style={{ position: 'absolute', top: 16, right: 16, color: 'var(--color-text-secondary)' }}
                                >
                                    <X size={24} />
                                </button>
                                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Ekibe Yeni Kişi Ekle</h3>

                                <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input
                                        required
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="İsim Soyisim"
                                        style={{
                                            padding: '12px', borderRadius: 'var(--radius-sm)',
                                            backgroundColor: 'var(--color-surface-light)', border: '1px solid var(--color-border)',
                                            color: '#fff', outline: 'none'
                                        }}
                                    />
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        style={{
                                            padding: '12px', borderRadius: 'var(--radius-sm)',
                                            backgroundColor: 'var(--color-surface-light)', border: '1px solid var(--color-border)',
                                            color: '#fff', outline: 'none'
                                        }}
                                    >
                                        <option value="Çaylak">Çaylak</option>
                                        <option value="Junior Barista">Junior Barista</option>
                                        <option value="Barista">Barista</option>
                                        <option value="Head Barista">Head Barista</option>
                                    </select>
                                    <select
                                        value={newGrade}
                                        onChange={(e) => setNewGrade(e.target.value)}
                                        style={{
                                            padding: '12px', borderRadius: 'var(--radius-sm)',
                                            backgroundColor: 'var(--color-surface-light)', border: '1px solid var(--color-border)',
                                            color: '#fff', outline: 'none'
                                        }}
                                    >
                                        <option value="A1">A1 (Başlangıç)</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1 (Orta)</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1 (Usta)</option>
                                        <option value="C2">C2 (Eğitmen)</option>
                                    </select>

                                    <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                                        Adayı Ekle
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal: Vardiya Düzenleme */}
                    {showShiftModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                        }}>
                            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '18px' }}>{shifts.find(s => s.id === editingShiftDay)?.day} Düzenle</h3>
                                    <button onClick={() => setShowShiftModal(false)} style={{ color: 'var(--color-text-secondary)' }}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <div style={{ padding: '20px', overflowY: 'auto' }}>

                                    {/* Sabah Atamaları */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '14px', color: 'var(--color-accent)' }}>SABAH VARDİYASI</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-surface-light)', padding: '4px 8px', borderRadius: '4px' }}>
                                                <Clock size={14} color="var(--color-text-secondary)" />
                                                <input
                                                    value={tempMorningTime}
                                                    onChange={(e) => setTempMorningTime(e.target.value)}
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '12px', width: '85px', outline: 'none' }}
                                                    placeholder="Örn: 08:00 - 16:00"
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {teamMembers.map(m => {
                                                const isSelected = tempMorning.includes(m.id);
                                                return (
                                                    <div
                                                        key={`m-${m.id}`}
                                                        onClick={() => toggleShiftMember(m.id, 'morning')}
                                                        style={{
                                                            padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                            backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'var(--color-surface-light)',
                                                            border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                                            display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}
                                                    >
                                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent' }}>
                                                            {isSelected && <CheckCircle2 size={12} color="#000" />}
                                                        </div>
                                                        <span style={{ fontSize: '13px' }}>{m.name.split(' ')[0]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Ara Vardiya Atamaları */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '14px', color: '#9cc2ff' }}>ARA VARDİYA (MID SHIFT)</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-surface-light)', padding: '4px 8px', borderRadius: '4px' }}>
                                                <Clock size={14} color="var(--color-text-secondary)" />
                                                <input
                                                    value={tempMidTime}
                                                    onChange={(e) => setTempMidTime(e.target.value)}
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '12px', width: '85px', outline: 'none' }}
                                                    placeholder="Örn: 12:00 - 20:00"
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {teamMembers.map(m => {
                                                const isSelected = tempMid.includes(m.id);
                                                return (
                                                    <div
                                                        key={`mid-${m.id}`}
                                                        onClick={() => toggleShiftMember(m.id, 'mid')}
                                                        style={{
                                                            padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                            backgroundColor: isSelected ? 'rgba(156, 194, 255, 0.15)' : 'var(--color-surface-light)',
                                                            border: isSelected ? '1px solid #9cc2ff' : '1px solid var(--color-border)',
                                                            display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}
                                                    >
                                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? '#9cc2ff' : 'transparent' }}>
                                                            {isSelected && <CheckCircle2 size={12} color="#000" />}
                                                        </div>
                                                        <span style={{ fontSize: '13px' }}>{m.name.split(' ')[0]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Akşam Atamaları */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '14px', color: '#ffb976' }}>AKŞAM VARDİYASI</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-surface-light)', padding: '4px 8px', borderRadius: '4px' }}>
                                                <Clock size={14} color="var(--color-text-secondary)" />
                                                <input
                                                    value={tempEveningTime}
                                                    onChange={(e) => setTempEveningTime(e.target.value)}
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '12px', width: '85px', outline: 'none' }}
                                                    placeholder="Örn: 16:00 - 00:00"
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {teamMembers.map(m => {
                                                const isSelected = tempEvening.includes(m.id);
                                                return (
                                                    <div
                                                        key={`e-${m.id}`}
                                                        onClick={() => toggleShiftMember(m.id, 'evening')}
                                                        style={{
                                                            padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                            backgroundColor: isSelected ? 'rgba(255, 185, 118, 0.15)' : 'var(--color-surface-light)',
                                                            border: isSelected ? '1px solid #ffb976' : '1px solid var(--color-border)',
                                                            display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}
                                                    >
                                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? '#ffb976' : 'transparent' }}>
                                                            {isSelected && <CheckCircle2 size={12} color="#000" />}
                                                        </div>
                                                        <span style={{ fontSize: '13px' }}>{m.name.split(' ')[0]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>

                                <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)' }}>
                                    <button className="btn-primary" onClick={saveShiftChanges}>
                                        Saatleri ve Ekibi Kaydet
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Üst Başlık & Duyuru - YETKİYE GÖRE DEĞİŞEN DAVET/KATILIM PANELİ */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Ekip <span className="text-accent">Yönetimi</span></h2>
                                <p className="text-secondary" style={{ fontSize: '13px' }}>{isLeader ? 'Kendi Ekibinizi Yönetin' : 'Global Topluluk Paneli'}</p>
                            </div>
                        </div>

                        {/* Katılım ve Davet Modülü */}
                        <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>

                            {/* Lider Görünümü */}
                            {isLeader ? (
                                <>
                                    <h4 style={{ fontSize: '15px', color: 'var(--color-accent)', marginBottom: '8px' }}>Yönetici Rolündesiniz</h4>
                                    {teamCode ? (
                                        <div>
                                            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
                                                Bu kodu çalışma arkadaşlarınızla paylaşarak ekibinize katılmalarını sağlayabilirsiniz.
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-accent)', padding: '10px 16px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {teamCode}
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(teamCode);
                                                            alert('Davet kodu panoya kopyalandı!');
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        title="Kodu Kopyala"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
                                                Personellerinizi eklemek ve vardiya sistemini yönetmek için bir davet kodu oluşturun.
                                            </p>
                                            <button onClick={generateInviteCode} className="btn-primary" style={{ fontSize: '13px', padding: '10px 16px' }}>
                                                Davet Kodu Üret
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Barista (Öğrenci) Görünümü */
                                <>
                                    <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>
                                        {joinStatus === 'approved' ? 'Ekip Bilgilerim' : 'Bir Ekibe Katıl'}
                                    </h4>

                                    {joinStatus === 'pending' ? (
                                        <div>
                                            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
                                                Liderinize katılım isteği gönderildi. Onay bekleniyor...
                                            </p>
                                            <div style={{ display: 'inline-block', backgroundColor: 'rgba(239, 185, 118, 0.2)', color: '#ffb976', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
                                                Onay Bekleniyor
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setJoinStatus(null);
                                                    localStorage.removeItem('doubleshot_team_status');
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '12px', marginLeft: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                İsteği İptal Et
                                            </button>
                                        </div>
                                    ) : joinStatus === 'approved' ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '13px', color: 'var(--color-accent)', marginBottom: '4px' }}>
                                                    Şu anda yetkili bir ekibin organik üyesisiniz.
                                                </p>
                                                <span className="text-secondary" style={{ fontSize: '11px' }}>Tüm ekip özelliklerine erişiminiz açık.</span>
                                            </div>
                                            <button
                                                onClick={handleLeaveTeam}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                    border: '1px solid rgba(255, 107, 107, 0.3)',
                                                    color: '#ff6b6b',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Ekipten Ayrıl
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
                                                Ekip liderinizin veya kurumunuzun verdiği davet kodunu girerek ağa dahil olun.
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    value={joinCodeInput}
                                                    onChange={(e) => setJoinCodeInput(e.target.value)}
                                                    placeholder="Örn: DS-X93Y"
                                                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '200px', textTransform: 'uppercase' }}
                                                />
                                                <button onClick={handleJoinRequest} className="btn-primary" style={{ padding: '10px 16px' }}>
                                                    Kodu Doğrula
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sekmeler (Tabs) - Sadece Onaylı Üye veya Lider Görebilir */}
                    {(isLeader || joinStatus === 'approved') && (
                        <div style={{
                            display: 'flex', gap: '8px', marginBottom: '24px',
                            backgroundColor: 'var(--color-surface)', padding: '6px', borderRadius: 'var(--radius-lg)'
                        }}>
                            <button
                                onClick={() => setActiveTab('personnel')}
                                style={{
                                    flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                                    backgroundColor: activeTab === 'personnel' ? 'var(--color-accent)' : 'transparent',
                                    color: activeTab === 'personnel' ? '#000' : 'var(--color-text-secondary)',
                                    fontWeight: activeTab === 'personnel' ? '600' : '500',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                <Award size={16} /> Liderlik
                            </button>

                            <button
                                onClick={() => setActiveTab('shifts')}
                                style={{
                                    flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                                    backgroundColor: activeTab === 'shifts' ? 'var(--color-accent)' : 'transparent',
                                    color: activeTab === 'shifts' ? '#000' : 'var(--color-text-secondary)',
                                    fontWeight: activeTab === 'shifts' ? '600' : '500',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                <Calendar size={16} /> Vardiya
                            </button>
                            {isLeader ? (
                                <>
                                    <button
                                        onClick={() => setActiveTab('shot')}
                                        style={{
                                            flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                                            backgroundColor: activeTab === 'shot' ? 'var(--color-accent)' : 'transparent',
                                            color: activeTab === 'shot' ? '#000' : 'var(--color-text-secondary)',
                                            fontWeight: activeTab === 'shot' ? '600' : '500',
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}
                                    >
                                        <Megaphone size={16} /> Bildirim
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tickets')}
                                        style={{
                                            flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                                            backgroundColor: activeTab === 'tickets' ? 'var(--color-accent)' : 'transparent',
                                            color: activeTab === 'tickets' ? '#000' : 'var(--color-text-secondary)',
                                            fontWeight: activeTab === 'tickets' ? '600' : '500',
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}
                                    >
                                        <Inbox size={16} /> Talepler
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    style={{
                                        flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                                        backgroundColor: activeTab === 'contact' ? 'var(--color-accent)' : 'transparent',
                                        color: activeTab === 'contact' ? '#000' : 'var(--color-text-secondary)',
                                        fontWeight: activeTab === 'contact' ? '600' : '500',
                                        transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    <MessageSquare size={16} /> Yöneticiye Ulaş
                                </button>
                            )}
                        </div>
                    )}

                    {/* TAB 1: Ekip Üyeleri (Yönetim) */}
                    {activeTab === 'members' && (
                        <div className="animate-fade-in">
                            {/* LİDER İÇİN: BEKLEYEN İSTEKLER PANELİ */}
                            {isLeader && joinRequests.length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#ffb976', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Bell size={16} /> Bekleyen Katılım İstekleri ({joinRequests.length})
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {joinRequests.map(req => (
                                            <div key={req.id} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid #ffb976' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{req.name}</h4>
                                                    <p className="text-secondary" style={{ fontSize: '12px' }}>{req.points} PT Puanı • {req.timestamp}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleRequestDecision(req.id, false)}
                                                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestDecision(req.id, true)}
                                                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px' }}>Ekip Üyeleri ({teamMembers.length + 1})</h3>
                                <span className="text-secondary" style={{ fontSize: '12px' }}>Görev ve Rol Yönetimi</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--color-accent)', background: 'rgba(212, 175, 55, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                            {(isLeader ? localStorage.getItem('profileName') || 'E' : (JSON.parse(localStorage.getItem('doubleshot_team_leader'))?.name || 'B')).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '15px', marginBottom: '2px' }}>
                                                {isLeader ? (localStorage.getItem('profileName') + ' (Sen)') : (JSON.parse(localStorage.getItem('doubleshot_team_leader'))?.name || 'Batuhan Çağatay')}
                                            </h4>
                                            <p className="text-secondary" style={{ fontSize: '12px' }}>Ekip Lideri</p>
                                        </div>
                                    </div>
                                </div>

                                {teamMembers.map((member) => (
                                    <div key={member.id} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                                                {member.avatar || member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '15px', marginBottom: '2px' }}>
                                                    {member.name}
                                                </h4>
                                                <p className="text-secondary" style={{ fontSize: '12px' }}>{member.role}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {isLeader && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleEditMemberRole(member)}
                                                        title="Rolü Düzenle"
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(member)}
                                                        title="Ekipten Çıkar"
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Liderlik Tablosu (Sadece Puanlar) */}
                    {activeTab === 'personnel' && (
                        <div className="animate-fade-in">
                            {(!isLeader && joinStatus !== 'approved') ? (
                                <div className="glass-panel" style={{ padding: '32px 24px', textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-text-secondary)' }}>
                                        <Users size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Henüz Bir Ekipte Değilsiniz</h3>
                                    <p className="text-secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                        Liderlik tablosunu ve ekip üyelerini görmek için yukarıdaki alandan bir davet kodu girerek ekibe dahil olmalısınız.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* EKİP LİDERİ BİLGİ BANDI */}
                                    {(localStorage.getItem('doubleshot_team_leader') || isLeader) && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <div
                                                className="glass-panel"
                                                onClick={() => {
                                                    const leaderInfo = isLeader
                                                        ? { name: localStorage.getItem('profileName'), role: 'Head Barista', grade: 'C1', points: parseInt(localStorage.getItem('doubleshot_points')) || 500, email: localStorage.getItem('profileEmail'), avatar: (localStorage.getItem('profileName') || 'E').charAt(0).toUpperCase() }
                                                        : JSON.parse(localStorage.getItem('doubleshot_team_leader'));
                                                    setSelectedProfile(leaderInfo);
                                                }}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderLeft: '4px solid var(--color-accent)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    background: 'rgba(212, 175, 55, 0.05)',
                                                    cursor: 'pointer'
                                                }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                                                    <Award size={18} />
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Ekip Lideri</span>
                                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                        {isLeader ? (localStorage.getItem('profileName') + ' (Sen)') : (JSON.parse(localStorage.getItem('doubleshot_team_leader'))?.name || 'Batuhan Çağatay')}
                                                    </span>
                                                </div>
                                            </div>
                                            {isLeader && (
                                                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
                                                    <button
                                                        onClick={() => setActiveTab('members')}
                                                        style={{
                                                            background: 'none', border: '1px solid var(--color-accent)', color: 'var(--color-accent)',
                                                            fontSize: '12px', cursor: 'pointer', display: 'flex', borderRadius: '16px',
                                                            alignItems: 'center', gap: '6px', padding: '6px 12px', transition: 'all 0.2s'
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent)'; e.currentTarget.style.color = '#000'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                                                    >
                                                        <Users size={14} /> Takım Üyelerini Yönet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '16px' }}>Haftanın Liderlik Tablosu</h3>
                                        <span className="text-secondary" style={{ fontSize: '12px' }}>Eğitim Puanı</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {(() => {
                                            // Mevcut giriş yapan kullanıcının verilerini localStorage'dan alıyoruz
                                            const myPoints = parseInt(localStorage.getItem('doubleshot_points')) || 0;
                                            const myName = localStorage.getItem('profileName') || 'Misafir Barista';

                                            const getGrade = (pt) => {
                                                if (pt >= 1000) return 'C2';
                                                if (pt >= 700) return 'C1';
                                                if (pt >= 450) return 'B2';
                                                if (pt >= 250) return 'B1';
                                                if (pt >= 100) return 'A2';
                                                return 'A1';
                                            };

                                            // Kullanıcı ekstradan "Sen" etiketiyle tabloya dahil ediliyor, mükerrer varlıkları önlemek için kontrol
                                            const isMeInList = teamMembers.some(m => m.name === myName);
                                            let mergedTeam = [];

                                            const defaultMyRole = localStorage.getItem('doubleshot_super_admin') === 'true'
                                                ? 'Head Barista (Super Admin)'
                                                : (localStorage.getItem('doubleshot_is_leader') === 'true' ? 'Ekip Lideri' : 'Barista');

                                            if (isMeInList) {
                                                mergedTeam = teamMembers.map(m => m.name === myName ? {
                                                    ...m,
                                                    id: 'me',
                                                    name: myName + ' (Sen)',
                                                    grade: getGrade(myPoints), // Güncel puanını baz al
                                                    points: myPoints,
                                                    role: defaultMyRole
                                                } : m);
                                            } else {
                                                mergedTeam = [
                                                    {
                                                        id: 'me',
                                                        name: myName + ' (Sen)',
                                                        role: defaultMyRole,
                                                        grade: getGrade(myPoints),
                                                        points: myPoints,
                                                        avatar: myName.charAt(0).toUpperCase()
                                                    },
                                                    ...teamMembers
                                                ];
                                            }

                                            // Lideri listeden çıkar (Hem "ben" lidersem, hem de başkası liderse)
                                            const leaderData = JSON.parse(localStorage.getItem('doubleshot_team_leader'));
                                            const leaderEmail = isLeader ? localStorage.getItem('profileEmail') : (leaderData?.email || 'bca@test.com');
                                            const leaderName = isLeader ? localStorage.getItem('profileName') : (leaderData?.name || 'Batuhan Çağatay');

                                            // Ben lidersem 'me' objesini oluşturmamalıyız veya listeyi filtrelerken çıkarmalıyız.
                                            let finalTeam = mergedTeam.filter(m => {
                                                if (m.email && m.email === leaderEmail) return false;
                                                if (m.name && (m.name === leaderName || m.name === leaderName + ' (Sen)')) return false;
                                                return true;
                                            });

                                            return finalTeam.sort((a, b) => b.points - a.points).map((member, idx) => (
                                                <div
                                                    key={member.id}
                                                    className="glass-panel"
                                                    onClick={() => setSelectedProfile(member)}
                                                    style={{
                                                        padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        border: idx === 0 && member.points > 0 ? '1px solid var(--color-accent)' : (member.id === 'me' ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-border)'),
                                                        backgroundColor: member.id === 'me' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                                        cursor: 'pointer'
                                                    }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <div style={{
                                                                width: '44px', height: '44px', borderRadius: '50%',
                                                                backgroundColor: idx === 0 && member.points > 0 ? 'rgba(212, 175, 55, 0.2)' : 'var(--color-surface-light)',
                                                                border: idx === 0 && member.points > 0 ? '2px solid var(--color-accent)' : 'none',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '16px', fontWeight: 'bold', color: idx === 0 && member.points > 0 ? 'var(--color-accent)' : '#fff'
                                                            }}>
                                                                {member.avatar}
                                                            </div>
                                                            {idx === 0 && member.points > 0 && (
                                                                <div style={{
                                                                    position: 'absolute', top: -8, right: -4, color: 'var(--color-accent)'
                                                                }}>
                                                                    <Star size={16} fill="var(--color-accent)" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 style={{ fontSize: '15px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                {member.name}
                                                                <span style={{
                                                                    fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                                                                    backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)'
                                                                }}>
                                                                    {member.grade}
                                                                </span>
                                                            </h4>
                                                            <p className="text-secondary" style={{ fontSize: '12px' }}>{member.role}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <strong style={{ fontSize: '18px', display: 'block' }}>{member.points}</strong>
                                                            <span className="text-secondary" style={{ fontSize: '10px' }}>PT</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB 2: Vardiya (Shift) Modülü */}
                    {activeTab === 'shifts' && (
                        <div className="animate-fade-in">

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                                    Haziran - 3. Hafta Planı (3 Vardiya)
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {shifts.map((shift) => (
                                    <div key={shift.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                                        <div style={{
                                            padding: '12px 16px', backgroundColor: 'var(--color-surface-light)',
                                            borderBottom: '1px solid var(--color-border)',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <h4 style={{ fontSize: '14px', margin: 0 }}>{shift.day}</h4>

                                            {isLeader && (
                                                <button
                                                    onClick={() => openShiftEditor(shift)}
                                                    style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                                                >
                                                    <Edit2 size={12} /> Saat ve Kişi Düzenle
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>

                                            <div style={{ padding: '12px', borderRight: '1px solid var(--color-border)' }}>
                                                <span style={{ fontSize: '10px', color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>SABAH <br /><span style={{ opacity: 0.6 }}>{shift.morningTime}</span></span>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {shift.morning.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Boş</span>}
                                                    {shift.morning.map((personId, i) => <li key={i}>• {getMemberName(personId)}</li>)}
                                                </ul>
                                            </div>

                                            <div style={{ padding: '12px', borderRight: '1px solid var(--color-border)' }}>
                                                <span style={{ fontSize: '10px', color: '#9cc2ff', display: 'block', marginBottom: '8px' }}>ARA VARDİYA <br /><span style={{ opacity: 0.6 }}>{shift.midTime}</span></span>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {(shift.mid || []).length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Boş</span>}
                                                    {(shift.mid || []).map((personId, i) => <li key={i}>• {getMemberName(personId)}</li>)}
                                                </ul>
                                            </div>

                                            <div style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '10px', color: '#ffb976', display: 'block', marginBottom: '8px' }}>AKŞAM <br /><span style={{ opacity: 0.6 }}>{shift.eveningTime}</span></span>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {shift.evening.length === 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Boş</span>}
                                                    {shift.evening.map((personId, i) => <li key={i}>• {getMemberName(personId)}</li>)}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* LİDER İÇİN: VARDİYAYI KAYDET VE BİLDİR BUTONU */}
                            {isLeader && (
                                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => {
                                            const myEmail = localStorage.getItem('profileEmail') || '';
                                            const newNotif = {
                                                id: Date.now(),
                                                title: 'Vardiya Güncellemesi',
                                                message: 'Haftalık shift güncellendi. Lütfen yeni vardiya planınızı kontrol ediniz.',
                                                type: 'info',
                                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                                isRead: false,
                                                sender: myEmail,
                                                target: 'team'
                                            };
                                            const existingNotifs = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
                                            localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...existingNotifs]));
                                            alert('Vardiya değişiklikleri sisteme kaydedildi ve tüm ekibe bildirim olarak gönderildi.');
                                        }}
                                        className="btn-primary"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                                    >
                                        <Send size={16} /> Değişiklikleri Kaydet ve Ekibe Bildir
                                    </button>
                                </div>
                            )}

                        </div>
                    )}

                    {/* TAB 3: Anlık Bildirim (Shot Push) Sistemi */}
                    {isLeader && activeTab === 'shot' && (
                        <div className="animate-fade-in">
                            <ShotPushUI shotTarget={shotTarget} setShotTarget={setShotTarget} />
                        </div>
                    )}

                    {/* TAB 4: Talepler / Biletler (Sadece Lider) */}
                    {isLeader && activeTab === 'tickets' && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Inbox size={20} className="text-accent" /> Ekip Talepleri ({tickets.length})
                            </h3>
                            {tickets.length === 0 ? (
                                <p className="text-secondary" style={{ textAlign: 'center', padding: '24px' }}>Henüz bir talep bulunmuyor.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} className="glass-panel" style={{ padding: '16px', borderLeft: ticket.status === 'open' ? '3px solid #ffb976' : (ticket.status === 'cancelled' ? '3px solid #ef4444' : '3px solid #4ade80') }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div>
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{ticket.timestamp}</span>
                                                    <h4 style={{ fontSize: '15px', marginTop: '4px' }}>{ticket.senderName}</h4>
                                                </div>
                                                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: ticket.status === 'open' ? 'rgba(255, 185, 118, 0.1)' : (ticket.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)'), color: ticket.status === 'open' ? '#ffb976' : (ticket.status === 'cancelled' ? '#ef4444' : '#4ade80') }}>
                                                    {ticket.status === 'open' ? 'Açık' : (ticket.status === 'cancelled' ? 'İptal Edildi' : 'Kapalı')}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>"{ticket.message}"</p>

                                            {ticket.reply && (
                                                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '2px solid var(--color-accent)', marginBottom: '16px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>Senin Yanıtın:</span>
                                                    <p style={{ fontSize: '13px', marginTop: '4px' }}>{ticket.reply}</p>
                                                </div>
                                            )}

                                            {ticket.status === 'open' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <input
                                                            id={`reply-${ticket.id}`}
                                                            placeholder={ticket.reply ? "Yanıtı güncelle..." : "Cevabınızı yazın..."}
                                                            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const replyInput = document.getElementById(`reply-${ticket.id}`);
                                                                if (replyInput && replyInput.value) {
                                                                    replyToTicket(ticket.id, replyInput.value);
                                                                    replyInput.value = '';
                                                                }
                                                            }}
                                                            className="btn-primary" style={{ padding: '0 16px', fontSize: '13px' }}
                                                        >
                                                            Yanıtla
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => closeTicket(ticket.id)}
                                                        style={{ alignSelf: 'flex-end', fontSize: '12px', color: '#ff6b6b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                                                    >
                                                        Talebi Kapat
                                                    </button>
                                                </div>
                                            )}
                                            {(ticket.status === 'closed' || ticket.status === 'cancelled') && (
                                                <button
                                                    onClick={() => deleteTicket(ticket.id)}
                                                    style={{ marginTop: '12px', fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', cursor: 'pointer', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    <Trash2 size={14} /> Talebi Sil
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 5: Yöneticiye Ulaş (Sadece Ekip Üyeleri) */}
                    {!isLeader && activeTab === 'contact' && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageSquare size={20} className="text-accent" /> Yöneticiye Ulaş
                            </h3>
                            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                                    Ekip liderinize şikayet, öneri veya taleplerinizi iletebilirsiniz. Mesajınız anında iletilecek ve yanıtlandığında bildirim alacaksınız.
                                </p>
                                <textarea
                                    value={contactMsg}
                                    onChange={(e) => setContactMsg(e.target.value)}
                                    placeholder="Mesajınızı buraya yazın..."
                                    style={{ width: '100%', height: '120px', backgroundColor: 'var(--color-surface-light)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: '16px' }}
                                />
                                <button onClick={submitTicket} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    <Send size={16} /> Mesajı Gönder
                                </button>
                            </div>

                            <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Geçmiş Taleplerim</h4>
                            {tickets.filter(t => t.senderEmail === localStorage.getItem('profileEmail')).length === 0 ? (
                                <p className="text-secondary" style={{ fontSize: '13px' }}>Daha önce gönderilmiş bir talebiniz bulunmuyor.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {tickets.filter(t => t.senderEmail === localStorage.getItem('profileEmail')).map(ticket => (
                                        <div key={ticket.id} className="glass-panel" style={{ padding: '16px', borderLeft: ticket.status === 'open' ? '3px solid #ffb976' : (ticket.status === 'cancelled' ? '3px solid #ef4444' : '3px solid #4ade80') }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{ticket.timestamp}</span>
                                                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: ticket.status === 'open' ? 'rgba(255, 185, 118, 0.1)' : (ticket.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)'), color: ticket.status === 'open' ? '#ffb976' : (ticket.status === 'cancelled' ? '#ef4444' : '#4ade80') }}>
                                                    {ticket.status === 'open' ? 'Bekliyor' : (ticket.status === 'cancelled' ? 'İptal Edildi' : 'Yanıtlandı')}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', marginBottom: ticket.reply ? '12px' : '0' }}>"{ticket.message}"</p>

                                            {ticket.reply && (
                                                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '2px solid var(--color-accent)' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>Yönetici Yanıtı:</span>
                                                    <p style={{ fontSize: '13px', marginTop: '4px' }}>{ticket.reply}</p>
                                                </div>
                                            )}

                                            {ticket.status === 'open' && (
                                                <button
                                                    onClick={() => cancelTicket(ticket.id)}
                                                    style={{ marginTop: '12px', fontSize: '12px', color: '#ffb976', background: 'transparent', border: '1px solid #ffb976', borderRadius: '4px', cursor: 'pointer', padding: '6px 12px' }}
                                                >
                                                    Talebi İptal Et
                                                </button>
                                            )}

                                            {(ticket.status === 'closed' || ticket.status === 'cancelled') && (
                                                <button
                                                    onClick={() => deleteTicket(ticket.id)}
                                                    style={{ marginTop: '12px', fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', cursor: 'pointer', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    <Trash2 size={14} /> Talebi Sil
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Rol Düzenleme Modalı */}
            {editingRoleMember && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
                        <button onClick={() => setEditingRoleMember(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Rol Düzenle</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                            {editingRoleMember.name} isimli personelin rolünü seçiniz:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    const updatedMembers = teamMembers.map(m => m.id === editingRoleMember.id ? { ...m, role: 'Barista' } : m);
                                    setTeamMembers(updatedMembers);
                                    localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));
                                    setEditingRoleMember(null);
                                }}
                                style={{ padding: '12px', borderRadius: '8px', border: editingRoleMember.role === 'Barista' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', backgroundColor: editingRoleMember.role === 'Barista' ? 'rgba(212, 175, 55, 0.1)' : 'var(--color-surface-light)', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                Barista
                            </button>
                            <button
                                onClick={() => {
                                    const updatedMembers = teamMembers.map(m => m.id === editingRoleMember.id ? { ...m, role: 'Vardiya Müdürü' } : m);
                                    setTeamMembers(updatedMembers);
                                    localStorage.setItem('doubleshot_team_members', JSON.stringify(updatedMembers));
                                    setEditingRoleMember(null);
                                }}
                                style={{ padding: '12px', borderRadius: '8px', border: editingRoleMember.role === 'Vardiya Müdürü' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', backgroundColor: editingRoleMember.role === 'Vardiya Müdürü' ? 'rgba(212, 175, 55, 0.1)' : 'var(--color-surface-light)', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                Vardiya Müdürü
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

const ShotPushUI = ({ shotTarget, setShotTarget }) => {
    const [msg, setMsg] = useState('');

    const sendPush = () => {
        if (!msg.trim()) return alert('Lütfen bir mesaj girin.');

        const newNotif = {
            id: Date.now(),
            title: shotTarget === 'active' ? 'Mesaidekilere Bildirim' : 'Genel Duyuru',
            message: msg,
            type: shotTarget === 'active' ? 'urgent' : 'info',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            sender: localStorage.getItem('profileEmail'),
            target: 'team'
        };

        const existing = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
        localStorage.setItem('doubleshot_notifications', JSON.stringify([newNotif, ...existing]));

        alert(shotTarget === 'active' ? 'Bildirim şu an aktif mesaideki kişilere başarıyla gönderildi!' : 'Bildirim genel kadrodaki tüm kişilere başarıyla genel anons olarak iletildi!');
        setMsg('');
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
                width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                color: 'var(--color-accent)'
            }}>
                <Megaphone size={28} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Shot Bildirimi Gönder</h3>
            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '20px' }}>
                {shotTarget === 'active'
                    ? 'Sadece şu an vardiyada aktif olan personellere anlık uyarı gider.'
                    : 'Tüm ekip üyelerine genel duyuru ve anons olarak iletilir.'}
            </p>

            {/* Toggle Slider */}
            <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-light)', borderRadius: '24px', padding: '4px', marginBottom: '16px', position: 'relative' }}>
                <div style={{
                    position: 'absolute', top: 4, bottom: 4, left: shotTarget === 'active' ? 4 : '50%', width: 'calc(50% - 4px)',
                    backgroundColor: 'var(--color-accent)', borderRadius: '20px', transition: 'all 0.3s ease'
                }} />
                <button
                    onClick={() => setShotTarget('active')}
                    style={{ flex: 1, padding: '8px 0', fontSize: '13px', fontWeight: 'bold', zIndex: 1, color: shotTarget === 'active' ? '#000' : 'var(--color-text-secondary)', transition: 'color 0.3s ease' }}
                >
                    Mesaidekiler
                </button>
                <button
                    onClick={() => setShotTarget('all')}
                    style={{ flex: 1, padding: '8px 0', fontSize: '13px', fontWeight: 'bold', zIndex: 1, color: shotTarget === 'all' ? '#000' : 'var(--color-text-secondary)', transition: 'color 0.3s ease' }}
                >
                    Tüm Ekip
                </button>
            </div>

            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder={shotTarget === 'active' ? "Ekibe acil mesaj..." : "Tüm ekibe duyuru..."}
                style={{
                    width: '100%', height: '100px', backgroundColor: 'var(--color-surface-light)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                    padding: '12px', color: '#fff', fontFamily: 'inherit', fontSize: '14px',
                    resize: 'none', outline: 'none', marginBottom: '16px'
                }}
            />

            <button className="btn-primary" style={{ width: '100%' }} onClick={sendPush}>
                <Send size={18} /> {shotTarget === 'active' ? 'Gönder' : 'Anons Geç'}
            </button>
        </div>
    );
};
