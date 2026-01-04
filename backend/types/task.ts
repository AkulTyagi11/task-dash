export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  date: string;
}
