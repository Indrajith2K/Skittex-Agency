"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ProjectType {
  id: string;
  name: string;
  client: string;
  company?: string;
  type: string;
  status: string;
  progress: number;
  deadline: string;
}

import { useStore } from "@/lib/store";
import { Project } from "@/types";

function statusColor(s: string) {
  if (s === 'completed') return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.2)' };
  if (s === 'testing') return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' };
  if (s === 'in-progress') return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.2)' };
  return { bg: 'rgba(255,255,255,0.05)', color: '#8b8ba7', border: 'rgba(255,255,255,0.06)' };
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };

export default function ProjectsPage() {
  const projects = useStore(state => state.projects);
  const addProject = useStore(state => state.addProject);
  const updateProject = useStore(state => state.updateProject);
  const deleteProject = useStore(state => state.deleteProject);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    name: '', clientName: '', type: 'website', status: 'planning', completionPercentage: 0, deadline: new Date().toISOString().split('T')[0]
  });

  const filteredProjects = projects.filter(p => {
    const searchTarget = `${p.name} ${p.clientName}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setCurrentProject({ name: '', clientName: '', type: 'website', status: 'planning', completionPercentage: 0, deadline: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setCurrentProject(p);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentProject.name || !currentProject.clientName) return;

    const projectToSave: any = {
      ...currentProject,
      id: currentProject.id || Date.now().toString(),
      startDate: currentProject.startDate || new Date().toISOString(),
      priority: currentProject.priority || 'medium',
      milestones: currentProject.milestones || [],
      tasks: currentProject.tasks || [],
      createdAt: currentProject.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentProject.id) {
      updateProject(currentProject.id, projectToSave);
    } else {
      addProject(projectToSave);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentProject.id) {
      deleteProject(currentProject.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Projects</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Track ongoing development, SEO, and client workflows.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> New Project
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search projects or clients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
           <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ appearance: 'none', padding: '9px 32px 9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(255,255,255,0.02)', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none' }}
           >
              <option value="all">Status: All</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
           </select>
           <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredProjects.map(p => {
          const sc = statusColor(p.status);
          return (
            <div key={p.id} onClick={() => openEditModal(p)} style={{ ...cardBase, padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, letterSpacing: '0.04em', display: 'inline-block', marginBottom: '12px' }}>
                    {p.status.replace('-', ' ')}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', margin: '0 0 4px 0' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: '#8b8ba7', margin: 0 }}>{p.clientName}</p>
                </div>
                <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', color: '#5a5a78', cursor: 'pointer' }}>
                  <MoreVertical style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#8b8ba7' }}>Progress</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{p.completionPercentage}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.completionPercentage}%`, height: '100%', borderRadius: '99px', background: p.completionPercentage === 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 0 14px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b8ba7' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {p.status === 'completed' ? <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> : <AlertCircle style={{ width: '14px', height: '14px' }} />}
                  {p.type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock style={{ width: '14px', height: '14px' }} />
                  Due {formatDate(p.deadline || '')}
                </span>
              </div>
            </div>
          );
        })}
        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#5a5a78', fontSize: '14px' }}>
            No projects found matching your criteria.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {currentProject.id ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Project Name</label>
                <input type="text" className="input-base" value={currentProject.name} onChange={e => setCurrentProject({...currentProject, name: e.target.value})} placeholder="e.g. Nexus Dashboard" />
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Client Name</label>
                  <input type="text" className="input-base" value={currentProject.clientName || ''} onChange={e => setCurrentProject({...currentProject, clientName: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Project Type</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentProject.type} onChange={e => setCurrentProject({...currentProject, type: e.target.value as any})}>
                    <option value="landing-page">Landing Page</option>
                    <option value="website">Website</option>
                    <option value="seo">SEO</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Status</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentProject.status} onChange={e => setCurrentProject({...currentProject, status: e.target.value as any})}>
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Deadline</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={currentProject.deadline || ''} 
                    onChange={e => setCurrentProject({...currentProject, deadline: e.target.value})} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>
                  <span>Progress</span>
                  <span style={{ color: '#fff' }}>{currentProject.completionPercentage || 0}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={currentProject.completionPercentage || 0} 
                  onChange={e => setCurrentProject({...currentProject, completionPercentage: parseInt(e.target.value)})} 
                  style={{ width: '100%', accentColor: '#6366f1' }} 
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentProject.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Project</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentProject.name || !currentProject.clientName} style={{ opacity: (!currentProject.name || !currentProject.clientName) ? 0.5 : 1 }}>
                    {currentProject.id ? 'Save Changes' : 'Create Project'}
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
