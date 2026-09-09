// Konfigurasi Utama Kartu Ulang Tahun (Birthday Card Configuration)
// Dikelola langsung di dalam kode — tidak perlu setting environment variable manual

export interface BirthdayCardSettings {
  // Nama yang menerima kartu ucapan
  recipientName: string;

  // Nama pengirim kartu
  senderName: string;

  // Tanda tangan & salam penutup dari pengirim
  senderSignature: string;

  // Judul besar pada layar awal (Cover Screen)
  coverTitle: string;

  // Judul pada kartu surat (Letter Card)
  letterTitle: string;

  // Tanggal target ulang tahun (Format 'YYYY-MM-DDTHH:mm:ss' atau kosongkan "" untuk countdown otomatis 5 menit)
  birthdayDate: string;

  // Paragraf pesan yang disampaikan dalam surat ucapan
  letterParagraphs: string[];
}

export const BIRTHDAY_CONFIG: BirthdayCardSettings = {
  // 1. Nama Penerima
  recipientName: 'Alex',

  // 2. Nama Pengirim
  senderName: 'Silvio',

  // 3. Tanda Tangan / Penutup Surat
  senderSignature: 'With warmest wishes and hugs',

  // 4. Judul Halaman Depan (Cover)
  coverTitle: "It's Your Day!",

  // 5. Judul Halaman Surat
  letterTitle: 'Happy Birthday! 🎂',

  // 6. Tanggal Target Ulang Tahun (kosongkan untuk default countdown 5 menit)
  birthdayDate: '',

  // 7. Pesan & Isi Paragraf Surat
  letterParagraphs: [
    'On this special milestone of your journey around the sun, may today bring you genuine peace, countless reasons to smile, and the warmest celebrations with the people who cherish you most.',
    'Looking back at everything you have accomplished and conquered over this past year, your kindness, resilience, and bright energy continue to inspire everyone lucky enough to cross your path.',
    'May your coming year be abundant with exciting adventures, creative breakthroughs, good health, and all the little everyday joys that make life sweet and deeply memorable.',
    'Take this day to slow down, soak in the love around you, make your biggest wishes, and treat yourself to the fullest.',
    'Here is to another chapter filled with laughter that makes your stomach hurt, wonderful surprises, and dreams coming true one after another. Happy Birthday!'
  ]
};
