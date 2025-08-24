import api from './api';

class TaskService {
  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  }
  
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  }
  
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  }
  
  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  }
  
  async getStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  }
}

export default new TaskService();
