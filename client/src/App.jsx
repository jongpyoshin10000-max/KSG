import React, { useMemo, useState } from 'react';
import HeaderSummary from './components/HeaderSummary';
import Tabs from './components/Tabs';
import { useDashboard, useDashboardActions } from './hooks/useDashboard';
import ExperienceListPage from './pages/ExperienceListPage';
import StatsPage from './pages/StatsPage';
import CalendarPage from './pages/CalendarPage';
import AlertsPage from './pages/AlertsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedId, setSelectedId] = useState('');
  const { data, isLoading, error } = useDashboard();
  const actions = useDashboardActions();

  const unreadCount = useMemo(() => (data?.notifications || []).filter((n) => !n.read).length, [data]);

  if (isLoading) return <div className="center">로딩중...</div>;
  if (error) return <div className="center">에러가 발생했습니다.</div>;

  return (
    <div className="app-shell">
      <HeaderSummary summary={data?.summary} />
      <Tabs active={activeTab} setActive={setActiveTab} unreadCount={unreadCount} />

      {activeTab === 'list' && <ExperienceListPage data={data} actions={actions} selectedId={selectedId} setSelectedId={setSelectedId} />}
      {activeTab === 'stats' && <StatsPage data={data} />}
      {activeTab === 'calendar' && <CalendarPage data={data} actions={actions} onSelectExperience={(id) => { setSelectedId(id); setActiveTab('list'); }} />}
      {activeTab === 'alerts' && <AlertsPage data={data} actions={actions} onOpenExperience={(id) => { setSelectedId(id); setActiveTab('list'); }} />}
    </div>
  );
}
