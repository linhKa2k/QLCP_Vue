import PlanRouteService from "@/services/PlanRouteService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "plan-route",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanRouteService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanRouteService.detail(params?.value),
    { ...config }
  );
};

export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanRouteService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanRouteService.delete(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useSavesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanRouteService.saveMany(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useGetListUser = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanRouteService.getUserWithPlanRouteId(params.planRouteId),
    { ...config }
  );
};
