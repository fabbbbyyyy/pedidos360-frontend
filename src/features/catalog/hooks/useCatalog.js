import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/core/auth/SessionProvider';
import { useApiClient } from '@/core/api/useApiClient';
import { createCatalogApi } from '../api/catalogApi';

export const CATALOG_KEY = ['catalog'];

function useCatalogQueryKey() {
  const { account } = useSession();
  return [...CATALOG_KEY, account.homeAccountId];
}

function useCatalogApi() {
  const http = useApiClient();
  return useMemo(() => createCatalogApi(http), [http]);
}

export function useProducts() {
  const api = useCatalogApi();
  const queryKey = useCatalogQueryKey();
  return useQuery({ queryKey, queryFn: api.list });
}

export function useCreateProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  const queryKey = useCatalogQueryKey();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  const queryKey = useCatalogQueryKey();
  return useMutation({
    mutationFn: ({ id, ...changes }) => api.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUploadProductImage() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  const queryKey = useCatalogQueryKey();
  const [progress, setProgress] = useState(null);

  function uploadFile(uploadUrl, file) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', uploadUrl);
      request.setRequestHeader('Content-Type', file.type);
      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
      });
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 300) resolve();
        else reject(new Error('No se pudo subir la imagen. Inténtalo nuevamente.'));
      });
      request.addEventListener('error', () => reject(new Error('No se pudo subir la imagen. Inténtalo nuevamente.')));
      request.addEventListener('abort', () => reject(new Error('La subida de la imagen fue cancelada.')));
      request.send(file);
    });
  }

  const mutation = useMutation({
    mutationFn: async ({ id, file }) => {
      setProgress(0);
      const upload = await api.requestImageUpload(id, {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      await uploadFile(upload.uploadUrl, file);
      return api.update(id, { imageKey: upload.imageKey });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onSettled: () => setProgress(null),
  });
  return { ...mutation, progress };
}

export function useDeleteProduct() {
  const api = useCatalogApi();
  const queryClient = useQueryClient();
  const queryKey = useCatalogQueryKey();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
