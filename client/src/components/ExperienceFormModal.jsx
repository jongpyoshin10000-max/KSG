import React, { useMemo, useState } from 'react';

const fieldDefs = [
  ['site', '사이트', 'text', true], ['title', '체험명', 'text', true], ['region', '방문지역', 'text'],
  ['type', '유형', 'select', true], ['status', '상태', 'select', true], ['shippingRequired', '배송여부', 'checkbox'],
  ['shippingDate', '배송일자', 'date'], ['visitReservationDate', '방문예약일자', 'date'], ['reviewDeadlineDate', '리뷰등록마감일자', 'date', true],
  ['reviewRegistered', '리뷰등록여부', 'checkbox'], ['blogUrl', '블로그URL', 'text'], ['purchaseSiteUrl', '구매사이트URL', 'text'],
  ['submitUrl', '제출URL', 'text'], ['providedAmount', '제공금액', 'number'], ['extraAmount', '추가금액', 'number'],
  ['paybackAmount', '페이백금액', 'number'], ['refundAmount', '환급금액', 'number'], ['paybackRequired', '페이백여부', 'checkbox'],
  ['paybackCompleted', '페이백완료여부', 'checkbox'], ['memo', '메모', 'textarea']
];

export default function ExperienceFormModal({ open, onClose, onSubmit, config, initialValue }) {
  const [form, setForm] = useState(initialValue || {});
  const [extraKey, setExtraKey] = useState('');
  const [extraValue, setExtraValue] = useState('');

  React.useEffect(() => setForm(initialValue || {}), [initialValue]);

  const typeOptions = config?.types || [];
  const statusOptions = config?.statuses || [];
  const canShow = open;
  const hiddenFields = useMemo(() => ({
    shippingDate: !String(form.type || '').includes('제공'),
    visitReservationDate: !String(form.type || '').includes('방문')
  }), [form.type]);

  if (!canShow) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? '체험단 수정' : '체험단 등록'}</h3>
        <div className="form-grid">
          {fieldDefs.map(([key, label, type, required]) => {
            if (hiddenFields[key]) return null;
            const val = form[key] ?? (type === 'checkbox' ? false : '');
            if (type === 'select') {
              const options = key === 'type' ? typeOptions : statusOptions;
              return <label key={key}>{label}<select value={val} required={required} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
            }
            if (type === 'checkbox') return <label key={key}><input type="checkbox" checked={Boolean(val)} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} /> {label}</label>;
            if (type === 'textarea') return <label key={key} className="full">{label}<textarea value={val} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>;
            return <label key={key}>{label}<input type={type} value={val} required={required} onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value || 0) : e.target.value })} /></label>;
          })}
        </div>
        <div className="extra-row">
          <input placeholder="추가 필드명" value={extraKey} onChange={(e) => setExtraKey(e.target.value)} />
          <input placeholder="추가 필드값" value={extraValue} onChange={(e) => setExtraValue(e.target.value)} />
          <button onClick={() => {
            if (!extraKey) return;
            setForm({ ...form, extraFields: { ...(form.extraFields || {}), [extraKey]: extraValue } });
            setExtraKey(''); setExtraValue('');
          }}>추가</button>
        </div>
        <div className="chips">{Object.entries(form.extraFields || {}).map(([k, v]) => <span key={k}>{k}:{String(v)}</span>)}</div>
        <div className="actions">
          <button onClick={onClose}>취소</button>
          <button onClick={() => onSubmit(form)}>저장</button>
        </div>
      </div>
    </div>
  );
}
