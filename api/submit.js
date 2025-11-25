const mongoose = require('mongoose');

// Veritabanı Şeması (Database'de nasıl görünecek)
const CevapSchema = new mongoose.Schema({
  isim: String,
  memleket: String,
  yemek: String,
  oncelik: String,
  not: String,
  tarih: { type: Date, default: Date.now }
});

let isConnected = false;

// Bağlantı Fonksiyonu
const connectToDB = async () => {
  if (isConnected) return;
  
  // MONGODB_URI'yi Vercel Ayarlarından çekecek
  if (!process.env.MONGODB_URI) {
    throw new Error('Veritabanı bağlantı adresi (URI) bulunamadı!');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

const Cevap = mongoose.models.Cevap || mongoose.model('Cevap', CevapSchema);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDB();
      
      // Gelen veriyi kaydet
      const yeniCevap = new Cevap(req.body);
      await yeniCevap.save();

      res.status(200).json({ message: 'Kayıt Başarılı' });
    } catch (error) {
      console.error("DB Hatası:", error);
      res.status(500).json({ error: 'Sunucu Hatası' });
    }
  } else {
    res.status(405).json({ message: 'Sadece POST isteği kabul edilir' });
  }
}