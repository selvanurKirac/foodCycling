# FoodCycling 🌟

**FoodCycling**, restoranlardaki gün sonu fazla yemeklerin israf edilmesini önlemek ve gıda güvencesizliği yaşayan kişilere ya da hayvan barınaklarına ulaştırılmasını sağlamak amacıyla geliştirilmiş gerçek zamanlı (real-time) bir web platformudur. **Manisa Celal Bayar Üniversitesi** bitirme projesi kapsamında geliştirilmiştir.

---

## 🎯 Projenin Amacı ve Teknik Döngüsü

Proje, Birleşmiş Milletler'in **"Sıfır Açlık" (Zero Hunger)** sürdürülebilirlik hedefini destekler. Sistem, yemeklerin durumuna göre kod seviyesinde otomatik olarak **3 aşamalı bir döngü** yürütür:

1. **İnsan Tüketimi Aşaması:** Restoranlar fazla yemekleri sisteme yükler. Misafirler veya kayıtlı kullanıcılar kendilerine en yakın yemekleri porsiyon bazlı rezerve eder.
2. **Hayvan Tüketimi Aşaması (`CategoryPage` Kontrolü):** Son tüketim tarihi (`food_date`) geçen gıdalar, `CategoryPage` üzerindeki dinamik kontrol mekanizmasıyla otomatik olarak algılanır ve Firestore üzerinde `category_id` değeri **"hayvanlar"** kategorisine güncellenir.
3. **İmha Aşaması:** Bozulma tarihi (`expire_date`) geçen ve artık tüketime uygun olmayan yemeklerin durumu otomatik olarak **"expired"** yapılır ve aktif listelerden tamamen filtrelenir.

---

## 👥 Akıllı Rol Yönetimi ve Otomatik Yönlendirme

Uygulamada `AuthContext` mimarisi ve Firebase Authentication altyapısı kullanılarak rol tabanlı bir erişim kontrolü (RBAC) sağlanmıştır:

* **Misafir Kullanıcılar:** Giriş yapmadan `Home` ekranındaki genel gıda listesini inceleyebilir ve kategorileri gezebilir. Rezervasyon yapmaya çalıştıklarında otomatik olarak giriş sayfasına yönlendirilirler.
* **Kullanıcılar (İhtiyaç Sahipleri):** Giriş yaptıkları anda veya `Home` sayfasındayken otomatik olarak `/user` paneline yönlendirilirler. Stok sınırları dahilinde porsiyon seçerek rezervasyon oluşturabilirler.
* **Restoranlar:** Giriş yaptıklarında otomatik olarak `/restaurants/:restaurant_id` sayfasına yönlendirilirler. Yetkisiz kullanıcıların bu panellere erişimi engellenmiştir.

---

## ✨ Öne Çıkan Gelişmiş Özellikler

### 📊 Sekmeli Rezervasyon Kontrol Sistemi (`ReservationInfo`)
Restoranlar, kendilerine yapılan gıda rezervasyonlarını tek bir ekrandan sekmeli arayüz yardımıyla yönetir:
* **Hepsi / Sonraki Aşama / İptal Edilenler / Tamamlananlar** filtreleri canlı olarak çalışır.
* İhtiyaç sahibi yemeği teslim almaya geldiğinde restoran **"Onayla"** butonuna basarak rezervasyon durumunu tek tıkla Firestore üzerinde `completed` haline getirir.

### 🔄 Canlı Veri Senkronizasyonu (Real-Time UI)
`ShowAllProducts`, `MyProducts` ve `ReservationInfo` bileşenlerinde Firestore `onSnapshot` dinleyicileri kullanılmıştır. Bu sayede:
* Bir kullanıcı rezervasyon yaptığında, restoranın panelindeki rezervasyon tablosu sayfa yenilenmeden anında güncellenir.
* Stoğu tükenen (status: unavailable) veya iptal edilen ürünler anlık olarak arayüzde listelenir veya listeden düşer.

---

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React.js, Vite, React Router (SPA)
* **Backend & Veritabanı:** Firebase Firestore (NoSQL mimarisi)
* **Kimlik Doğrulama:** Firebase Authentication (Güvenli oturum ve token yönetimi)
* **Durum Yönetimi (State):** 
  * `AuthContext`: Giriş yapan `uid` değerini `restaurants` ve `users` koleksiyonlarında sorgulayarak kullanıcının kimliğini ve rolünü belirler.
  * `ProductContext`: Merkezi gıda verilerini ve ID tabanlı ürün çekme işlemlerini yönetir.


