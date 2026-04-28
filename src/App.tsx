import { useState, useEffect, useRef } from 'react';
import { TIMETABLE, PERIODS, DAYS, ATTENDANCE_BASE_URL, type Day, type ColorType } from './timetableData';
import { QRScanner } from './QRScanner';
import './App.css';

const COLOR_MAP: Record<ColorType, string> = {
  blue: 'cell-blue',
  yellow: 'cell-yellow',
  orange: 'cell-orange',
  green: 'cell-green',
  pink: 'cell-pink',
};

function getTodayDay(now: Date): Day | null {
  const dayIndex = now.getDay();
  if (dayIndex === 0 || dayIndex === 6) return null;
  return DAYS[dayIndex - 1];
}

function getCurrentPeriod(now: Date): number | null {
  const total = now.getHours() * 60 + now.getMinutes();
  for (const p of PERIODS) {
    const [sh, sm] = p.startTime.split(':').map(Number);
    const [eh, em] = p.endTime.split(':').map(Number);
    if (total >= sh * 60 + sm && total < eh * 60 + em) return p.period;
  }
  return null;
}

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [qrTarget, setQrTarget] = useState<{ name: string } | null>(null);
  const [now, setNow] = useState(() => new Date());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());

    // 次の「分の境界」に合わせてから毎分ちょうどに更新する
    // → 授業切り替わり（例: 11:00:00）を遅延なく即座に検知できる
    const msUntilNextMinute =
      (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();

    const timeout = setTimeout(() => {
      tick();
      intervalRef.current = setInterval(tick, 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const today = getTodayDay(now);
  const currentPeriod = getCurrentPeriod(now);
  const currentEntry = today && currentPeriod ? TIMETABLE[currentPeriod][today] : null;
  const currentPeriodInfo = currentPeriod ? PERIODS.find(p => p.period === currentPeriod) : null;

  function handleCellClick(room: number, name: string) {
    if (room >= 700) {
      // 7xx番台はQRコードが暗号化されているためカメラで読み取る
      setQrTarget({ name });
    } else {
      const url = `${ATTENDANCE_BASE_URL}${room}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setToast(`出席登録: ${name.split('\n')[0]}`);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>2026年 1学期</h1>
        <p className="subtitle">授業をタップして出席登録</p>
        {currentEntry && currentPeriodInfo && (
          <button
            className={`now-card ${COLOR_MAP[currentEntry.color]}`}
            onClick={() => handleCellClick(currentEntry.room, currentEntry.name)}
          >
            <span className="now-card-badge">NOW</span>
            <span className="now-card-name">{currentEntry.name}</span>
            <span className="now-card-meta">{currentPeriodInfo.period}限 {currentPeriodInfo.startTime}〜{currentPeriodInfo.endTime}</span>
            <span className="room-badge">{currentEntry.room}</span>
          </button>
        )}
      </header>

      <div className="table-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th className="th-period"></th>
              {DAYS.map((day) => (
                <th key={day} className={`th-day ${day === today ? 'today' : ''}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((p) => (
              <tr key={p.period} className={currentPeriod === p.period ? 'current-row' : ''}>
                <td className="td-period">
                  <span className="period-num">{p.period}</span>
                  <span className="period-time">{p.startTime}</span>
                  <span className="period-time">{p.endTime}</span>
                </td>
                {DAYS.map((day) => {
                  const entry = TIMETABLE[p.period][day];
                  const isCurrentCell = day === today && p.period === currentPeriod;
                  return (
                    <td key={day} className="td-cell">
                      {entry ? (
                        <button
                          className={`class-cell ${COLOR_MAP[entry.color]} ${isCurrentCell ? 'current-cell' : ''}`}
                          onClick={() => handleCellClick(entry.room, entry.name)}
                          title={`${entry.name.replace('\n', ' ')} — 教室 ${entry.room}`}
                        >
                          <span className="class-name">{entry.name}</span>
                          <span className="room-badge">{entry.room}</span>
                          {isCurrentCell && <span className="now-badge">NOW</span>}
                        </button>
                      ) : (
                        <div className="empty-cell" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {qrTarget && (
        <QRScanner
          courseName={qrTarget.name}
          onClose={() => setQrTarget(null)}
        />
      )}
    </div>
  );
}
