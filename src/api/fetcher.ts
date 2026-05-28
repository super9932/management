import client from './client';

/**
 * GET fetcher — SWR / React Query queryFn 공용
 * useSWR(url, fetcher) 또는 useQuery([url], () => fetcher(url)) 형태로 사용
 */
export const fetcher = <T>(url: string): Promise<T> =>
  client.get<{ success: boolean; data: T }>(url).then((r) => r.data.data);

/**
 * GET fetcher (params 포함)
 * useQuery(['url', params], () => fetcherWithParams('url', params))
 */
export const fetcherWithParams = <T>(url: string, params: object): Promise<T> =>
  client.get<{ success: boolean; data: T }>(url, { params }).then((r) => r.data.data);

/**
 * POST fetcher — React Query mutationFn 공용
 * useMutation((body) => postFetcher('/path', body))
 */
export const postFetcher = <T>(url: string, body: unknown): Promise<T> =>
  client.post<{ success: boolean; data: T }>(url, body).then((r) => r.data.data);

/**
 * multipart/form-data POST — 파일 업로드용
 */
export const uploadFetcher = <T>(url: string, formData: FormData): Promise<T> =>
  client
    .post<{ success: boolean; data: T }>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.data);
