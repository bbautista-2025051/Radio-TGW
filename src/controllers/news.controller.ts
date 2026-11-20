import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/news.service';

export class NewsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, subcategory, search, featured, includeUnvalidated } = req.query;
      const items = await newsService.findAll({
        category: typeof category === 'string' ? category : undefined,
        subcategory: typeof subcategory === 'string' ? subcategory : undefined,
        search: typeof search === 'string' ? search : undefined,
        featured: featured === 'true' ? true : undefined,
        includeUnvalidated: includeUnvalidated === 'true'
      });

      res.json({
        status: 'success',
        count: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const item = await newsService.findBySlug(slug);
      if (!item) {
        res.status(404).json({ status: 'error', message: 'Noticia no encontrada' });
        return;
      }
      res.json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, summary, content, category, subcategory, author, imageUrl, directorValidated } = req.body;
      if (!title || !summary || !content || !category) {
        res.status(400).json({
          status: 'error',
          message: 'Título, resumen, contenido y categoría son obligatorios.'
        });
        return;
      }

      const created = await newsService.createNews({
        title: String(title).trim(),
        summary: String(summary).trim(),
        content: String(content).trim(),
        category: String(category).trim(),
        subcategory: subcategory ? String(subcategory).trim() : undefined,
        author: author ? String(author).trim() : 'Redacción TGW',
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        directorValidated: Boolean(directorValidated)
      });

      res.status(201).json({
        status: 'success',
        message:
          created.category === 'OPINION_W' && !created.directorValidated
            ? 'Columna OpiniónW registrada y enviada a despacho para validación del Director General de la radio.'
            : 'Noticia almacenada exitosamente en la base de datos Prisma de TGW.',
        data: created
      });
    } catch (error) {
      next(error);
    }
  }

  async validateOpinion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const updated = await newsService.validateOpinion(id);
      res.json({
        status: 'success',
        message: 'Columna de OpiniónW validada oficialmente por el Director General.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}

export const newsController = new NewsController();
