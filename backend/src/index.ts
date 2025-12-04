import express from 'express';
import cors from 'cors';

// In production (Railway), env vars are injected directly into process.env
// In development, load from .env file
if (process.env.NODE_ENV !== 'production' && !process.env.RAILWAY_ENVIRONMENT) {
  require('dotenv').config();
}

import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import logger from './utils/logger';
import { swaggerSpec } from './config/swagger';
import { getStakingOptions, createStakingOption } from './routes/stakingOptions';
import { createTransaction, getTransactionsByUser, updateTransactionStatus } from './routes/transactions';
import { executeStake, getStakeQuote } from './routes/staking';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;

// Debug: Log environment info
console.log('=== ENVIRONMENT DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('MONGO_URI exists:', !!mongoUri);
console.log('PORT:', process.env.PORT);
console.log('========================');

if (!mongoUri) {
  logger.error('MONGO_URI not found in environment variables', { service: 'Database' });
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => logger.success('Connected to MongoDB', { service: 'Database' }))
  .catch(err => {
    logger.error(`MongoDB connection error: ${err}`, { service: 'Database' });
    process.exit(1);
  });

app.use(express.static('public'));

// Swagger Documentation with Dark Crypto Theme
const swaggerOptions = {
  customCss: `
    .swagger-ui { font-family: 'Inter', sans-serif; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { background-color: #0a0e27; }
    .swagger-ui .info { background-color: #0f1629; border-radius: 12px; padding: 24px; margin-bottom: 24px; position: relative; }
    .swagger-ui .info::before {
      content: '';
      display: block;
      width: 60px;
      height: 60px;
      background-image: url('/icons/dedlyfi.png');
      background-size: contain;
      background-repeat: no-repeat;
      margin-bottom: 16px;
    }
    .swagger-ui .info .title { color: #60a5fa; font-size: 32px; font-weight: 700; display: flex; align-items: center; gap: 12px; }
    .swagger-ui .info .description { color: #94a3b8; line-height: 1.6; }
    .swagger-ui .scheme-container { background-color: #0f1629; border-radius: 8px; padding: 16px; }
    .swagger-ui .opblock { background-color: #0f1629; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 16px; }
    .swagger-ui .opblock .opblock-summary { background-color: #1e293b; border-radius: 8px 8px 0 0; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; }
    .swagger-ui .opblock.opblock-post .opblock-summary { background-color: #064e3b; }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; }
    .swagger-ui .opblock.opblock-get .opblock-summary { background-color: #1e3a8a; }
    .swagger-ui .opblock.opblock-patch { border-color: #f59e0b; }
    .swagger-ui .opblock.opblock-patch .opblock-summary { background-color: #78350f; }
    .swagger-ui .opblock-tag { color: #60a5fa; font-size: 20px; font-weight: 600; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
    .swagger-ui .opblock-summary-method { background-color: #1e293b; color: #fff; border-radius: 6px; font-weight: 600; }
    .swagger-ui .opblock-summary-path { color: #94a3b8; }
    .swagger-ui .opblock-description-wrapper { background-color: #0a0e27; color: #cbd5e1; padding: 16px; }
    .swagger-ui .opblock-body { background-color: #0a0e27; }
    .swagger-ui .parameters { background-color: #0f1629; padding: 16px; border-radius: 8px; }
    .swagger-ui .parameter__name { color: #60a5fa; font-weight: 600; }
    .swagger-ui .parameter__type { color: #34d399; }
    .swagger-ui .response { background-color: #0f1629; border: 1px solid #1e293b; border-radius: 8px; }
    .swagger-ui .response-col_status { color: #10b981; font-weight: 600; }
    .swagger-ui .response-col_description { color: #94a3b8; }
    .swagger-ui .model-box { background-color: #0f1629; border: 1px solid #1e293b; border-radius: 8px; }
    .swagger-ui .model { color: #cbd5e1; }
    .swagger-ui .prop-type { color: #34d399; }
    .swagger-ui .prop-format { color: #60a5fa; }
    .swagger-ui table thead tr th { background-color: #1e293b; color: #60a5fa; border-bottom: 2px solid #3b82f6; }
    .swagger-ui table tbody tr td { background-color: #0f1629; color: #cbd5e1; border-bottom: 1px solid #1e293b; }
    .swagger-ui .btn { background-color: #3b82f6; color: #fff; border-radius: 6px; font-weight: 600; border: none; }
    .swagger-ui .btn:hover { background-color: #2563eb; }
    .swagger-ui .btn.execute { background-color: #10b981; }
    .swagger-ui .btn.execute:hover { background-color: #059669; }
    .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select { background-color: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; }
    .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus { border-color: #3b82f6; outline: none; }
    .swagger-ui .highlight-code { background-color: #0a0e27; }
    .swagger-ui .microlight { color: #cbd5e1; }
  `,
  customSiteTitle: 'DedlyFi Staking API - Docs',
  customfavIcon: '/icons/dedlyfi.png'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verifica el estado del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Staking Options Routes
app.get('/api/options', getStakingOptions);
app.post('/api/options', createStakingOption);

// Bull Board
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { updateOptionsQueue } from './queues/updateOptionsQueue';
import { transactionQueue } from './queues/transactionQueue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(updateOptionsQueue),
    new BullMQAdapter(transactionQueue)
  ],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// Admin: Force update options
app.post('/api/admin/update-options', async (req, res) => {
  try {
    await updateOptionsQueue.add('manual-update', {});
    logger.info('Manual update options job triggered', { service: 'API' });
    res.json({ message: 'Update job queued' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Staking Execution Routes
app.post('/api/stake/execute', executeStake);
app.post('/api/stake/quote', getStakeQuote);

// Transaction Routes
app.post('/api/transactions', createTransaction);
app.get('/api/transactions/:userAddress', getTransactionsByUser);
app.patch('/api/transactions/:txHash/status', updateTransactionStatus);

// User Routes
import { loginUser, getUserByAddress } from './routes/users';
app.post('/api/users/login', loginUser);
app.get('/api/users/:walletAddress', getUserByAddress);


// Initialize queues and listeners
import { scheduleUpdateOptions } from './queues/updateOptionsQueue';
import { startContractListener } from './listeners/contractListener';

app.listen(port, async () => {
  logger.success(`Backend running on http://localhost:${port}`, { service: 'System' });
  logger.info(`Network: ${process.env.ACTIVE_NETWORK || 'sepolia'}`, { service: 'System' });
  logger.info(`📚 API Docs: http://localhost:${port}/api-docs`, { service: 'System' });
  logger.info(`🎯 Bull Board: http://localhost:${port}/admin/queues`, { service: 'System' });
  
  // Inicializar colas de actualización y listeners
  try {
    await scheduleUpdateOptions();
    startContractListener();
    logger.success('Queue system and listeners initialized', { service: 'System' });
  } catch (error: any) {
    logger.error(`Failed to initialize queues: ${error.message}`, { service: 'System' });
  }
});
