import PlanService from "@/services/PlanService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum
{
  Items = "plan",
}
export const useGetList = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanService.get(params?.value),
    { ...config }
  );
};

export const useGetListConfirm = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanService.getConfirm(params?.value),
    { ...config }
  );
};

export const useGetInfoData = (params: any, config: object): any =>
{
  const queryClient = useQueryClient();
  queryClient.invalidateQueries(ServerStateKeysEnum.Items);
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanService.getAllInfoData(params?.id),
    { ...config }
  );
};

export const useDetail = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanService.detail(params?.value),
    { ...config }
  );
};

export const useSaveMutation = () =>
{
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanService.save(data), {
    onSuccess: async () =>
    {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useCancelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanService.cancel(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
