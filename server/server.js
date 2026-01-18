import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/businesses.js';
import socialRoutes from './routes/socials.js';
import adminRoutes from './routes/admin.js';

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || '*',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
