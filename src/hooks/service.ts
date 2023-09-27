import ServiceService from "@/services/ServiceService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "service",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ServiceService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ServiceService.detail(params?.value),
    { ...config }
  )
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => ServiceService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};