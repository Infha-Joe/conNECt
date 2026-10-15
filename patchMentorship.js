const fs = require('fs');
let code = fs.readFileSync('client/src/pages/ActiveMentorship.jsx', 'utf8');

code = code.replace(
  'const handleSendMessage = (e) => {',
  `const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50000000) {
        alert('File size exceeds 50MB limit');
        return;
      }
      setAttachment(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setAttachmentPreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {`
);

code = code.replace(
  'if (!newMessage.trim() || mentorship?.status === "expired" || mentorship?.status === "completed" || isSending) return;',
  'if ((!newMessage.trim() && !attachment) || mentorship?.status === "expired" || mentorship?.status === "completed" || isSending) return;'
);

code = code.replace(
  /setIsSending\(true\);\s*const token = localStorage\.getItem\("connect_token"\);\s*socketRef\.current\.emit\("send_message", \{\s*mentorshipId: id,\s*content: newMessage\.trim\(\),\s*token\s*\}, \(response\) => \{/,
  `setIsSending(true);
    let uploadedAttachment = null;

    if (attachment) {
      const formData = new FormData();
      formData.append('media', attachment);
      try {
        const res = await api.post('/upload', formData);
        let type = 'file';
        if (attachment.type.startsWith('image/')) type = 'image';
        else if (attachment.type.startsWith('video/')) type = 'video';
        uploadedAttachment = { url: res.data.url, type, name: attachment.name };
      } catch (err) {
        alert('File upload failed.');
        setIsSending(false);
        return;
      }
    }

    const token = localStorage.getItem('connect_token');
    socketRef.current.emit('send_message', {
      mentorshipId: id,
      content: newMessage.trim(),
      attachment: uploadedAttachment,
      token
    }, (response) => {`
);

code = code.replace(
  /\/\/ Fallback if server doesn't support ack[\s\S]*?\}, 500\);/m,
  ``
);

code = code.replace(
  `      // In case we want to support an ack from server
      setIsSending(false);
      if (response?.error) {
        alert("Unable to send message. Please try again.");
      } else {
        setNewMessage("");
      }
    });`,
  `      setIsSending(false);
      if (response?.error) {
        alert("Unable to send message.");
      } else {
        setNewMessage("");
        removeAttachment();
      }
    });

  const handleToggleReaction = (messageId, emoji) => {
    const token = localStorage.getItem('connect_token');
    socketRef.current.emit('toggle_reaction', { messageId, emoji, token, mentorshipId: id });
  };`
);

// UI PATCHING
const uiReaction = `
                        {msg.attachment && (
                          <div className="mt-2 mb-1">
                            {msg.attachment.type === 'image' ? (
                              <img src={msg.attachment.url} alt="attachment" className="max-w-[200px] sm:max-w-[300px] rounded-lg border border-slate-200" />
                            ) : msg.attachment.type === 'video' ? (
                              <video src={msg.attachment.url} controls className="max-w-[200px] sm:max-w-[300px] rounded-lg border border-slate-200" />
                            ) : (
                              <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-brand hover:underline font-medium border border-slate-200">
                                <FiFile /> {msg.attachment.name || 'View File'}
                              </a>
                            )}
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        
                        <div className="relative group">
                          <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
                            <FiSmile size={12} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex bg-white shadow-lg border border-slate-200 rounded-full px-2 py-1 gap-1 z-10">
                            {['👍', '❤️', '😂', '😮', '😢', '👏'].map(emoji => (
                              <button key={emoji} onClick={() => handleToggleReaction(msg._id, emoji)} className="hover:scale-125 transition-transform text-sm">{emoji}</button>
                            ))}
                          </div>
                        </div>

                        {msg.reactions?.length > 0 && (
                          <div className="flex gap-1">
                            {msg.reactions.map(r => (
                              <button key={r.emoji} onClick={() => handleToggleReaction(msg._id, r.emoji)} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded-full text-[10px] border border-slate-200 hover:bg-slate-200">
                                <span>{r.emoji}</span>
                                <span className="font-medium text-slate-600">{r.users.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
`;
code = code.replace(
  `<p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`,
  uiReaction
);

const uiInputBox = `              <div className="p-4 border-t border-slate-200 bg-slate-50">
                {attachmentPreview && (
                  <div className="mb-3 relative inline-block">
                    <img src={attachmentPreview} alt="Preview" className="h-20 w-auto rounded border border-slate-200 object-cover" />
                    <button onClick={removeAttachment} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><FiX size={12} /></button>
                  </div>
                )}
                {attachment && !attachmentPreview && (
                  <div className="mb-3 flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 inline-flex relative pr-8">
                    <FiFile className="text-slate-500" />
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">{attachment.name}</span>
                    <button onClick={removeAttachment} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"><FiX size={14} /></button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2 relative items-end max-w-[1100px]">
                  <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 mb-1 text-slate-400 hover:text-brand transition-colors bg-white border border-slate-200 rounded-full">
                    <FiPaperclip size={18} />
                  </button>
                  <textarea`;

code = code.replace(/<div className="p-4 border-t border-slate-200 bg-slate-50">\s*<form onSubmit=\{handleSendMessage\} className="flex gap-2 relative items-end max-w-\[1100px\]">\s*<textarea/, uiInputBox);

// One more fix for the first regex UI replace:
code = code.replace('uiAttachmentAndReaction', 'uiReaction');

fs.writeFileSync('client/src/pages/ActiveMentorship.jsx', code);
