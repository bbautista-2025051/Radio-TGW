import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { loadOrGenerateSSL } from '../config/ssl';

export class PortalController {
  async getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [culturalEvents, programs, archives, totalNews, pendingOpinions] = await Promise.all([
        prisma.culturalEvent.findMany({ orderBy: { id: 'asc' } }),
        prisma.radioProgram.findMany({ orderBy: { id: 'asc' } }),
        prisma.historicalArchive.findMany({ orderBy: { id: 'asc' } }),
        prisma.news.count(),
        prisma.news.findMany({
          where: { category: 'OPINION_W', directorValidated: false },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      const { metadata } = loadOrGenerateSSL();

      res.json({
        status: 'success',
        data: {
          exchangeRate: env.EXCHANGE_RATE_GTQ,
          totalNews,
          culturalEvents,
          programs,
          archives,
          pendingOpinions,
          securityCertificate: metadata
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async submitProcedure(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { procedureType, applicantName, dpiOrNit, email, phone, details } = req.body;
      if (!procedureType || !applicantName || !dpiOrNit || !email) {
        res.status(400).json({
          status: 'error',
          message: 'Todos los campos obligatorios del trámite deben completarse.'
        });
        return;
      }

      const trackingCode = `TGW-TRM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const submission = await prisma.procedureSubmission.create({
        data: {
          trackingCode,
          procedureType: String(procedureType),
          applicantName: String(applicantName).trim(),
          dpiOrNit: String(dpiOrNit).trim(),
          email: String(email).trim(),
          phone: phone ? String(phone).trim() : '',
          details: details ? String(details).trim() : ''
        }
      });

      res.status(201).json({
        status: 'success',
        message: `Solicitud registrada con éxito en la ventanilla electrónica de TGW. Número de expediente: ${trackingCode}`,
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  async submitCitizenReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reportType, citizenName, email, subject, message, isAnonymous } = req.body;
      if (!reportType || !subject || !message) {
        res.status(400).json({
          status: 'error',
          message: 'El tipo de gestión, asunto y descripción son obligatorios.'
        });
        return;
      }

      const trackingCode = `TGW-VOZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const report = await prisma.citizenReport.create({
        data: {
          trackingCode,
          reportType: String(reportType),
          citizenName: isAnonymous ? 'Ciudadano Anónimo' : String(citizenName || 'Ciudadano').trim(),
          email: String(email || 'sin-correo@ciudadano.gt').trim(),
          subject: String(subject).trim(),
          message: String(message).trim(),
          isAnonymous: Boolean(isAnonymous)
        }
      });

      res.status(201).json({
        status: 'success',
        message: `Gestión de Voz Ciudadana recibida correctamente. Código de seguimiento: ${trackingCode}`,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }

  async getSecurityCertificate(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { metadata } = loadOrGenerateSSL();
      res.json({
        status: 'success',
        data: metadata
      });
    } catch (error) {
      next(error);
    }
  }
}

export const portalController = new PortalController();
