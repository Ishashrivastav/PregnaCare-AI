import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import api from '../api/client.js';
import { Project } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import EmptyState from '../components/common/EmptyState.js';
import ConfirmModal from '../components/common/ConfirmModal.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create Project Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setProjects(data || []);
    } catch (err: any) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createProject({
        name: newProjectName,
        description: newProjectDescription,
        status: newProjectStatus,
      });
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateModal(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await api.deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Pregnancy Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize milestones into structured plans (Hospital Prep, Essentials, Trimester Care)
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition self-start active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Pregnancy Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-soft border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
          />
        </form>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-rosewater-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No pregnancy projects yet"
          description="Create your first project to start organizing hospital preparations, nursery planning, or prenatal care plans."
          actionText="Create Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const progress = proj.progressPercentage || 0;
            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-soft-lg transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        proj.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'IN_PROGRESS'
                          ? 'bg-rosewater-100 text-rosewater-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => setProjectToDelete(proj)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link to={`/projects/${proj.id}`}>
                    <h2 className="text-sm font-bold text-slate-800 group-hover:text-rosewater-600 transition">
                      {proj.name}
                    </h2>
                  </Link>
                  {proj.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}

                  {/* Dynamic Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{progress}%</span>
                      <span className="text-[11px] text-slate-400">
                        {proj.completedTasks || 0}/{proj.totalTasks || 0} tasks completed
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress === 100
                            ? 'bg-emerald-500'
                            : progress > 0
                            ? 'bg-rosewater-500'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-50">
                  <Link
                    to={`/projects/${proj.id}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rosewater-50 text-slate-700 hover:text-rosewater-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Project & Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Create Pregnancy Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Hospital Preparation, Nursery Planning"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Goals and key items for this pregnancy plan..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  value={newProjectStatus}
                  onChange={(e: any) => setNewProjectStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newProjectName.trim()}
                  className="px-5 py-2 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating project...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        title="Delete Pregnancy Project?"
        message={`Deleting "${projectToDelete?.name}" will also permanently remove all associated tasks under this project. Are you sure?`}
        confirmText="Delete Project"
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />

      <MedicalDisclaimer />
    </div>
  );
};

export default Projects;
