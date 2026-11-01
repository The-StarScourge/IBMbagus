/* ═══════════════════════════════════════════════════════════════════
   SiAkad Buddy — script.js
   Vanilla JS RAG-style chatbot (no framework, no CDN, no backend)
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════════
   SECTION 1 — KNOWLEDGE BASE
   ─────────────────────────────────────────────────────────────────
   CATATAN: Isi di bawah adalah CONTOH aturan akademik generik.
   Ganti atau tambahkan entri sesuai pedoman akademik kampus Anda.
   Setiap entri memiliki:
     judul  : nama topik (tampil di sidebar)
     tanya  : contoh pertanyaan (diisi ke input saat topik diklik)
     kata   : kata kunci relevan (bobot lebih tinggi saat pencarian)
     ringkas: kalimat pembuka jawaban
     langkah: array string — setiap item satu langkah/poin
     sumber : referensi bab/pasal dari pedoman
   ══════════════════════════════════════════════════════════════════ */
const KNOWLEDGE_BASE = [
  {
    id: 'masa-studi-s1',
    judul: 'Masa Studi S1',
    tanya: 'Berapa batas maksimal masa studi untuk program S1?',
    kata:  ['masa studi', 'batas studi', 's1', 'sarjana', 'semester', 'maksimal', 'lama kuliah', 'drop out', 'do'],
    ringkas: 'Program Sarjana (S1) memiliki beban studi minimal 144 SKS dengan masa studi normal 4 tahun (8 semester) dan batas maksimal 7 tahun (14 semester).',
    langkah: [
      'Masa studi normal S1 adalah 8 semester (4 tahun).',
      'Batas maksimal masa studi adalah 14 semester (7 tahun), termasuk cuti akademik.',
      'Mahasiswa yang melampaui batas 14 semester akan dikenai evaluasi dan dapat dikeluarkan (DO).',
      'Evaluasi awal dilakukan pada akhir semester 4: minimal 30 SKS dengan IPK ≥ 2,00.',
      'Evaluasi akhir dilakukan pada akhir semester 8: minimal 75 SKS dengan IPK ≥ 2,00.',
    ],
    sumber: 'Pedoman Akademik — Bab III Pasal 8: Masa dan Beban Studi',
  },
  {
    id: 'krs',
    judul: 'Pengisian KRS',
    tanya: 'Bagaimana prosedur dan batas waktu pengisian KRS?',
    kata:  ['krs', 'kartu rencana studi', 'pengisian', 'registrasi', 'mata kuliah', 'dosen wali', 'perwalian', 'semester'],
    ringkas: 'Kartu Rencana Studi (KRS) wajib diisi setiap awal semester melalui sistem informasi akademik (SIAK) dalam periode yang ditetapkan kalender akademik.',
    langkah: [
      'Lunasi seluruh kewajiban administrasi keuangan sebelum periode KRS dibuka.',
      'Login ke SIAK menggunakan NIM dan password akun mahasiswa.',
      'Konsultasikan rencana mata kuliah dengan Dosen Pembimbing Akademik (DPA).',
      'Pilih dan input mata kuliah sesuai kurikulum; perhatikan prasyarat tiap mata kuliah.',
      'DPA melakukan persetujuan (approval) KRS secara online.',
      'Cetak atau simpan KRS yang telah disetujui sebagai bukti resmi.',
      'Batas waktu pengisian mengikuti kalender akademik yang ditetapkan oleh universitas.',
    ],
    sumber: 'Pedoman Akademik — Bab IV Pasal 12: Prosedur Pengisian KRS',
  },
  {
    id: 'perubahan-krs',
    judul: 'Perubahan KRS (KPRS)',
    tanya: 'Apakah saya bisa menambah atau mengganti mata kuliah setelah KRS disetujui?',
    kata:  ['perubahan krs', 'kprs', 'tambah', 'batal', 'ganti', 'mata kuliah', 'revisi', 'ubah krs'],
    ringkas: 'Perubahan KRS (KPRS) dapat dilakukan dalam periode satu minggu setelah perkuliahan dimulai, sesuai kalender akademik.',
    langkah: [
      'Buka fitur KPRS di SIAK dalam periode yang ditentukan (biasanya minggu pertama kuliah).',
      'Mahasiswa dapat menambah, mengganti, atau membatalkan mata kuliah.',
      'Perubahan tetap memerlukan persetujuan Dosen Pembimbing Akademik.',
      'Setelah periode KPRS berakhir, tidak ada perubahan yang dapat dilakukan.',
      'Pembatalan mata kuliah setelah periode KPRS tidak menghilangkan nilai "K" (kosong) di transkrip.',
    ],
    sumber: 'Pedoman Akademik — Bab IV Pasal 13: Perubahan KRS',
  },
  {
    id: 'cuti-akademik',
    judul: 'Cuti Akademik',
    tanya: 'Bagaimana prosedur pengajuan cuti akademik?',
    kata:  ['cuti', 'cuti akademik', 'istirahat kuliah', 'cuti studi', 'izin tidak kuliah', 'stop out'],
    ringkas: 'Cuti akademik adalah penghentian kegiatan perkuliahan sementara yang diizinkan universitas atas permohonan mahasiswa, dengan durasi maksimal 2 semester berturut-turut (4 semester kumulatif).',
    langkah: [
      'Ajukan permohonan cuti secara tertulis ke Biro Akademik sebelum periode KRS berakhir.',
      'Lampirkan dokumen pendukung (alasan sakit: surat dokter; alasan keuangan: surat keterangan).',
      'Dapatkan persetujuan dari Dosen Pembimbing Akademik dan Ketua Program Studi.',
      'Bayar biaya administrasi cuti sesuai ketentuan yang berlaku.',
      'Mahasiswa cuti tidak dihitung dalam evaluasi studi, namun masa cuti dihitung dalam batas 14 semester.',
      'Ajukan aktivasi kembali ke SIAK sebelum semester berikutnya dimulai.',
    ],
    sumber: 'Pedoman Akademik — Bab V Pasal 18: Cuti Akademik',
  },
  {
    id: 'syarat-skripsi',
    judul: 'Syarat Pengajuan Skripsi',
    tanya: 'Apa saja syarat mahasiswa boleh mengajukan skripsi atau tugas akhir?',
    kata:  ['skripsi', 'tugas akhir', 'ta', 'pengajuan', 'syarat', 'prasyarat', 'sks', 'ipk', 'proposal'],
    ringkas: 'Mahasiswa dapat mengajukan skripsi/tugas akhir setelah memenuhi persyaratan akademik dan administratif yang telah ditetapkan.',
    langkah: [
      'Telah menempuh minimal 120 SKS dari total kurikulum.',
      'Nilai Indeks Prestasi Kumulatif (IPK) minimal 2,00.',
      'Telah lulus seluruh mata kuliah prasyarat yang ditetapkan program studi.',
      'Tidak memiliki nilai D atau E untuk mata kuliah inti (mata kuliah mayor).',
      'Mengisi formulir pengajuan skripsi di Biro Akademik atau SIAK.',
      'Mendapatkan persetujuan dari Program Studi dan penunjukan Dosen Pembimbing.',
      'Mengajukan proposal skripsi yang disetujui dalam sidang proposal (jika diwajibkan prodi).',
    ],
    sumber: 'Pedoman Akademik — Bab VII Pasal 25: Persyaratan Tugas Akhir',
  },
  {
    id: 'sidang-skripsi',
    judul: 'Pendaftaran Sidang Skripsi',
    tanya: 'Bagaimana cara mendaftar sidang skripsi dan apa syaratnya?',
    kata:  ['sidang', 'ujian skripsi', 'ujian ta', 'pendaftaran sidang', 'ujian akhir', 'daftar sidang', 'seminar hasil'],
    ringkas: 'Pendaftaran sidang skripsi dilakukan setelah naskah skripsi dinyatakan siap oleh Dosen Pembimbing.',
    langkah: [
      'Naskah skripsi disetujui dan ditandatangani oleh seluruh Dosen Pembimbing.',
      'Serahkan naskah ke Program Studi minimal 7 hari kerja sebelum sidang.',
      'Tidak memiliki tunggakan keuangan.',
      'Telah lulus seluruh mata kuliah (SKS sudah terpenuhi).',
      'Mendaftarkan diri ke Biro Akademik dengan mengisi formulir sidang dan menyertakan bukti persetujuan pembimbing.',
      'Jadwal sidang ditentukan oleh Program Studi.',
    ],
    sumber: 'Pedoman Akademik — Bab VII Pasal 27: Pendaftaran Ujian Skripsi',
  },
  {
    id: 'yudisium',
    judul: 'Yudisium dan Kelulusan',
    tanya: 'Apa itu yudisium dan kapan saya bisa mendaftar yudisium?',
    kata:  ['yudisium', 'kelulusan', 'lulus', 'dinyatakan lulus', 'wisuda', 'gelar', 'predikat kelulusan', 'cumlaude'],
    ringkas: 'Yudisium adalah penetapan kelulusan mahasiswa secara resmi oleh universitas setelah mahasiswa memenuhi seluruh kewajiban akademik.',
    langkah: [
      'Lulus sidang skripsi/tugas akhir dengan nilai minimal B.',
      'Menyelesaikan seluruh kewajiban SKS sesuai kurikulum (umumnya 144 SKS untuk S1).',
      'Tidak ada nilai E dan nilai D tidak melebihi 10% total SKS.',
      'Menyelesaikan seluruh kewajiban administratif dan keuangan.',
      'Mengumpulkan naskah skripsi final (hardcover) dan file digital ke perpustakaan.',
      'Mendaftarkan diri ke Biro Akademik untuk dimasukkan dalam periode yudisium.',
    ],
    sumber: 'Pedoman Akademik — Bab VIII Pasal 30: Yudisium',
  },
  {
    id: 'wisuda',
    judul: 'Syarat Wisuda',
    tanya: 'Apa saja syarat untuk mendaftar wisuda?',
    kata:  ['wisuda', 'upacara wisuda', 'daftar wisuda', 'syarat wisuda', 'toga', 'kelulusan'],
    ringkas: 'Mahasiswa yang telah diyudisium dapat mendaftar wisuda pada periode yang ditetapkan universitas.',
    langkah: [
      'Telah dinyatakan lulus melalui proses yudisium.',
      'Mengisi formulir pendaftaran wisuda secara online.',
      'Menyerahkan pas foto terbaru sesuai ketentuan (biasanya berlatar merah/biru, jaket almamater).',
      'Melunasi biaya wisuda dan seluruh kewajiban keuangan.',
      'Menyerahkan kartu bebas pustaka dari perpustakaan.',
      'Mengikuti gladi resik (technical rehearsal) sesuai jadwal yang ditentukan.',
    ],
    sumber: 'Pedoman Akademik — Bab VIII Pasal 32: Wisuda',
  },
  {
    id: 'nilai-kelulusan',
    judul: 'Nilai Minimum Kelulusan',
    tanya: 'Berapa nilai minimum agar dinyatakan lulus suatu mata kuliah?',
    kata:  ['nilai', 'nilai minimum', 'lulus mata kuliah', 'huruf mutu', 'grade', 'angka mutu', 'e', 'd', 'c', 'remediasi'],
    ringkas: 'Kelulusan mata kuliah ditentukan oleh nilai huruf mutu minimum yang ditetapkan program studi, umumnya minimal C.',
    langkah: [
      'Skala nilai: A (4,00), A- (3,75), B+ (3,25), B (3,00), B- (2,75), C+ (2,25), C (2,00), D (1,00), E (0,00).',
      'Nilai minimum lulus mata kuliah umumnya adalah C (2,00).',
      'Nilai D: tidak lulus, tetapi SKS tetap dihitung dalam beban studi.',
      'Nilai E: tidak lulus, SKS tidak dihitung, wajib mengulang.',
      'Mata kuliah dengan nilai D wajib diulang jika merupakan mata kuliah prasyarat dengan nilai minimum B.',
      'Batas maksimal nilai D adalah 10% dari total SKS untuk syarat kelulusan.',
    ],
    sumber: 'Pedoman Akademik — Bab VI Pasal 21: Penilaian dan Huruf Mutu',
  },
  {
    id: 'evaluasi-do',
    judul: 'Indeks Prestasi dan Evaluasi DO',
    tanya: 'Kapan mahasiswa bisa dikeluarkan (DO) karena IPK rendah?',
    kata:  ['ipk', 'indeks prestasi', 'do', 'drop out', 'evaluasi', 'dikeluarkan', 'pemutusan studi', 'ips', 'ip rendah'],
    ringkas: 'Evaluasi studi dilakukan secara berkala. Mahasiswa yang tidak memenuhi standar minimal dapat dikenai pemutusan studi (DO).',
    langkah: [
      'Evaluasi I (akhir semester 4): wajib lulus minimal 30 SKS dengan IPK ≥ 2,00.',
      'Evaluasi II (akhir semester 8): wajib lulus minimal 75 SKS dengan IPK ≥ 2,00.',
      'Mahasiswa yang tidak memenuhi salah satu syarat di atas akan mendapat surat peringatan.',
      'Jika tidak ada perbaikan dalam 1 semester berikutnya, universitas berwenang memutuskan studi.',
      'IPK di bawah 2,00 selama 2 semester berturut-turut juga menjadi dasar evaluasi.',
      'Mahasiswa yang mendekati batas DO disarankan menemui DPA dan Biro Akademik untuk konsultasi.',
    ],
    sumber: 'Pedoman Akademik — Bab V Pasal 19: Evaluasi dan Pemutusan Studi',
  },
  {
    id: 'beasiswa',
    judul: 'Beasiswa — Syarat Umum',
    tanya: 'Apa saja syarat umum untuk mendapatkan beasiswa di kampus?',
    kata:  ['beasiswa', 'scholarship', 'bantuan biaya', 'bidikmisi', 'kip kuliah', 'prestasi', 'syarat beasiswa'],
    ringkas: 'Universitas menyediakan beberapa jalur beasiswa berdasarkan prestasi akademik dan/atau kondisi ekonomi mahasiswa.',
    langkah: [
      'Tercatat sebagai mahasiswa aktif (tidak sedang cuti akademik).',
      'IPK minimal 3,00 (untuk beasiswa prestasi) atau sesuai ketentuan beasiswa yang dilamar.',
      'Tidak sedang menerima beasiswa lain dari sumber yang sama (kecuali diizinkan).',
      'Mengisi formulir permohonan beasiswa di Biro Kemahasiswaan.',
      'Melampirkan dokumen pendukung: transkrip nilai, surat keterangan tidak mampu (jika beasiswa ekonomi), atau sertifikat prestasi.',
      'Seleksi dilakukan oleh komite beasiswa universitas.',
      'Penerima beasiswa wajib mempertahankan IPK minimal yang disyaratkan selama menerima beasiswa.',
    ],
    sumber: 'Pedoman Akademik — Bab X Pasal 38: Beasiswa dan Bantuan Pendidikan',
  },
  {
    id: 'alih-kredit',
    judul: 'Alih Kredit / Transfer Mata Kuliah',
    tanya: 'Bagaimana proses alih kredit untuk mahasiswa pindahan atau dari kampus lain?',
    kata:  ['alih kredit', 'transfer kredit', 'pindahan', 'mahasiswa pindah', 'konversi', 'ekuivalensi', 'mata kuliah transfer'],
    ringkas: 'Alih kredit adalah pengakuan mata kuliah yang telah ditempuh di perguruan tinggi lain atau program lain, setelah melalui proses evaluasi.',
    langkah: [
      'Mahasiswa mengajukan permohonan alih kredit ke Program Studi disertai transkrip nilai resmi dari institusi asal.',
      'Program Studi mengevaluasi kesesuaian isi (silabus) mata kuliah dengan mata kuliah yang ada.',
      'Mata kuliah yang diekuivalensikan minimal memiliki kemiripan 70% materi.',
      'Nilai yang diakui minimal C dari institusi asal.',
      'Hasil evaluasi ditetapkan oleh Ketua Program Studi dan dilaporkan ke Biro Akademik.',
      'Maksimal 50% dari total SKS dapat berasal dari alih kredit (kecuali tugas akhir wajib ditempuh di universitas ini).',
    ],
    sumber: 'Pedoman Akademik — Bab IV Pasal 15: Alih Kredit',
  },
  {
    id: 'dosen-wali',
    judul: 'Dosen Pembimbing Akademik (DPA)',
    tanya: 'Apa peran dosen wali dan kapan saya harus menemui DPA?',
    kata:  ['dosen wali', 'dpa', 'pembimbing akademik', 'perwalian', 'konsultasi akademik', 'bimbingan'],
    ringkas: 'Dosen Pembimbing Akademik (DPA) adalah dosen yang ditunjuk untuk membimbing dan memantau perkembangan studi mahasiswa.',
    langkah: [
      'Setiap mahasiswa mendapatkan DPA yang ditetapkan oleh Program Studi.',
      'Mahasiswa wajib menemui DPA minimal satu kali per semester, terutama saat pengisian KRS.',
      'DPA berwenang menyetujui atau menolak rencana studi mahasiswa.',
      'Konsultasikan permasalahan akademik (nilai rendah, rencana cuti, pindah prodi) dengan DPA terlebih dahulu.',
      'Temui DPA juga jika mendapat surat peringatan akademik.',
      'Hubungi DPA melalui saluran resmi (email kampus atau sistem perwalian online).',
    ],
    sumber: 'Pedoman Akademik — Bab II Pasal 6: Dosen Pembimbing Akademik',
  },
  {
    id: 'sanksi-akademik',
    judul: 'Sanksi Akademik',
    tanya: 'Apa saja bentuk sanksi akademik yang bisa diberikan kepada mahasiswa?',
    kata:  ['sanksi', 'pelanggaran', 'kecurangan', 'plagiarisme', 'plagiat', 'mencontek', 'menyontek', 'hukuman', 'skorsing'],
    ringkas: 'Universitas menerapkan sanksi akademik bagi mahasiswa yang melanggar peraturan, mulai dari teguran hingga pemecatan.',
    langkah: [
      'Teguran lisan atau tertulis: untuk pelanggaran ringan pertama kali.',
      'Pengurangan nilai atau nilai E pada mata kuliah terkait: untuk kecurangan dalam ujian atau tugas.',
      'Pembatalan hasil ujian semester: untuk kecurangan yang terstruktur.',
      'Skorsing (tidak boleh kuliah 1–2 semester): untuk pelanggaran berat.',
      'Pemecatan (pemutusan studi): untuk pelanggaran sangat berat seperti plagiarisme tugas akhir atau tindak pidana.',
      'Proses sanksi melalui sidang komite integritas akademik dan mahasiswa berhak membela diri.',
    ],
    sumber: 'Pedoman Akademik — Bab IX Pasal 35: Sanksi Akademik',
  },
];

/* ══════════════════════════════════════════════════════════════════
   SECTION 2 — RETRIEVAL ENGINE CONFIGURATION
   ══════════════════════════════════════════════════════════════════ */

/** Minimum relevance score (0–1 scale) for an answer to be shown */
const RELEVANCE_THRESHOLD = 0.08;

/** Boost multiplier for matches in judul and kata fields */
const TITLE_BOOST  = 3.0;
const KEYWORD_BOOST = 2.5;

/** Ambiguity detection: if top-2 scores are within this ratio, ask for clarification */
const AMBIGUITY_RATIO = 0.15;

/** Stopwords — common Indonesian words to ignore during tokenisation */
const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'adalah', 'ada', 'atau',
  'jika', 'untuk', 'dengan', 'pada', 'dalam', 'tidak', 'akan', 'saya', 'anda',
  'bisa', 'boleh', 'apakah', 'bagaimana', 'apa', 'berapa', 'kapan', 'siapa',
  'sudah', 'telah', 'harus', 'perlu', 'ingin', 'mau', 'juga', 'tapi', 'tetapi',
  'karena', 'oleh', 'maka', 'sehingga', 'ketika', 'setelah', 'sebelum', 'hingga',
  'sampai', 'agar', 'supaya', 'seperti', 'lebih', 'banyak', 'sangat', 'sudah',
  'saat', 'kalau', 'tentang', 'hal', 'cara', 'baru', 'lagi', 'jadi', 'ke',
  'nya', 'pun', 'lah', 'kah', 'sih', 'dong', 'ya', 'nih', 'tuh', 'deh',
  'mohon', 'tolong', 'bantu', 'jelaskan', 'ceritakan', 'terimakasih', 'terima',
  'kasih', 'halo', 'hai', 'hey', 'selamat', 'pagi', 'siang', 'malam',
]);

/** Injection / prompt-override patterns */
const INJECTION_PATTERNS = [
  /\babaikan\b/i,
  /\bignore\b/i,
  /\bforget\b/i,
  /\bpretend\b/i,
  /\blupakan\b/i,
  /\bpura[-\s]pura\b/i,
  /\bseolah\b/i,
  /\bseakan\b/i,
  /\boverride\b/i,
  /\bjailbreak\b/i,
  /\bact as\b/i,
  /\byou are now\b/i,
  /\bsystem prompt\b/i,
  /\binstruksi baru\b/i,
  /\bubah aturan\b/i,
  /\bganti aturan\b/i,
  /\bhapus aturan\b/i,
  /\bperintah sebelumnya\b/i,
  /\bprevious instruction\b/i,
  /\bDAN\b/,            // "Do Anything Now" jailbreak
];

/** Topics clearly outside academic domain */
const OFF_TOPIC_PATTERNS = [
  /\b(resep|masak|makan|minum)\b/i,
  /\b(cuaca|weather|ramalan)\b/i,
  /\b(olahraga|sepak\s*bola|basket|futsal)\b/i,
  /\b(film|musik|lagu|artis|drakor|drama)\b/i,
  /\b(pacaran|cinta|galau|putus)\b/i,
  /\b(politik|pilkada|pemerintah)\b/i,
  /\b(bitcoin|kripto|saham|investasi)\b/i,
  /\b(game|gaming|esport)\b/i,
  /\b(belanja|online\s*shop|shopee|tokopedia)\b/i,
];

/** Academic keyword hints — at least one must match to avoid off-topic rejection */
const ACADEMIC_HINTS = [
  'krs', 'mata kuliah', 'semester', 'ipk', 'sks', 'skripsi', 'tugas akhir',
  'wisuda', 'yudisium', 'cuti', 'beasiswa', 'nilai', 'mahasiswa', 'kuliah',
  'kampus', 'universitas', 'akademik', 'sidang', 'dpa', 'dosen', 'prodi',
  'program studi', 'biro', 'studi', 'lulus', 'kelulusan', 'do', 'masa studi',
  'transfer', 'alih kredit', 'perwalian', 'wali', 'sanksi', 'plagiat', 'evaluasi',
];

/* ══════════════════════════════════════════════════════════════════
   SECTION 3 — TOKENISATION & INDEXING
   ══════════════════════════════════════════════════════════════════ */

/**
 * Tokenise a string: lowercase, strip punctuation, split on whitespace,
 * filter out stopwords and tokens shorter than 2 characters.
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t));
}

/**
 * Build a pre-computed document corpus for TF-IDF scoring.
 * Weights: title tokens × TITLE_BOOST, keyword tokens × KEYWORD_BOOST, body × 1.
 * Returns { idf: Map<token, number>, docFreqs: Map<docId, Map<token, number>> }
 */
function buildIndex() {
  const docFreqs = new Map();   // docId → Map(token → weighted count)
  const docCount = new Map();   // token → number of docs containing it

  KNOWLEDGE_BASE.forEach(doc => {
    const freq = new Map();

    // Body tokens (ringkas + all langkah joined)
    const bodyText = doc.ringkas + ' ' + doc.langkah.join(' ') + ' ' + doc.sumber;
    tokenize(bodyText).forEach(t => freq.set(t, (freq.get(t) || 0) + 1));

    // Title tokens with boost
    tokenize(doc.judul).forEach(t => freq.set(t, (freq.get(t) || 0) + TITLE_BOOST));

    // Keyword tokens with boost
    doc.kata.forEach(kw => {
      tokenize(kw).forEach(t => freq.set(t, (freq.get(t) || 0) + KEYWORD_BOOST));
    });

    docFreqs.set(doc.id, freq);

    // Count document frequency for IDF
    freq.forEach((_, t) => docCount.set(t, (docCount.get(t) || 0) + 1));
  });

  // Compute IDF: log(N / df) + 1
  const N = KNOWLEDGE_BASE.length;
  const idf = new Map();
  docCount.forEach((df, t) => idf.set(t, Math.log(N / df) + 1));

  return { idf, docFreqs };
}

/** Global index — built once on load */
const INDEX = buildIndex();

/* ══════════════════════════════════════════════════════════════════
   SECTION 4 — SEARCH
   ══════════════════════════════════════════════════════════════════ */

/**
 * Score a single document against a query token list using TF-IDF.
 * @param {string[]} queryTokens
 * @param {string} docId
 * @returns {number} raw score
 */
function scoreDocument(queryTokens, docId) {
  const freq = INDEX.docFreqs.get(docId);
  if (!freq) return 0;

  // Max frequency in this document (for TF normalisation)
  const maxFreq = Math.max(...freq.values(), 1);

  return queryTokens.reduce((score, t) => {
    const tf = (freq.get(t) || 0) / maxFreq;
    const idf = INDEX.idf.get(t) || 0;
    return score + tf * idf;
  }, 0);
}

/**
 * Search the knowledge base for the best matching documents.
 * @param {string} query
 * @returns {{ results: Array<{doc, score}>, queryTokens: string[] }}
 */
function search(query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return { results: [], queryTokens };

  const scored = KNOWLEDGE_BASE.map(doc => ({
    doc,
    score: scoreDocument(queryTokens, doc.id),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Normalise to 0–1 range
  const maxScore = scored[0].score || 1;
  const results = scored.map(r => ({ doc: r.doc, score: r.score / maxScore }));

  return { results, queryTokens };
}

/* ══════════════════════════════════════════════════════════════════
   SECTION 5 — GUARDRAILS
   ══════════════════════════════════════════════════════════════════ */

/**
 * Detect prompt injection / rule-override attempts.
 * @param {string} text
 * @returns {boolean}
 */
function detectInjection(text) {
  return INJECTION_PATTERNS.some(p => p.test(text));
}

/**
 * Detect queries clearly outside the academic domain.
 * Returns true only if query has NO academic hints AND matches an off-topic pattern.
 * @param {string} text
 * @returns {boolean}
 */
function detectOffTopic(text) {
  const lower = text.toLowerCase();
  const hasAcademicHint = ACADEMIC_HINTS.some(h => lower.includes(h));
  if (hasAcademicHint) return false;
  return OFF_TOPIC_PATTERNS.some(p => p.test(text));
}

/**
 * Detect if user appears to share personal data (NIM/phone: ≥8 consecutive digits).
 * @param {string} text
 * @returns {boolean}
 */
function detectPersonalData(text) {
  return /\d{8,}/.test(text);
}

/**
 * Detect if query touches on a personal situation (using first-person + numeric/status).
 * @param {string} text
 * @returns {boolean}
 */
function detectPersonalCase(text) {
  const lower = text.toLowerCase();
  const firstPerson = /\b(saya|aku|gue|gw|kami|kita)\b/.test(lower);
  const personalStatus = /\b(ipk|nilai|semester|sks)\s*(saya|ku|ku)?\s*[\d,]+/.test(lower) ||
    /[\d,]+\s*(ipk|sks|semester)/.test(lower);
  return firstPerson && personalStatus;
}

/**
 * Detect ambiguity: top-2 scores are very close to each other.
 * @param {Array<{doc, score}>} results
 * @returns {boolean}
 */
function detectAmbiguous(results) {
  if (results.length < 2) return false;
  if (results[0].score < RELEVANCE_THRESHOLD) return false;
  const gap = results[0].score - results[1].score;
  return gap / results[0].score < AMBIGUITY_RATIO;
}

/* ══════════════════════════════════════════════════════════════════
   SECTION 6 — RESPONSE BUILDERS (DOM — no innerHTML on user data)
   ══════════════════════════════════════════════════════════════════ */

/**
 * Build a complete answer fragment for a matched document.
 * @param {object} doc — KNOWLEDGE_BASE entry
 * @param {Array<{doc, score}>} allResults — for related topics
 * @returns {DocumentFragment}
 */
function buildAnswer(doc, allResults) {
  const frag = document.createDocumentFragment();

  // Summary sentence
  const summary = document.createElement('p');
  summary.className = 'answer-summary';
  summary.textContent = doc.ringkas;
  frag.appendChild(summary);

  // Numbered steps
  if (doc.langkah && doc.langkah.length > 0) {
    const ol = document.createElement('ol');
    ol.className = 'answer-steps';
    doc.langkah.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    frag.appendChild(ol);
  }

  // Source badge
  const source = document.createElement('span');
  source.className = 'answer-source';
  source.textContent = '📄 Sumber: ' + doc.sumber;
  frag.appendChild(source);

  // Related topics (top-3 excluding current)
  const related = allResults
    .filter(r => r.doc.id !== doc.id && r.score >= RELEVANCE_THRESHOLD * 0.5)
    .slice(0, 3);

  if (related.length > 0) {
    const relLabel = document.createElement('p');
    relLabel.className = 'related-label';
    relLabel.textContent = 'Lihat juga:';
    frag.appendChild(relLabel);

    const relButtons = document.createElement('div');
    relButtons.className = 'related-buttons';
    related.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'related-btn';
      btn.type = 'button';
      btn.textContent = r.doc.judul;
      btn.addEventListener('click', () => handleTopicClick(r.doc));
      relButtons.appendChild(btn);
    });
    frag.appendChild(relButtons);
  }

  return frag;
}

/**
 * Build the "not found" response fragment.
 * @returns {DocumentFragment}
 */
function buildNotFound() {
  const frag = document.createDocumentFragment();

  const p1 = document.createElement('p');
  p1.textContent = 'Informasi ini tidak ditemukan pada dokumen yang tersedia.';
  frag.appendChild(p1);

  const p2 = document.createElement('p');
  p2.style.marginTop = '8px';
  p2.textContent = 'Silakan hubungi Biro Akademik kampus secara langsung untuk mendapatkan informasi yang tepat dan terkini.';
  frag.appendChild(p2);

  return frag;
}

/**
 * Build a clarification request with two topic buttons.
 * @param {object} docA
 * @param {object} docB
 * @returns {DocumentFragment}
 */
function buildClarification(docA, docB) {
  const frag = document.createDocumentFragment();

  const label = document.createElement('p');
  label.className = 'clarify-label';
  label.textContent = 'Pertanyaan Anda cocok dengan beberapa topik. Maksud Anda yang mana?';
  frag.appendChild(label);

  const buttons = document.createElement('div');
  buttons.className = 'clarify-buttons';

  [docA, docB].forEach(doc => {
    const btn = document.createElement('button');
    btn.className = 'clarify-btn';
    btn.type = 'button';
    btn.textContent = doc.judul;
    btn.addEventListener('click', () => {
      // Inject the sample question into the input and trigger a search
      const input = document.getElementById('chat-input');
      input.value = doc.tanya;
      handleSubmit(doc.tanya);
    });
    buttons.appendChild(btn);
  });

  frag.appendChild(buttons);
  return frag;
}

/**
 * Build an injection-rejection message.
 * @returns {DocumentFragment}
 */
function buildInjectionReject() {
  const frag = document.createDocumentFragment();
  const p = document.createElement('p');
  p.textContent = 'Maaf, saya hanya dapat membantu menjawab pertanyaan seputar aturan akademik kampus sesuai pedoman resmi. Saya tidak dapat mengubah atau mengabaikan aturan yang berlaku.';
  frag.appendChild(p);
  return frag;
}

/**
 * Build an off-topic rejection message.
 * @returns {DocumentFragment}
 */
function buildOffTopicReject() {
  const frag = document.createDocumentFragment();
  const p = document.createElement('p');
  p.textContent = 'Mohon maaf, saya hanya dapat menjawab pertanyaan seputar aturan akademik kampus (KRS, cuti, skripsi, kelulusan, dll.). Untuk topik lain, silakan gunakan sumber yang sesuai.';
  frag.appendChild(p);
  return frag;
}

/**
 * Build a personal-case addendum paragraph.
 * @returns {HTMLParagraphElement}
 */
function buildPersonalCaseNote() {
  const p = document.createElement('p');
  p.style.marginTop = '10px';
  p.style.fontStyle = 'italic';
  p.style.fontSize = '0.85em';
  p.textContent = 'ℹ️ Catatan: Informasi di atas adalah aturan umum. Untuk keputusan resmi terkait kondisi studi Anda secara pribadi, silakan konsultasikan langsung ke Biro Akademik atau Dosen Pembimbing Akademik (DPA) Anda.';
  return p;
}

/**
 * Build a personal-data warning message.
 * @returns {DocumentFragment}
 */
function buildPersonalDataWarning() {
  const frag = document.createDocumentFragment();
  const p = document.createElement('p');
  p.textContent = '⚠️ Terdeteksi angka panjang dalam pesan Anda. Harap tidak membagikan NIM, nomor telepon, atau data pribadi lain di sini. Saya hanya memproses pertanyaan akademik, bukan data identitas.';
  frag.appendChild(p);
  return frag;
}

/* ══════════════════════════════════════════════════════════════════
   SECTION 7 — UI / RENDER
   ══════════════════════════════════════════════════════════════════ */

/** @type {HTMLDivElement} */
const chatMessages  = document.getElementById('chat-messages');
/** @type {HTMLDivElement} */
const typingIndicator = document.getElementById('typing-indicator');
/** @type {HTMLFormElement} */
const chatForm      = document.getElementById('chat-form');
/** @type {HTMLInputElement} */
const chatInput     = document.getElementById('chat-input');
/** @type {HTMLButtonElement} */
const sendBtn       = document.getElementById('send-btn');
/** @type {HTMLButtonElement} */
const restartBtn    = document.getElementById('restart-btn');
/** @type {HTMLUListElement} */
const topicList     = document.getElementById('topic-list');

/**
 * Append a message bubble to the chat.
 * @param {'user'|'bot'|'system'|'error'} role
 * @param {DocumentFragment|HTMLElement|string} content — use fragment/element, not raw HTML
 * @returns {HTMLDivElement} the bubble element (allows appending extras like personal note)
 */
function appendMessage(role, content) {
  const row = document.createElement('div');
  row.className = 'bubble-row ' + role;

  const avatar = document.createElement('div');
  avatar.className = 'bubble-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'user' ? '👤' : role === 'bot' ? '🎓' : 'ℹ️';
  row.appendChild(avatar);

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (typeof content === 'string') {
    const p = document.createElement('p');
    p.textContent = content;  // safe — no innerHTML
    bubble.appendChild(p);
  } else {
    bubble.appendChild(content);
  }

  row.appendChild(bubble);
  chatMessages.appendChild(row);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return bubble;
}

/** Show the typing / searching indicator */
function showTypingIndicator() {
  typingIndicator.hidden = false;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/** Hide the typing / searching indicator */
function hideTypingIndicator() {
  typingIndicator.hidden = true;
}

/** Lock/unlock the input form during processing */
function setInputLocked(locked) {
  chatInput.disabled = locked;
  sendBtn.disabled   = locked;
}

/**
 * Main flow for handling a submitted query.
 * Orchestrates guardrails → search → render.
 * @param {string} rawQuery
 */
function handleSubmit(rawQuery) {
  const query = rawQuery.trim();
  if (!query) return;

  // Clear input field
  chatInput.value = '';

  // Render user bubble
  appendMessage('user', query);

  // Lock input
  setInputLocked(true);

  // Show typing indicator with a realistic delay
  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();

    // ── GUARDRAIL 1: Personal data warning ──
    if (detectPersonalData(query)) {
      appendMessage('system', buildPersonalDataWarning());
      // Continue processing after warning — user may still have a valid question
    }

    // ── GUARDRAIL 2: Injection / override attempt ──
    if (detectInjection(query)) {
      appendMessage('error', buildInjectionReject());
      setInputLocked(false);
      chatInput.focus();
      return;
    }

    // ── GUARDRAIL 3: Off-topic check ──
    if (detectOffTopic(query)) {
      appendMessage('system', buildOffTopicReject());
      setInputLocked(false);
      chatInput.focus();
      return;
    }

    // ── SEARCH ──
    const { results } = search(query);
    const isPersonal  = detectPersonalCase(query);

    // ── GUARDRAIL 4: Very short ambiguous query ──
    if (query.split(/\s+/).length <= 3 && detectAmbiguous(results)) {
      appendMessage('bot', buildClarification(results[0].doc, results[1].doc));
      setInputLocked(false);
      chatInput.focus();
      return;
    }

    // ── BELOW THRESHOLD: not found ──
    if (results[0].score < RELEVANCE_THRESHOLD) {
      appendMessage('bot', buildNotFound());
      setInputLocked(false);
      chatInput.focus();
      return;
    }

    // ── ANSWER ──
    const bestDoc  = results[0].doc;
    const answerFrag = buildAnswer(bestDoc, results);

    // If personal case, append addendum note inside the fragment
    if (isPersonal) {
      answerFrag.appendChild(buildPersonalCaseNote());
    }

    appendMessage('bot', answerFrag);
    setInputLocked(false);
    chatInput.focus();

  }, 800 + Math.random() * 400); // 800–1200 ms simulated search delay
}

/**
 * Inject a topic's sample question into the input and submit.
 * @param {object} doc — KNOWLEDGE_BASE entry
 */
function handleTopicClick(doc) {
  chatInput.value = doc.tanya;
  chatInput.focus();
  handleSubmit(doc.tanya);
}

/** Clear the chat and show the welcome message. */
function handleRestart() {
  // Remove all child nodes safely
  while (chatMessages.firstChild) {
    chatMessages.removeChild(chatMessages.firstChild);
  }
  showWelcome();
  chatInput.value = '';
  chatInput.focus();
}

/** Render the initial welcome message. */
function showWelcome() {
  const frag = document.createDocumentFragment();

  const greeting = document.createElement('p');
  greeting.textContent = 'Halo! Saya SiAkad Buddy 👋 — asisten akademik virtual Anda.';
  frag.appendChild(greeting);

  const hint = document.createElement('p');
  hint.style.marginTop = '6px';
  hint.textContent = 'Silakan ketik pertanyaan tentang KRS, cuti akademik, skripsi, kelulusan, beasiswa, atau topik akademik lainnya. Anda juga bisa klik topik di samping untuk memulai.';
  frag.appendChild(hint);

  appendMessage('bot', frag);
}

/** Populate the sidebar topic list. */
function buildTopicList() {
  KNOWLEDGE_BASE.forEach(doc => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = doc.judul;
    btn.setAttribute('aria-label', 'Tanya tentang ' + doc.judul);
    btn.addEventListener('click', () => handleTopicClick(doc));
    li.appendChild(btn);
    topicList.appendChild(li);
  });
}

/* ══════════════════════════════════════════════════════════════════
   SECTION 8 — EVENT LISTENERS & INIT
   ══════════════════════════════════════════════════════════════════ */

// Form submit (also handles Enter key via browser default behaviour)
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = chatInput.value;
  if (q.trim()) handleSubmit(q);
});

// Restart button
restartBtn.addEventListener('click', handleRestart);

// Initialise on DOMContentLoaded (script is at end of body, so DOM is ready)
buildTopicList();
showWelcome();
chatInput.focus();
