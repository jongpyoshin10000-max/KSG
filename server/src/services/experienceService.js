import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { BASE_FIELDS } from '../constants/domainConstants.js';

export class ExperienceService {
  constructor(repository) {
    this.repository = repository;
  }

  normalize(input) {
    return {
      ...BASE_FIELDS,
      ...input,
      id: input.id || uuid(),
      providedAmount: Number(input.providedAmount || 0),
      extraAmount: Number(input.extraAmount || 0),
      paybackAmount: Number(input.paybackAmount || 0),
      refundAmount: Number(input.refundAmount || 0),
      shippingRequired: Boolean(input.shippingRequired),
      reviewRegistered: Boolean(input.reviewRegistered),
      paybackRequired: Boolean(input.paybackRequired),
      paybackCompleted: Boolean(input.paybackCompleted),
      extraFields: input.extraFields || {}
    };
  }

  async getDashboard() {
    const data = await this.repository.findAll();
    const summary = this.calculateSummary(data.experiences);
    const notifications = this.calculateNotifications(data.experiences, data.notifications);
    return { ...data, summary, notifications };
  }

  calculateSummary(experiences) {
    const totalProvidedAmount = experiences.reduce((acc, item) => acc + Number(item.providedAmount || 0), 0);
    const totalRefundAmount = experiences.reduce((acc, item) => acc + Number(item.refundAmount || 0), 0);
    const totalPaybackAmount = experiences.reduce((acc, item) => acc + Number(item.paybackAmount || 0), 0);
    const byType = experiences.reduce((acc, cur) => ({ ...acc, [cur.type]: (acc[cur.type] || 0) + 1 }), {});
    const byStatus = experiences.reduce((acc, cur) => ({ ...acc, [cur.status]: (acc[cur.status] || 0) + 1 }), {});

    return {
      totalCount: experiences.length,
      byType,
      byStatus,
      totalProvidedAmount,
      totalRefundAmount,
      totalPaybackAmount
    };
  }

  calculateNotifications(experiences, readStates = []) {
    const today = dayjs().startOf('day');
    const targets = [];
    const offsets = [7, 3, 1];

    experiences.forEach((item) => {
      const dateCandidates = [
        { key: 'reviewDeadlineDate', date: item.reviewDeadlineDate, label: '리뷰마감' },
        { key: 'visitReservationDate', date: item.visitReservationDate, label: '방문예약' },
        { key: 'shippingDate', date: item.shippingDate, label: '배송일자' }
      ];
      dateCandidates.forEach((c) => {
        if (!c.date) return;
        const diff = dayjs(c.date).startOf('day').diff(today, 'day');
        if (offsets.includes(diff)) {
          const id = `${item.id}:${c.key}:${diff}`;
          const found = readStates.find((r) => r.id === id);
          targets.push({ id, experienceId: item.id, title: item.title, category: c.label, dueDate: c.date, daysLeft: diff, read: Boolean(found?.read) });
        }
      });
    });
    return targets.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  async createExperience(payload) {
    const data = await this.repository.findAll();
    const experience = this.normalize(payload);
    data.experiences.unshift(experience);
    await this.repository.saveAll(data);
    return experience;
  }

  async updateExperience(id, payload) {
    const data = await this.repository.findAll();
    const index = data.experiences.findIndex((i) => i.id === id);
    if (index < 0) return null;
    data.experiences[index] = this.normalize({ ...data.experiences[index], ...payload, id });
    await this.repository.saveAll(data);
    return data.experiences[index];
  }

  async deleteExperience(id) {
    const data = await this.repository.findAll();
    const next = data.experiences.filter((i) => i.id !== id);
    if (next.length === data.experiences.length) return false;
    data.experiences = next;
    await this.repository.saveAll(data);
    return true;
  }

  async upsertPersonalSchedule(payload) {
    const data = await this.repository.findAll();
    const item = { id: payload.id || uuid(), title: payload.title, date: payload.date, note: payload.note || '' };
    const idx = data.personalSchedules.findIndex((p) => p.id === item.id);
    if (idx >= 0) data.personalSchedules[idx] = item;
    else data.personalSchedules.unshift(item);
    await this.repository.saveAll(data);
    return item;
  }

  async deletePersonalSchedule(id) {
    const data = await this.repository.findAll();
    data.personalSchedules = data.personalSchedules.filter((x) => x.id !== id);
    await this.repository.saveAll(data);
    return true;
  }

  async markNotification(id, read) {
    const data = await this.repository.findAll();
    const idx = data.notifications.findIndex((n) => n.id === id);
    if (idx >= 0) data.notifications[idx].read = read;
    else data.notifications.push({ id, read: Boolean(read) });
    await this.repository.saveAll(data);
    return { id, read: Boolean(read) };
  }
}
