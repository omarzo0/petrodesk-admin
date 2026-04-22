import { useQuery } from '@tanstack/react-query';
import { overviewApi, OverviewData } from '../api/overview.api';

export function useOverview() {
    return useQuery<OverviewData>({
        queryKey: ['overview'],
        queryFn: () => overviewApi.getOverview(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
