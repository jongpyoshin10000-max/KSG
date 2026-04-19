import path from 'path';
import { fileURLToPath } from 'url';
import { BaseRepository } from './baseRepository.js';
import { JsonFileStore } from '../utils/jsonFileStore.js';
import { EXPERIENCE_STATUSES, EXPERIENCE_TYPES, SITE_OPTIONS } from '../constants/domainConstants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialData = {
  meta: { version: 1, lastUpdated: new Date().toISOString() },
  config: { sites: SITE_OPTIONS, types: EXPERIENCE_TYPES, statuses: EXPERIENCE_STATUSES },
  experiences: [],
  personalSchedules: [],
  notifications: []
};

export class ExperienceRepository extends BaseRepository {
  constructor() {
    super();
    this.store = new JsonFileStore(path.join(__dirname, '../data/storage.json'), initialData);
  }

  async findAll() {
    const data = await this.store.read();
    return { ...initialData, ...data, config: { ...initialData.config, ...(data.config || {}) } };
  }

  async saveAll(data) {
    const safe = { ...initialData, ...data, meta: { version: 1, lastUpdated: new Date().toISOString() } };
    await this.store.write(safe);
    return safe;
  }
}
