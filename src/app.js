import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import config from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      !config.corsOrigins.length ||
      config.corsOrigins.includes('*') ||
      config.corsOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(
  morgan(':method :url :status :remote-addr - :response-time ms', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/messages', messageRoutes);
app.use('/upload', mediaRoutes);
app.use('/', contentRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || 'Server error' });
});

export default app;
