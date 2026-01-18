import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makkahLiveApi, CreateMakkahChannelDto } from '../../../lib/api/endpoints';

const QUERY_KEY = 'makkah-live-channels';

export function useMakkahLiveChannels() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => makkahLiveApi.getAll(),
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMakkahChannelDto) => makkahLiveApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMakkahChannelDto> }) =>
      makkahLiveApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => makkahLiveApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useToggleChannelStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => makkahLiveApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useToggleChannelFeatured() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => makkahLiveApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useSeedChannels() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => makkahLiveApi.seed(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

