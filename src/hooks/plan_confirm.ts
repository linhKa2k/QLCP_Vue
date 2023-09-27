import PlanConfirmService from "@/services/PlanConfirmService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum
{
  Items = "plan-confirm",
}
export const useGetList = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanConfirmService.get(params?.value),
    { ...config }
  );
};

export const useGetByPlanRoute = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanConfirmService.getByPlanRoute(params?.value),
    { ...config }
  );
};

export const useDetail = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanConfirmService.detail(params?.value),
    { ...config }
  );
};

export const useSaveMutation = () =>
{
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanConfirmService.save(data), {
    onSuccess: async () =>
    {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      queryClient.invalidateQueries("plan-route");
    },
  });
};

export const useGetListStaffConfirm = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanConfirmService.getStaffConfirm(params.planRouteId),
    { ...config }
  );
};

export const useDeleteMutation = () =>
{
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanConfirmService.delete(data), {
    onSuccess: async () =>
    {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useUpdatePlanConfirm = (): any =>
{
  const queryClient = useQueryClient();
  return useMutation(
    (data: any) => PlanConfirmService.updateStatusPlanConfirm(data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
        queryClient.invalidateQueries("plan");
      },
    }
  );
};
