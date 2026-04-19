import fs from 'fs/promises';
import path from 'path';

export class JsonFileStore {
  constructor(filePath, initialData) {
    this.filePath = filePath;
    this.initialData = initialData;
    this.writeQueue = Promise.resolve();
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify(this.initialData, null, 2), 'utf8');
    }
  }

  async read() {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf8');
    return JSON.parse(raw);
  }

  async write(data) {
    this.writeQueue = this.writeQueue.then(async () => {
      await this.ensureFile();
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    });
    return this.writeQueue;
  }
}
