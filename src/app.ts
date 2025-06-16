import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 