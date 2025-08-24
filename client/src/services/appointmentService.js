import api from './api';

class AppointmentService {
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/appointments?${params.toString()}`);
    return response.data;
  }
  
  async createAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  }
  
  async updateAppointment(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  }
  
  async deleteAppointment(id) {
    await api.delete(`/appointments/${id}`);
  }
  
  async getUpcoming() {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  }
}

export default new AppointmentService();
