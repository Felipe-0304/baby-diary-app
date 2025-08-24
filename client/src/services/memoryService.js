import api from './api';

class MedicalService {
  async getRecords(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/medical?${params.toString()}`);
    return response.data;
  }
  
  async createRecord(recordData) {
    const response = await api.post('/medical', recordData);
    return response.data;
  }
  
  async updateRecord(id, recordData) {
    const response = await api.put(`/medical/${id}`, recordData);
    return response.data;
  }
  
  async deleteRecord(id) {
    await api.delete(`/medical/${id}`);
  }
  
  async getByType(type) {
    const response = await api.get(`/medical/type/${type}`);
    return response.data;
  }
}

export default new MedicalService();
