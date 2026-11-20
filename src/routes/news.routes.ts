import { Router } from 'express';
import { newsController } from '../controllers/news.controller';

const router = Router();

router.get('/', (req, res, next) => newsController.list(req, res, next));
router.get('/:slug', (req, res, next) => newsController.getBySlug(req, res, next));
router.post('/', (req, res, next) => newsController.create(req, res, next));
router.patch('/:id/validate', (req, res, next) => newsController.validateOpinion(req, res, next));

export default router;
