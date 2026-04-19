import React from 'react';

export default function AlertsPage({ data, actions, onOpenExperience }) {
  const grouped = [7, 3, 1].map((d) => ({ days: d, items: (data?.notifications || []).filter((n) => n.daysLeft === d) }));

  return <div className="alerts-grid">
    {grouped.map((group) => <div key={group.days} className="panel"><h3>{group.days}일 전</h3>
      {!group.items.length ? <p>해당 알림 없음</p> : group.items.map((item) => (
        <div key={item.id} className={`alert-item ${item.read ? 'read' : 'unread'}`}>
          <div onClick={() => onOpenExperience?.(item.experienceId)}>
            <b>{item.title}</b><p>{item.category} - {item.dueDate}</p>
          </div>
          <button onClick={() => actions.markNotification.mutate({ id: item.id, read: !item.read })}>{item.read ? '읽음해제' : '읽음처리'}</button>
        </div>
      ))}
    </div>)}
  </div>;
}
