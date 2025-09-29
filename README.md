# WhatsApp API dengan Baileys

API WhatsApp menggunakan library Baileys untuk mengirim berbagai jenis pesan.

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan aplikasi:
```bash
npm start
# atau untuk development
npm run dev
```

## Cara Penggunaan

1. Jalankan server
2. Buka browser dan akses `http://localhost:3000` untuk melihat daftar endpoint
3. Akses `GET /status` untuk mendapatkan QR Code
4. Scan QR Code dengan WhatsApp di ponsel
5. Gunakan endpoint API untuk mengirim pesan

## Endpoints

### GET /status
Mendapatkan status koneksi dan QR code untuk autentikasi

### POST /send-text
Mengirim pesan teks
```json
{
  "phoneNumber": "08123456789",
  "message": "Hello World!"
}
```

### POST /send-image
Mengirim gambar (multipart/form-data)
- `phoneNumber`: Nomor telepon
- `image`: File gambar
- `caption`: Caption (opsional)

### POST /send-document
Mengirim dokumen (multipart/form-data)
- `phoneNumber`: Nomor telepon
- `document`: File dokumen
- `fileName`: Nama file

### POST /send-audio
Mengirim audio (multipart/form-data)
- `phoneNumber`: Nomor telepon
- `audio`: File audio

### POST /send-location
Mengirim lokasi
```json
{
  "phoneNumber": "08123456789",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "address": "Jakarta, Indonesia"
}
```

### POST /send-contact
Mengirim kontak
```json
{
  "phoneNumber": "08123456789",
  "contactName": "John Doe",
  "contactNumber": "08987654321"
}
```

### POST /send-button
Mengirim pesan dengan tombol
```json
{
  "phoneNumber": "08123456789",
  "text": "Pilih salah satu:",
  "buttons": ["Ya", "Tidak", "Mungkin"],
  "footer": "Footer text"
}
```

### POST /send-list
Mengirim pesan dengan list
```json
{
  "phoneNumber": "08123456789",
  "text": "Pilih menu:",
  "buttonText": "Lihat Menu",
  "sections": [
    {
      "title": "Menu Makanan",
      "rows": [
        {"title": "Nasi Goreng", "description": "Nasi goreng spesial", "rowId": "1"},
        {"title": "Mie Ayam", "description": "Mie ayam bakso", "rowId": "2"}
      ]
    }
  ],
  "footer": "Restoran ABC"
}
```

### GET /profile-picture/:phoneNumber
Mendapatkan URL foto profil

### POST /logout
Logout dari WhatsApp

## Catatan

- Nomor telepon bisa dalam format 08xxx atau 62xxx
- File auth akan disimpan di folder `auth_info`
- Log akan disimpan di file `wa-logs.txt`