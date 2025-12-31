import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scholarsApi } from '../../../lib/api';
import { Scholar } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';

export const scholarQueryKeys = {
  all: ['scholars'] as const,
  lists: () => [...scholarQueryKeys.all, 'list'] as const,
  list: (filters: UseScholarsParams) => [...scholarQueryKeys.lists(), filters] as const,
  details: () => [...scholarQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...scholarQueryKeys.details(), id] as const,
};

interface UseScholarsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useScholars(params: UseScholarsParams = {}) {
  return useQuery({
    queryKey: scholarQueryKeys.list(params),
    queryFn: () => scholarsApi.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useScholar(id: string) {
  return useQuery({
    queryKey: scholarQueryKeys.detail(id),
    queryFn: () => scholarsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateScholar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Scholar>) => scholarsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarQueryKeys.lists() });
      toast.success('Scholar created', 'Scholar has been created successfully.');
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });
}

export function useUpdateScholar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Scholar> }) =>
      scholarsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scholarQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scholarQueryKeys.lists() });
      toast.success('Scholar updated', 'Scholar has been updated successfully.');
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });
}

export function useDeleteScholar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => scholarsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scholarQueryKeys.lists() });
      toast.success('Scholar deleted', 'Scholar has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });
}

