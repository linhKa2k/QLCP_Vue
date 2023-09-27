<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="6">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="1" :tab="t('plan.attribute.with_road')">
            <a-row>
              <a-col :span="24">
                <a-input-search
                  v-model:value="textSearchRoute"
                  placeholder="Tìm kiếm"
                  @search="onSearchRoute()"
                  @input="onSearchRoute()"
                />
              </a-col>
              <a-col :span="24" class="tab_pane">
                <a-row>
                  <a-col :span="24">
                    <a-row :gutter="[0, 24]">
                      <a-col
                        :span="24"
                        v-for="(item, key) in dataRouteItem"
                        :key="key"
                        @click="handleSelectRoute(item)"
                        class="item_chose"
                      >
                        <a-row>
                          <a-col :span="24"
                            ><h3>
                              {{
                                item.from_department && item.to_department
                                  ? item.from_department.name +
                                    " - " +
                                    item.to_department.name
                                  : "--"
                              }}
                            </h3></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Đơn vị đi" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.from_department
                                ? item.from_department.name
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Đơn vị đến" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.to_department
                                ? item.to_department.name
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Ngày bắt đầu" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.start_time
                                ? formatDate(item.start_time)
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Ngày kết thúc" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.end_time ? formatDate(item.end_time) : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            :key="2"
            :tab="t('plan.attribute.with_employee')"
            force-render
            ><a-row>
              <a-col :span="24">
                <a-input-search
                  v-model:value="textSeachStaff"
                  placeholder="Tìm kiếm"
                  @search="onSearchStaff"
                  @input="onSearchStaff"
                />
              </a-col>
              <a-col :span="24" class="tab_pane">
                <a-row>
                  <a-col :span="24">
                    <a-row :gutter="[0, 24]">
                      <a-col
                        :span="24"
                        v-for="(item, key) in dataStaffItem"
                        :key="key"
                        @click="handleSelectStaff(item)"
                        class="item_chose"
                      >
                        <a-row>
                          <a-col :span="24"
                            ><h3>
                              {{ item.name ? `${item.name}` : "--" }}
                            </h3></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="24"
                            ><span>{{
                              item.description ? item.description : "--"
                            }}</span></a-col
                          >
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
            </a-row></a-tab-pane
          >
        </a-tabs>
      </a-col>

      <a-col :span="18">
        <a-table
          :columns="columns"
          :data-source="dataCostEstimate"
          :scroll="{ y: 370 }"
          bordered
          :loading="costEstimateLoading"
        >
          <template
            v-for="col in ['quantity', 'amount', 'estimated_cost']"
            #[col]="{ text, record }"
            :key="col"
          >
            <div>
              <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][col]"
                style="margin: -5px 0"
                type="number"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template #operation="{ record }">
            <div class="editable-row-operations">
              <span v-if="editableData[record.key]">
                <a @click="save(record.key)">Lưu</a>
                <a-popconfirm
                  title="Chắc chắn hủy?"
                  @confirm="cancel(record.key)"
                  ok-text="Ok" 
                  cancel-text="Hủy"
                >
                  <a>Hủy</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <span v-if="!record.children">
                  <a @click="edit(record.key)">Sửa</a>
                </span>
                <span v-else> </span>
              </span>
            </div>
          </template>

          <template #footer>
            <a-row :gutter="16">
              <a-col :span="7">{{ "Tổng" }}</a-col>
              <a-col :span="5">{{
                totalQuantity ? formatNumber(totalQuantity) : formatNumber(0)
              }}</a-col>
              <a-col :span="5">{{
                totalAmount ? formatNumber(totalAmount) : formatNumber(0)
              }}</a-col>
              <a-col :span="5">{{
                totalEstimateCost
                  ? formatNumber(totalEstimateCost)
                  : formatNumber(0)
              }}</a-col>
            </a-row>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-col>
</template>
<script setup lang="ts">
import { ref, UnwrapRef, reactive, onMounted, computed } from "vue";

import i18n from "@/lang";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import PlanRouteService from "@/services/PlanRouteService";
import { useGetList as getPlanRoute } from "@/hooks/plan_route";
import { useGetList as getPlanRouteUser } from "@/hooks/plan_route_user";
import { useGetCostEstimate } from "@/hooks/plan_cost";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import Constant from "@/constant";
import { formatDate, formatNumber } from "@/utility";

const { t } = i18n.global;
interface Props {
  form: any;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  rules: {},
  fields: {},
});

interface DataItem {
  key?: number;
  content: string;
  amount?: number;
  total_amount?: number;
  cost_type?: any;
  cost_estimate?: number;
  plan_user_id?: any;

  children?: DataItem[];
}
interface planCostForm {
  id?: any;
  key?: number;
  content?: string;
  plan_id?: number;
  plan_route_id?: number;
  plan_route_name?: string;
  quantity?: number;
  amount?: number;
  total_amount?: number;
  total_quantity?: number;
  total_estimated_cost?: number;
  estimated_cost?: number;
  cost_id?: number;
  cost_type?: any;
  plan_route_user_id?: any;
  plan_route_user_name?: any;
  children?: planCostForm[];

  plan?: any;
  plan_route?: any;
  user?: any;
  estimated_amount?: any;
  limit_amount?: any;
  is_active?: Boolean;
}
const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const textSearchRoute = ref<any>("");
const textSeachStaff = ref<any>("");
const dataRouteItem = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataStaffItem = ref<any[]>([]);
const dataStaffRecord = ref<any[]>([]);

const dataCostEstimate = ref<any[]>([]);

const key = ref<number>(1);
const data = ref<planCostForm[]>([]);
const routeLevel = ref<planCostForm[]>([]);
const costLevel = ref<planCostForm[]>([]);
const userLevel = ref<planCostForm[]>([]);

const totalQuantity = ref<any>();
const totalAmount = ref<any>();
const totalEstimateCost = ref<any>();
const queryClient = useQueryClient();

const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});

const columns = [
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
    width: "30%",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    slots: { customRender: "quantity" },
  },
  {
    title: "Hạn mức",
    dataIndex: "amount",
    key: "amount",
    slots: { customRender: "amount" },
  },
  {
    title: "Chi phí dự định",
    dataIndex: "estimated_cost",
    key: "estimated_cost",
    slots: { customRender: "estimated_cost" },
  },
  {
    title: "Hành động",
    key: "operation",
    width: 200,
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];

const dataFakeTest: planCostForm[] = [
  {
    id: 1,
    plan_id: 1,
    plan_route_id: 124,
    plan_route_name: "Hà Nội- Hải Dương",
    quantity: 10,
    amount: 100,
    total_amount: 1000,
    plan_route_user_id: 1,
    plan_route_user_name: "hung",
    cost_id: 1,
    cost_type: "Phí bay",
  },
  {
    id: 1,
    plan_id: 1,
    plan_route_id: 124,
    plan_route_name: "Hà Nội- Hải Dương",
    quantity: 10,
    amount: 100,
    total_amount: 1000,
    plan_route_user_id: 1,
    plan_route_user_name: "hung",
    cost_id: 3,
    cost_type: "Phí bay gần",
  },
  {
    id: 3,
    plan_id: 1,
    plan_route_id: 124,
    plan_route_name: "Hà Nội- Hải Dương",
    quantity: 30,
    amount: 300,
    total_amount: 3000,
    plan_route_user_id: 1,
    plan_route_user_name: "Minh",
    cost_id: 1,
    cost_type: "Phí bay",
  },
  {
    id: 2,
    plan_id: 1,
    plan_route_id: 123,
    plan_route_name: "Hà Nội_Hải Phòng",
    quantity: 20,
    amount: 200,
    total_amount: 2000,
    plan_route_user_id: 73,
    plan_route_user_name: "Nam",
    cost_id: 2,
    cost_type: "Phí xe di chuyển",
  },
  {
    id: 2,
    plan_id: 1,
    plan_route_id: 125,
    plan_route_name: "Hà Nội_Nam định",
    quantity: 20,
    amount: 200,
    total_amount: 2000,
    plan_route_user_id: 73,
    plan_route_user_name: "Nam",
    cost_id: 2,
    cost_type: "Phí xe di chuyển",
  },
  {
    id: 2,
    plan_id: 1,
    plan_route_id: 125,
    plan_route_name: "Hà Nội_Nam định",
    quantity: 40,
    amount: 400,
    total_amount: 4000,
    plan_route_user_id: 73,
    plan_route_user_name: "Nam",
    cost_id: 3,
    cost_type: "Phí xe quản lí",
  },
];

const renderCostType = (type) => {
  const item = Constant.planCostType.find((i) => i.value == type);
  return item?.label;
};

const onSearchRoute = async () => {
  dataRouteItem.value = await dataRouteRecord.value.filter((item) => {
    return (
      (item.from_department.name + " - " + item.to_department.name)
        .toLowerCase()
        .search(textSearchRoute.value.toLowerCase()) !== -1
    );
  });
};

const onSearchStaff = async () => {
  dataStaffItem.value = await dataStaffRecord.value.filter((item) => {
    return (
      item.name.toLowerCase().search(textSeachStaff.value.toLowerCase()) !== -1
    );
  });
};

const handleSelectRoute = async (item: any) => {
  dataCostEstimate.value = routeLevel.value.filter(
    (a: any) => a.plan_route_id == item.id
  );
  
    if (dataCostEstimate.value[0]) {
    totalQuantity.value = await data.value[0].total_quantity;
    totalAmount.value = await data.value[0].total_amount;
    totalEstimateCost.value = await data.value[0].total_estimated_cost;
  } else {
    totalQuantity.value = 0;
    totalAmount.value = 0;
    totalEstimateCost.value = 0;
  }
};
const handleSelectStaff = async (item: any) => {
  dataCostEstimate.value = await generateDataCostEstimateByUser(
    data.value,
    item.id
  );
};
const activeKey = ref<number>(1);
const editableData: UnwrapRef<Record<number, DataItem>> = reactive({});
const dataEdit = ref<any>(null);

const edit = async (key: number) => {
  await fillterDataItem(dataCostEstimate.value, key);
  editableData[key] = cloneDeep(dataEdit.value);
};

const save = async (key: number) => {
  await fillterDataItem(dataCostEstimate.value, key);
  Object.assign(dataEdit.value, editableData[key]);
  delete editableData[key];
  console.log(dataCostEstimate.value, " check data after update");
};
const cancel = (key: string) => {
  delete editableData[key];
};

const fillterDataItem = (a: any[], value: any) => {
  a.forEach((item) => {
    if (item.key == value) {
      dataEdit.value = item;
      return false;
    }
    if (item.children) {
      if (item.children.length > 0) {
        fillterDataItem(item.children, value);
      }
    }
  });
};
const { isLoading: routeLoading } = getPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    dataRouteRecord.value = await val.data?.content;
    dataRouteItem.value = await dataRouteRecord.value;
  },
});

const { isLoading: staffLoading } = getPlanRouteUser(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    let a: any[] = [];

    dataStaffRecord.value = await val.data?.content;
    // dataStaffItem.value = await
    console.log(val.data?.content, " val.data?.content");
    val.data.content.forEach((item: any) => {
      if (
        !dataStaffItem.value.filter(
          (a: any) => a.plan_user_id == item.plan_user_id
        )[0]
      ) {
        dataStaffItem.value.push(item);
      }
    });
  },
});

const { isLoading: costEstimateLoading } = useGetCostEstimate(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    data.value = await val.data; // val.data;
    await generateDataCostEstimate(val.data);
  },
});

const generateDataCostEstimate = async (data: any) => {
  // let key = 1;
  data.forEach(async (item: any) => {
    if (
      !routeLevel.value.filter(
        (a: any) => a.plan_route_id == item.plan_route_id
      )[0]
    ) {
      await routeLevel.value.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        content: item.plan_route_name,
      });
    }
  });
  data.forEach(async (item: any) => {
    if (
      !costLevel.value.filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id && a.cost_type == item.cost_type
      )[0]
    ) {
      await costLevel.value.push({
        key: key.value++,
        content: renderCostType(item.cost_type),
        plan_route_id: item.plan_route_id,
        cost_type: item.cost_type,
      });
    }
  });
  data.forEach(async (item: any) => {
    if (
      !userLevel.value.filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id &&
          a.cost_type == item.cost_type &&
          a.plan_route_user_id == item.plan_route_user_id
      )[0]
    ) {
      await userLevel.value.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        cost_type: item.cost_type,
        content: item.plan_route_user_name,
        quantity: item.quantity,
        amount: item.amount,
        estimated_cost: item.estimated_cost,
        total_quantity: item.total_quantity,
        total_amount: item.total_amount,
        total_estimated_cost: item.total_estimated_cost,


        plan: { id: item.plan_id },
        plan_route: { id: item.plan_route_id },
        user: { id: item.plan_route_user_id },
        cost_id: item.cost_type,
        limit_amount: item.amount,
        estimated_amount: item.estimated_cost,
        is_active: true,
      });
    }
  });

  await routeLevel.value.forEach((item: any) => {
    item.children = costLevel.value.filter(
      (a: any) => a.plan_route_id == item.plan_route_id
    );
  });
  await costLevel.value.forEach((item: any) => {
    item.children = userLevel.value.filter(
      (a: any) =>
        a.cost_type == item.cost_type && a.plan_route_id == item.plan_route_id
    );
  });

  // dataCostEstimate.value = routeLevel.value;
};

const generateDataCostEstimateByUser = async (data: any, id: any) => {
  let routeLevel: planCostForm[] = [];
  let costLevel: planCostForm[] = [];
  let result = data.filter((item: any) => item.plan_route_user_id == id);
  // let result = data;
  await result.forEach(async (item: any) => {
    if (
      !routeLevel.filter((a: any) => a.plan_route_id == item.plan_route_id)[0]
    ) {
      await routeLevel.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        content: item.plan_route_name,
      });
    }
  });

  await result.forEach(async (item: any) => {
    if (
      !costLevel.filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id && a.cost_type == item.cost_type
      )[0]
    ) {
      await costLevel.push({
        key: key.value++,
        content: renderCostType(item.cost_type),
        plan_route_id: item.plan_route_id,
        cost_type: item.cost_type,
        quantity: item.quantity,
        amount: item.amount,
        total_amount: item.total_amount,
      });
    }
  });

  await routeLevel.forEach((item: any) => {
    item.children = costLevel.filter(
      (a: any) => a.plan_route_id == item.plan_route_id
    );
  });
  return routeLevel;
};


enum ServerStateKeysEnum {
  plan_cost = "plan-cost",
  plan_route = "plan-route",
  plan_route_user = "plan-route-user",
}

defineExpose({
  userLevel,
});
onMounted(async () => {
  // await queryClient.invalidateQueries(ServerStateKeysEnum.plan_cost);
  // await queryClient.invalidateQueries(ServerStateKeysEnum.plan_route);
  // await queryClient.invalidateQueries(ServerStateKeysEnum.plan_route_user);
  console.log("run unmount");
});
</script>
<style scoped lang="scss">
.item_chose:hover {
  background-color: rgb(137, 221, 243);
}
.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
}

.tab_pane {
  height: 58vh;
  overflow: auto;
}

.editable-row-operations a {
  margin-right: 8px;
}
</style>
