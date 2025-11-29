import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './auth';
import categoryRouter from './category';
import productRouter from './product';
import supplierRouter from './supplier';
import saleRouter from './sale';
import userRouter from './user';
import uploadRouter from './upload';
import settingsRouter from './settings';
import mediaRouter from './media';
import storefrontRouter from './storefront';

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins: string[] = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
  process.env.STOREFRONT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
    : true, // Allow all in development
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/sales', saleRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/storefront', storefrontRouter);

app.get('/', (req, res) => {
  res.send('Hello from the POS server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
