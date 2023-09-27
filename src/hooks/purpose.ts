import PurposeService from "@/services/PurposeService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "purpose",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PurposeService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PurposeService.detail(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PurposeService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
