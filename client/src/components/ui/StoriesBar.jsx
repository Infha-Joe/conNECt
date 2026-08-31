import Card from "./Card";
import Avatar from "./Avatar";
import { FiPlus } from "react-icons/fi";

const StoriesBar = () => {
  // Placeholder data for UI presentation
  const stories = [
    { id: 1, name: "Dr. Smith", avatar: null, active: true },
    { id: 2, name: "Alumni John", avatar: null, active: true },
    { id: 3, name: "Tech Club", avatar: null, active: true },
    { id: 4, name: "Jane Doe", avatar: null, active: false },
  ];

  return (
    <Card className="mb-6 p-4">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Current User Create Story */}
        <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
          <div className="relative h-14 w-14 rounded-full border-2 border-ink/10 p-0.5 group-hover:border-brass transition-colors">
            <Avatar name="You" size="md" className="h-full w-full" />
            <div className="absolute bottom-0 right-0 rounded-full bg-brass p-0.5 text-ink ring-2 ring-white">
              <FiPlus size={12} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-500">Your Story</span>
        </div>

        {/* Other Users Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className={`rounded-full p-0.5 transition-transform group-hover:scale-105 ${story.active ? "bg-gradient-to-tr from-brass to-brass-dark" : "border-2 border-ink/10"}`}>
              <div className="rounded-full border-2 border-white bg-white">
                <Avatar name={story.name} size="md" className="h-12 w-12" />
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-500 truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StoriesBar;
