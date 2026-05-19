"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, AlertCircle, Calendar as CalendarIcon, Tag, X } from "lucide-react";

interface TaskType {
  id: string;
  title: string;
  type: string;
  priority: string;
  due: string;
  status: string;
}

const mockTasks: TaskType[] = [
  { id: "1", title: "Follow up with Sarah for proposal", type: "follow-up", priority: "high", due: "2024-05-16", status: "pending" },
  { id: "2", title: "Renew hosting for Nexus Properties", type: "renewal", priority: "urgent", due: "2024-05-17", status: "pending" },
  { id: "3", title: "Send invoice for Web App phase 1", type: "payment", priority: "medium", due: "2024-05-20", status: "pending" },
  { id: "4", title: "Onboarding call with new SEO client", type: "meeting", priority: "high", due: "2024-05-16", status: "pending" },
  { id: "5", title: "Draft wireframes for Bloom E-commerce", type: "deadline", priority: "medium", due: "2024-05-23", status: "completed" },
];

function priorityColor(p: string) {
  if (p === 'urgent') return '#f43f5e';
  if (p === 'high') return '#f59e0b';
  if (p === 'medium') return '#6366f1';
  if (p === 'low') return '#10b981';
  return '#8b8ba7';
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const tabs = ['all', 'pending', 'completed'];

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState<TaskType[]>(mockTasks);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<TaskType>>({
    title: '', type: 'follow-up', priority: 'medium', due: new Date().toISOString().split('T')[0], status: 'pending'
  });

  const filtered = tasks.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return t.status === 'completed';
    if (activeTab === 'pending') return t.status === 'pending';
    return true;
  });

  const openAddModal = () => {
    setCurrentTask({ title: '', type: 'follow-up', priority: 'medium', due: new Date().toISOString().split('T')[0], status: 'pending' });
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskType) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const toggleTaskStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const handleSave = () => {
    if (!currentTask.title) return;

    if (currentTask.id) {
      setTasks(tasks.map(t => t.id === currentTask.id ? { ...t, ...currentTask } as TaskType : t));
    } else {
      setTasks([{
        id: Date.now().toString(),
        ...currentTask,
      } as TaskType, ...tasks]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentTask.id) {
      setTasks(tasks.filter(t => t.id !== currentTask.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Tasks & Reminders</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage your daily priorities and upcoming commitments.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Task
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
            textTransform: 'capitalize',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === tab ? '#6366f1' : '#5a5a78',
            borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.2s ease',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {filtered.length === 0 && (
           <div style={{ textAlign: 'center', padding: '40px 0', color: '#5a5a78', fontSize: '14px' }}>
             No tasks found in this view.
           </div>
        )}
        {filtered.map(task => (
          <div 
            key={task.id} 
            onClick={() => openEditModal(task)}
            style={{
              background: 'rgba(20,20,28,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '18px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              opacity: task.status === 'completed' ? 0.6 : 1,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <button onClick={(e) => toggleTaskStatus(task.id, e)} style={{ marginTop: '2px', background: 'none', border: 'none', cursor: 'pointer', color: task.status === 'completed' ? '#10b981' : '#5a5a78', flexShrink: 0, transition: 'color 0.2s' }}>
              {task.status === 'completed' ? <CheckCircle2 style={{ width: '20px', height: '20px' }} /> : <Circle style={{ width: '20px', height: '20px' }} />}
            </button>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: task.status === 'completed' ? '#8b8ba7' : '#fff', margin: 0, textDecoration: task.status === 'completed' ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                {task.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: priorityColor(task.priority) }}>
                  <AlertCircle style={{ width: '13px', height: '13px' }} />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8b8ba7' }}>
                  <CalendarIcon style={{ width: '13px', height: '13px' }} />
                  {formatDate(task.due)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8b8ba7', textTransform: 'capitalize' }}>
                  <Tag style={{ width: '13px', height: '13px' }} />
                  {task.type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {currentTask.id ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Task Title</label>
                <input type="text" className="input-base" value={currentTask.title} onChange={e => setCurrentTask({...currentTask, title: e.target.value})} placeholder="e.g. Call Nexus Properties" />
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Priority</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentTask.priority} onChange={e => setCurrentTask({...currentTask, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Type</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentTask.type} onChange={e => setCurrentTask({...currentTask, type: e.target.value})}>
                    <option value="follow-up">Follow up</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="payment">Payment</option>
                    <option value="renewal">Renewal</option>
                    <option value="task">General Task</option>
                  </select>
                </div>
              </div>
              
              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Due Date</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={currentTask.due} 
                    onChange={e => setCurrentTask({...currentTask, due: e.target.value})} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
                {currentTask.id && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Status</label>
                    <select className="input-base" style={{ appearance: 'none' }} value={currentTask.status} onChange={e => setCurrentTask({...currentTask, status: e.target.value})}>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentTask.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Task</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentTask.title} style={{ opacity: (!currentTask.title) ? 0.5 : 1 }}>
                    {currentTask.id ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
