import MovingQuotaService from "@/services/MovingQuotaService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "moving_quota",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await MovingQuotaService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await MovingQuotaService.detail(params?.value),
    { ...config }
  );
};

export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => MovingQuotaService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
