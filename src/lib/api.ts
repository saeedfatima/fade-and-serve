const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://barber-shop-backend-latest.onrender.com/api';

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

  async updateBooking(bookingId: number, updateData: { 
    status?: string; 
    notes?: string; 
    is_vip?: boolean;
    is_home_service?: boolean;
    use_new_equipment?: boolean;
  }) {
    return this.request(`/bookings/${bookingId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart/');
  }

  async addToCart(cartData: {
    service_id: number;
    quantity?: number;
    use_new_equipment?: boolean;
    equipment_surcharge?: number;
  }) {
    return this.request('/cart/add/', {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  }

  async removeFromCart(itemId: number) {
    return this.request(`/cart/remove/${itemId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear/', {
      method: 'POST',
    });
  }

  // Service availability endpoints
  async getServiceAvailability(params?: {
    service_id?: number;
    date?: string;
    is_home_service?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.service_id) searchParams.append('service_id', params.service_id.toString());
    if (params?.date) searchParams.append('date', params.date);
    if (params?.is_home_service !== undefined) searchParams.append('is_home_service', params.is_home_service.toString());
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/service-availability/${query}`);
  }

  async createServiceAvailability(availabilityData: {
    service_id: number;
    date: string;
    start_time: string;
    end_time: string;
    capacity?: number;
    is_home_service?: boolean;
  }) {
    return this.request('/service-availability/create/', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  }

  // Equipment endpoints
  async getEquipment() {
    return this.request('/equipment/');
  }

  // Credit top-up endpoints
  async getCreditTopUps() {
    return this.request('/credit-topups/');
  }

  async createCreditTopUp(amount: number) {
    return this.request('/credit-topups/', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async deleteBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);