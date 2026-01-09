# Setup Guide: Menggunakan Chat API di Next.js (Vercel)

Panduan lengkap untuk setup dan deploy aplikasi Next.js yang menggunakan Chat API.

---

## 📋 Prerequisites

- Next.js project (App Router atau Pages Router)
- Akun Vercel
- Domain untuk Chat API (sudah di-deploy)

---

## 🚀 Step 1: Setup Environment Variables

### Di Local Development

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_CHAT_API_URL=https://your-api-domain.com/api/chat
```

**Catatan:**

- `NEXT_PUBLIC_` prefix diperlukan untuk variables yang diakses di client component
- Ganti `your-api-domain.com` dengan domain sebenarnya

### Di Vercel

1. Buka project di [Vercel Dashboard](https://vercel.com/dashboard)
2. Pergi ke **Settings** → **Environment Variables**
3. Klik **Add New**
4. Tambahkan:
   - **Name:** `NEXT_PUBLIC_CHAT_API_URL`
   - **Value:** `https://your-api-domain.com/api/chat`
   - **Environment:** Pilih semua (Production, Preview, Development)
5. Klik **Save**

---

## 📁 Step 2: Install Dependencies

Tidak ada dependency tambahan yang diperlukan! Next.js sudah include `fetch` API.

---

## 📝 Step 3: Copy Files ke Project

### Option A: Menggunakan Custom Hook (Recommended)

1. Copy `helper/nextjs-useChat.ts` ke `hooks/useChat.ts`
2. Copy `helper/nextjs-ChatComponent.tsx` ke `components/ChatComponent.tsx` (atau sesuaikan path)

### Option B: Menggunakan API Proxy

1. Copy `helper/nextjs-api-proxy-route.ts` ke `app/api/chat-proxy/route.ts`
2. Update environment variable:
   ```env
   CHAT_API_URL=https://your-api-domain.com/api/chat
   ```

---

## 🎨 Step 4: Implementasi di Halaman

### Menggunakan Custom Hook

Buat file `app/chat/page.tsx`:

```tsx
"use client";

import ChatComponent from "@/components/ChatComponent";

export default function ChatPage() {
  return <ChatComponent />;
}
```

### Atau Custom Implementation

```tsx
"use client";

import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, input, isLoading, setInput, handleSubmit } = useChat();

  return <div>{/* Custom UI Anda */}</div>;
}
```

---

## 🔧 Step 5: Konfigurasi CORS (Jika Diperlukan)

Jika Chat API di domain berbeda, pastikan CORS sudah dikonfigurasi di API server.

Untuk Next.js API proxy, CORS sudah di-handle di `route.ts`.

---

## 🧪 Step 6: Testing

### Test Local

1. Start development server:

   ```bash
   npm run dev
   ```

2. Buka `http://localhost:3000/chat`
3. Test kirim pesan

### Test di Vercel Preview

1. Push ke GitHub
2. Vercel akan auto-deploy
3. Test di preview URL

---

## 📦 Step 7: Deploy ke Vercel

### Via GitHub (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Vercel akan auto-detect Next.js
4. Pastikan environment variables sudah di-set
5. Deploy!

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_CHAT_API_URL
```

---

## 🔍 Troubleshooting

### Error: "CHAT_API_URL is not configured"

**Solusi:** Pastikan environment variable sudah di-set di Vercel Dashboard

### Error: CORS

**Solusi:**

1. Pastikan CORS headers sudah di-set di API server
2. Atau gunakan API proxy pattern

### Error: "Failed to fetch"

**Solusi:**

1. Check apakah API URL benar
2. Check apakah API server sedang running
3. Check network tab di browser DevTools

### Streaming tidak bekerja

**Solusi:**

1. Pastikan response headers `Content-Type: text/event-stream`
2. Pastikan menggunakan `response.body.getReader()` untuk membaca stream
3. Check browser console untuk error

---

## 🎯 Best Practices

1. **Environment Variables**:

   - Gunakan `NEXT_PUBLIC_` untuk client-side
   - Jangan expose API keys di client

2. **Error Handling**:

   - Selalu handle error dengan try-catch
   - Tampilkan pesan error yang user-friendly

3. **Loading States**:

   - Tampilkan loading indicator saat request
   - Disable form saat loading

4. **Rate Limiting**:

   - Pertimbangkan rate limiting di API server
   - Implement retry logic jika diperlukan

5. **Security**:
   - Jangan hardcode API URLs
   - Gunakan environment variables
   - Validasi input di client dan server

---

## 📚 File Structure

```
your-nextjs-project/
├── app/
│   ├── chat/
│   │   └── page.tsx          # Chat page
│   └── api/
│       └── chat-proxy/
│           └── route.ts      # API proxy (optional)
├── components/
│   └── ChatComponent.tsx     # Chat component
├── hooks/
│   └── useChat.ts            # Custom hook
├── .env.local                 # Local env vars
└── vercel.json               # Vercel config (optional)
```

---

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Fetch API Streaming](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)

---

## 💡 Tips

1. **Development**: Gunakan `.env.local` untuk local development
2. **Production**: Set environment variables di Vercel Dashboard
3. **Testing**: Test di preview deployment sebelum production
4. **Monitoring**: Gunakan Vercel Analytics untuk monitor performance

---

## ✅ Checklist

- [ ] Environment variables di-set di `.env.local`
- [ ] Environment variables di-set di Vercel Dashboard
- [ ] Files di-copy ke project
- [ ] Halaman chat dibuat
- [ ] Test local berhasil
- [ ] Deploy ke Vercel
- [ ] Test di production

---

Selamat! 🎉 Aplikasi Anda siap digunakan.
