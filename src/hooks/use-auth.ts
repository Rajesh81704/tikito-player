import { useMutation, useQuery } from '@tanstack/react-query';

import {
  fetchCurrentUser,
  type LoginPayload,
  loginUser,
  logoutUser,
  type SignupPayload,
  signupUser,
} from '@/src/lib/api';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signupUser(payload),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutUser,
  });
}

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    enabled,
    retry: 1,
  });
}
