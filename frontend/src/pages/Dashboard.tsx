import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, TrendingUp, ListTodo, MoreHorizontal } from 'lucide-react';
import TaskProgressCard from '../components/dashboard/TaskProgressCard';
import TaskList from '../components/dashboard/TaskList';
import ActivityChart from '../components/dashboard/ActivityChart';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../utils/api';
import { Task } from '../types/task';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

    // Check authentication
    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, authLoading, navigate]);

    // Fetch tasks from backend
    useEffect(() => {
      const fetchTasks = async () => {
        if (!isAuthenticated) return;
      
        try {
          const fetchedTasks = await taskAPI.getAllTasks();
          const tasksWithId: Task[] = fetchedTasks.map((task) => ({
            ...task,
            id: task._id ?? task.id
          }));
          setTasks(tasksWithId);
          setRecentTasks(tasksWithId.slice(0, 5));
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }, [isAuthenticated]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const inProgressCount = totalCount - completedCount;
  const productivityRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const categoryPalette: Record<string, string> = {
    Work: 'bg-sky-500',
    Personal: 'bg-emerald-500',
    Health: 'bg-teal-500',
    Learning: 'bg-amber-500',
    Other: 'bg-rose-500'
  };

  const progressData = ['Work', 'Personal', 'Health', 'Learning', 'Other']
    .map((category, index) => {
      const categoryTasks = tasks.filter((task) => task.category === category);
      return {
        id: index + 1,
        name: category,
        completed: categoryTasks.filter((task) => task.completed).length,
        total: categoryTasks.length,
        color: categoryPalette[category]
      };
    })
    .filter((item) => item.total > 0);

  const visibleProgressData = progressData.length
    ? progressData
    : [
        { id: 1, name: 'Work', completed: 0, total: 0, color: 'bg-sky-500' },
        { id: 2, name: 'Personal', completed: 0, total: 0, color: 'bg-emerald-500' },
        { id: 3, name: 'Health', completed: 0, total: 0, color: 'bg-teal-500' },
        { id: 4, name: 'Learning', completed: 0, total: 0, color: 'bg-amber-500' }
      ];

  const upcomingTasks: Task[] = tasks
    .filter((task) => !task.completed)
    .map((task) => ({
      ...task,
      dateValue: new Date(task.date).getTime()
    }))
    .filter((task) => !Number.isNaN(task.dateValue))
    .sort((a, b) => a.dateValue - b.dateValue)
    .slice(0, 4)
    .map(({ dateValue, ...task }) => task);

  const handleNewTask = async (task: Omit<Task, 'id' | 'completed' | '_id'>) => {
    try {
      const createdTask = await taskAPI.createTask({
        ...task,
        completed: false
      });
      const normalizedTask: Task = { ...createdTask, id: createdTask._id ?? createdTask.id };
      setRecentTasks([normalizedTask, ...recentTasks.slice(0, 4)]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Here's your weekly momentum.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
              <Calendar className="w-4 h-4 inline mr-1" />
              Today
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors duration-200"
            >
              <ListTodo className="w-4 h-4 inline mr-1" />
              New Task
            </button>
          </div>
        </div>

        {/* Task Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visibleProgressData.map((category) => (
            <TaskProgressCard key={category.id} {...category} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 flex items-center border border-slate-200 dark:border-slate-800">
                <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 mr-4">
                  <CheckCircle className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{completedCount} Tasks</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 flex items-center border border-slate-200 dark:border-slate-800">
                <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 mr-4">
                  <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{inProgressCount} Tasks</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 flex items-center border border-slate-200 dark:border-slate-800">
                <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 mr-4">
                  <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Productivity</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{productivityRate}%</p>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Activity</h2>
                <button className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <ActivityChart />
            </div>

            {/* Recent Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Tasks</h2>
                <button className="text-sm text-sky-600 dark:text-sky-400 hover:underline">View All</button>
              </div>
              {recentTasks.length ? (
                <TaskList tasks={recentTasks} />
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400">No tasks yet. Create your first task to get started.</div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
                <button className="text-sm text-sky-600 dark:text-sky-400 hover:underline">View Calendar</button>
              </div>
              {upcomingTasks.length ? (
                <UpcomingTasks tasks={upcomingTasks} />
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400">No upcoming tasks scheduled.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(taskData: Omit<Task, 'id' | 'completed'>) => {
            handleNewTask(taskData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
