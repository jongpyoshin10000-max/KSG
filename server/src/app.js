import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExperienceRepository } from './repositories/experienceRepository.js';
import { ExperienceService } from './services/experienceService.js';
import { buildRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();
  const repo = new ExperienceRepository();
  const service = new ExperienceService(repo);

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use('/api', buildRoutes(service));

  // 향후 로그인 도입 시 auth router/middleware를 이 지점에 확장
  // app.use('/api/auth', authRouter)

  const staticDir = path.join(__dirname, '../../client/dist');
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    return res.sendFile(path.join(staticDir, 'index.html'));
  });

  app.use(errorHandler);
  return app;
};
