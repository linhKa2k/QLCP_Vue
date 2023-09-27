import TransferRequestItemService from "@/services/TransferRequestItemService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "transfer-request-item",
}
export const useGetContentMax = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await TransferRequestItemService.getContentMax(params?.value),
    { ...config }
  );
};
