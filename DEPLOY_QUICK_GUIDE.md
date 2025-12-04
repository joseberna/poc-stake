# 🚀 Guía Rápida de Deployment

## 📋 Archivos Creados

- `backend/.env.production` - Variables para Railway
- `frontend/.env.production` - Variables para Vercel

**⚠️ IMPORTANTE**: Estos archivos NO se subirán al repositorio (están en .gitignore)

---

## 🚂 Railway (Backend)

### Opción 1: Importar desde archivo

1. Ve a tu proyecto en Railway
2. Click en tu servicio → **Variables**
3. Click en **Raw Editor** (arriba a la derecha)
4. Abre `backend/.env.production`
5. Copia TODO el contenido
6. Pégalo en el Raw Editor de Railway
7. Click **Update Variables**

### Opción 2: Agregar una por una

En Railway → Variables → Add Variable:

```
MONGO_URI=mongodb+srv://devdedlyfi_db_user:ArrzeJpT224RkTSJ@clusterdca.fevf2cq.mongodb.net/poc-stake-prod?retryWrites=true&w=majority
PORT=3001
ACTIVE_NETWORK=sepolia
PRIVATE_KEY=c259ba4fcc715509dbf7fc3274ab57e3068d8c85219bf1c3081f955ea606f3ec
PRIVATE_KEY_RELAYER=c259ba4fcc715509dbf7fc3274ab57e3068d8c85219bf1c3081f955ea606f3ec
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
REDIS_URL=redis://default:S3KhNLSQYjKcu7npnH0eNaoHNhdOYWGf@redis-17742.c73.us-east-1-2.ec2.cloud.redislabs.com:17742
REDIS_HOST=redis-17742.c73.us-east-1-2.ec2.cloud.redislabs.com
REDIS_PORT=17742
REDIS_PASSWORD=S3KhNLSQYjKcu7npnH0eNaoHNhdOYWGf
STAKING_ROUTER_ADDRESS=0xd965b8FA53a1b33B19079b9e998F4A928354B826
SEPOLIA_USDC_TOKEN=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
SEPOLIA_WETH_TOKEN=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
SEPOLIA_WBTC_TOKEN=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
```

### Después del Deploy

1. Railway te dará una URL como: `https://dedlyfi-backend-production.up.railway.app`
2. **GUARDA ESTA URL** - la necesitarás para el frontend
3. Verifica que funcione: `https://TU-URL.railway.app/health`

---

## ▲ Vercel (Frontend)

### ⚠️ PRIMERO: Actualiza la URL del Backend

1. Abre `frontend/.env.production`
2. Reemplaza `TU-BACKEND-URL` con la URL real de Railway
3. Ejemplo: `NEXT_PUBLIC_API_URL=https://dedlyfi-backend-production.up.railway.app`

### Opción 1: Importar desde archivo

1. Ve a tu proyecto en Vercel
2. Settings → **Environment Variables**
3. Click **Import .env**
4. Selecciona `frontend/.env.production`
5. Asegúrate de seleccionar **Production** environment
6. Click **Import**

### Opción 2: Agregar una por una

En Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://TU-BACKEND-URL.railway.app
NEXT_PUBLIC_WC_PROJECT_ID=ac7fd15874acf324297a079d51249398
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_SEPOLIA_USDC=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
NEXT_PUBLIC_SEPOLIA_WETH=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
NEXT_PUBLIC_SEPOLIA_WBTC=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=0xd965b8FA53a1b33B19079b9e998F4A928354B826
```

**Para cada variable**:
- Name: (nombre de la variable)
- Value: (valor)
- Environment: **Production** ✅

---

## ✅ Checklist de Deployment

### Backend (Railway)
- [ ] Proyecto creado en Railway
- [ ] Variables de entorno importadas
- [ ] Deploy exitoso
- [ ] URL del backend guardada
- [ ] `/health` endpoint funciona
- [ ] `/api-docs` muestra Swagger

### Frontend (Vercel)
- [ ] Proyecto creado en Vercel
- [ ] `NEXT_PUBLIC_API_URL` actualizada con URL de Railway
- [ ] Variables de entorno importadas
- [ ] Deploy exitoso
- [ ] Página carga correctamente
- [ ] Wallet se puede conectar
- [ ] Opciones de staking se cargan

---

## 🧪 Pruebas Post-Deployment

1. **Conectar Wallet**: Verifica que MetaMask se conecte
2. **Ver Opciones**: Deben aparecer Aave, Uniswap, Lido
3. **Hacer Stake**: Prueba con una cantidad pequeña
4. **Ver Posiciones**: Verifica que aparezca en "My Positions"
5. **Unstake**: Prueba retirar fondos

---

## 🐛 Troubleshooting

### Backend no responde
```bash
# Verifica logs en Railway
railway logs
```

### Frontend no carga opciones
- Verifica que `NEXT_PUBLIC_API_URL` sea correcta
- Abre DevTools (F12) → Console → busca errores
- Verifica que el backend esté corriendo

### CORS Error
- El backend ya tiene CORS habilitado
- Si persiste, verifica que la URL en frontend sea exacta (sin `/` al final)

---

## 📝 Notas Importantes

1. **Railway redeploys automáticamente** cuando actualizas variables
2. **Vercel requiere redeploy manual** después de cambiar variables
3. Los archivos `.env.production` están en `.gitignore` - NO se subirán a GitHub
4. Guarda estos archivos en un lugar seguro (1Password, etc.)
