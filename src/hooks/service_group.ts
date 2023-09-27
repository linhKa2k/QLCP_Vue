import ServiceGroupService from "@/services/ServiceGroupService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "service-group",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ServiceGroupService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ServiceGroupService.detail(params?.value),
    { ...config }
  )
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => ServiceGroupService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};