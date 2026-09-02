import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Calendar = () => {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const loadMonthEvents = async () => {
    setLoading(true);
    const from = new Date(year, month, 1).toISOString();
    const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    const { data } = await api.get("/events", { params: { from, to } });
    setEvents(data.events);
    setLoading(false);
  };

  useEffect(() => { loadMonthEvents(); setSelectedDate(null); /* eslint-disable-next-line */ }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const day = new Date(e.eventDate).getDate();
      map[day] = map[day] || [];
      map[day].push(e);
    });
    return map;
  }, [events]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const { data } = await api.get("/events", { params: { search: searchQuery.trim() } });
    setSearchResults(data.events);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const todayKey = new Date().toDateString();
  const selectedDayEvents = selectedDate ? eventsByDay[selectedDate] || [] : [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-medium text-ink">Calendar</h1>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-text" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events — e.g. 'coding workshop'"
              className="w-full rounded-lg border border-ink/15 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brass" />
          </div>
          <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-parchment hover:bg-ink-light">Search</button>
        </form>

        {searchResults !== null ? (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</p>
              <button onClick={() => { setSearchResults(null); setSearchQuery(""); }} className="text-xs text-brass-dark hover:underline">Back to calendar</button>
            </div>
            {searchResults.map((e) => (
              <Link key={e._id} to={`/events/${e._id}`} className="block rounded-lg border border-ink/10 bg-white p-3 text-sm transition hover:border-brass/40">
                <p className="font-medium text-ink">{e.title}</p>
                <p className="text-xs text-slate-text">{new Date(e.eventDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg p-2 text-ink transition hover:bg-ink/5"><ChevronLeft size={18} /></button>
              <p className="font-display text-lg text-ink">{monthNames[month]} {year}</p>
              <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg p-2 text-ink transition hover:bg-ink/5"><ChevronRight size={18} /></button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-text">
              {["S","M","T","W","T","F","S"].map((d, i) => (<div key={i} className="py-1">{d}</div>))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset }).map((_, i) => (<div key={`empty-${i}`} />))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = eventsByDay[day] || [];
                const isToday = new Date(year, month, day).toDateString() === todayKey;
                return (
                  <button key={day} onClick={() => setSelectedDate(day)}
                    className={`flex aspect-square flex-col items-center justify-start rounded-lg border p-1.5 text-sm transition ${selectedDate === day ? "border-brass bg-brass/10" : "border-ink/10 bg-white hover:border-brass/30"}`}>
                    <span className={isToday ? "font-bold text-brass-dark" : "text-ink"}>{day}</span>
                    {dayEvents.length > 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brass" />}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-semibold text-ink">{monthNames[month]} {selectedDate}, {year}</p>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-slate-text">No events on this day.</p>
                ) : (
                  selectedDayEvents.map((e) => (
                    <Link key={e._id} to={`/events/${e._id}`} className="block rounded-lg border border-ink/10 bg-white p-3 text-sm transition hover:border-brass/40">
                      <p className="font-medium text-ink">{e.title}</p>
                      <p className="text-xs text-slate-text">{new Date(e.eventDate).toLocaleTimeString(undefined, { timeStyle: "short" })}{e.venue && ` · ${e.venue}`}</p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
