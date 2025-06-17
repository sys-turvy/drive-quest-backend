import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';

// 環境変数の読み込み（絶対パスで指定）
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 8000;

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(port, () => {
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log(`Server is running on http://localhost:${port}`);
}); 