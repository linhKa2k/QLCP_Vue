import FileService from "@/services/FileService"
import { useQuery,useMutation,useQueryClient } from "vue-query";
// const queryClient = useQueryClient();
export enum ServerStateKeysEnum {
    Items = "file",
  }
  export const useUploadMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation((data:any) => FileService.upload(data),{
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      }
    });
  }
  export const useUploadImgMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation((data:any) => FileService.uploadImg(data),{
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      }
    });
  }
    export const useUploadFormDataMutation = () => {
      const queryClient = useQueryClient();
      return useMutation((data: any) => FileService.uploadFormData(data), {
        onSuccess: async () => {
          queryClient.invalidateQueries(ServerStateKeysEnum.Items);
        },
      });
    };

    export const downloadFile = (params: any, config: object): any => {
      return useQuery(
        [ServerStateKeysEnum.Items, params],
        async () => await FileService.downloadFile(params.value),
        { ...config }
      );
    };