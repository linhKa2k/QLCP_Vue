import PolicyLimitService from "@/services/PolicyLimitService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "policy_limit",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await PolicyLimitService.get(params?.value),
    { ...config }
  )
};
export const useGetAmountByUser = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PolicyLimitService.getLimitAmount(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await PolicyLimitService.detail(params?.value),
    { ...config }
  )
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PolicyLimitService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};