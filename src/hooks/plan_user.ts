import PlanUserService from "@/services/PlanUserService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "plan-user",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanUserService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanUserService.detail(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanUserService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
export const useSavesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanUserService.saves(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useDelete = () => {
  const queryClient = useQueryClient();
  return useMutation((id: any) => PlanUserService.delete(id), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};


