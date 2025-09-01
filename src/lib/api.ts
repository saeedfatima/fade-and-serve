const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.detail || errorData.message || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    phone?: string;
    gender?: string;
  }) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Services endpoints
  async getServices() {
    return this.request('/services/');
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings/');
  }

  async createBooking(bookingData: {
    service_id: number;
    appointment_date: string;
    appointment_time: string;
    notes?: string;
  }) {
    return this.request('/bookings/create/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(bookingId: number, updateData: { status?: string; notes?: string }) {
    return this.request(`/bookings/${bookingId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async deleteBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);