import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PERIOD_OPTIONS } from '../constants/ui';
import { won } from '../utils/format';

const COLORS = ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function StatsPage({ data }) {
  const [period, setPeriod] = useState('month');
  const [site, setSite] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [payback, setPayback] = useState('all');

  const filtered = useMemo(() => (data?.experiences || []).filter((x) =>
    (site === 'all' || x.site === site) && (type === 'all' || x.type === type) && (status === 'all' || x.status === status) && (payback === 'all' || String(Boolean(x.paybackRequired)) === payback)
  ), [data, site, type, status, payback]);

  const bucket = (d) => {
    if (!d) return '미정';
    const dt = dayjs(d);
    if (period === 'year') return dt.format('YYYY');
    if (period === 'day') return dt.format('YYYY-MM-DD');
    return dt.format('YYYY-MM');
  };

  const periodData = Object.entries(filtered.reduce((a, c) => ({ ...a, [bucket(c.reviewDeadlineDate)]: (a[bucket(c.reviewDeadlineDate)] || 0) + 1 }), {})).map(([name, count]) => ({ name, count }));
  const typeData = Object.entries(filtered.reduce((a, c) => ({ ...a, [c.type]: (a[c.type] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));

  const totalProvided = filtered.reduce((a, c) => a + Number(c.providedAmount || 0), 0);
  const totalRefund = filtered.reduce((a, c) => a + Number(c.refundAmount || 0), 0);
  const totalPayback = filtered.reduce((a, c) => a + Number(c.paybackAmount || 0), 0);
  const completed = filtered.filter((x) => ['승인완료', '페이백완료'].includes(x.status)).length;
  const completionRate = filtered.length ? Math.round((completed / filtered.length) * 100) : 0;

  return (<div>
    <div className="toolbar">
      {PERIOD_OPTIONS.map((p) => <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>{p.toUpperCase()}</button>)}
      <select value={site} onChange={(e) => setSite(e.target.value)}><option value="all">전체 사이트</option>{(data?.config?.sites || []).map((x) => <option key={x}>{x}</option>)}</select>
      <select value={type} onChange={(e) => setType(e.target.value)}><option value="all">전체 유형</option>{(data?.config?.types || []).map((x) => <option key={x}>{x}</option>)}</select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">전체 상태</option>{(data?.config?.statuses || []).map((x) => <option key={x}>{x}</option>)}</select>
      <select value={payback} onChange={(e) => setPayback(e.target.value)}><option value="all">페이백 전체</option><option value="true">페이백</option><option value="false">비페이백</option></select>
    </div>
    <div className="summary-grid">
      <div className="card"><b>기간별 건수</b><span>{periodData.reduce((a,c)=>a+c.count,0)}</span></div>
      <div className="card"><b>제공금액 합계</b><span>{won(totalProvided)}</span></div>
      <div className="card"><b>환급금액 합계</b><span>{won(totalRefund)}</span></div>
      <div className="card"><b>페이백금액 합계</b><span>{won(totalPayback)}</span></div>
      <div className="card"><b>완료율</b><span>{completionRate}%</span></div>
    </div>
    <div className="chart-grid">
      <div className="panel"><h3>기간별 체험단 건수</h3><ResponsiveContainer width="100%" height={280}><BarChart data={periodData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#2563eb" /></BarChart></ResponsiveContainer></div>
      <div className="panel"><h3>유형별 건수</h3><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={typeData} dataKey="value" nameKey="name" outerRadius={95}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
    </div>
  </div>);
}
