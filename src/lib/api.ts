import { AxiosError } from 'axios';

import { apiClient } from '@/src/lib/axios';

export type LoginPayload = {
  identifier: string;
  password: string;
  role: 'user';
};

export type SignupPayload = {
  full_name: string;
  phone_no: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type AuthUser = {
  sub: string;
  role: string;
  exp?: number;
};

export type Turf = {
  turf_field_id: string;
  turf_name: string;
  turf_location: string | null;
  turf_address: string | null;
  no_of_grounds: number | null;
  turf_facilities: string | null;
  turf_rules: string | null;
  longitude: string | null;
  latitude: string | null;
};

type ApiErrorResponse = {
  error?: string;
  detail?: string;
  message?: string;
};

function extractApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.error ?? data?.detail ?? data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export async function signupUser(payload: SignupPayload) {
  try {
    const { data } = await apiClient.post('/users/sign-up', payload);

    if (data?.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function loginUser(payload: LoginPayload) {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);

    if (!data.access_token) {
      throw new Error('Access token missing from login response.');
    }

    return data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function fetchCurrentUser() {
  try {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function logoutUser() {
  try {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

export async function fetchTurfs(city?: string) {
  try {
    const { data } = await apiClient.get<Turf[]>('/users/turfs', {
      params: city !== undefined ? { city } : undefined,
    });

    return data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
