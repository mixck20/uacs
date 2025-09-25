import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/limiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import backupRoutes from './routes/backupRoutes.js';

const app = express();
await connectDB();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.get('/', (req, res) => res.json({ name: env.APP_NAME, status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/backup', backupRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 ${env.APP_NAME} listening on http://localhost:${env.PORT}`);
});
