import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Trash2,
  FolderKanban,
  AlertCircle,
  Tag,
} from 'lucide-react';
import api from '../api/client.js';
import { Task, Project } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import EmptyState from '../components/common/EmptyState.js';
import ConfirmModal from '../components/common/ConfirmModal.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  // New Task Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Task
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasksAndProjects = async () => {
    setIsLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        api.getTasks({
          search: search.trim() || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
          projectId: projectFilter !== 'ALL' ? projectFilter : undefined,
        }),
        api.getProjects(),
      ]);
      setTasks(tasksData || []);
      setProjects(projectsData || []);
      if (projectsData && projectsData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsData[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndProjects();
  }, [statusFilter, priorityFilter, projectFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasksAndProjects();
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.toggleTask(taskId);
      fetchTasksAndProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newTaskName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createTask({
        projectId: selectedProjectId,
        name: newTaskName,
        description: newTaskDescription,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined,
      });
      setNewTaskName('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setShowCreateModal(false);
      fetchTasksAndProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      fetchTasksAndProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Care Task Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize actionable preparations, tests, checklists, and doctor consultations
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition self-start active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Care Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-soft border border-slate-100 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Project Filter */}
          {projects.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Project:</span>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none max-w-xs truncate"
              >
                <option value="ALL">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <CardSkeleton rows={5} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Add a new task to organize hospital preparations, doctor questions, or essentials."
          actionText="Add Care Task"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 divide-y divide-slate-100">
          {tasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== 'COMPLETED';

            return (
              <div key={task.id} className="py-4 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer mt-0.5"
                  />
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        task.status === 'COMPLETED'
                          ? 'line-through text-slate-400'
                          : 'text-slate-800'
                      }`}
                    >
                      {task.name}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                    )}
                    {task.project && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rosewater-700 bg-rosewater-50 px-2 py-0.5 rounded-md mt-1.5">
                        <FolderKanban className="w-3 h-3" />
                        <span>{task.project.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      task.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>

                  {task.dueDate && (
                    <span
                      className={`text-[11px] font-semibold flex items-center gap-1 ${
                        isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      {isOverdue && '(Overdue)'}
                    </span>
                  )}

                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Add Pregnancy Care Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Associated Project *
                </label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Task Name *</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Prepare hospital documents, Check car seat"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Notes or details..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                  />
                </div>
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
                  disabled={isSubmitting || !newTaskName.trim() || !selectedProjectId}
                  className="px-5 py-2 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Care Task?"
        message={`Are you sure you want to delete "${taskToDelete?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

      <MedicalDisclaimer />
    </div>
  );
};

export default Tasks;
