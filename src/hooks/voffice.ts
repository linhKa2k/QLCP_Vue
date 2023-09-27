import VOfficeService from "@/services/VOfficeService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "voffice",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.get(params?.value),
    { ...config }
  );
};

export const useGetListUser = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.getSignner(params?.value),
    { ...config }
  );
};
export const useGetListUserRole = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.getSignnerRole(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.detail(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => VOfficeService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const uploadFileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => VOfficeService.uploadFile(data), {
    onSuccess: async () => {
      // queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const vOfficeLogin = () => {
  // return VOfficeService.login(data);
    const queryClient = useQueryClient();
    return useMutation((data: any) => VOfficeService.login(data), {
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      },
    });
};

export const useGetListDomain = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.getDomains(params),
    { ...config }
  );
};

export const useGetListDocType = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.getDocTypes(params),
    { ...config }
  );
};

export const sendAndSignVOfice = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => VOfficeService.sendAndSign(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      queryClient.invalidateQueries("plan");
    },
  });
};

export const useGetSapAccounting = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await VOfficeService.getSapAccounting(),
    { ...config }
  );
};
