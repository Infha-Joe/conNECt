import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiSearch, FiUserPlus, FiTrash2, FiUsers, FiUser } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

// --- Modals ---
const RequestMentorModal = ({ mentor, onClose, onSubmit, currentUser }) => {
  const [requestType, setRequestType] = useState("individual");
  const [goals, setGoals] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("30");
  
  // Group specific
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      const query = memberSearchQuery.trim();
      setHasSearched(query.length > 0);
      
      api.get(`/users/search?role=student&query=${query}`)
        .then(res => {
          const allStudents = res.data.users || [];
          const available = allStudents.filter(
            u => u._id !== currentUser._id && !selectedMembers.some(sm => sm._id === u._id)
          );
          setMemberSearchResults(available);
        })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(delay);
  }, [memberSearchQuery, selectedMembers, currentUser._id]);

  const handleAddMember = (user) => {
    if (user._id === currentUser._id) return;
    if (!selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    // We intentionally do not clear the search query here so the user can continue searching,
    // as per the requirement: "The search state must not break after selecting a member."
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      mentorId: mentor._id,
      requestType,
      groupName: requestType === "group" ? `${currentUser.name}'s Group` : undefined,
      groupMembers: requestType === "group" ? selectedMembers.map(m => m._id) : [],
      goals,
      message,
      requestedDuration: Number(duration)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-ink text-lg">Request Mentorship</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500 mb-4">Requesting mentorship from <span className="font-bold text-ink">{mentor.name}</span>.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Who is requesting?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 flex-1">
                <input type="radio" name="reqType" checked={requestType === "individual"} onChange={() => setRequestType("individual")} className="accent-brand" />
                <FiUser className="text-slate-500" />
                <span className="text-sm font-medium">Individual</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 flex-1">
                <input type="radio" name="reqType" checked={requestType === "group"} onChange={() => setRequestType("group")} className="accent-brand" />
                <FiUsers className="text-slate-500" />
                <span className="text-sm font-medium">Group</span>
              </label>
            </div>
          </div>

          {requestType === "group" && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-ink mb-2">Group Members ({selectedMembers.length + 1})</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-3 py-2 bg-white rounded-md border border-slate-200">
                  <span className="text-sm font-medium">✓ {currentUser.name}</span>
                  <span className="text-xs font-semibold text-brand bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">Leader</span>
                </div>
                {selectedMembers.map(m => (
                  <div key={m._id} className="flex justify-between items-center px-3 py-2 bg-white rounded-md border border-slate-200">
                    <span className="text-sm">✓ {m.name}</span>
                    <button type="button" onClick={() => handleRemoveMember(m._id)} className="text-xs text-red-500 font-medium hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-bold text-ink mb-3">Add Members</h4>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 overflow-hidden focus-within:border-brand mb-3">
                  <FiSearch className="text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search students..."
                    value={memberSearchQuery}
                    onChange={e => setMemberSearchQuery(e.target.value)}
                    className="w-full py-2 px-2 text-sm outline-none"
                  />
                </div>
                
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {hasSearched ? "Search Results:" : "Available Students:"}
                </p>
                
                {memberSearchResults.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-lg max-h-40 overflow-y-auto">
                    {memberSearchResults.map(m => (
                      <button 
                        key={m._id}
                        type="button"
                        onClick={() => handleAddMember(m)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm flex justify-between items-center border-b border-slate-100 last:border-0"
                      >
                        <span>{m.name}</span>
                        <span className="text-xs font-semibold text-brand flex items-center gap-1">
                          <FiUserPlus /> Add
                        </span>
                      </button>
                    ))}
                  </div>
                ) : hasSearched ? (
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center text-sm text-slate-500">
                    No students found.<br/>Try a different name.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center text-sm text-slate-500">
                    No additional students available.
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goals for this Mentorship</label>
            <textarea 
              required 
              rows={2}
              value={goals} 
              onChange={e => setGoals(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand"
              placeholder="What do you want to achieve?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea 
              rows={2}
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand"
              placeholder="Introduce yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Requested Duration (days)</label>
            <input 
              type="number" 
              required
              min="1"
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-blue-700 rounded-lg">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AcceptMentorModal = ({ request, onClose, onSubmit }) => {
  const [duration, setDuration] = useState(request.requestedDuration || 30);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(request._id, Number(duration));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-ink text-lg">Accept Mentorship</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-4">
              Accepting request from <span className="font-bold text-ink">{request.requestType === "individual" ? request.requester?.name : request.groupName || "a group"}</span>.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Duration (days)</label>
            <input 
              type="number" 
              required
              min="1"
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand"
            />
            <p className="text-xs text-slate-400 mt-1">Student requested {request.requestedDuration} days. You can adjust this.</p>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-blue-700 rounded-lg">Confirm Mentorship</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
const MentorshipHub = () => {
  const { user } = useAuth();
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [requestMentorTarget, setRequestMentorTarget] = useState(null);
  const [acceptRequestTarget, setAcceptRequestTarget] = useState(null);

  // Mentor Search State
  const [providerSearch, setProviderSearch] = useState("");
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user.role === "student") {
      const delaySearch = setTimeout(() => {
        fetchProviders(providerSearch);
      }, 300);
      return () => clearTimeout(delaySearch);
    }
  }, [providerSearch, user.role]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activeRes, incomingRes, outgoingRes] = await Promise.all([
        api.get("/mentorship/active"),
        (user.role === "teacher" || user.role === "alumni") ? api.get("/mentorship/requests/incoming") : Promise.resolve({ data: [] }),
        user.role === "student" ? api.get("/mentorship/requests/outgoing") : Promise.resolve({ data: [] })
      ]);
      
      setActiveMentorships(activeRes.data);
      if (incomingRes.data) setIncomingRequests(incomingRes.data);
      if (outgoingRes.data) setOutgoingRequests(outgoingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async (query) => {
    try {
      const res = await api.get(`/mentorship/providers?search=${query}`);
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptSubmit = async (requestId, durationDays) => {
    try {
      await api.patch(`/mentorship/requests/${requestId}/accept`, { durationDays });
      setAcceptRequestTarget(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting request");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await api.patch(`/mentorship/requests/${id}/reject`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting request");
    }
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      await api.post("/mentorship/request", requestData);
      setRequestMentorTarget(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  // Helper to determine request status for a specific provider
  const getProviderStatus = (providerId) => {
    // Check if there is an active workspace
    const activeWorkspace = activeMentorships.find(m => m.mentor._id === providerId && m.status !== "completed");
    if (activeWorkspace) return { status: "ACTIVE", type: "workspace", workspaceId: activeWorkspace._id };

    // Check outgoing requests
    const outReq = outgoingRequests.find(req => req.mentor._id === providerId);
    if (outReq) {
      if (outReq.status === "pending") return { status: "PENDING", type: "request" };
      if (outReq.status === "rejected") return { status: "REJECTED", type: "request" };
    }

    return null;
  };

  return (
    <DashboardLayout>
      {requestMentorTarget && (
        <RequestMentorModal 
          mentor={requestMentorTarget} 
          currentUser={user}
          onClose={() => setRequestMentorTarget(null)} 
          onSubmit={handleRequestSubmit} 
        />
      )}

      {acceptRequestTarget && (
        <AcceptMentorModal 
          request={acceptRequestTarget} 
          onClose={() => setAcceptRequestTarget(null)} 
          onSubmit={handleAcceptSubmit} 
        />
      )}

      <div className="space-y-10 pb-10">
        
        {/* Mentor Search for Students */}
        {user.role === "student" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-ink">Find a Mentor or Teacher</h2>
            <div className="relative w-full">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 shadow-sm focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <FiSearch className="text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={providerSearch}
                  onChange={e => setProviderSearch(e.target.value)}
                  placeholder="Search by name, skill, expertise..."
                  className="w-full py-3 px-3 text-sm outline-none bg-transparent"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-6">
                {providerSearch.trim() === "" ? "Suggested Mentors & Teachers" : "Search Results"}
              </h3>

              {providers.length === 0 ? (
                providerSearch.trim() === "" ? (
                  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                    No mentors or teachers available at the moment.
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                    No mentors or teachers found.<br/>Try a different search term.
                  </div>
                )
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {providers.map(p => {
                    const providerStatus = getProviderStatus(p._id);
                    
                    return (
                      <div key={p._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                              {p.profilePhoto ? <img src={p.profilePhoto} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><FiUser /></div>}
                            </div>
                            <div>
                              <h3 className="font-bold text-ink text-base leading-tight">{p.name}</h3>
                              <p className="text-xs font-medium text-brand capitalize">{p.role}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                            {p.designation || p.currentRole || (p.role === "teacher" ? "Faculty" : "Industry Professional")}
                          </p>
                          {p.skills && p.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {p.skills.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{s}</span>
                              ))}
                              {p.skills.length > 3 && <span className="text-[10px] px-2 py-0.5 text-slate-400">+{p.skills.length - 3}</span>}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-4">
                          {providerStatus?.status === "ACTIVE" ? (
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-green-600 uppercase tracking-wider text-center">Mentorship: Active</span>
                              <Link to={`/mentorship/${providerStatus.workspaceId}`} className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors text-center inline-block">
                                Open Workspace
                              </Link>
                            </div>
                          ) : providerStatus?.status === "PENDING" ? (
                            <div className="w-full py-2 bg-slate-100 text-slate-500 text-sm font-medium rounded-lg text-center cursor-not-allowed">
                              Request Pending
                            </div>
                          ) : providerStatus?.status === "REJECTED" ? (
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-red-500 uppercase tracking-wider text-center">Previous Request: Rejected</span>
                              <button onClick={() => setRequestMentorTarget(p)} className="w-full py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                                Request Again
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setRequestMentorTarget(p)} className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                              Request Mentorship
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Requests (Outgoing) */}
        {user.role === "student" && (
          <div>
            <h2 className="text-xl font-bold text-ink mb-4">My Requests</h2>
            {outgoingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 text-sm shadow-sm">You haven't sent any mentorship requests.</div>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.map(req => (
                  <div key={req._id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {req.requestType}
                        </span>
                        <p className="font-semibold text-ink text-sm">To: {req.mentor.name}</p>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">Goal: {req.goals}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider w-fit shrink-0 ${
                      req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Incoming Requests (Mentors) */}
        {(user.role === "teacher" || user.role === "alumni") && (
          <div>
            <h2 className="text-2xl font-bold text-ink mb-4">Incoming Mentorship Requests</h2>
            {incomingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 shadow-sm">No new incoming requests.</div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <div key={req._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                    
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2 bg-blue-50 w-fit px-2 py-0.5 rounded">{req.requestType} Mentorship Request</p>
                      
                      {req.requestType === "group" ? (
                        <div className="mb-3">
                          <p className="text-sm text-slate-500 mb-1">Leader: <span className="font-semibold text-ink">{req.requester?.name}</span></p>
                          <p className="text-sm text-slate-500 mb-1">Members: {req.groupMembers?.length || 0}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {req.groupMembers?.map(m => (
                              <span key={m._id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{m.name}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <p className="text-sm text-slate-500">Student: <span className="font-semibold text-ink">{req.requester?.name}</span></p>
                        </div>
                      )}

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3 space-y-2 text-sm">
                        <p><span className="font-semibold text-slate-700">Goal:</span> {req.goals}</p>
                        {req.message && <p><span className="font-semibold text-slate-700">Message:</span> {req.message}</p>}
                        <p><span className="font-semibold text-slate-700">Requested Duration:</span> {req.requestedDuration} days</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                      <button onClick={() => handleReject(req._id)} className="px-5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-colors">
                        Reject
                      </button>
                      <button onClick={() => setAcceptRequestTarget(req)} className="px-5 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors">
                        Accept Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Mentorships / Workspaces */}
        <div>
          <h2 className="text-2xl font-bold text-ink mb-4">My Workspaces</h2>
          {activeMentorships.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 shadow-sm">You have no active workspaces.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeMentorships.map(m => (
                <div key={m._id} className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between relative overflow-hidden group transition-colors ${m.status === 'completed' ? 'border-slate-200 opacity-75' : 'border-slate-200 hover:border-brand'}`}>
                  <div className={`absolute top-0 left-0 w-full h-1 ${m.status === 'completed' ? 'bg-slate-300' : 'bg-green-400'}`}></div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {m.requestType === "individual" ? "Individual" : "Group"}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${m.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600'}`}>
                        {m.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-ink mb-1">
                      {user.role === "student" 
                        ? `Mentor: ${m.mentor.name}` 
                        : (m.requestType === "individual" ? `Mentee: ${m.mentee?.name}` : `Group: ${m.groupName || m.groupMembers?.length + " members"}`)
                      }
                    </h3>
                    
                    <p className="text-xs font-medium text-slate-500 mb-4 mt-2">
                      {m.status === "completed" ? "Closed Workspace" : `Ends: ${new Date(m.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link to={`/mentorship/${m._id}`} className="w-full inline-flex justify-center items-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                      Open Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MentorshipHub;
