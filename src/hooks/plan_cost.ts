import PlanCostService from "@/services/PlanCostService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "plan-cost",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostService.detail(params?.value),
    { ...config }
  );
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => PlanCostService.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};

export const useGetCostEstimate = (params: any, config: object) => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostService.getCostEstimate(params?.value),
    // async () => await PlanCostService.getCostEstimate({ planId: 50 }),
    { ...config }
  );
};

export const useGetPlanCostByPlanId = (params: any, config: object) => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await PlanCostService.getPlanCostByPlanId(params?.value),
    // async () => await PlanCostService.getCostEstimate({ planId: 50 }),
    { ...config }
  );
};
