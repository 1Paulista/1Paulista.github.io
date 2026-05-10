const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── GET /api/reviews?courseId=xxx ──
// Отримати всі відгуки по конкретному курсу
// з відформатованою датою і сортуванням за спаданням
app.get('/api/reviews', async (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId є обовязковим параметром' });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' }
    });

    // Трансформація: додаємо dateFormatted у форматі "день.місяць.рік"
    const transformed = reviews.map(review => {
      const date = new Date(review.createdAt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return {
        ...review,
        dateFormatted: `${day}.${month}.${year}`
      };
    });

    res.json(transformed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// ── POST /api/reviews ──
// Додати новий відгук з валідацією довжини тексту
app.post('/api/reviews', async (req, res) => {
  const { courseId, userEmail, text, rating } = req.body;

  if (!courseId || !userEmail || !text || !rating) {
    return res.status(400).json({ error: 'Всі поля є обовязковими' });
  }

  // Валідація довжини тексту
  if (text.length < 10) {
    return res.status(400).json({ error: 'Відгук має містити мінімум 10 символів' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Відгук має містити максимум 500 символів' });
  }

  try {
    const review = await prisma.review.create({
      data: {
        courseId,
        userEmail,
        text,
        rating: parseInt(rating),
        createdAt: new Date() // ISO 8601 автоматично
      }
    });

    // Додаємо dateFormatted до відповіді
    const date = new Date(review.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    res.status(201).json({
      ...review,
      dateFormatted: `${day}.${month}.${year}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// ── GET /api/message ── тестовий маршрут
app.get('/api/message', (req, res) => {
  res.json({ message: 'Сервер працює!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});