import { Router } from 'express';
import { portalController } from '../controllers/portal.controller';

const router = Router();

router.get('/overview', (req, res, next) => portalController.getOverview(req, res, next));
router.post('/procedures', (req, res, next) => portalController.submitProcedure(req, res, next));
router.post('/citizen-reports', (req, res, next) => portalController.submitCitizenReport(req, res, next));
router.get('/security/certificate', (req, res, next) => portalController.getSecurityCertificate(req, res, next));

export default router;
