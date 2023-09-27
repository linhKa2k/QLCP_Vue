import PlanCostQuotaService from "@/services/PlanCostQuotaService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "plan-cost-quota",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostQuotaService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostQuotaService.detail(params?.value),
    { ...config }
  );
};

export const getCostQuotaByPlanId = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostQuotaService.getCostQuotaByPlanId(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanCostQuotaService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};


