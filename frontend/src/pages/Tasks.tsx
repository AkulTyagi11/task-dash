import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import TaskItem from '../components/tasks/TaskItem';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../utils/api';

interface Task {
  _id?: string;
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  date: string;
  category: string;
}

const Tasks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

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
          setIsLoading(true);
          const fetchedTasks = await taskAPI.getAllTasks();
          // Convert _id to id for compatibility with existing components
          const tasksWithId = fetchedTasks.map(task => ({
            ...task,
            id: task._id
          }));
          setTasks(tasksWithId as Task[]);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTasks();
    }, [isAuthenticated]);

    const toggleTaskCompletion = async (taskId: number | string) => {
      try {
        const taskToUpdate = tasks.find(t => t.id === taskId || t._id === taskId);
        if (!taskToUpdate?._id) return;

        const updatedTask = await taskAPI.toggleTask(taskToUpdate._id);
        setTasks(tasks.map(task =>
          (task.id === taskId || task._id === taskId) 
            ? { ...updatedTask, id: updatedTask._id } 
            : task
        ));
      } catch (error) {
        console.error('Error toggling task:', error);
      }
  };

    const deleteTask = async (taskId: number | string) => {
      try {
        const taskToDelete = tasks.find(t => t.id === taskId || t._id === taskId);
        if (!taskToDelete?._id) return;

        await taskAPI.deleteTask(taskToDelete._id);
        setTasks(tasks.filter(task => task.id !== taskId && task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
  };

    const addTask = async (newTask: Omit<Task, 'id' | '_id'>) => {
      try {
        const createdTask = await taskAPI.createTask({
          ...newTask,
          completed: false
        });
        setTasks([{ ...createdTask, id: createdTask._id }, ...tasks]);
      } catch (error) {
        console.error('Error creating task:', error);
      }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    })
    .filter(task => {
      if (categoryFilter !== 'all') return task.category === categoryFilter;
      return true;
    })
    .filter(task => {
      if (searchQuery) {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading tasks...</div>
            </div>
          ) : (
            <>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Tasks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'all'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'incomplete'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                To Do
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'completed'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                Completed
              </button>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Task List</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTasks.filter(t => !t.completed).length} remaining
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id || task.id}
                  task={task}
                  onToggle={() => toggleTaskCompletion(task._id || task.id!)}
                  onDelete={() => deleteTask(task._id || task.id!)}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              {tasks.length === 0 ? 'No tasks yet. Create your first task to get started!' : 'No tasks match your filters.'}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <NewTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(task) => {
            addTask(task);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;