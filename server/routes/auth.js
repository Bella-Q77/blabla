import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDatabase } from '../db.js';
import { JWT_SECRET, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  if (username.length < 2 || password.length < 4) {
    return res.status(400).json({ error: '用户名至少2个字符，密码至少4个字符' });
  }

  const db = getDb();
  const existing = db.exec('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    return res.status(400).json({ error: '用户名已存在' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

  const result = db.exec('SELECT id FROM users WHERE username = ?', [username]);
  const userId = result[0].values[0][0];
  saveDatabase();

  const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: userId, username } });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const db = getDb();
  const result = db.exec('SELECT id, username, password FROM users WHERE username = ?', [username]);
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(400).json({ error: '用户名或密码错误' });
  }

  const [id, name, hashedPassword] = result[0].values[0];
  if (!bcrypt.compareSync(password, hashedPassword)) {
    return res.status(400).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign({ id, username: name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id, username: name } });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

export default router;
