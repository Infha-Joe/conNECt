import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar as CalendarIcon } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", venue: "", eventDate: "" });
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    const { data } = await api.get("/events");
    setEvents(data.events);
    setLoading(false);
  };

  useEffect(() => { loadEvents(); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/events", form);
      setForm({ title: "", description: "", venue: "", eventDate: "" });
      setShowCreate(false);
      loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create event");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Events</h1>
          <button onClick={() => setShowCreate((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light">
            <Plus size={16} /> New event
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
            <input required name="title" value={form.title} onChange={handleChange} placeholder="Event title"
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={2}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <div className="grid grid-cols-2 gap-3">
              <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue"
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
              <input required type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange}
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Create</button>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
          {!loading && events.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No events scheduled.</p>}
          {events.map((event) => (
            <Link key={event._id} to={`/events/${event._id}`} className="block rounded-xl border border-ink/10 bg-white p-4 transition hover:border-brass/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{event.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-text">
                    <span className="flex items-center gap-1"><CalendarIcon size={13} />{new Date(event.eventDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                    {event.venue && <span className="flex items-center gap-1"><MapPin size={13} />{event.venue}</span>}
                  </div>
                </div>
                <span className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium capitalize text-sage">{event.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Events;
