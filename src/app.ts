import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 