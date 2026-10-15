import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiLifeBuoy, FiSearch, FiFilter, FiCheck, FiX, FiMessageSquare } from 'react-icons/fi';
import Button from '../components/ui/Button';

const HelpRequests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'my-requests', 'my-contributions'
  
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', subject: '', topic: '', description: '', helpNeeded: '' });

  const [offerModalTarget, setOfferModalTarget] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'feed') {
        const { data } = await api.get('/help-requests?status=open');
        setRequests(data.helpRequests);
      } else if (activeTab === 'my-requests') {
        const { data } = await api.get('/help-requests/me');
        setMyRequests(data.helpRequests);
      } else if (activeTab === 'my-contributions') {
        const { data } = await api.get('/help-requests/contributions');
        setMyContributions(data.helpRequests);
      }
    } catch (err) {
      console.error('Failed to fetch help requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/help-requests', createForm);
      setShowCreateModal(false);
      setCreateForm({ title: '', subject: '', topic: '', description: '', helpNeeded: '' });
      if (activeTab === 'feed' || activeTab === 'my-requests') fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create request');
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/help-requests/${offerModalTarget._id}/offer`, { message: offerMessage });
      setOfferModalTarget(null);
      setOfferMessage('');
      alert('Help offer sent!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send offer');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await api.put(`/help-requests/offer/${offerId}/accept`);
      alert('Offer accepted!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept offer');
    }
  };

  const handleMarkCompleted = async (requestId) => {
    try {
      await api.put(`/help-requests/${requestId}/complete`);
      alert('Marked as completed! Waiting for requester confirmation.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark completed');
    }
  };

  const handleConfirmCompletion = async (requestId, success) => {
    try {
      await api.put(`/help-requests/${requestId}/confirm`, { success });
      alert(success ? 'Help confirmed successful!' : 'Help marked incomplete.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    }
  };

  return (
    <DashboardLayout>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-ink flex items-center gap-2'>
          <FiLifeBuoy className='text-brand' /> Help Requests
        </h1>
        <Button onClick={() => setShowCreateModal(true)}>Request Help</Button>
      </div>

      {/* Tabs */}
      <div className='flex gap-6 border-b border-slate-200 mb-6'>
        <button 
          onClick={() => setActiveTab('feed')} 
          className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'feed' ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-ink'}`}
        >
          Explore Requests
        </button>
        <button 
          onClick={() => setActiveTab('my-requests')} 
          className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'my-requests' ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-ink'}`}
        >
          My Requests
        </button>
        <button 
          onClick={() => setActiveTab('my-contributions')} 
          className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'my-contributions' ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-ink'}`}
        >
          My Contributions
        </button>
      </div>

      {loading ? (
        <div className='text-center py-10 text-slate-500'>Loading...</div>
      ) : activeTab === 'feed' ? (
        <div className='space-y-4'>
          {requests.length === 0 ? (
            <div className='bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500'>No open requests found.</div>
          ) : (
            requests.map(req => (
              <div key={req._id} className='bg-white p-5 rounded-xl border border-slate-200 shadow-sm'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-lg font-bold text-ink'>{req.title}</h3>
                  <span className='text-xs font-bold px-2 py-1 rounded uppercase tracking-wider bg-slate-50 text-slate-600'>{req.status}</span>
                </div>
                
                <div className='flex gap-2 mb-3'>
                  <span className='text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700'>{req.subject}</span>
                  <span className='text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700'>{req.topic}</span>
                </div>
                
                <p className='text-sm text-slate-600 mb-4 line-clamp-2'>{req.description}</p>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-6 h-6 rounded-full bg-slate-200 overflow-hidden'>
                    {req.requester?.profilePhoto && <img src={req.requester.profilePhoto} alt='p' className='w-full h-full object-cover'/>}
                  </div>
                  <span className='text-xs font-medium text-slate-500'>{req.requester?.name || 'Unknown User'}</span>
                </div>
                {req.requester?._id !== user?._id && (
                  <Button variant='outline' size='sm' className='w-full' onClick={() => setOfferModalTarget(req)}>Offer Help</Button>
                )}
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'my-requests' ? (
        <div className='space-y-4'>
          {myRequests.length === 0 ? (
            <div className='bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500'>You haven't created any requests.</div>
          ) : (
            myRequests.map(req => (
              <div key={req._id} className='bg-white p-5 rounded-xl border border-slate-200 shadow-sm'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-lg font-bold text-ink'>{req.title}</h3>
                  <span className='text-xs font-bold px-2 py-1 rounded uppercase tracking-wider bg-slate-50 text-slate-600'>{req.status}</span>
                </div>
                
                {req.status === 'open' && req.offers?.length > 0 && (
                  <div className='mt-4 border-t border-slate-200 pt-4'>
                    <h4 className='text-sm font-bold mb-3'>Offers ({req.offers.length})</h4>
                    <div className='space-y-3'>
                      {req.offers.map(offer => (
                        <div key={offer._id} className='flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200'>
                          <div>
                            <p className='text-sm font-semibold'>{offer.helper?.name || 'Unknown User'}</p>
                            {offer.message && <p className='text-xs text-slate-500 mt-1'>{offer.message}</p>}
                          </div>
                          <Button size='sm' onClick={() => handleAcceptOffer(offer._id)}>Accept</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {req.status === 'pending_confirmation' && (
                  <div className='mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100'>
                    <p className='text-sm text-yellow-800 font-semibold mb-3'>{req.acceptedHelper?.name} marked this help as completed. Did they successfully help you?</p>
                    <div className='flex gap-3'>
                      <Button size='sm' onClick={() => handleConfirmCompletion(req._id, true)}>Yes, confirm completion</Button>
                      <Button variant='outline' size='sm' onClick={() => handleConfirmCompletion(req._id, false)}>No, still issues</Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          {myContributions.length === 0 ? (
            <div className='bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500'>You haven't offered help yet.</div>
          ) : (
            myContributions.map(offer => (
              <div key={offer._id} className='bg-white p-5 rounded-xl border border-slate-200 shadow-sm'>
                <p className='text-xs text-slate-500 mb-1'>Requested by: {offer.helpRequest?.requester?.name}</p>
                <h3 className='text-lg font-bold text-ink mb-2'>{offer.helpRequest?.title}</h3>
                <div className='flex justify-between items-center'>
                  <span className='text-xs font-bold px-2 py-1 rounded uppercase tracking-wider bg-slate-50 text-slate-600'>Offer Status: {offer.status}</span>
                  
                  {offer.status === 'accepted' && offer.helpRequest?.status === 'in_progress' && (
                    <Button size='sm' onClick={() => handleMarkCompleted(offer.helpRequest._id)}>Mark Completed</Button>
                  )}
                  {offer.status === 'accepted' && offer.helpRequest?.status === 'pending_confirmation' && (
                    <span className='text-sm font-semibold text-yellow-600'>Waiting for requester confirmation</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl max-w-lg w-full p-6'>
            <h2 className='text-xl font-bold mb-4'>Request Help</h2>
            <form onSubmit={handleCreateSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>Title</label>
                <input required type='text' className='w-full px-4 py-2 border border-slate-200 rounded-lg' value={createForm.title} onChange={e => setCreateForm({...createForm, title: e.target.value})} />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>Subject</label>
                  <input required type='text' className='w-full px-4 py-2 border border-slate-200 rounded-lg' value={createForm.subject} onChange={e => setCreateForm({...createForm, subject: e.target.value})} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>Topic</label>
                  <input required type='text' className='w-full px-4 py-2 border border-slate-200 rounded-lg' value={createForm.topic} onChange={e => setCreateForm({...createForm, topic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>Description</label>
                <textarea required rows='3' className='w-full px-4 py-2 border border-slate-200 rounded-lg' value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>What kind of help is needed?</label>
                <textarea required rows='2' className='w-full px-4 py-2 border border-slate-200 rounded-lg' value={createForm.helpNeeded} onChange={e => setCreateForm({...createForm, helpNeeded: e.target.value})}></textarea>
              </div>
              <div className='flex gap-3 pt-4 border-t border-slate-200'>
                <Button variant='outline' type='button' onClick={() => setShowCreateModal(false)} className='w-full'>Cancel</Button>
                <Button type='submit' className='w-full'>Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {offerModalTarget && (
        <div className='fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl max-w-md w-full p-6'>
            <h2 className='text-xl font-bold mb-4'>Offer Help</h2>
            <p className='text-sm text-slate-600 mb-4'>You are offering to help {offerModalTarget.requester?.name || 'this user'} with &quot;{offerModalTarget.title}&quot;.</p>
            <form onSubmit={handleOfferSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1'>Message (Optional)</label>
                <textarea rows='3' className='w-full px-4 py-2 border border-slate-200 rounded-lg' placeholder='E.g. I can help you with this on Friday...' value={offerMessage} onChange={e => setOfferMessage(e.target.value)}></textarea>
              </div>
              <div className='flex gap-3 pt-4 border-t border-slate-200'>
                <Button variant='outline' type='button' onClick={() => setOfferModalTarget(null)} className='w-full'>Cancel</Button>
                <Button type='submit' className='w-full'>Confirm Offer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default HelpRequests;
