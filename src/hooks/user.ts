import UserService from "@/services/UserService"
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum
{
  Items = "user",
}
export const useGetList = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await UserService.get(params?.value),
    { ...config }
  )
};
export const useGetAll = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await UserService.getAll(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any =>
{
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await UserService.detail(params?.value),
    { ...config }
  )
};

export const useSaveMutation = () =>
{
  const queryClient = useQueryClient();
  return useMutation((data: any) => UserService.save(data), {
    onSuccess: async () =>
    {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};