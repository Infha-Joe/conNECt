const SpotlightCategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = ["students", "faculty", "alumni"];

  return (
    <div className="flex items-center justify-center gap-8 border-b border-slate-200 mb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`pb-3 text-[13px] font-bold uppercase tracking-wider transition-colors relative ${
            activeCategory === cat ? "text-ink" : "text-slate-500 hover:text-ink"
          }`}
        >
          {cat}
          {activeCategory === cat && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default SpotlightCategoryTabs;
