import React, { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { ko };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: (d) => startOfWeek(d, { weekStartsOn: 0 }), getDay, locales });

export default function CalendarPage({ data, actions, onSelectExperience }) {
  const [showExperience, setShowExperience] = useState(true);
  const [showVisitOnly, setShowVisitOnly] = useState(false);
  const [showPersonal, setShowPersonal] = useState(true);
  const [draft, setDraft] = useState({ title: '', date: '', note: '' });

  const events = useMemo(() => {
    const ex = (data?.experiences || []).flatMap((i) => {
      const list = [];
      if (showExperience && i.reviewDeadlineDate) list.push({ id: `review-${i.id}`, title: `[리뷰마감] ${i.title}`, start: new Date(i.reviewDeadlineDate), end: new Date(i.reviewDeadlineDate), allDay: true, color: '#111111', experienceId: i.id });
      if ((showVisitOnly || showExperience) && i.visitReservationDate && i.type.includes('방문')) list.push({ id: `visit-${i.id}`, title: `[방문] ${i.title}`, start: new Date(i.visitReservationDate), end: new Date(i.visitReservationDate), allDay: true, color: '#1d4ed8', experienceId: i.id });
      return list;
    });
    const ps = showPersonal ? (data?.personalSchedules || []).map((p) => ({ id: p.id, title: `[개인] ${p.title}`, start: new Date(p.date), end: new Date(p.date), allDay: true, color: '#111111', bg: '#fef08a', personal: true, note: p.note })) : [];
    return [...ex, ...ps];
  }, [data, showExperience, showVisitOnly, showPersonal]);

  return <div>
    <div className="toolbar">
      <label><input type="checkbox" checked={showExperience} onChange={(e) => setShowExperience(e.target.checked)} /> 전체체험단(리뷰마감)</label>
      <label><input type="checkbox" checked={showVisitOnly} onChange={(e) => setShowVisitOnly(e.target.checked)} /> 방문형 일정</label>
      <label><input type="checkbox" checked={showPersonal} onChange={(e) => setShowPersonal(e.target.checked)} /> 개인일정</label>
      <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
      <input placeholder="개인일정 제목" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      <input placeholder="메모" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
      <button onClick={() => actions.saveSchedule.mutate(draft)}>개인일정 등록</button>
    </div>
    <div className="legend">범례: <span>검정=전체 체험단</span> <span style={{ color: '#1d4ed8' }}>파랑=방문형</span> <span style={{ background: '#fef08a' }}>노랑음영=개인일정</span></div>
    <div style={{ height: 700, background: '#fff', padding: 8 }}>
      <Calendar
        localizer={localizer}
        events={events}
        views={['month']}
        defaultView="month"
        style={{ height: '100%' }}
        eventPropGetter={(event) => ({ style: { color: event.color, backgroundColor: event.bg || '#fff', border: '1px solid #ddd' } })}
        onSelectEvent={(event) => {
          if (event.experienceId) onSelectExperience?.(event.experienceId);
          if (event.personal && window.confirm('개인일정을 삭제할까요?')) actions.deleteSchedule.mutate(event.id);
        }}
      />
    </div>
  </div>;
}
