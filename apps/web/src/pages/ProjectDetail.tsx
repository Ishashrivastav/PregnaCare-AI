import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronLeft,
  Calendar,
  AlertCircle,
  CheckSquare,
} from 'lucide-react';
import api from '../api/client.js';
import { Project, Task } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import ConfirmModal from '../components/common/ConfirmModal.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Delete Task Modal
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchProject = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await api.getProject(id);
      setProject(data);
    } catch (err: any) {
      console.error('Failed to load project', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !taskName.trim()) return;

    setIsSubmittingTask(true);
    try {
      await api.createTask({
        projectId: project.id,
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
      });
      setTaskName('');
      setTaskDescription('');
      setTaskDueDate('');
      setShowAddTask(false);
      fetchProject();
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.toggleTask(taskId);
      fetchProject();
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      fetchProject();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  if (isLoading) return <CardSkeleton rows={5} />;
  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl shadow-soft">
        <p className="text-sm font-semibold text-slate-700">Project not found</p>
        <Link to="/projects" className="mt-3 inline-block text-xs font-bold text-rosewater-600">
          Back to Projects
        </Link>
      </div>
    );
  }

  const progress = project.progressPercentage || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rosewater-600 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                project.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : project.status === 'IN_PROGRESS'
                  ? 'bg-rosewater-100 text-rosewater-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {project.status.replace('_', ' ')}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{project.name}</h1>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition self-start active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task to Plan</span>
          </button>
        </div>

        {project.description && (
          <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>
        )}

        {/* Dynamic Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Plan Completion Progress</span>
            <span className="font-black text-rosewater-700">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress === 100 ? 'bg-emerald-500' : 'bg-rosewater-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {project.completedTasks || 0} of {project.totalTasks || 0} tasks completed
          </p>
        </div>
      </div>

      {/* Tasks List Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          Associated Care Tasks
        </h2>

        {project.tasks && project.tasks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {project.tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== 'COMPLETED';

              return (
                <div key={task.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'COMPLETED'}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer"
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
                        <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                        className={`text-[10px] font-semibold flex items-center gap-1 ${
                          isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        {isOverdue && '(Overdue)'}
                      </span>
                    )}

                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition ml-2"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500">No tasks in this project yet.</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-rosewater-50 text-rosewater-700 text-xs font-bold hover:bg-rosewater-100 transition"
            >
              Add First Task
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Add Task to {project.name}</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Task Name *</label>
                <input
                  type="text"
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. Choose hospital, Prepare questions for doctor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description / Details
                </label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Key items or notes..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
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
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask || !taskName.trim()}
                  className="px-5 py-2 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmittingTask ? 'Adding task...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
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

export default ProjectDetail;
