import { FiBox } from "react-icons/fi";

const EmptyState = ({ icon: Icon = FiBox, title, description, action, compact = false }) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Icon size={24} className="mb-2 text-ink-lighter" />
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-xs text-ink-light">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-background">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border text-ink-light">
        <Icon size={24} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-ink">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-ink-light">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
