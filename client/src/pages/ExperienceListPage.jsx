import React, { useMemo, useState } from 'react';
import ExperienceFormModal from '../components/ExperienceFormModal';
import { toDateLabel, truncate, won } from '../utils/format';

export default function ExperienceListPage({ data, actions, selectedId, setSelectedId, onNavigateDetail }) {
  const [query, setQuery] = useState('');
  const [site, setSite] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [payback, setPayback] = useState('all');
  const [sortKey, setSortKey] = useState('reviewDeadlineDate');
  const [modal, setModal] = useState({ open: false, item: null });

  const items = data?.experiences || [];
  const filtered = useMemo(() => items
    .filter((i) => (query ? `${i.title} ${i.site}`.includes(query) : true))
    .filter((i) => (site === 'all' ? true : i.site === site))
    .filter((i) => (type === 'all' ? true : i.type === type))
    .filter((i) => (status === 'all' ? true : i.status === status))
    .filter((i) => (payback === 'all' ? true : String(Boolean(i.paybackRequired)) === payback))
    .sort((a, b) => String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''))), [items, query, site, type, status, payback, sortKey]);

  const selected = items.find((i) => i.id === selectedId) || filtered[0];
  React.useEffect(() => { if (!selectedId && filtered[0]) setSelectedId(filtered[0].id); }, [selectedId, filtered, setSelectedId]);

  const save = async (payload) => {
    if (!payload.title || !payload.site || !payload.reviewDeadlineDate) return alert('필수값 누락');
    if (payload.id) await actions.updateExperience.mutateAsync({ id: payload.id, payload });
    else await actions.createExperience.mutateAsync(payload);
    setModal({ open: false, item: null });
  };

  const del = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await actions.deleteExperience.mutateAsync(id);
  };

  return (
    <div className="list-layout">
      <section>
        <div className="toolbar">
          <input placeholder="검색" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={site} onChange={(e) => setSite(e.target.value)}><option value="all">전체 사이트</option>{(data?.config?.sites || []).map((x) => <option key={x}>{x}</option>)}</select>
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="all">전체 유형</option>{(data?.config?.types || []).map((x) => <option key={x}>{x}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">전체 상태</option>{(data?.config?.statuses || []).map((x) => <option key={x}>{x}</option>)}</select>
          <select value={payback} onChange={(e) => setPayback(e.target.value)}><option value="all">페이백 전체</option><option value="true">페이백</option><option value="false">비페이백</option></select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}><option value="reviewDeadlineDate">리뷰마감일</option><option value="visitReservationDate">예약일</option><option value="shippingDate">배송일</option></select>
          <button onClick={() => setModal({ open: true, item: null })}>체험단 등록</button>
        </div>
        {filtered.length === 0 ? <div className="empty">등록된 데이터가 없습니다.</div> : (
          <table className="list-table"><thead><tr><th>상태</th><th>사이트</th><th>체험명</th><th>유형</th><th>지역</th><th>예약/배송일</th><th>리뷰마감일</th><th>페이백</th><th>제공금액</th><th>환급금액</th></tr></thead>
            <tbody>{filtered.map((i) => <tr key={i.id} className={selected?.id === i.id ? 'selected' : ''} onClick={() => { setSelectedId(i.id); onNavigateDetail?.('list', i.id); }}><td>{i.status}</td><td>{i.site}</td><td>{truncate(i.title, 24)}</td><td>{i.type}</td><td>{i.region || '-'}</td><td>{toDateLabel(i.visitReservationDate || i.shippingDate)}</td><td>{toDateLabel(i.reviewDeadlineDate)}</td><td>{i.paybackRequired ? 'Y' : 'N'}</td><td>{won(i.providedAmount)}</td><td>{won(i.refundAmount)}</td></tr>)}</tbody>
          </table>
        )}
      </section>
      <aside>
        <h3>상세정보</h3>
        {!selected ? <div className="empty">선택된 항목 없음</div> : <>
          <div className="detail-sections">
            <div><h4>기본정보</h4><p>ID: {selected.id}</p><p>사이트: {selected.site}</p><p>체험명: {selected.title}</p><p>유형: {selected.type}</p><p>상태: {selected.status}</p><p>지역: {selected.region || '-'}</p></div>
            <div><h4>일정정보</h4><p>배송여부: {selected.shippingRequired ? 'Y' : 'N'}</p><p>배송일: {toDateLabel(selected.shippingDate)}</p><p>방문예약일: {toDateLabel(selected.visitReservationDate)}</p><p>리뷰마감일: {toDateLabel(selected.reviewDeadlineDate)}</p></div>
            <div><h4>리뷰/링크</h4><p>리뷰등록여부: {selected.reviewRegistered ? 'Y' : 'N'}</p><p>블로그URL: {selected.blogUrl || '-'}</p><p>구매사이트URL: {selected.purchaseSiteUrl || '-'}</p><p>제출URL: {selected.submitUrl || '-'}</p></div>
            <div><h4>금액정보</h4><p>제공금액: {won(selected.providedAmount)}</p><p>추가금액: {won(selected.extraAmount)}</p><p>페이백금액: {won(selected.paybackAmount)}</p><p>환급금액: {won(selected.refundAmount)}</p></div>
            <div><h4>메모</h4><p>{selected.memo || '-'}</p><h4>확장필드</h4>{Object.keys(selected.extraFields || {}).length ? Object.entries(selected.extraFields).map(([k,v]) => <p key={k}>{k}: {String(v)}</p>) : <p>-</p>}</div>
          </div>
          <div className="actions"><button onClick={() => setModal({ open: true, item: selected })}>수정</button><button onClick={() => del(selected.id)}>삭제</button></div>
        </>}
      </aside>
      <ExperienceFormModal open={modal.open} onClose={() => setModal({ open: false, item: null })} onSubmit={save} config={data?.config} initialValue={modal.item} />
    </div>
  );
}
