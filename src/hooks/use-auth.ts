import { useMutation, useQuery } from '@tanstack/react-query';

import {
  type AvailableSlot,
  bookSlot,
  type Booking,
  type BookSlotPayload,
  fetchCurrentUser,
  fetchAvailableSlots,
  fetchGroundDetails,
  fetchMyBookings,
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

export function useBookSlotMutation() {
  return useMutation({
    mutationFn: (payload: BookSlotPayload) => bookSlot(payload),
  });
}

export function useMyBookingsQuery(enabled = true) {
  return useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: fetchMyBookings,
    enabled,
    retry: 1,
  });
}
