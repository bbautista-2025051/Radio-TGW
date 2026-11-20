import { prisma } from '../database/prisma';

export interface NewsFilterParams {
  category?: string;
  subcategory?: string;
  search?: string;
  featured?: boolean;
  includeUnvalidated?: boolean;
}

export class NewsService {
  async findAll(filters: NewsFilterParams) {
    const where: Record<string, unknown> = {};

    if (filters.category && filters.category !== 'TODAS') {
      where.category = filters.category;
    }

    if (filters.subcategory && filters.subcategory !== 'TODAS') {
      where.subcategory = filters.subcategory;
    }

    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured;
    }

    if (!filters.includeUnvalidated) {
      where.directorValidated = true;
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
        { author: { contains: q } }
      ];
    }

    return prisma.news.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }]
    });
  }

  async findBySlug(slug: string) {
    const item = await prisma.news.findUnique({ where: { slug } });
    if (item) {
      await prisma.news.update({
        where: { id: item.id },
        data: { views: { increment: 1 } }
      });
    }
    return item;
  }

  async createNews(data: {
    title: string;
    summary: string;
    content: string;
    category: string;
    subcategory?: string;
    author: string;
    imageUrl?: string;
    directorValidated?: boolean;
  }) {
    const baseSlug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const isOpinion = data.category === 'OPINION_W';
    const validated = isOpinion ? Boolean(data.directorValidated) : true;

    return prisma.news.create({
      data: {
        slug,
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        subcategory: data.subcategory || null,
        author: data.author || 'Redacción TGW',
        imageUrl:
          data.imageUrl ||
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
        sourceUrl: 'https://radiotgw.gob.gt/',
        isFeatured: false,
        directorValidated: validated,
        validatedBy: validated ? 'Validado por el Director General de Radio TGW' : 'Pendiente de Validación - Dirección General'
      }
    });
  }

  async validateOpinion(id: number) {
    return prisma.news.update({
      where: { id },
      data: {
        directorValidated: true,
        validatedBy: 'Validado por el Director General de Radio TGW'
      }
    });
  }
}

export const newsService = new NewsService();
