import { Router } from 'express';
import { getDb, saveDatabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/:companyId/reviews', (req, res) => {
  const db = getDb();
  const { companyId } = req.params;

  const result = db.exec(
    `SELECT r.*, u.username FROM reviews r
     LEFT JOIN users u ON r.user_id = u.id
     WHERE r.company_id = ?
     ORDER BY r.created_at DESC`,
    [companyId]
  );

  const reviews = result.length > 0 ? result[0].values.map(row => ({
    id: row[0],
    company_id: row[1],
    user_id: row[2],
    rating: row[3],
    title: row[4],
    content: row[5],
    is_employee: row[6],
    created_at: row[7],
    username: row[8]
  })) : [];

  res.json(reviews);
});

router.post('/:companyId/reviews', authMiddleware, (req, res) => {
  const { rating, title, content, is_employee } = req.body;
  const { companyId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: '评分必须在1-5之间' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ error: '评论标题不能为空' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '评论内容不能为空' });
  }
  if (is_employee === undefined || is_employee === null) {
    return res.status(400).json({ error: '请选择是否为该公司员工' });
  }

  const db = getDb();

  const company = db.exec('SELECT id FROM companies WHERE id = ?', [companyId]);
  if (company.length === 0 || company[0].values.length === 0) {
    return res.status(404).json({ error: '公司不存在' });
  }

  db.run(
    'INSERT INTO reviews (company_id, user_id, rating, title, content, is_employee) VALUES (?, ?, ?, ?, ?, ?)',
    [companyId, req.user.id, rating, title.trim(), content.trim(), is_employee ? 1 : 0]
  );
  saveDatabase();

  res.json({ message: '评论发表成功' });
});

export default router;
