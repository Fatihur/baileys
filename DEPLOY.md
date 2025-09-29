# Deployment Guide untuk Back4App

## Langkah-langkah Deploy ke Back4App

### 1. Persiapan Project
Pastikan semua file sudah siap:
- ✅ Dockerfile
- ✅ .dockerignore
- ✅ package.json dengan engines specification
- ✅ Source code aplikasi

### 2. Upload ke Back4App

1. **Login ke Back4App Console**
   - Buka https://dashboard.back4app.com/
   - Login dengan akun Anda

2. **Create New Container App**
   - Pilih "Containers" dari dashboard
   - Klik "Create a Container App"
   - Pilih "Upload your code"

3. **Upload Source Code**
   - Upload semua file project dalam format ZIP, atau
   - Connect dengan GitHub repository

4. **Configuration Settings**
   ```
   App Name: whatsapp-api-baileys
   Runtime: Docker
   Port: 3000 (atau sesuai PORT env variable)
   ```

5. **Environment Variables**
   Set environment variables berikut di Back4App dashboard:
   ```
   PORT=3000
   NODE_ENV=production
   ```

### 3. Deployment Commands

Jika menggunakan Back4App CLI:

```bash
# Install Back4App CLI
npm install -g back4app-cli

# Login
back4app login

# Deploy
back4app deploy
```

### 4. Post-Deployment

1. **Check Application Status**
   - Buka app URL yang diberikan Back4App
   - Akses `/status` endpoint untuk melihat status koneksi

2. **WhatsApp Authentication**
   - Akses `/status` untuk mendapatkan QR Code
   - Scan QR Code dengan WhatsApp di ponsel
   - Setelah terkoneksi, API siap digunakan

3. **Test Endpoints**
   ```bash
   # Test status
   curl https://your-app.back4app.io/status

   # Test send message
   curl -X POST https://your-app.back4app.io/send-text \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber":"08123456789","message":"Hello from Back4App!"}'
   ```

### 5. Important Notes

- **Persistent Storage**: Auth info akan hilang setiap restart container. Untuk production, pertimbangkan menggunakan external storage untuk session data.
- **Resource Limits**: Back4App memiliki limit resource, pastikan aplikasi tidak melebihi limit yang diberikan.
- **Logs**: Monitor logs melalui Back4App dashboard untuk debugging.

### 6. Monitoring

- Check application logs di Back4App dashboard
- Monitor resource usage (CPU, Memory)
- Set up alerts untuk downtime

### 7. Scaling

Untuk traffic tinggi:
- Upgrade plan Back4App sesuai kebutuhan
- Implementasi rate limiting
- Optimasi kode untuk performance

## Troubleshooting

**Problem**: Container tidak start
- **Solution**: Check logs di Back4App dashboard, pastikan PORT environment variable sudah di-set

**Problem**: QR Code tidak muncul
- **Solution**: Akses `/status` endpoint dan check response

**Problem**: Auth session hilang
- **Solution**: Implement external session storage atau re-authenticate