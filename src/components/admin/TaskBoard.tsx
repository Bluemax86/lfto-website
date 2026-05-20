import React, { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask, TaskData } from '../../services/firebase';
import { Plus, Trash2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<(TaskData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  
  // Local drafts to enable zero-lag typing before saving on blur
  const [drafts, setDrafts] = useState<{ [taskId: string]: { title: string; description: string } }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data as (TaskData & { id: string })[]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNormalizedStatus = (status: string): 'TODO' | 'IN_PROGRESS' | 'COMPLETED' => {
    const s = (status || '').toUpperCase().trim();
    if (s === 'DONE' || s === 'COMPLETED') return 'COMPLETED';
    if (s === 'IN PROGRESS' || s === 'IN_PROGRESS') return 'IN_PROGRESS';
    return 'TODO';
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await addTask({
        title: newTitle,
        description: newNotes,
        status: 'TODO'
      });
      setNewTitle('');
      setNewNotes('');
      fetchData();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleTitleChange = (taskId: string, newTitleVal: string) => {
    setDrafts(prev => ({
      ...prev,
      [taskId]: {
        title: newTitleVal,
        description: prev[taskId]?.description !== undefined 
          ? prev[taskId].description 
          : (tasks.find(t => t.id === taskId)?.description || '')
      }
    }));
  };

  const handleDescriptionChange = (taskId: string, newDescVal: string) => {
    setDrafts(prev => ({
      ...prev,
      [taskId]: {
        title: prev[taskId]?.title !== undefined 
          ? prev[taskId].title 
          : (tasks.find(t => t.id === taskId)?.title || ''),
        description: newDescVal
      }
    }));
  };

  const handleSaveTask = async (taskId: string) => {
    const draft = drafts[taskId];
    if (!draft) return; // No draft edits to save

    setSavingTaskId(taskId);
    try {
      await updateTask(taskId, {
        title: draft.title,
        description: draft.description
      });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: draft.title, description: draft.description } : t));
    } catch (error) {
      console.error("Error saving task details:", error);
      alert("Failed to save changes.");
    } finally {
      setSavingTaskId(null);
    }
  };

  const moveTask = async (task: TaskData & { id: string }, direction: 'left' | 'right') => {
    const current = getNormalizedStatus(task.status);
    let nextStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' = current;
    
    if (current === 'TODO' && direction === 'right') {
      nextStatus = 'IN_PROGRESS';
    } else if (current === 'IN_PROGRESS') {
      nextStatus = direction === 'left' ? 'TODO' : 'COMPLETED';
    } else if (current === 'COMPLETED' && direction === 'left') {
      nextStatus = 'IN_PROGRESS';
    }

    if (nextStatus === current) return;

    try {
      await updateTask(task.id, { status: nextStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
    } catch (error) {
      console.error("Error transitioning task:", error);
      alert("Failed to move task.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
        // Clean up drafts if any
        setDrafts(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    }
  };

  const getTaskTitle = (task: TaskData & { id: string }) => {
    return drafts[task.id]?.title !== undefined ? drafts[task.id].title : task.title;
  };

  const getTaskDescription = (task: TaskData & { id: string }) => {
    return drafts[task.id]?.description !== undefined ? drafts[task.id].description : (task.description || '');
  };

  const columns: { id: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'; title: string; color: string; bg: string; border: string }[] = [
    { id: 'TODO', title: 'To Do', color: '#0066cc', bg: 'rgba(0, 122, 255, 0.02)', border: 'rgba(0, 122, 255, 0.15)' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#b8860b', bg: 'rgba(212, 175, 55, 0.02)', border: 'rgba(212, 175, 55, 0.2)' },
    { id: 'COMPLETED', title: 'Completed', color: '#2e7d32', bg: 'rgba(76, 175, 80, 0.02)', border: 'rgba(76, 175, 80, 0.15)' }
  ];

  if (loading && tasks.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--outline)' }}>Loading Kanban Board...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-loader {
          animation: spin 1s linear infinite;
        }
        .kanban-input:focus, .kanban-textarea:focus {
          background-color: var(--surface-container-lowest) !important;
          border-color: var(--outline) !important;
        }
      `}</style>

      <h1 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '8px' }}>Task Board & Compliance</h1>
      <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: 'var(--on-surface-variant)', fontFamily: "'Inter', sans-serif" }}>
        Manage active task cards in an interactive Kanban layout. Edits to headings and notes autosave instantly when clicking away from the fields.
      </p>

      {/* Sleek Quick-Add Form */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Task Heading</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                placeholder="What needs to be done?" 
                className="lfto-input"
                style={{ textAlign: 'left', textTransform: 'none', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ flex: 2, minWidth: '320px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Initial Progress Notes (Optional)</label>
              <input 
                type="text" 
                value={newNotes} 
                onChange={(e) => setNewNotes(e.target.value)} 
                placeholder="Add status details, links, or draft notes..." 
                className="lfto-input"
                style={{ textAlign: 'left', textTransform: 'none', fontSize: '14px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="lfto-btn lfto-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', height: 'auto' }}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Kanban Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start', marginBottom: '56px' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => getNormalizedStatus(t.status) === col.id);
          return (
            <div 
              key={col.id} 
              style={{ 
                backgroundColor: col.bg, 
                border: `1px solid ${col.border}`, 
                borderRadius: '12px', 
                padding: '20px', 
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${col.border}`, paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: col.color, fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {col.title}
                </h3>
                <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: col.color, color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {colTasks.map(task => (
                  <div 
                    key={task.id} 
                    style={{ 
                      backgroundColor: 'var(--surface)', 
                      borderRadius: '10px', 
                      border: '1px solid var(--outline-variant)', 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    {/* Auto-save Status Indicator */}
                    {savingTaskId === task.id && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--outline)' }}>
                        <Loader2 size={12} className="spin-loader" />
                      </div>
                    )}

                    {/* Heading Editable Input */}
                    <div style={{ width: '85%' }}>
                      <input 
                        type="text" 
                        value={getTaskTitle(task)}
                        onChange={(e) => handleTitleChange(task.id, e.target.value)}
                        onBlur={() => handleSaveTask(task.id)}
                        placeholder="Task heading..."
                        className="kanban-input"
                        style={{ 
                          border: '1px solid transparent', 
                          background: 'transparent', 
                          fontWeight: 600, 
                          fontSize: '14px', 
                          color: 'var(--primary)', 
                          outline: 'none',
                          padding: '4px',
                          borderRadius: '4px',
                          fontFamily: "'Inter', sans-serif",
                          width: '100%',
                          transition: 'border-color 0.2s, background-color 0.2s'
                        }} 
                      />
                    </div>

                    {/* Notes Multi-line Textarea */}
                    <div>
                      <textarea 
                        value={getTaskDescription(task)}
                        onChange={(e) => handleDescriptionChange(task.id, e.target.value)}
                        onBlur={() => handleSaveTask(task.id)}
                        placeholder="Add progress notes or status details..."
                        rows={3}
                        className="kanban-textarea"
                        style={{ 
                          border: '1px solid transparent', 
                          background: 'rgba(0,0,0,0.015)', 
                          borderRadius: '6px', 
                          padding: '8px', 
                          fontSize: '13px', 
                          color: 'var(--on-surface-variant)', 
                          outline: 'none',
                          fontFamily: "'Inter', sans-serif",
                          resize: 'vertical',
                          width: '100%',
                          transition: 'border-color 0.2s, background-color 0.2s',
                          lineHeight: '1.4'
                        }}
                      />
                    </div>

                    {/* Card Actions Bottom Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--outline-variant)', paddingTop: '10px', marginTop: '4px' }}>
                      {/* Transition arrows */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {col.id !== 'TODO' && (
                          <button 
                            onClick={() => moveTask(task, 'left')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Move to Previous Column"
                          >
                            <ArrowLeft size={16} />
                          </button>
                        )}
                        {col.id !== 'COMPLETED' && (
                          <button 
                            onClick={() => moveTask(task, 'right')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Move to Next Column"
                          >
                            <ArrowRight size={16} />
                          </button>
                        )}
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => handleDelete(task.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--outline)', fontSize: '13px', fontFamily: "'Inter', sans-serif", border: '1px dashed var(--outline-variant)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.005)' }}>
                    No tasks here.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
