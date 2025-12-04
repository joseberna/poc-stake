# Deployment Guide

## 🚂 Backend - Railway

### 1. Preparación
1. Crea una cuenta en [Railway](https://railway.app)
2. Instala Railway CLI (opcional): `npm i -g @railway/cli`

### 2. Deployment
1. En Railway dashboard, click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio
4. Selecciona la carpeta `backend`
5. Railway detectará automáticamente que es Node.js

### 3. Variables de Entorno
En Railway dashboard → Variables:

**Copia estas variables desde `backend/.env.example`:**

```env
PORT=3001
ACTIVE_NETWORK=sepolia
MONGO_URI=mongodb+srv://...
REDIS_URL=redis://...
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASSWORD=...
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=...
STAKING_ROUTER_ADDRESS=0xd965b8FA53a1b33B19079b9e998F4A928354B826
SEPOLIA_USDC_TOKEN=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
SEPOLIA_WETH_TOKEN=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
SEPOLIA_WBTC_TOKEN=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
```

### 4. Build Settings
Railway debería detectar automáticamente:
- **Build Command**: `npm run build` (si tienes uno)
- **Start Command**: `npm start` o `node dist/index.js`

### 5. Dominio
Railway te dará un dominio como: `https://your-app.railway.app`
Guarda esta URL para configurar el frontend.

---

## ▲ Frontend - Vercel

### 1. Preparación
1. Crea una cuenta en [Vercel](https://vercel.com)
2. Instala Vercel CLI (opcional): `npm i -g vercel`

### 2. Deployment
1. En Vercel dashboard, click "Add New Project"
2. Importa tu repositorio de GitHub
3. Selecciona la carpeta `frontend` como Root Directory
4. Framework Preset: **Next.js** (auto-detectado)

### 3. Variables de Entorno
En Vercel → Settings → Environment Variables:

**Copia estas variables desde `frontend/.env.example`:**

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=0xd965b8FA53a1b33B19079b9e998F4A928354B826
NEXT_PUBLIC_SEPOLIA_WETH=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
NEXT_PUBLIC_SEPOLIA_WBTC=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
NEXT_PUBLIC_SEPOLIA_USDC=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

**⚠️ IMPORTANTE**: Reemplaza `https://your-backend.railway.app` con la URL real de Railway.

### 4. Build Settings
Vercel auto-detecta Next.js:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy
Click "Deploy" y espera ~2 minutos.

---

## 🔄 Orden de Deployment

1. **Primero**: Deploy Backend en Railway
2. **Obtén**: La URL del backend (ej: `https://dedlyfi-backend.railway.app`)
3. **Segundo**: Deploy Frontend en Vercel
4. **Configura**: `NEXT_PUBLIC_API_URL` con la URL del backend

---

## ✅ Verificación Post-Deployment

### Backend
1. Visita `https://your-backend.railway.app/health`
   - Deberías ver: `{"status":"ok","timestamp":"..."}`
2. Visita `https://your-backend.railway.app/api-docs`
   - Deberías ver la documentación Swagger

### Frontend
1. Visita tu dominio de Vercel
2. Conecta tu wallet
3. Verifica que las opciones de staking se carguen
4. Revisa la consola del navegador (F12) para errores

---

## 🐛 Troubleshooting

### Backend no inicia
- **Error**: `MONGO_URI not found`
  - **Solución**: Verifica que todas las variables de entorno estén configuradas en Railway

- **Error**: `Redis connection failed`
  - **Solución**: Verifica REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

### Frontend no conecta al Backend
- **Error**: `Failed to fetch`
  - **Solución**: Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta de Railway
  - **Solución**: Asegúrate de que el backend tenga CORS habilitado (ya lo tiene)

### Transacciones fallan
- **Error**: `Transaction reverted`
  - **Solución**: Verifica que las direcciones de contratos sean correctas
  - **Solución**: Asegúrate de estar en Sepolia testnet

---

## 📝 Notas

- **Railway**: Ofrece $5 de crédito gratis al mes
- **Vercel**: Plan gratuito es suficiente para este proyecto
- **MongoDB Atlas**: Tier gratuito (512MB) es suficiente para desarrollo
- **Redis**: Usa Redis Cloud (tier gratuito 30MB)

---

## 🔐 Seguridad

- ✅ Nunca commitees archivos `.env` al repositorio
- ✅ Usa variables de entorno en Railway/Vercel
- ✅ Mantén las private keys seguras
- ✅ Usa diferentes wallets para dev/prod
