import React, { useEffect, useState } from 'react';
import { getInfluencers, addInfluencer, updateInfluencer, deleteInfluencer, InfluencerData, LogEntry } from '../../services/firebase';
import { Plus, Edit2, Trash2, Mail, MessageSquare, X, History, MapPin } from 'lucide-react';

const statuses = [
  '1. Scouted - did research, good fit, following on social',
  '2. Contacted - sent an email or DM',
  '3. Replied - influencer replied',
  '4. Sent Product',
  '5. Signed Collab',
  '6. Signed UGC',
  '7. Signed other',
  '8. Rejected, not a good fit',
  '9. Declined - influencer declined offer',
  '10. No Response',
  '11. On Hold - paused, follow up at launch'
];

const availablePlatforms = ['Instagram', 'TikTok', 'X', 'YouTube', 'Facebook'];

const getPlatformsMap = (platformsField: any): { [key: string]: number } => {
  if (!platformsField) return {};
  if (Array.isArray(platformsField)) {
    const map: { [key: string]: number } = {};
    platformsField.forEach((p: string) => {
      map[p] = 0;
    });
    return map;
  }
  return platformsField;
};

// Styling variables for elegant admin-specific forms
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--on-surface-variant)',
  marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: 'normal',
  backgroundColor: 'var(--surface-container-lowest)',
  border: '1px solid var(--outline-variant)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'var(--on-surface)',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  cursor: 'pointer',
  userSelect: 'none',
  color: 'var(--on-surface)'
};

const InfluencerTracker: React.FC = () => {
  const [influencers, setInfluencers] = useState<(InfluencerData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<InfluencerData, 'id'>>({
    name: '',
    handle: '',
    email: '',
    status: statuses[0],
    platforms: {},
    niche: '',
    location: '',
    logs: []
  });

  const [newLogEntry, setNewLogEntry] = useState('');
  const [viewingLogsInfluencer, setViewingLogsInfluencer] = useState<(InfluencerData & { id: string }) | null>(null);
  const [quickLogText, setQuickLogText] = useState('');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [editingAddressInfluencer, setEditingAddressInfluencer] = useState<(InfluencerData & { id: string }) | null>(null);
  const [addressInput, setAddressInput] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getInfluencers();
      setInfluencers(data as (InfluencerData & { id: string })[]);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const currentPlatforms = getPlatformsMap(prev.platforms);
      const updated = { ...currentPlatforms };
      if (updated[platform] !== undefined) {
        delete updated[platform];
      } else {
        updated[platform] = 0;
      }
      return { ...prev, platforms: updated };
    });
  };

  const handlePlatformFollowersChange = (platform: string, count: number) => {
    setFormData(prev => {
      const currentPlatforms = getPlatformsMap(prev.platforms);
      return {
        ...prev,
        platforms: {
          ...currentPlatforms,
          [platform]: count
        }
      };
    });
  };

  const handleAddLog = () => {
    if (!newLogEntry.trim()) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      text: newLogEntry.trim()
    };
    setFormData(prev => ({ ...prev, logs: [...(prev.logs || []), entry] }));
    setNewLogEntry('');
  };

  const handleAddQuickLog = async () => {
    if (!viewingLogsInfluencer || !quickLogText.trim()) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      text: quickLogText.trim()
    };
    
    // Convert existing legacy notes to log if necessary
    const existingLogs = viewingLogsInfluencer.logs || 
      (viewingLogsInfluencer.notes ? [{ timestamp: new Date().toISOString(), text: viewingLogsInfluencer.notes }] : []);
      
    const updatedLogs = [...existingLogs, entry];
    try {
      await updateInfluencer(viewingLogsInfluencer.id, { logs: updatedLogs });
      const updatedInf = { ...viewingLogsInfluencer, logs: updatedLogs };
      setViewingLogsInfluencer(updatedInf);
      setInfluencers(prev => prev.map(inf => inf.id === viewingLogsInfluencer.id ? updatedInf : inf));
      setQuickLogText('');
    } catch (error) {
      console.error("Error saving quick log:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Duplicate check on handle & email
      const trimmedHandle = formData.handle.trim().toLowerCase();
      const trimmedEmail = formData.email.trim().toLowerCase();

      // Verify handle duplicate
      const duplicateHandle = influencers.find(inf => 
        inf.id !== editingId && 
        inf.handle.trim().toLowerCase() === trimmedHandle
      );

      if (duplicateHandle) {
        alert(`Error: An influencer with the handle "${formData.handle}" already exists under the name "${duplicateHandle.name}".`);
        return;
      }

      // Verify email duplicate (if provided)
      if (trimmedEmail) {
        const duplicateEmail = influencers.find(inf => 
          inf.id !== editingId && 
          inf.email && inf.email.trim().toLowerCase() === trimmedEmail
        );

        if (duplicateEmail) {
          alert(`Error: An influencer with the email "${formData.email}" already exists under the name "${duplicateEmail.name}".`);
          return;
        }
      }

      if (editingId) {
        await updateInfluencer(editingId, formData);
      } else {
        await addInfluencer(formData);
      }
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ name: '', handle: '', email: '', status: statuses[0], platforms: {}, niche: '', location: '', logs: [] });
      fetchData();
    } catch (error) {
      console.error("Error saving influencer:", error);
      alert("Failed to save. Please try again.");
    }
  };

  const handleEdit = (influencer: InfluencerData & { id: string }) => {
    setFormData({
      name: influencer.name,
      handle: influencer.handle,
      email: influencer.email || '',
      status: influencer.status,
      platforms: getPlatformsMap(influencer.platforms),
      niche: influencer.niche || '',
      location: influencer.location || '',
      logs: influencer.logs || (influencer.notes ? [{ timestamp: new Date().toISOString(), text: influencer.notes }] : [])
    });
    setEditingId(influencer.id);
    setIsFormOpen(true);
    setNewLogEntry('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this influencer?")) {
      try {
        await deleteInfluencer(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting influencer:", error);
        alert("Failed to delete. Please try again.");
      }
    }
  };

  const handleStartEditAddress = (influencer: InfluencerData & { id: string }) => {
    setEditingAddressInfluencer(influencer);
    setAddressInput(influencer.address || '');
  };

  const handleSaveAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingAddressInfluencer) return;
    try {
      const updatedAddress = addressInput.trim();
      await updateInfluencer(editingAddressInfluencer.id, { address: updatedAddress });
      
      setInfluencers(prev => prev.map(inf => 
        inf.id === editingAddressInfluencer.id 
          ? { ...inf, address: updatedAddress } 
          : inf
      ));
      
      setEditingAddressInfluencer(null);
      setAddressInput('');
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  if (loading && influencers.length === 0) {
    return <div>Loading Influencers...</div>;
  }

  const getShortStatus = (status: string) => {
    let cleaned = status;
    if (status.includes(' - ')) {
      cleaned = status.split(' - ')[0];
    }
    // Remove numeric prefixes like "1. ", "10. "
    cleaned = cleaned.replace(/^\d+\.\s*/, '');
    return cleaned;
  };

  const isRejectedOrDeclined = (status: string) => {
    return status.includes('8. Rejected') || status.includes('9. Declined') || status.includes('10. No Response');
  };

  const getStatusPriority = (status: string): number => {
    if (status.includes('4. Sent Product')) return 1;
    if (status.includes('5. Signed') || status.includes('6. Signed') || status.includes('7. Signed')) return 2;
    if (status.includes('3. Replied')) return 3;
    if (status.includes('11. On Hold')) return 4;
    if (status.includes('2. Contacted')) return 5;
    if (status.includes('1. Scouted')) return 6;
    return 10;
  };

  const getRegistryBadgeStyle = (status: string) => {
    if (status.includes('Rejected')) {
      return { backgroundColor: 'rgba(186, 26, 26, 0.1)', color: 'var(--error)' };
    }
    if (status.includes('Declined')) {
      return { backgroundColor: 'rgba(186, 26, 26, 0.1)', color: 'var(--error)' };
    }
    // Gray for No Response
    return { backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' };
  };

  const getStatusTheme = (status: string) => {
    if (status.includes('1. Scouted')) {
      return { 
        bg: 'rgba(0, 122, 255, 0.06)', 
        color: '#0066cc', 
        border: 'rgba(0, 122, 255, 0.25)' 
      };
    }
    if (status.includes('2. Contacted')) {
      return { 
        bg: 'rgba(156, 39, 176, 0.06)', 
        color: '#7b1fa2', 
        border: 'rgba(156, 39, 176, 0.25)' 
      };
    }
    if (status.includes('3. Replied')) {
      return { 
        bg: 'rgba(212, 175, 55, 0.06)', 
        color: '#b8860b', 
        border: 'rgba(212, 175, 55, 0.4)' 
      };
    }
    if (status.includes('4. Sent Product')) {
      return { 
        bg: 'rgba(233, 30, 99, 0.06)', 
        color: '#c2185b', 
        border: '#c2185b' 
      };
    }
    if (status.includes('5. Signed Collab')) {
      return { 
        bg: 'rgba(0, 150, 136, 0.06)', 
        color: '#00796b', 
        border: 'rgba(0, 150, 136, 0.25)' 
      };
    }
    if (status.includes('6. Signed UGC')) {
      return { 
        bg: 'rgba(0, 188, 212, 0.06)', 
        color: '#0097a7', 
        border: 'rgba(0, 188, 212, 0.25)' 
      };
    }
    if (status.includes('7. Signed other')) {
      return { 
        bg: 'rgba(76, 175, 80, 0.06)', 
        color: '#2e7d32', 
        border: 'rgba(76, 175, 80, 0.25)' 
      };
    }
    if (status.includes('11. On Hold')) {
      return { 
        bg: 'rgba(103, 58, 183, 0.06)', 
        color: '#673ab7', 
        border: 'rgba(103, 58, 183, 0.25)' 
      };
    }
    return { 
      bg: 'var(--surface-container-high)', 
      color: 'var(--on-surface-variant)', 
      border: 'var(--outline-variant)' 
    };
  };



  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Influencer Tracker</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', handle: '', email: '', status: statuses[0], platforms: {}, niche: '', location: '', logs: [] });
            setIsFormOpen(true);
            setNewLogEntry('');
          }}
          className="lfto-btn lfto-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Add Influencer
        </button>
      </div>

      {/* Modal Popup Form */}
      {isFormOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 28, 29, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--outline-variant)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid var(--outline-variant)',
              backgroundColor: 'var(--surface-container-low)'
            }}>
              <h2 className="title-lg" style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>
                {editingId ? 'Edit Influencer Profile' : 'Add New Influencer'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input 
                    required 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    style={inputStyle} 
                    placeholder="e.g. Michelle Geyer"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Handle / Username</label>
                  <input 
                    required 
                    type="text" 
                    name="handle" 
                    value={formData.handle} 
                    onChange={handleInputChange} 
                    style={inputStyle} 
                    placeholder="e.g. @michellegeyerbeauty"
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={labelStyle}>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    style={inputStyle} 
                    placeholder="name@domain.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Niche</label>
                  <input 
                    type="text" 
                    name="niche" 
                    value={formData.niche} 
                    onChange={handleInputChange} 
                    style={inputStyle} 
                    placeholder="e.g. Skincare, Surf"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    style={inputStyle} 
                    placeholder="e.g. Australia, US"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Outreach Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  style={{...inputStyle, cursor: 'pointer'}}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Active Platforms & Followers</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--surface-container-low)', padding: '16px', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                  {availablePlatforms.map(platform => {
                    const platformsMap = getPlatformsMap(formData.platforms);
                    const isChecked = platformsMap[platform] !== undefined;
                    const followersValue = isChecked ? (platformsMap[platform] || '') : '';
                    return (
                      <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <label style={{ ...checkboxLabelStyle, minWidth: '120px' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handlePlatformToggle(platform)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          {platform}
                        </label>
                        {isChecked && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                              type="number"
                              placeholder="Followers count"
                              value={followersValue}
                              onChange={(e) => handlePlatformFollowersChange(platform, parseInt(e.target.value) || 0)}
                              style={{ ...inputStyle, padding: '6px 12px', fontSize: '13px', width: '160px' }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>followers</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '20px' }}>
                <label style={labelStyle}>Communication History / Audit Log</label>
                
                <div style={{ 
                  marginBottom: '16px', 
                  maxHeight: '160px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px',
                  backgroundColor: 'var(--surface-container-low)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--outline-variant)'
                }}>
                  {(!formData.logs || formData.logs.length === 0) && (
                    <span style={{ color: 'var(--outline)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>No logged events or notes yet.</span>
                  )}
                  {formData.logs?.map((log, index) => (
                    <div key={index} style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, marginBottom: '4px' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      <div style={{ color: 'var(--on-surface)', lineHeight: '1.4' }}>{log.text}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={newLogEntry} 
                    onChange={(e) => setNewLogEntry(e.target.value)} 
                    style={{...inputStyle, flex: 1}} 
                    placeholder="Log an email sent, DM reply, contract terms..."
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLog(); } }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddLog} 
                    className="lfto-btn" 
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)', padding: '10px 20px', borderRadius: '8px', fontSize: '11px', letterSpacing: '0.15em' }}
                  >
                    Add Log
                  </button>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end', 
                marginTop: '12px',
                borderTop: '1px solid var(--outline-variant)',
                paddingTop: '20px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)} 
                  className="lfto-btn" 
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: 'var(--on-surface)', 
                    border: '1px solid var(--outline)',
                    padding: '12px 24px',
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="lfto-btn lfto-btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '8px' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Log Modal Popup */}
      {viewingLogsInfluencer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 28, 29, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--outline-variant)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--outline-variant)',
              backgroundColor: 'var(--surface-container-low)'
            }}>
              <div>
                <h2 className="title-lg" style={{ margin: 0, color: 'var(--primary)', fontWeight: 600, fontSize: '18px' }}>
                  Communication Log History
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>
                  {viewingLogsInfluencer.name} ({viewingLogsInfluencer.handle})
                </p>
              </div>
              <button 
                onClick={() => setViewingLogsInfluencer(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Add Log Input */}
            <div style={{ padding: '20px 24px 12px 24px', borderBottom: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
              <label style={labelStyle}>Quick Add Note / Update</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input 
                  type="text"
                  placeholder="Enter a new update to the communication log..."
                  value={quickLogText}
                  onChange={(e) => setQuickLogText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuickLog(); } }}
                  style={{ ...inputStyle, padding: '10px 14px' }}
                />
                <button
                  type="button"
                  onClick={handleAddQuickLog}
                  className="lfto-btn lfto-btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '11px', letterSpacing: '0.15em' }}
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Scrollable Timeline */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '24px',
              backgroundColor: 'var(--surface-container-low)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Backward compatibility check */}
              {(() => {
                const logsList = [...(viewingLogsInfluencer.logs || 
                  (viewingLogsInfluencer.notes ? [{ timestamp: new Date().toISOString(), text: viewingLogsInfluencer.notes }] : []))].reverse();
                
                if (logsList.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--outline)', fontFamily: "'Inter', sans-serif" }}>
                      No history entries logged yet.
                    </div>
                  );
                }
                
                return logsList.map((log, index) => (
                  <div key={index} style={{
                    backgroundColor: 'var(--surface-container-lowest)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--outline-variant)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--outline)', 
                      fontWeight: 600, 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <History size={12} />
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--on-surface)', 
                      lineHeight: '1.5',
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: 'pre-wrap'
                    }}>
                      {log.text}
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--outline-variant)',
              backgroundColor: 'var(--surface-container-low)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setViewingLogsInfluencer(null)}
                className="lfto-btn"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--on-primary)',
                  padding: '12px 24px',
                  borderRadius: '8px'
                }}
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List States preparation */}
      {(() => {
        const activeInfluencers = influencers
          .filter(inf => !isRejectedOrDeclined(inf.status))
          .sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));

        const inactiveInfluencers = influencers
          .filter(inf => isRejectedOrDeclined(inf.status));

        return (
          <>
            {/* Active Influencers Header */}
            <div style={{ marginBottom: '16px' }}>
              <h2 className="title-md" style={{ color: 'var(--primary)', fontWeight: 600, margin: '0 0 4px 0' }}>
                Active Campaigns ({activeInfluencers.length})
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>
                Sorted by priority: Action Needed (Sent Product) ➔ High Priority (Signed) ➔ Active Outreach (Replied, Contacted, Scouted, No Response).
              </p>
            </div>

            {/* Grid List of Active Influencers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {activeInfluencers.map(inf => {
                const theme = getStatusTheme(inf.status);
                const isSentProduct = inf.status.includes('4. Sent Product');
                return (
                  <div key={inf.id} style={{ 
                    backgroundColor: 'var(--surface)', 
                    padding: '24px', 
                    borderRadius: '12px', 
                    border: isSentProduct 
                      ? `2px solid ${theme.border}` 
                      : `1px solid ${theme.border}`, 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: isSentProduct ? `0 8px 24px ${theme.border}1e` : 'none'
                  }}>
                    {isSentProduct && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '-12px', 
                        left: '20px', 
                        backgroundColor: theme.color, 
                        color: 'var(--on-primary)', 
                        fontSize: '10px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        letterSpacing: '0.1em', 
                        textTransform: 'uppercase' 
                      }}>
                        ACTION NEEDED
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: '0 0 4px 0', color: 'var(--primary)', fontFamily: "'Montserrat', sans-serif", fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', wordBreak: 'break-word', lineHeight: '1.3' }}>{inf.name}</h3>
                        <p className="body-md" style={{ margin: 0, color: 'var(--on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inf.handle}</p>
                      </div>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '16px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        backgroundColor: theme.bg, 
                        color: theme.color,
                        border: `1px solid ${theme.border}`,
                        textAlign: 'center',
                        lineHeight: '1.2',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}>
                        {getShortStatus(inf.status)}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                      {inf.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} style={{ color: theme.color }} />
                          <a 
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inf.email)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                          >
                            Gmail
                          </a>
                        </div>
                      )}
                      {inf.location && <div>📍 {inf.location}</div>}
                      {inf.niche && <div style={{ gridColumn: 'span 2' }}>🎯 {inf.niche}</div>}
                      {inf.address && (
                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ flexShrink: 0 }}>🏠</span>
                          <span style={{ fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap', color: 'var(--on-surface)' }}>{inf.address}</span>
                        </div>
                      )}
                      {inf.platforms && Object.keys(getPlatformsMap(inf.platforms)).length > 0 && (
                        <div style={{ gridColumn: 'span 2' }}>
                          📱 {Object.entries(getPlatformsMap(inf.platforms))
                            .map(([platform, followers]) => `${platform} (${followers > 0 ? followers.toLocaleString() : 'no count'})`)
                            .join(', ')}
                        </div>
                      )}
                    </div>

                  <div style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '12px', borderRadius: '8px', fontSize: '14px', color: 'var(--on-surface)', flex: 1, marginBottom: '16px', maxHeight: '120px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
                        <MessageSquare size={14} /> Recent Logs
                      </div>
                      <button 
                        onClick={() => setViewingLogsInfluencer(inf)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                        title="View Full History"
                      >
                        <History size={14} /> History ({inf.logs ? inf.logs.length : (inf.notes ? 1 : 0)})
                      </button>
                    </div>
                    {(!inf.logs || inf.logs.length === 0) ? (
                      <span style={{ color: 'var(--outline)' }}>{inf.notes ? inf.notes : 'No logs.'}</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[...inf.logs].reverse().slice(0, 2).map((log, idx) => (
                          <div key={idx} style={{ borderBottom: idx !== Math.min(inf.logs!.length, 2) - 1 ? '1px solid var(--outline-variant)' : 'none', paddingBottom: '4px' }}>
                            <div style={{ fontSize: '10px', color: 'var(--outline)' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                            <div>{log.text}</div>
                          </div>
                        ))}
                        {inf.logs.length > 2 && (
                          <button 
                            onClick={() => setViewingLogsInfluencer(inf)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', cursor: 'pointer', padding: '4px 0 0 0', textAlign: 'left', fontWeight: 600 }}
                          >
                            + View {inf.logs.length - 2} more logs
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                    <button onClick={() => setViewingLogsInfluencer(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} title="View Log History"><History size={18} /></button>
                    <button onClick={() => handleStartEditAddress(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: inf.address ? 'var(--primary)' : 'var(--on-surface-variant)' }} title={inf.address ? "Edit Address" : "Add Address"}><MapPin size={18} /></button>
                    <button onClick={() => handleEdit(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(inf.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }} title="Delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              );
            })}
            </div>
            
            {!loading && activeInfluencers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--on-surface-variant)', backgroundColor: 'var(--surface-container-low)', borderRadius: '12px', border: '1px dashed var(--outline-variant)', marginBottom: '40px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", margin: 0 }}>No active outreach campaigns tracked. Add one above!</p>
              </div>
            )}

            {/* Registry of Declined, Rejected & No Response Influencers */}
            <div style={{ marginTop: '56px', borderTop: '2px dashed var(--outline-variant)', paddingTop: '40px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 className="title-md" style={{ color: 'var(--on-surface-variant)', fontWeight: 600, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🚫 Declined, Rejected & No Response Registry ({inactiveInfluencers.length})
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--outline)', fontFamily: "'Inter', sans-serif" }}>
                  This registry preserves profiles of influencers who declined, were rejected, or had no response, preventing accidental duplicate research or outreach.
                </p>
              </div>

              {inactiveInfluencers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--outline)', fontFamily: "'Inter', sans-serif", fontSize: '13px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px', border: '1px dashed var(--outline-variant)' }}>
                  No registry profiles on record.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name / Handle</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Niche & Location</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platforms</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Event / Reason</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveInfluencers.map(inf => {
                        const logsList = inf.logs || (inf.notes ? [{ text: inf.notes }] : []);
                        const lastLog = logsList.length > 0 ? logsList[logsList.length - 1].text : 'No log details.';
                        const badgeStyle = getRegistryBadgeStyle(inf.status);
                        return (
                          <tr 
                            key={inf.id} 
                            onMouseEnter={() => setHoveredRowId(inf.id)}
                            onMouseLeave={() => setHoveredRowId(null)}
                            style={{ 
                              borderBottom: '1px solid var(--outline-variant)', 
                              backgroundColor: hoveredRowId === inf.id ? 'var(--surface-container-lowest)' : 'transparent',
                              transition: 'background-color 0.2s' 
                            }}
                          >
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{inf.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--outline)' }}>{inf.handle}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: 600, 
                                backgroundColor: badgeStyle.backgroundColor,
                                color: badgeStyle.color
                              }}>
                                {getShortStatus(inf.status)}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)' }}>
                              <div>🎯 {inf.niche || 'Not specified'}</div>
                              <div style={{ fontSize: '12px' }}>📍 {inf.location || 'Not specified'}</div>
                              {inf.address && (
                                <div style={{ fontSize: '11px', marginTop: '4px', whiteSpace: 'pre-wrap', color: 'var(--on-surface)' }}>🏠 {inf.address}</div>
                              )}
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontSize: '13px' }}>
                              {inf.platforms && Object.keys(getPlatformsMap(inf.platforms)).length > 0 
                                ? Object.keys(getPlatformsMap(inf.platforms)).join(', ') 
                                : 'None'}
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--on-surface)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lastLog}>
                              {lastLog}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setViewingLogsInfluencer(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} title="View Log History"><History size={16} /></button>
                                <button onClick={() => handleStartEditAddress(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: inf.address ? 'var(--primary)' : 'var(--on-surface-variant)' }} title={inf.address ? "Edit Address" : "Add Address"}><MapPin size={16} /></button>
                                <button onClick={() => handleEdit(inf)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} title="Edit"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(inf.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }} title="Delete"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* Edit Address Modal Popup */}
      {editingAddressInfluencer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 28, 29, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--outline-variant)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--outline-variant)',
              backgroundColor: 'var(--surface-container-low)'
            }}>
              <div>
                <h2 className="title-lg" style={{ margin: 0, color: 'var(--primary)', fontWeight: 600, fontSize: '18px' }}>
                  Edit Address
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>
                  {editingAddressInfluencer.name} ({editingAddressInfluencer.handle})
                </p>
              </div>
              <button 
                onClick={() => setEditingAddressInfluencer(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Mailing / Shipping Address</label>
                <textarea 
                  value={addressInput} 
                  onChange={(e) => setAddressInput(e.target.value)} 
                  style={{
                    ...inputStyle,
                    height: '120px',
                    resize: 'vertical',
                    fontFamily: "'Inter', sans-serif"
                  }} 
                  placeholder="Enter full shipping address (street, city, state, zip, country)..."
                  autoFocus
                />
              </div>

              {/* Modal Footer Controls */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end', 
                borderTop: '1px solid var(--outline-variant)',
                paddingTop: '20px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setEditingAddressInfluencer(null)} 
                  className="lfto-btn" 
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: 'var(--on-surface)', 
                    border: '1px solid var(--outline)',
                    padding: '10px 20px',
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="lfto-btn lfto-btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '8px' }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerTracker;
