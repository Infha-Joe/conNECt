import { FiBox } from "react-icons/fi";

const EmptyState = ({ icon: Icon = FiBox, title, description, action, compact = false }) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Icon size={24} className="mb-2 text-slate-500/50" />
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500">
        <Icon size={24} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-ink">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
