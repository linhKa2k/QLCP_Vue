<template>
  <a-spin :spinning="costEstimateLoading">
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
                          @click="handleSelectRoute(item, key)"
                          class="item_chose"
                          :style="
                            custom[key]
                              ? {
                                  backgroundColor: ' #ed1b2f',
                                  color: 'white',
                                }
                              : {}
                          "
                        >
                          <a-row>
                            <a-col :span="24">
                              <span style="font-size: 117%">
                                <strong>
                                  {{ item.name ? item.name : "--" }}
                                </strong>
                              </span>
                            </a-col>
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
                                item.is_to_internal
                                  ? item.to_department
                                    ? item.to_department.name
                                    : "--"
                                  : item.to_department_name
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
                    v-model:value="textSearchStaff"
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
                          v-for="(item, key) in dataStaffRecord"
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
                                item.position ? item.position : "--"
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
            :key="dataCostEstimate.length"
            :columns="columnsCostEstimate"
            :data-source="dataCostEstimate"
            :scroll="{ y: 370 }"
            bordered
            defaultExpandAllRows
            :pagination="false"
          >
            <template
              v-for="col in ['total_amount']"
              #[col]="{ text, record }"
              :key="col"
            >
              <div>
                <a-input-number
                  v-if="editableData[record.key]"
                  v-model:value="editableData[record.key][col]"
                  style="margin: -5px 0; width: 100%"
                  :min="0"
                  :max="1000000000"
                  :maxlength="14"
                  :formatter="
                    (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  "
                  :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                />
                <template v-else>
                  {{ text != null ? formatCurrency(text) : null }}
                </template>
              </div>
            </template>
            <template #currency="{ text }">
              {{ text ? formatCurrency(text) : "" }}
            </template>

            <template #operation="{ record }">
              <div class="editable-row-operations">
                <span v-if="record?.level.value == levelTypeEnum.ROUTE_LEVEL">
                  <a-tooltip placement="top" title="Thêm chi phí">
                    <a-button @click="openCreateCostEstimateModal(record)">
                      <template #icon><PlusCircleOutlined /></template>
                    </a-button>
                  </a-tooltip>
                </span>
                <span v-if="editableData[record.key]">
                  <a @click="saveEdit(record.key)">Lưu</a>
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
                  <span v-if="!record.children && !record?.is_default_quota">
                    <a-button
                      class="remove-item"
                      type="text"
                      @click="edit(record.key)"
                    >
                      <template #icon><EditOutlined /></template>
                    </a-button>
                  </span>
                  <span v-else> </span>
                </span>
              </div>
            </template>

            <template #footer>
              <a-row :gutter="16">
                <a-col :span="8">{{ "Tổng" }}</a-col>
                <a-col :span="5" style="">{{
                  footer.quantity_final != null
                    ? formatCurrency(footer.quantity_final)
                    : 0
                }}</a-col>
                <a-col :span="5">{{
                  footer.limit_amount_final != null
                    ? formatCurrency(footer.limit_amount_final)
                    : 0
                }}</a-col>
                <a-col :span="5">{{
                  footer.total_amount_final != null
                    ? formatCurrency(footer.total_amount_final)
                    : 0
                }}</a-col>
              </a-row>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-col>
  </a-spin>

  <a-modal
    v-model:visible="createCostEstimateModalShow"
    width="80%"
    title="Thêm dự toán chi phí"
    @ok="null"
  >
    <a-table
      :columns="createCostEstimateModalColumns"
      :data-source="createCostEstimateModalDatas"
      :pagination="false"
      size="small"
      :destroyOnClose="true"
      :closable="true"
      @cancel="closeCostEstimateModal"
    >
      <template #service="{ column, record }">
        <o-select
          style="width: 100%"
          v-model:value="record.service"
          @input="onChangeService($event, record)"
          :placeholder="'Chọn dịch vụ'"
          entity="services"
          :isDisplay="'none'"
          :textField="'name'"
          ref="service"
          valueField="id"
          :filters="[
            {
              field: 'isDefaultServiceGroup',
              operator: 'equal',
              value: false,
            },
            {
              field: 'is_active',
              operator: 'in',
              value: form?.mode == 'add' ? 1 : null,
            },
          ]"
        />
      </template>
      <template #plan_route_user="{ record }">
        <o-select
          v-model:value="record.plan_route_user"
          @input="onChangePlanRouteUser($event, record)"
          :placeholder="'Chọn nhân viên'"
          entity="plan-route-users"
          :isDisplay="'none'"
          :textField="'name'"
          ref="plan_route_user"
          valueField="id"
          :filters="[
            {
              field: 'planRouteId',
              operator: 'equal',
              value: routeSelect ? routeSelect.id : 0,
            },
            {
              field: 'planUserType',
              operator: 'equals',
              value: planUserType.staff,
            },
          ]"
        />
      </template>
      <template #limit_amount="{ text, record, column }">
        <a-input-number
          :disabled="true"
          :style="'width: 100%;'"
          :value="(record.limit_amount = limitAmount ? limitAmount : null)"
          :placeholder="formatPlaceholder(column.dataIndex)"
          :min="1"
          :max="1000000000"
          :maxlength="14"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
        />
      </template>
      <template #number="{ text, record, column }">
        <a-input-number
          :style="'width: 100%;'"
          v-model:value="record[column.dataIndex]"
          :placeholder="formatPlaceholder(column.dataIndex)"
          :min="1"
          :max="1000000000"
          :maxlength="14"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
          @blur="
            () => {
              if (column.dataIndex == 'total_amount') {
                if (record['limit_amount'] < record['total_amount']) {
                  message.error('Chi phí dự tính không được lớn hơn hạn mức');
                  record[column.dataIndex] = null;
                }
              }
            }
          "
        />
      </template>
    </a-table>
    <template #footer>
      <a-button type="default" key="back" @click="closeCostEstimateModal">{{
        $t("common.back")
      }}</a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        type="primary"
        @click="addEstimatedCost(createCostEstimateModalDatas[0])"
        >{{ $t("Thêm") }}</a-button
      >
    </template>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, UnwrapRef, reactive, onMounted, computed, watch } from "vue";

import i18n from "@/lang";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { useGetList as getPlanRoute } from "@/hooks/plan_route";
import { useGetCostEstimate, useGetPlanCostByPlanId } from "@/hooks/plan_cost";
import { useQueryClient } from "vue-query";
import { formatDate, formatCurrency, formatNumber } from "@/utility";
import { planUserType } from "@/common/enumUtility";
import { message } from "ant-design-vue";
import { useGetAmountByUser } from "@/hooks/policy_limit";
const queryClient = useQueryClient();
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
  plan?: any;
  plan_route?: any;
  user?: any;
  user_id?: any;
  service_id?: any;
  estimated_amount?: any;
  limit_amount?: any;
  is_active?: Boolean;
  children?: planCostForm[];
  level?: any;
}
const custom = ref<any>({});

const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
});

const paramsDefault = ref<any>({
  planId: props.form.id ? props.form.id : null,
  default: true,
});
const textSearchRoute = ref<any>("");
const textSearchStaff = ref<any>("");
const dataRouteItem = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataStaffItem = ref<any[]>([]);
const dataStaffRecord = ref<any[]>([]);

const dataCostEstimate = ref<any[]>([]);

const key = ref<number>(1);
const planCostEstimateData = ref<planCostForm[]>([]);
const routeLevel = ref<planCostForm[]>([]);
const serviceLevel = ref<planCostForm[]>([]);
const userLevel = ref<planCostForm[]>([]);
const mode = ref<any>("add");
const createCostEstimateModalShow = ref<boolean>(false);
const levelType = {
  routeLevel: { value: 1, actionAdd: true, colSpan: 5, totalColSpan: 5 },
  serviceLevel: { value: 2, actionAdd: false, colSpan: 1, totalColSpan: 5 },
  userLevel: { value: 3, actionAdd: false, colSpan: 1, totalColSpan: 5 },
};
const enum levelTypeEnum {
  ROUTE_LEVEL = 1,
  SERVICE_LEVEL = 2,
  USER_LEVEL = 3,
}
const enum filterType {
  FILTER_BY_ROUTE = 1,
  FILTER_BY_USER = 2,
}
const modeFilter = ref<any>(null);
const createCostEstimateModalDatas = ref<any[]>([{}]);
const routeSelect = ref<any>();
const indexRouteSelect = ref<any>();
const policyLimitParams = ref<any>({
  serviceId: null,
  userId: null,
});
const enabledgetLimitAmountByUser = computed(
  () =>
    policyLimitParams.value.serviceId != null &&
    policyLimitParams.value.userId != null
);
const limitAmount = ref<any>(null);
const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});

const enabledGetPlanCostEstimate = computed(() => {
  return planParams.value.planId !== null;
});

const createCostEstimateModalColumns = [
  {
    title: "Dịch vụ",
    dataIndex: "service",
    key: "service",
    width: 200,
    slots: { customRender: "service" },
  },
  {
    title: "Nhân viên",
    dataIndex: "plan_route_user_id",
    key: "plan_route_user_id",
    slots: { customRender: "plan_route_user" },
    width: 200,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    slots: { customRender: "number" },
    width: 150,
  },
  {
    title: "Hạn mức",
    dataIndex: "limit_amount",
    key: "limit_amount",
    slots: { customRender: "limit_amount" },
    width: 150,
  },
  {
    title: "Chi phí dự định",
    dataIndex: "total_amount",
    key: "total_amount",
    slots: { customRender: "number" },
    width: 150,
  },
];
const columnsCostEstimate = [
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
    width: 350,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    slots: { customRender: "quantity" },
    width: 200,
  },
  {
    title: "Hạn mức",
    dataIndex: "limit_amount",
    key: "limit_amount",
    slots: { customRender: "currency" },
    width: 200,
  },
  {
    title: "Chi phí dự định",
    dataIndex: "total_amount",
    key: "total_amount",
    slots: { customRender: "total_amount" },
    width: 200,
  },
  {
    title: "Hành động",
    key: "operation",
    width: 50,
    dataIndex: "operation",
    align: "center",
    slots: { customRender: "operation" },
  },
];

const onChangePlanRouteUser = ($event, record) => {
  if ($event.value) {
    let item = $event.value.options.find((i) => i.id == $event.value.value);
    record.plan_route_user = {
      ...item,
      key: $event.value.key,
      id: $event.value.key,
    };
    policyLimitParams.value.userId = item?.user_id;
  } else {
    policyLimitParams.value.userId = null;
    limitAmount.value = null;
    record.plan_route_user = {
      id: null,
      key: null,
    };
  }
};

const onChangeService = ($event, record) => {
  if ($event.value) {
    let item = $event.value.options.find((i) => i.id == $event.value.key);
    record.service = {
      ...item,
      key: $event.value.key,
      id: $event.value.key,
    };
    policyLimitParams.value.serviceId = item?.id;
  } else {
    policyLimitParams.value.serviceId = null;
    limitAmount.value = null;
    record.service = {
      key: null,
      id: null,
    };
  }
};

const formatPlaceholder = (value) => {
  let result;
  switch (value) {
    case "quantity":
      result = "Nhập số lượng";
      break;
    case "limit_amount":
      result = "Nhập hạn mức";
      break;
    case "estimated_amount":
      result = "Nhập định mức dự tính";
      break;
    default:
      result = "Vui lòng nhập";
      break;
  }
  return result;
};

const resetData = () => {
  routeLevel.value = [];
  serviceLevel.value = [];
  userLevel.value = [];
};

const addEstimatedCost = async (data) => {
  try {
    await validateEstimateCostForm(data);
    let itemForm = {
      ...data,
      plan_route_id: routeSelect.value.id,
      name_of_plan_route: routeSelect.value.name,
      plan_route_user_id: data.plan_route_user.id,
      user_id: data.plan_route_user.user_id,
      name_of_plan_route_user: data.plan_route_user.name,
      service_id: data.service.id,
      name_of_service: data.service.name,
      plan_id: props.form.id ? props.form.id : null,
      is_default_quota: false,
    };
    resetData();
    planCostEstimateData.value.push(itemForm);
    generateDataCostEstimate(planCostEstimateData.value);
    handleSelectRoute(routeSelect.value, indexRouteSelect.value);
    createCostEstimateModalShow.value = false;
    createCostEstimateModalDatas.value = [{}];
  } catch (error: any) {
    if (typeof error == "string" || `${error}`.length > 0) {
      message.error(error);
    }
  }
};

const validateEstimateCostForm = (data: any) => {
  if (typeof data.service == "undefined" || data.service?.id == null) {
    throw "Vui lòng chọn dịch vụ";
  }
  if (
    typeof data.plan_route_user == "undefined" ||
    data.plan_route_user?.id == null
  ) {
    throw "Vui lòng chọn nhân viên";
  }
  if (typeof data.quantity == "undefined" || data.quantity == null) {
    throw "Vui lòng nhập đầy đủ số lượng";
  }
  if (typeof data.limit_amount == "undefined" || data.limit_amount == null) {
    throw "Nhân viên chưa có chính sách hạn mức";
  }
  if (typeof data.total_amount == "undefined" || data.total_amount == null) {
    throw "Vui lòng nhập đầy đủ chi phí dự tính";
  }
};

const openCreateCostEstimateModal = (record: any) => {
  createCostEstimateModalShow.value = true;
};

const closeCostEstimateModal = () => {
  createCostEstimateModalShow.value = false;
};

const onSearchRoute = () => {
  dataRouteItem.value = dataRouteRecord.value.filter((item) => {
    return (
      item.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .search(
          textSearchRoute.value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        ) !== -1
    );
  });
};

const onSearchStaff = () => {
  dataStaffRecord.value = dataStaffItem.value.filter((item) => {
    return (
      item.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .search(
          textSearchStaff.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) !== -1
    );
  });
};

const handleSelectRoute = (item: any, idx: any) => {
  custom.value = {};
  custom.value[idx] = true; // change color layout
  routeSelect.value = item;
  indexRouteSelect.value = idx;
  (modeFilter.value = filterType.FILTER_BY_ROUTE),
    (dataCostEstimate.value = routeLevel.value.filter(
      (a: any) => a.plan_route_id == item.id
    ));
};
const handleSelectStaff = (item: any) => {
  (modeFilter.value = filterType.FILTER_BY_USER),
    (dataCostEstimate.value = generateDataCostEstimateByUser(
      planCostEstimateData.value,
      item
    ));
};
const activeKey = ref<number>(1);
const editableData: UnwrapRef<Record<number, DataItem>> = reactive({});
const dataEdit = ref<any>(null);

const edit = async (key: number) => {
  await filterDataItem(dataCostEstimate.value, key);
  editableData[key] = cloneDeep(dataEdit.value);
};

const saveEdit = async (key: number) => {
  await filterDataItem(dataCostEstimate.value, key);
  Object.assign(dataEdit.value, editableData[key]);
  delete editableData[key];
  userLevel.value.forEach((element) => {
    if (element.key == dataEdit.value.key) {
      element.total_amount = dataEdit.value.total_amount;
    }
  });
  reloadDataTable(dataCostEstimate.value);
};
const cancel = (key: string) => {
  delete editableData[key];
};

const reloadDataTable = (data: any[]) => {
  data.forEach((item) => {
    if (item.children) {
      if (item.children.length > 0) {
        reloadDataTable(item.children);
      }
      item.total_amount = item.children
        .map((i) => (i.total_amount ? i.total_amount : 0))
        .reduce((a: any, b: any) => a + b, 0);
    }
  });
};

const filterDataItem = (a: any[], value: any) => {
  a.forEach((item) => {
    if (item.key == value) {
      dataEdit.value = item;
      return false;
    }
    if (item.children) {
      if (item.children.length > 0) {
        filterDataItem(item.children, value);
      }
    }
  });
};
const { isLoading: routeLoading } = getPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    dataRouteRecord.value = await val.data?.content.filter(
      (item) => item.plan.id == planParams.value.planId
    );
    dataRouteItem.value = await dataRouteRecord.value;
    let planRouteUser: any = [];
    val.data?.content.forEach(async (item) => {
      planRouteUser = [...planRouteUser, ...item.plan_route_user_dto_list];
    });
    planRouteUser = planRouteUser.map((item) => {
      return {
        id: item.id,
        plan_user_id: item.plan_user.id,
        plan_route_id: item.plan_route_id,
        user_name: item.plan_user.user_name,
        name: item.plan_user.name,
        position:
          item.plan_user.type == planUserType.staff
            ? item.plan_user.position
            : item.plan_user.position_group
            ? item.plan_user.position_group.name
            : null,
        user_id: item.user_id,
      };
    });
    planRouteUser.forEach((item) => {
      if (dataStaffRecord.value.length > 0) {
        if (!dataStaffRecord.value.find((i) => i.user_id == item.user_id)) {
          dataStaffRecord.value.push(item);
        }
      } else {
        dataStaffRecord.value.push(item);
      }
    });
    dataStaffItem.value = dataStaffRecord.value;
  },
});

const { isLoading: costEstimateLoading } = useGetCostEstimate(paramsDefault, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanCostEstimate,
  retry: false,
  onSuccess: (val) => {
    planCostEstimateData.value = val.data; // val.data;
    generateDataCostEstimate(planCostEstimateData.value);
  },
});

const {} = useGetAmountByUser(policyLimitParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledgetLimitAmountByUser,
  retry: false,
  onSuccess: (val) => {
    if (typeof val.data == "number") {
      limitAmount.value = val.data;
    } else if (`${val.data}`.length == 0) {
      limitAmount.value = null;
    }
  },
});

const generateDataCostEstimate = async (data: any) => {
  await data.forEach((item: any) => {
    if (
      !routeLevel.value.filter(
        (a: any) => a.plan_route_id == item.plan_route_id
      )[0]
    ) {
      routeLevel.value.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        content: item.name_of_plan_route,
        level: levelType.routeLevel,
      });
    }

    if (
      !serviceLevel.value.filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id &&
          a.service_id == item.service_id
      )[0]
    ) {
      serviceLevel.value.push({
        key: key.value++,
        content: item.name_of_service,
        plan_route_id: item.plan_route_id,
        service_id: item.service_id,
        level: levelType.serviceLevel,
      });
    }

    item.key = key.value++;
    userLevel.value.push({
      is_default_quota: true,
      ...item,
      content: item.name_of_plan_route_user,
      is_active: true,
      isSetTotal: true,
      level: levelType.userLevel,
    });
  });
  await serviceLevel.value.forEach((item: any) => {
    item.children = userLevel.value.filter(
      (a: any) =>
        a.service_id == item.service_id && a.plan_route_id == item.plan_route_id
    );
    item.total_amount = item.children
      .map((i) => i.total_amount)
      .reduce((a: any, b: any) => a + b, 0);
  });

  routeLevel.value.forEach((item: any) => {
    item.children = serviceLevel.value.filter(
      (a: any) => a.plan_route_id == item.plan_route_id
    );
    item.total_amount = item.children
      .map((i) => i.total_amount)
      .reduce((a: any, b: any) => a + b, 0);
  });
};

const generateDataCostEstimateByUser = (data: any, user: any) => {
  let routeLevel: planCostForm[] = [];
  let result = data.filter((item: any) => item.user_id == user.user_id);
  result.forEach((item: any) => {
    if (
      !routeLevel.filter((a: any) => a.plan_route_id == item.plan_route_id)[0]
    ) {
      routeLevel.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        content: item.name_of_plan_route,
        level: levelType.routeLevel,
      });
    }
  });
  routeLevel.forEach((item: any) => {
    item.children = userLevel.value
      .filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id && a.user_id == user.user_id
      )
      .map((i: any) => {
        return {
          ...i,
          content: i.name_of_service,
          isSetTotal: true,
          level: levelType.serviceLevel,
        };
      });
  });
  return routeLevel;
};

const footer = computed(() => {
  const data = flattenData(dataCostEstimate.value);
  return {
    quantity_final:
      data.length > 0
        ? data
            .map((i: any) => (i.quantity ? i.quantity : 0))
            .reduce((a: any, b: any) => a + b, 0)
        : 0,
    limit_amount_final:
      data.length > 0
        ? data
            .map((i: any) => (i.limit_amount ? i.limit_amount : 0))
            .reduce((a: any, b: any) => a + b, 0)
        : 0,
    total_amount_final:
      data.length > 0
        ? data
            .map((i: any) => {
              if (typeof i.isSetTotal != "undefined") {
                return i.total_amount ? i.total_amount : 0;
              } else {
                return 0;
              }
            })
            .reduce((a: any, b: any) => a + b, 0)
        : 0,
  };
});

const flattenData = (data) => {
  let res: any[] = [];
  const mapData = (array, items) => {
    items.forEach((i) => {
      array.push(i);
      if (i.children?.length > 0) {
        mapData(array, i.children);
      }
    });
  };
  mapData(res, data);
  return res;
};

defineExpose({
  userLevel,
  mode,
});
onMounted(async () => {});
</script>
<style scoped lang="scss">
.item_chose:hover {
  background-color: #ed1b2f;
  color: #fff;
}
.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
  border-bottom: 1px solid rgb(223, 212, 212);
}

.tab_pane {
  height: 58vh;
  overflow: auto;
}

.editable-row-operations a {
  margin-right: 8px;
}

#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme="dark"] #components-table-demo-summary tfoot th,
[data-theme="dark"] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
</style>
