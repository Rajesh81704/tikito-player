import { useMutation, useQuery } from '@tanstack/react-query';

import {
  type AvailableSlot,
  fetchCurrentUser,
  fetchAvailableSlots,
  fetchGroundDetails,
  fetchTurfs,
  type Ground,
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

export function useTurfsQuery(city?: string, enabled = true) {
  return useQuery({
    queryKey: ['turfs', city ?? 'all'],
    queryFn: () => fetchTurfs(city),
    enabled,
    retry: 1,
  });
}

export function useGroundDetailsQuery(turfId?: string, enabled = true) {
  return useQuery<Ground[]>({
    queryKey: ['ground-details', turfId],
    queryFn: () => fetchGroundDetails(turfId as string),
    enabled: enabled && Boolean(turfId),
    retry: 1,
  });
}

export function useAvailableSlotsQuery(turfGroundId?: string, enabled = true) {
  return useQuery<AvailableSlot[]>({
    queryKey: ['available-slots', turfGroundId],
    queryFn: () => fetchAvailableSlots(turfGroundId as string),
    enabled: enabled && Boolean(turfGroundId),
    retry: 1,
  });
}
