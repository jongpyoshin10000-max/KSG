import React from 'react';
import { TABS } from '../constants/ui';

export default function Tabs({ active, setActive, unreadCount }) {
  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button key={tab.key} className={active === tab.key ? 'active' : ''} onClick={() => setActive(tab.key)}>
          {tab.label} {tab.key === 'alerts' && unreadCount > 0 ? <span className="badge">N</span> : null}
        </button>
      ))}
    </div>
  );
}
