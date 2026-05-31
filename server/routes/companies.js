import { Router } from 'express';
import { getDb, saveDatabase } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const db = getDb();
  const offset = (page - 1) * limit;

  let query, countQuery, params;
  if (search) {
    params = [`%${search}%`, `%${search}%`];
    countQuery = 'SELECT COUNT(*) as total FROM companies WHERE name LIKE ? OR industry LIKE ?';
    query = `SELECT c.*, u.username as creator_name FROM companies c LEFT JOIN users u ON c.created_by = u.id WHERE c.name LIKE ? OR c.industry LIKE ? ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
  } else {
    params = [];
    countQuery = 'SELECT COUNT(*) as total FROM companies';
    query = `SELECT c.*, u.username as creator_name FROM companies c LEFT JOIN users u ON c.created_by = u.id ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
  }

  const countResult = db.exec(countQuery, params);
  const total = countResult[0]?.values[0]?.[0] || 0;

  const result = db.exec(query, search ? [`%${search}%`, `%${search}%`] : []);
  const companies = result.length > 0 ? result[0].values.map(row => ({
    id: row[0],
    name: row[1],
    industry: row[2],
    location: row[3],
    description: row[4],
    created_by: row[5],
    created_at: row[6],
    updated_at: row[7],
    creator_name: row[8]
  })) : [];

  // Get average ratings for each company
  const companiesWithRatings = companies.map(company => {
    const ratingResult = db.exec(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE company_id = ?',
      [company.id]
    );
    const avgRating = ratingResult[0]?.values[0]?.[0] || 0;
    const reviewCount = ratingResult[0]?.values[0]?.[1] || 0;
    return { ...company, avg_rating: Math.round(avgRating * 10) / 10, review_count: reviewCount };
  });

  res.json({ companies: companiesWithRatings, total, page: Number(page), limit: Number(limit) });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const result = db.exec(
    'SELECT c.*, u.username as creator_name FROM companies c LEFT JOIN users u ON c.created_by = u.id WHERE c.id = ?',
    [req.params.id]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: '公司不存在' });
  }

  const row = result[0].values[0];
  const company = {
    id: row[0], name: row[1], industry: row[2], location: row[3],
    description: row[4], created_by: row[5], created_at: row[6],
    updated_at: row[7], creator_name: row[8]
  };

  const ratingResult = db.exec(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE company_id = ?',
    [company.id]
  );
  company.avg_rating = Math.round((ratingResult[0]?.values[0]?.[0] || 0) * 10) / 10;
  company.review_count = ratingResult[0]?.values[0]?.[1] || 0;

  res.json(company);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, industry, location, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '公司名称不能为空' });
  }

  const db = getDb();
  db.run(
    'INSERT INTO companies (name, industry, location, description, created_by) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), industry || '', location || '', description || '', req.user.id]
  );

  const result = db.exec('SELECT MAX(id) as id FROM companies');
  const id = result[0].values[0][0];
  saveDatabase();
  res.json({ id, message: '公司创建成功' });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, industry, location, description } = req.body;
  const db = getDb();

  const existing = db.exec('SELECT id FROM companies WHERE id = ?', [req.params.id]);
  if (existing.length === 0 || existing[0].values.length === 0) {
    return res.status(404).json({ error: '公司不存在' });
  }

  db.run(
    'UPDATE companies SET name = COALESCE(?, name), industry = COALESCE(?, industry), location = COALESCE(?, location), description = COALESCE(?, description), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name || null, industry || null, location || null, description || null, req.params.id]
  );
  saveDatabase();

  res.json({ message: '公司信息更新成功' });
});

export default router;
