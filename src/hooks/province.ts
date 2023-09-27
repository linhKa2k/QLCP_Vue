import ProvinceService from "@/services/ProvinceService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "province",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await ProvinceService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await ProvinceService.detail(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => ProvinceService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
