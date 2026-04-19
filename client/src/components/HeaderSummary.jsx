import React from 'react';
import { won } from '../utils/format';

export default function HeaderSummary({ summary = {} }) {
  const typeEntries = Object.entries(summary.byType || {}).slice(0, 4);
  const statusEntries = Object.entries(summary.byStatus || {}).slice(0, 4);
  return (
    <header className="header">
      <h1>체험단 일정관리</h1>
      <div className="summary-grid">
        <div className="card"><b>전체 건수</b><span>{summary.totalCount || 0}</span></div>
        <div className="card"><b>총 제공금액</b><span>{won(summary.totalProvidedAmount)}</span></div>
        <div className="card"><b>총 환급금액</b><span>{won(summary.totalRefundAmount)}</span></div>
        <div className="card"><b>총 페이백금액</b><span>{won(summary.totalPaybackAmount)}</span></div>
        <div className="card wide"><b>유형별</b><span>{typeEntries.map(([k, v]) => `${k}:${v}`).join(' | ') || '-'}</span></div>
        <div className="card wide"><b>상태별</b><span>{statusEntries.map(([k, v]) => `${k}:${v}`).join(' | ') || '-'}</span></div>
      </div>
    </header>
  );
}
