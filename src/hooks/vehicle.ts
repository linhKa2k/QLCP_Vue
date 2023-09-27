import VehicleService from "@/services/VehicleService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "vehicle",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await VehicleService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await VehicleService.detail(params?.value),
    { ...config }
  )
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => VehicleService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};