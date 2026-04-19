import { Router } from 'express';

export const buildRoutes = (service) => {
  const router = Router();

  router.get('/health', (_, res) => res.json({ ok: true }));
  router.get('/bootstrap', async (_, res, next) => {
    try { res.json(await service.getDashboard()); } catch (e) { next(e); }
  });

  router.post('/experiences', async (req, res, next) => {
    try { res.status(201).json(await service.createExperience(req.body)); } catch (e) { next(e); }
  });
  router.put('/experiences/:id', async (req, res, next) => {
    try {
      const updated = await service.updateExperience(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found' });
      return res.json(updated);
    } catch (e) { next(e); }
  });
  router.delete('/experiences/:id', async (req, res, next) => {
    try {
      const ok = await service.deleteExperience(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Not found' });
      return res.status(204).send();
    } catch (e) { next(e); }
  });

  router.post('/personal-schedules', async (req, res, next) => {
    try { res.status(201).json(await service.upsertPersonalSchedule(req.body)); } catch (e) { next(e); }
  });
  router.put('/personal-schedules/:id', async (req, res, next) => {
    try { res.json(await service.upsertPersonalSchedule({ ...req.body, id: req.params.id })); } catch (e) { next(e); }
  });
  router.delete('/personal-schedules/:id', async (req, res, next) => {
    try { await service.deletePersonalSchedule(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  });

  router.patch('/notifications/:id', async (req, res, next) => {
    try { res.json(await service.markNotification(req.params.id, req.body.read)); } catch (e) { next(e); }
  });

  return router;
};
