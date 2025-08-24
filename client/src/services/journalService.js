import api from './api';

class JournalService {
  async getEntries(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/journal?${params.toString()}`);
    return response.data;
  }
  
  async createEntry(entryData) {
    const response = await api.post('/journal', entryData);
    return response.data;
  }
  
  async updateEntry(id, entryData) {
    const response = await api.put(`/journal/${id}`, entryData);
    return response.data;
  }
  
  async deleteEntry(id) {
    await api.delete(`/journal/${id}`);
  }
  
  async getStats() {
    const response = await api.get('/journal/stats');
    return response.data;
  }
}

export default new JournalService();
