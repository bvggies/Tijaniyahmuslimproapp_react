import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { azanApi } from '../../../lib/api';
import { CreateAzanDto } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';

export const azanQueryKeys = {
  all: ['azan'] as const,
  lists: () => [...azanQueryKeys.all, 'list'] as const,
  list: (activeOnly?: boolean) => [...azanQueryKeys.lists(), activeOnly] as const,
  details: () => [...azanQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...azanQueryKeys.details(), id] as const,
};

export function useAzans(activeOnly?: boolean) {
  return useQuery({
    queryKey: azanQueryKeys.list(activeOnly),
    queryFn: () => azanApi.getAll({ activeOnly }),
    staleTime: 0,
    gcTime: 0,
  });
}

export function useAzan(id: string) {
  return useQuery({
    queryKey: azanQueryKeys.detail(id),
    queryFn: () => azanApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAzan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAzanDto) => azanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: azanQueryKeys.all });
      toast.success('Azan schedule created', 'Azan schedule has been added successfully.');
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });
}

export function useUpdateAzan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAzanDto> }) =>
      azanApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: azanQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: azanQueryKeys.lists() });
      toast.success('Azan schedule updated', 'Azan schedule has been updated successfully.');
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });
}

export function useDeleteAzan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => azanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: azanQueryKeys.all });
      toast.success('Azan schedule deleted', 'Azan schedule has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });
}
