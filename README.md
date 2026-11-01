# SiAkad Buddy — README

Chatbot RAG untuk menjawab pertanyaan aturan akademik kampus berbasis dokumen PDF.
**Stack:** Langflow · Astra DB · Google Gemini

---

## 📁 File yang Tersedia

| File | Fungsi |
|------|--------|
| `flow_ingest.json` | Import dokumen PDF ke Astra DB (dijalankan sekali) |
| `flow_chat.json`  | Flow tanya-jawab (RAG chatbot) |

---

## 🚀 Langkah Import (urutan wajib)

### 1. Import `flow_ingest.json` terlebih dahulu

1. Buka Langflow di browser.
2. Klik tombol **"New Flow"** → pilih **"Import"** (ikon upload).
3. Pilih file `flow_ingest.json`.
4. Flow terbuka dengan nama **"SiAkad Buddy — Ingest"**.

### 2. Import `flow_chat.json` setelah ingest selesai

1. Ulangi langkah yang sama, pilih file `flow_chat.json`.
2. Flow terbuka dengan nama **"SiAkad Buddy — Chat"**.

---

## ✏️ Bagian yang Harus Diisi Manual

Setelah import, buka setiap flow dan isi field berikut. **Jangan jalankan flow sebelum semua field terisi.**

### `flow_ingest.json`

| Komponen | Field | Yang Harus Diisi |
|----------|-------|-----------------|
| **Google Generative AI Embeddings** | `Google API Key` | API key dari [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Astra DB** | `Astra DB Application Token` | Token `AstraCS:...` dari [Astra DB Console](https://astra.datastax.com) |
| **Astra DB** | `API Endpoint` | URL endpoint database Anda, contoh: `https://xxxx-region.apps.astra.datastax.com` |
| **Read File** | `Path` | Klik ikon upload → pilih file PDF pedoman akademik Anda |

> `Collection Name` sudah terisi otomatis: **`pedoman_akademik`**. Ganti jika perlu.

### `flow_chat.json`

| Komponen | Field | Yang Harus Diisi |
|----------|-------|-----------------|
| **Google Generative AI Embeddings** | `Google API Key` | API key yang sama seperti di atas |
| **Google Generative AI** (LLM) | `Google API Key` | API key yang sama |
| **Astra DB** | `Astra DB Application Token` | Token yang sama seperti di atas |
| **Astra DB** | `API Endpoint` | URL endpoint yang sama |

> Sticky Note: Ganti **`[NAMA SAYA]`** dan **`[UNIVERSITAS SAYA]`** dengan nama dan universitas Anda.

---

## 🔄 Cara Menjalankan

### Tahap 1 — Ingest (satu kali)

1. Buka flow **"SiAkad Buddy — Ingest"**.
2. Pastikan semua field sudah terisi.
3. Klik **▶ Run** (atau **Build**).
4. Tunggu hingga muncul tanda centang hijau di node **Astra DB**.
5. Ingest selesai — dokumen sudah tersimpan sebagai vektor.

### Tahap 2 — Chat

1. Buka flow **"SiAkad Buddy — Chat"**.
2. Pastikan semua field sudah terisi.
3. Klik **▶ Run** → lalu klik ikon **Chat** (bubble) di pojok kanan bawah.
4. Ketik pertanyaan di kotak chat.

---

## 🧪 3 Pertanyaan Contoh untuk Pengujian

Gunakan pertanyaan-pertanyaan berikut untuk memverifikasi bahwa chatbot berjalan dengan benar:

### Pertanyaan 1 — KRS
```
Apa saja syarat dan batas waktu pengisian KRS setiap semester?
```
**Jawaban yang diharapkan:** Chatbot menyebutkan syarat KRS (misalnya: tidak ada tunggakan, persetujuan dosen wali), batas waktu sesuai kalender akademik, dan menyebutkan sumber bab/pasal dari dokumen.

---

### Pertanyaan 2 — Cuti Akademik
```
Bagaimana prosedur pengajuan cuti akademik dan berapa maksimal cuti yang diperbolehkan?
```
**Jawaban yang diharapkan:** Chatbot menjelaskan langkah pengajuan cuti, syarat administratif, durasi maksimal cuti, dan efeknya terhadap masa studi.

---

### Pertanyaan 3 — Syarat Skripsi / Tugas Akhir
```
Apa syarat mahasiswa boleh mendaftar sidang skripsi?
```
**Jawaban yang diharapkan:** Chatbot menyebutkan syarat SKS minimal, IPK minimal, lulus mata kuliah prasyarat, dan dokumen yang diperlukan sesuai dokumen pedoman.

---

### ✅ Cara Verifikasi

- Jika chatbot menjawab dengan referensi bab/pasal → **RAG bekerja dengan benar**.
- Jika chatbot menjawab "Informasi ini tidak ditemukan pada dokumen yang tersedia" → pertanyaan tidak tercakup dalam PDF yang di-ingest, **bukan error**.
- Jika chatbot memberikan jawaban tanpa referensi dokumen → periksa kembali apakah ingest berhasil dan collection name di kedua flow **sama persis**.

---

## ⚠️ Catatan Penting

- **Jangan simpan API key di dalam file JSON** — isi selalu melalui UI Langflow.
- Pastikan nama collection di `flow_ingest.json` dan `flow_chat.json` **identik** (`pedoman_akademik`).
- Model LLM default: `gemini-1.5-flash`. Bisa diganti ke `gemini-1.5-pro` untuk jawaban lebih detail (quota lebih besar).
- Temperature LLM diset ke `0.1` agar jawaban konsisten dan faktual.
- Jika Langflow menampilkan **"Unknown Component"** setelah import, hapus node tersebut dan tambahkan ulang dari panel komponen dengan konfigurasi yang sama.

---

*Dibuat untuk Capstone Project IBM SkillsBuild University Education — SiAkad Buddy*
