import TransferRequestService from "@/services/TransferRequestService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "transfer-request",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await TransferRequestService.get(params?.value),
    { ...config }
  );
};

export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await TransferRequestService.detail(params?.value),
    { ...config }
  );
};

export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => TransferRequestService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => TransferRequestService.updateStatus(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
