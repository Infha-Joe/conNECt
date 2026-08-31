import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/events/${id}`);
    setEvent(data.event);
    setRegistrationCount(data.registrationCount);
    setIsRegistered(data.isRegistered);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const toggleRegistration = async () => {
    if (isRegistered) await api.delete(`/events/${id}/register`);
    else await api.post(`/events/${id}/register`);
    load();
  };

  if (loading) return (<DashboardLayout><div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div></DashboardLayout>);

  const isFull = event.capacity > 0 && registrationCount >= event.capacity;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-medium text-ink">{event.title}</h1>
              <p className="mt-1 text-sm text-slate-text">
                Organized by <Link to={`/profile/${event.organizer._id}`} className="hover:underline">{event.organizer.name}</Link>
                {event.club && <> · {event.club.name}</>}
              </p>
            </div>
            <button onClick={toggleRegistration} disabled={!isRegistered && isFull}
              className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-40 ${isRegistered ? "border border-ink/15 text-ink hover:bg-ink/5" : "bg-ink text-parchment hover:bg-ink-light"}`}>
              {isRegistered ? "Registered" : isFull ? "Full" : "Register"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-ink/5 pt-4 text-sm text-slate-text">
            <span className="flex items-center gap-1.5"><CalendarIcon size={15} />{new Date(event.eventDate).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}</span>
            {event.venue && <span className="flex items-center gap-1.5"><MapPin size={15} />{event.venue}</span>}
            <span className="flex items-center gap-1.5"><Users size={15} />{registrationCount}{event.capacity > 0 ? ` / ${event.capacity}` : ""} registered</span>
          </div>

          {event.description && <p className="mt-4 text-sm text-ink">{event.description}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventDetail;
