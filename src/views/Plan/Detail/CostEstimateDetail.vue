<template>
  <a-spin :spinning="planCostLoading || formLoading">
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
                          <a-row class="route_item">
                            <a-col
                              ><span>{{ "Đơn vị đi :" }}</span></a-col
                            >
                            <a-col
                              ><strong>{{
                                item.from_department
                                  ? item.from_department.name
                                  : "--"
                              }}</strong></a-col
                            >
                          </a-row>
                          <a-row class="route_item">
                            <a-col
                              ><span>{{ "Đơn vị đến :" }}</span></a-col
                            >
                            <a-col
                              ><strong>{{
                                item.is_to_internal
                                  ? item.to_department
                                    ? item.to_department.name
                                    : "--"
                                  : item.to_department_name
                              }}</strong></a-col
                            >
                          </a-row>
                          <a-row class="route_item">
                            <a-col
                              ><span>{{ "Ngày bắt đầu :" }}</span></a-col
                            >

                            <a-col
                              ><strong>{{
                                item.start_time
                                  ? formatDate(item.start_time)
                                  : "--"
                              }}</strong></a-col
                            >
                          </a-row>
                          <a-row class="route_item">
                            <a-col
                              ><span>{{ "Ngày kết thúc :" }}</span></a-col
                            >

                            <a-col
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
            expandRowByClick
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
                  <span v-if="!record.children">
                    <!-- <a @click="edit(record.key)"></a> -->
                    <!-- <a-button
                      type="dashed"
                      style="width: 100%"
                      @click="edit(record.key)"
                    >
                      <PlusCircleTwoTone />
                    </a-button> -->
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
                <a-col :span="9">{{ "Tổng" }}</a-col>
                <a-col :span="5">{{
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
  <a-row
    type="flex"
    class="footer"
    style="justify-content: flex-end"
    v-if="isPlanAdditional"
  >
    <a-spin :spinning="false">
      <a-button class="prev" @click="cancelForm" size="middle">
        <DoubleLeftOutlined />{{ "Trở lại" }}
      </a-button>
      <template v-if="isPlanSendSign">
        <a-button
          :size="'middle'"
          style="background-color: #ed1b2f; color: #fff"
          @click="openModalSignDetail"
        >
          {{ "Xem trình ký" }}</a-button
        >
      </template>
      <template v-else>
        <a-button
          :size="'middle'"
          @click="handleSendSign"
          style="background-color: #ed1b2f; color: #fff"
        >
          <!-- <template #icon>
          <DownloadOutlined />
        </template> -->
          {{ "Trình ký" }}
        </a-button>
      </template>
    </a-spin>
  </a-row>

  <a-row>
    <LoginVOffice
      :show="showLoginVOfficeModal"
      @loginSucces="openSignModal"
      @hideModal="cancelVoficeLogin"
    >
    </LoginVOffice>
  </a-row>

  <a-modal
    v-model:visible="showSendSignModal"
    :title="'Trình ký'"
    okText="Trình ký"
    cancelText="Hủy"
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        marginRight: '8px',
      },
    }"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
  >
    <AdvanceRequestSign
      :form="AdvanceRequestSignProps"
      @hideModal="closeSignModal"
      @sendSignSuccess="sendSignSuccess"
    >
    </AdvanceRequestSign>
  </a-modal>

  <div>
    <a-modal
      v-model:visible="showModalSignDetail"
      title="Chi tiết trình ký"
      :destroyOnClose="true"
      :closable="true"
      :cancel-text="$t('common.back')"
      :bodyStyle="bodyStyleModal"
      :width="'100%'"
      centered
      :wrapClassName="wrapClassName"
      target="current_tab"
      ref="modal"
      :ok-button-props="{
        style: {
          background: '#ed1b2f',
          borderColor: '#ed1b2f',
          marginRight: '8px',
        },
      }"
    >
      <SignDetailModal
        :planId="props.form.id ? props.form.id : null"
        :type="signStageType.TRINH_KY_DE_NGHI_TM"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, UnwrapRef, reactive, onMounted, computed, watch } from "vue";

import i18n from "@/lang";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import html2pdf from "html2pdf.js";
import moment from "moment/moment";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import { message } from "ant-design-vue";
import PlanRouteService from "@/services/PlanRouteService";
import { useGetList as getPlanRoute } from "@/hooks/plan_route";
import { useGetList as getPlanRouteUser } from "@/hooks/plan_route_user";
import { useGetCostEstimate, useGetPlanCostByPlanId } from "@/hooks/plan_cost";
import { formatDate, formatNumber, formatCurrency } from "@/utility";
import LoginVOffice from "@/views/VOffice/LoginVOffice.vue";
import AdvanceRequestSign from "@/views/Plan/Modal/AdvanceRequestSign.vue";
import SignDetailModal from "../Modal/SignDetailModal.vue";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import { uploadFileMutation } from "@/hooks/voffice";
import { pdfSignPosition, planUserType } from "@/common/enumUtility";
import {
  planStatus as planStatusEnum,
  planInfo as planEnum,
  signStageType,
} from "@/common/enumUtility";
import plan from "@/store/modules/plan";
import Constant from "@/constant";

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
  service_group_id?: any;
  plan?: any;
  plan_route?: any;
  user?: any;
  user_id?: any;
  service_id?: any;
  estimated_amount?: any;
  limit_amount?: any;
  is_active?: Boolean;
  children?: planCostForm[];
}
const custom = ref<any>({});

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
const planCostEstimateData = ref<planCostForm[]>([]);
const routeLevel = ref<planCostForm[]>([]);
const serviceLevel = ref<planCostForm[]>([]);
const userLevel = ref<planCostForm[]>([]);
const mode = ref<any>("add");
const modeDefault = ref<boolean>(false);
const showLoginVOfficeModal = ref<boolean>(false);
const showSendSignModal = ref<boolean>(false);
const showModalSignDetail = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const wrapClassName = ref<string>("full-form");
const bodyStyleModal = ref<{
  overflowX: string;
  height: string;
  overflowY: string;
  padding: string;
}>({
  overflowX: "hidden",
  height: "calc(100vh - 112px)",
  overflowY: "scroll",
  padding: "0",
});
const isPlanAdditional = ref<any>(props.form ? props.form.is_add : null);

const isPlanSendSign = ref<boolean>(
  props.form
    ? [planStatusEnum.wait_approve, planStatusEnum.done_approve].includes(
        props.form.status
      )
    : false
);

const uploadFile = uploadFileMutation();
const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});

const enabledGetPlanCostEstimate = computed(() => {
  return planParams.value.planId !== null && modeDefault.value;
});

const AdvanceRequestSignProps = ref<any>({
  filePdf: [],
});

const emit = defineEmits<{
  (e: "pevStep"): void;
  (e: "hideModal"): void;
}>();

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
    width: 200,
    slots: { customRender: "total_amount" },
  },
];

const sendSignSuccess = () => {
  queryClient.invalidateQueries("plan");
  emit("hideModal");
};

const openModalSignDetail = () => {
  showModalSignDetail.value = true;
};

const cancelVoficeLogin = () => {
  showLoginVOfficeModal.value = false;
};

const cancelForm = () => {
  emit("hideModal");
};

const closeSignModal = () => {
  showSendSignModal.value = false;
};

const onSearchRoute = async () => {
  dataRouteItem.value = await dataRouteRecord.value.filter((item) => {
    return (
      item.name.toLowerCase().search(textSearchRoute.value.toLowerCase()) !== -1
    );
  });
};

const onSearchStaff = async () => {
  dataStaffRecord.value = await dataStaffItem.value.filter((item) => {
    return (
      item.name.toLowerCase().search(textSeachStaff.value.toLowerCase()) !== -1
    );
  });
};

const handleSelectRoute = async (item: any, idx: any) => {
  custom.value = {};
  custom.value[idx] = true; // change color layout
  dataCostEstimate.value = routeLevel.value.filter(
    (a: any) => a.plan_route_id == item.id
  );
};
const handleSelectStaff = async (item: any) => {
  dataCostEstimate.value = await generateDataCostEstimateByUser(
    planCostEstimateData.value,
    item
  );
};
const activeKey = ref<number>(1);
const editableData: UnwrapRef<Record<number, DataItem>> = reactive({});
const dataEdit = ref<any>(null);

const edit = async (key: number) => {
  await fillterDataItem(dataCostEstimate.value, key);
  editableData[key] = cloneDeep(dataEdit.value);
};

const saveEdit = async (key: number) => {
  await fillterDataItem(dataCostEstimate.value, key);
  Object.assign(dataEdit.value, editableData[key]);
  //
  delete editableData[key];
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

const { isLoading: planCostLoading } = useGetPlanCostByPlanId(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    if (Array.isArray(val.data) && val.data.length > 0) {
      planCostEstimateData.value = val.data; // val.data;
      generateDataCostEstimate(planCostEstimateData.value);
    } else {
      message.error("Chưa tạo dự toán chi phí kế hoạch");
    }
  },
});

const generateDataCostEstimate = async (data: any) => {
  // let key = 1;
  data.forEach((item: any) => {
    if (
      !routeLevel.value.filter(
        (a: any) => a.plan_route_id == item.plan_route_id
      )[0]
    ) {
      routeLevel.value.push({
        key: key.value++,
        plan_route_id: item.plan_route_id,
        content: item.name_of_plan_route,
        level: Constant.levelCostContants.CAP_LO_TRINH,
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
        level: Constant.levelCostContants.CAP_DICH_VU,
      });
    }

    item.key = key.value++;
    userLevel.value.push({
      ...item,
      content: item.name_of_plan_route_user,
      is_active: true,
      isSetTotal: true,
      level: Constant.levelCostContants.CAP_NGUOI_DUNG,
    });
  });
  serviceLevel.value.forEach((item: any) => {
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
        };
      });
  });
  return routeLevel;
};

const handleSendSign = () => {
  showLoginVOfficeModal.value = true;
};
const openSignModal = async (data: any) => {
  showLoginVOfficeModal.value = false;
  formLoading.value = true;
  AdvanceRequestSignProps.value = { filePdf: [] };
  await Object.assign(AdvanceRequestSignProps.value, data, {
    plan: props.form,
  });
  await loadFilePdfData();
  setTimeout(() => {
    showSendSignModal.value = true;
    formLoading.value = false;
  }, 5000);
};

watch(
  () => dataRouteItem.value,
  (val: any) => {
    if (val.length > 0) {
      handleSelectRoute(val[0], 0);
    }
  },
  { immediate: true }
);

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

const uploadFilePdf = async (
  camelCasePdf: string,
  data: any,
  // table: any,
  position?: any,
  mode?: any
) => {
  const { opt, content } = await downloadFilePdf(camelCasePdf, data, mode);
  html2pdf()
    .set(opt)
    .from(content)
    .toPdf()
    .get("pdf")
    .then(function (pdfObj) {
      const perBlob = pdfObj.output("blob");
      var formData = new FormData();
      formData.append("file", perBlob, opt.filename);
      uploadFile
        .mutateAsync({ data: formData, position: position })
        .then((response) => {
          // table.value.push(response.data);
          AdvanceRequestSignProps.value.filePdf.push(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
};

const loadFilePdfData = async () => {
  const planCostFlattenDatas = await flattenData(routeLevel.value);
  await uploadFilePdf(
    "planAppendix",
    {
      table: routeLevel.value,
      total_amount_final:
        Array.isArray(planCostFlattenDatas) && planCostFlattenDatas.length > 0
          ? planCostFlattenDatas
              .map((i: any) => (i.total_amount ? i.total_amount : 0))
              .reduce((a: any, b: any) => a + b, 0)
          : 0,
    },
    pdfSignPosition.PHU_LUC_CHI_PHI
  );

  await uploadFilePdf(
    "planProcess",
    {
      table: props.form.plan_route_user
        ? props.form.plan_route_user.map((item, index) => {
            return {
              STT: index + 1,
              ...item,
              department_user: item?.plan_user?.department?.name,
            };
          })
        : [],
      name_of_plan: props.form.name,
      day_now: `${formatDate(moment())}`.split("/")[0],
      month_now: `${formatDate(moment())}`.split("/")[1],
      year_now: `${formatDate(moment())}`.split("/")[2],
      start_time: props.form.start_time,
      end_time: props.form.end_time,
      description: props.form.description,
      address_business_list: props.form?.plan_route
        ? props.form.plan_route.map((planRoute) => {
            return {
              department: planRoute.is_to_internal
                ? planRoute?.to_department
                  ? planRoute?.to_department?.name
                  : ""
                : planRoute.to_department_name,
              address: planRoute?.to_department
                ? planRoute?.to_department?.address
                : "",
            };
          })
        : [],
    },
    pdfSignPosition.KE_HOACH_CONG_TAC
  );
};

defineExpose({
  userLevel,
  mode,
});
// onMounted(async () => {});
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

.footer {
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: white;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
  position: absolute;
  bottom: 0px;
  z-index: 1;

  .ant-btn {
    margin-left: 15px;
  }

  .ant-btn-text {
    border: none;
    width: fit-content;
  }

  .ant-btn-text:hover,
  .ant-btn-text:active,
  .ant-btn-text:focus {
    color: var(--mainColor);
  }

  .prev:hover,
  .prev:active,
  .prev:focus {
    border: 1px solid var(--mainColor);
    color: var(--mainColor);
  }

  .ant-btn-primary:hover,
  .ant-btn-primary:active,
  .ant-btn-primary:focus {
    border-color: var(--mainColor);
    // color: var(--mainColor);
    background: var(--mainColor);
  }
}
.route_item {
  display: flex;
  justify-content: space-between;
}
</style>
