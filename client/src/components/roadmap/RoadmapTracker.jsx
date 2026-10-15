import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FiCheckCircle, FiCircle, FiClock, FiPlus } from "react-icons/fi";
import Card from "../ui/Card";
import Button from "../ui/Button";

const RoadmapTracker = ({ entityType, entityId }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStage, setNewStage] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchRoadmap();
  }, [entityType, entityId]);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get(`/roadmaps/${entityType}/${entityId}`);
      if (res.data.roadmap) {
        setRoadmap(res.data.roadmap);
        setStages(res.data.stages);
      }
    } catch (err) {
      console.error("Failed to fetch roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  const createRoadmap = async () => {
    try {
      const res = await api.post("/roadmaps", {
        title: `${entityType} Roadmap`,
        entityType,
        entityId
      });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/roadmaps/${roadmap._id}/stages`, {
        ...newStage,
        order: stages.length
      });
      setStages([...stages, res.data.stage]);
      setShowAddForm(false);
      setNewStage({ title: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const updateStageProgress = async (stageId, newProgress, status) => {
    try {
      const res = await api.put(`/roadmaps/stages/${stageId}`, {
        progress: newProgress,
        status,
        note: `Updated progress to ${newProgress}%`
      });
      setStages(stages.map(s => s._id === stageId ? res.data.stage : s));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-slate-50 rounded-lg"></div>;

  if (!roadmap) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-bold text-ink mb-2">No Roadmap Yet</h3>
        <p className="text-slate-500 mb-4">Track progress by creating a roadmap.</p>
        <Button onClick={createRoadmap}>Create Roadmap</Button>
      </Card>
    );
  }

  const overallProgress = stages.length > 0 
    ? Math.round(stages.reduce((acc, s) => acc + s.progress, 0) / stages.length) 
    : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink">{roadmap.title}</h2>
          <p className="text-sm text-slate-500">Overall Progress: {overallProgress}%</p>
        </div>
        <div className="w-1/3 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-brand h-full transition-all duration-500 text-white" style={{ width: `${overallProgress}%` }}></div>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {stages.map((stage, idx) => (
          <div key={stage._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {stage.progress === 100 ? <FiCheckCircle className="text-green-500" size={20} /> : <FiClock size={16} />}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-ink">{stage.title}</h4>
                <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded-full">{stage.progress}%</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
              
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" max="100" step="10" 
                  value={stage.progress}
                  onChange={(e) => updateStageProgress(stage._id, Number(e.target.value), e.target.value === "100" ? "completed" : "in-progress")}
                  className="w-full accent-brand"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddStage} className="mt-8 border border-slate-200 p-4 rounded-lg bg-slate-50">
          <h4 className="font-bold text-ink mb-3">Add New Stage</h4>
          <input 
            type="text" required placeholder="Stage Title"
            className="w-full mb-3 px-3 py-2 border rounded-md"
            value={newStage.title} onChange={e => setNewStage({...newStage, title: e.target.value})}
          />
          <textarea 
            placeholder="Description"
            className="w-full mb-3 px-3 py-2 border rounded-md"
            value={newStage.description} onChange={e => setNewStage({...newStage, description: e.target.value})}
          />
          <div className="flex gap-2">
            <Button type="submit">Save Stage</Button>
            <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setShowAddForm(true)}
          className="mt-8 flex items-center justify-center w-full gap-2 py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-brand hover:text-brand transition"
        >
          <FiPlus /> Add Roadmap Stage
        </button>
      )}
    </Card>
  );
};

export default RoadmapTracker;
