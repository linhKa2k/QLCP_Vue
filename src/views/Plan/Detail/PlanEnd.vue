<template>
  <a-spin
    :spinning="
      getListInvoiceLoading ||
      getPLanReportLoading ||
      getPlanCostQuotaLoading ||
      getplanRequireLoading ||
      paymentRequestLoading
    "
  >
    <a-col :span="24">
      <a-row>
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" :header="'Thông tin chung'">
              <a-form
                :model="form"
                :layout="layout"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
                labelAlign="left"
              >
                <a-col :span="24">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="Mã kế hoạch" name="code">{{
                        planInfo.plan ? planInfo.plan.code : "--"
                      }}</a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Trạng thái" name="status"
                        >{{
                          planInfo.plan
                            ? renderPlanStatus(planInfo.plan.status)
                            : "--"
                        }}
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Tên kế hoạch" name="name"
                        >{{ planInfo.plan ? planInfo.plan.name : "--" }}
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Lý do" name="code"
                        >{{ form.user_request ? form.user_request : "--" }}
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Ngày bắt đầu" name="code"
                        >{{
                          planInfo.plan
                            ? formatDate(planInfo.plan.start_time)
                            : "--"
                        }}
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Ngày kết thúc" name="code"
                        >{{
                          planInfo.plan
                            ? formatDate(planInfo.plan.end_time)
                            : "--"
                        }}
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-form>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="2" :header="'Báo cáo kết thúc công tác'">
              <a-form
                ref="ruleForm"
                :rules="reportRules"
                :model="form"
                :layout="layout"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
                labelAlign="left"
              >
                <a-col :span="24">
                  <a-form-item label="Nội dung công việc đã làm" name="content">
                    <template v-if="isSendSign">
                      <span>{{ form.content ? form.content : "--" }}</span>
                    </template>
                    <template v-else>
                      <a-textarea
                        v-model:value="form.content"
                        :placeholder="'Nội dung công việc đã làm'"
                        :maxlength="2000"
                        style="width: 100%"
                      />
                    </template>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="Kết quả thực hiện" name="result">
                    <template v-if="isSendSign">
                      <span>{{ form.result ? form.result : "--" }}</span>
                    </template>
                    <template v-else>
                      <a-textarea
                        v-model:value="form.result"
                        :placeholder="'Kết quả thực hiện'"
                        :maxlength="2000"
                      />
                    </template>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="Đề xuất" name="propose">
                    <template v-if="isSendSign">
                      <span>{{ form.result ? form.result : "--" }}</span>
                    </template>
                    <template v-else>
                      <a-textarea
                        v-model:value="form.propose"
                        :placeholder="'Đề xuất'"
                        :maxlength="2000"
                      />
                    </template>
                  </a-form-item>
                </a-col>
              </a-form>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="3" :header="'Chi phí theo định mức'">
              <a-table
                :key="dataTableCostAmount.length"
                :columns="columnCostByAmount"
                :dataSource="dataTableCostAmount"
                defaultExpandAllRows
                expandRowByClick
                :pagination="false"
                bordered
              >
                <template #footer>
                  <a-row :gutter="16">
                    <a-col :span="4"> {{ "Tổng" }} </a-col>
                    <a-col :span="17"></a-col>
                    <a-col :span="2" style="margin-left: -20px">
                      {{ formatCurrency(totalPlanCostQuota) }}
                    </a-col>
                  </a-row>
                </template>
                <template #currency="{ text }">
                  <span>{{ text ? formatCurrency(text) : null }}</span>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="4" :header="'Chi phí có hóa đơn'">
              <a-table
                :columns="invoiceCostColumns"
                :dataSource="invoiceCostData"
                bordered
              >
                <template #payment_type="{ text }">
                  <span>{{
                    text ? renderInvoicePaymentType(text) : "--"
                  }}</span>
                </template>
                <template #invoice_items="{ text }">
                  <span>{{ text[0] ? text[0].name : "--" }}</span>
                </template>
                <template #STT="{ index }">
                  {{ index + 1 }}
                </template>
                <template #date="{ text }">
                  <span>{{ text ? formatDate(text) : "--" }}</span>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="5" :header="'Tổng chi phí'">
              <a-col :span="24">
                <!-- <a-row :gutter="16"> -->
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="Tổng chi phí định mức" name="note">
                      {{
                        totalPlanCostQuota
                          ? `${formatCurrency(totalPlanCostQuota)} VNĐ`
                          : `0 VNĐ`
                      }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-item label="Tổng chi phí hóa đơn" name="note">
                      {{
                        totalCostInvoice
                          ? `${formatCurrency(totalCostInvoice)} VNĐ`
                          : `0 VNĐ`
                      }}
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-col :span="24">
                  <a-form-item label="Số tiền đã tạm ứng" name="note">
                    {{
                      costPlanRequired
                        ? `${formatCurrency(costPlanRequired)} VNĐ`
                        : `0 VNĐ`
                    }}
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <template v-if="totalPayFinal < 0">
                    <a-form-item label="Số tiền phải thu" name="note">
                      {{
                        totalPayFinal < 0
                          ? `${formatCurrency(Math.abs(totalPayFinal))} VNĐ`
                          : `0 VNĐ`
                      }}
                    </a-form-item>
                  </template>
                  <template v-else-if="totalPayFinal > 0">
                    <a-form-item label="Số tiền phải chi" name="note">
                      {{
                        totalPayFinal > 0
                          ? `${formatCurrency(totalPayFinal)} VNĐ`
                          : `0 VNĐ`
                      }}
                    </a-form-item>
                  </template>
                  <template v-else>
                    <a-form-item label="Số tiền phải thu/ chi" name="note">
                      {{ `0 VNĐ` }}
                    </a-form-item>
                  </template>
                </a-col>
                <!-- <a-col :span="24">
                
              </a-col> -->

                <!-- </a-row> -->
              </a-col>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>
    </a-col>
    <a-row>
      <a-modal
        v-model:visible="showPaymentRequestModal"
        width="100%"
        :title="'Thông tin thanh toán'"
        @ok="handleSavePaymentRequest"
        @cancel="hidePaymentRequest"
        okText="Lưu"
        cancelText="Hủy"
        :ok-button-props="{
          style: {
            background: '#ed1b2f',
            borderColor: '#ed1b2f',
            marginRight: '8px',
          },
          disabled: isSendSign,
          loading: btnSavePaymentLoading,
        }"
      >
        <a-form
          ref="paymentRequestForm"
          :rules="paymentRequestRules"
          :model="formPaymentRequest"
          :layout="layout"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
        >
          <a-col :span="24">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item
                  label="Thời hạn thanh toán"
                  name="expire_date"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 8 }"
                >
                  <a-date-picker
                    v-model:value="formPaymentRequest.expire_date"
                    format="DD/MM/YYYY"
                    :placeholder="'Thời hạn thanh toán'"
                    class="width_item"
                    :allowClear="false"
                    @change="checkDateRange"
                    :disabled="isSendSign"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24" class="title">
                <span>{{ t("Thông tin người nhận thanh toán") }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item
                  label="Chọn nhân viên"
                  name="user_payment_request"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 8 }"
                >
                  <o-select
                    :disabled="isSendSign"
                    v-model:value="formPaymentRequest.user_payment_request"
                    @input="onChangePaymentRequestUser"
                    :placeholder="'Tìm kiếm theo tên'"
                    entity="plan-users"
                    :isDisplay="'none'"
                    :textField="'name'"
                    ref="user_payment_request"
                    valueField="id"
                    style="width: 80%"
                    :filters="[
                      {
                        field: 'plan_id',
                        operator: 'equal',
                        value: props.form.id ? props.form.id : null,
                      },
                      {
                        field: 'type',
                        operator: 'equals',
                        value: planUserType.staff,
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24" :offset="4">
                <a-button
                  @click="choseMemberPaymentRequest"
                  style="background-color: #ed1b2f; color: white"
                  v-if="!isSendSign"
                >
                  {{ "Chọn" }}
                </a-button>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-table
                  :columns="paymentRequestColumns"
                  :dataSource="paymentRequestData"
                  :pagination="false"
                >
                  <template #currency="{ text }">
                    <span>{{ text != null ? formatCurrency(text) : 0 }}</span>
                  </template>
                  <template #date="{ text }">
                    <span>{{ text ? formatDate(text) : "--" }}</span>
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
        </a-form>
      </a-modal>
    </a-row>
  </a-spin>

  <a-modal
    v-model:visible="showPlanEndSignModal"
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
    <PlanEndSignForm
      :form="
        Object.assign(signModalProps, {
          cost_amount: dataTableCostAmount,
          login: loginVOfficeData,
          plan: props.form.plan,
          requestConfirmation: {
            content: form.content,
            result: form.result,
            propose: form.propose,
          },
        })
      "
      @hideModal="closePlanEndSignModal"
      @sendSignSuccess="cancelForm"
      :uploadLoading="endSignLoading"
    />
  </a-modal>

  <a-modal
    v-model:visible="showPlanEndSignDetailModal"
    :title="'Xen chi tiết trình ký'"
    okText="OK"
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
    <PlanEndSignFormDetail
      @hideModal="closePlanEndSignDetailModal"
      :planId="props.form.id"
      :type="planSignTypeEnum.final_stage"
    />
  </a-modal>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button v-if="true" class="prev" @click="cancelForm" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
    </a-button>
    <a-button
      v-if="!isSendSign"
      @click="saveForm"
      size="middle"
      style="background-color: #ed1b2f; color: white"
      :loading="btnLoading"
    >
      <SaveOutlined />{{ t("common.save") }}
    </a-button>
    <a-button
      @click="handleCreatePayRequest"
      style="background-color: #ed1b2f; color: white"
      v-if="!(totalPayFinal == 0)"
    >
      {{
        totalPayFinal > 0
          ? `${paymentRequestDetailData.length > 0 ? "Xem" : "Tạo"} đề nghị chi`
          : `${paymentRequestDetailData.length > 0 ? "Xem" : "Tạo"} hoàn ứng`
      }}</a-button
    >
    <template v-if="isSendSign">
      <a-button
        size="middle"
        style="background-color: #ed1b2f; color: white"
        @click="openSendSignDetailModal"
        >{{ "Xem trình kí" }}
        <DoubleRightOutlined />
      </a-button>
    </template>
    <template v-else>
      <a-button
        v-if="!isSendSign"
        @click="handleSaveAndSign"
        size="middle"
        style="background-color: #ed1b2f; color: white"
        >{{ "Trình kí" }}
        <DoubleRightOutlined />
      </a-button>
    </template>
  </a-row>

  <a-row>
    <LoginVOffice
      @loginSucces="openSignModal"
      @hideModal="cancelVoficeLogin"
      :show="showLoginVOfficeModal"
    >
    </LoginVOffice>
  </a-row>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQueryClient } from "vue-query";
import i18n from "@/lang";
import Constant from "@/constant";
import { useGetList as useGetListInvoice } from "@/hooks/invoice";
import { useSaveMutation as PlanReportMutation } from "@/hooks/plan_report";
import Constants from "@/constant";
import LoginVOffice from "@/views/VOffice/LoginVOffice.vue";
import PlanEndSignForm from "@/views/Plan/Modal/PlanEndSignForm.vue";
import PlanEndSignFormDetail from "@/views/Plan/Modal/PlanEndSignFormDetail.vue";
import { useGetList as getListPlanRequire } from "@/hooks/plan_required";
import { useGetList as getPlanCostQuota } from "@/hooks/plan_cost_quota";
import { useGetList as getPLanReport } from "@/hooks/plan_report";
import {
  formatDate,
  formatCurrency,
  DocTienBangChu,
  formatNumber,
} from "@/utility";
import { useStore } from "vuex";
import {
  useSaveMutation as paymentRequestMutation,
  useGetList as getListPaymentRequest,
  useDeleteItemMutation as deletePaymentRequest,
} from "@/hooks/payment_request";
import { message } from "ant-design-vue";
import moment from "moment/moment";
import {
  paymentRequestType,
  planStatus as planEnum,
} from "@/common/enumUtility";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import html2pdf from "html2pdf.js";
import { uploadFileMutation } from "@/hooks/voffice";
import {
  pdfSignPosition,
  planUserType,
  planSignType as planSignTypeEnum,
} from "@/common/enumUtility";
import { getCostQuotaByPlanId } from "@/hooks/plan_cost_quota";
import _ from "lodash";

const { t } = i18n.global;
const queryClient = useQueryClient();

interface Props {
  form: any;
  width: string;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  fields: {},
});
const ruleForm = ref<any>();
const layout = ref<string>("horizontal");
const form = ref<any>(props.form);
const signModalProps = ref<any>({
  ...props.form,
  fileSign: [],
  fileAppendix: [],
});
const formPaymentRequest = ref<any>({});
const fields = ref<any>(props.fields);
const dataTableCostAmount = ref<any[]>([]);
const invoiceCostData = ref<any[]>([]);
const activeKey = ref(["1", "2", "3", "4", "5"]);
const showLoginVOfficeModal = ref<boolean>(false);
const showPaymentRequestModal = ref<boolean>(false);
const showPlanEndSignModal = ref<boolean>(false);
const showPlanEndSignDetailModal = ref<boolean>(false);
const endSignLoading = ref<boolean>(false);
const invoicePlanData = ref<any>([]);
const paymentRequestData = ref<any>([]);
const paymentRequestDetailData = ref<any>([]);

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
const emit = defineEmits<{
  (e: "pevStep"): void;
  (e: "hideModal"): void;
}>();

const key = ref<number>(1);
const routeLevel = ref<any[]>([]);
const serviceGroupLevel = ref<any[]>([]);
const userLevel = ref<any[]>([]);
const planId = ref<any>(props.form.id ? props.form.id : null);
const params = ref<any>({
  planId: props.form?.id ? props.form.id : null,
});

const planRequiredData = ref<number>(0);
const useSavePlanReport = PlanReportMutation();
const useSavePaymentRequest = paymentRequestMutation();
const uploadFile = uploadFileMutation();
const planCostQuotaDatas = ref<any[]>([]);
const paymentRequestForm = ref();
const btnLoading = ref<boolean>(false);
const btnSavePaymentLoading = ref<boolean>(false);
const paramsPaymentRequest = ref<any>({
  planId: props.form?.id ? props.form.id : null,
  type: null,
});
const enabledGetListInvoice = computed(() => {
  return planId.value != null;
});
const enabledGetPaymentRequest = computed(() => {
  return paramsPaymentRequest.value.planId != null;
});
const enabledGetListPlanRequire = computed(() => {
  return planId.value != null;
});
const enabledGetFormDefault = computed(() => {
  return planId.value != null;
});

const enabledGetCostQuota = computed(() => {
  return planId.value != null;
});

const planInfo = computed(() => props.form);
const totalCostInvoice = computed(() =>
  invoiceCostData.value.length > 0
    ? invoiceCostData.value
        .map((i) => i.total_final_amount)
        .reduce((a, b) => a + b, 0)
    : 0
);
const costPlanRequired = computed(() => planRequiredData.value);
const totalPlanCostQuota = computed(() =>
  planCostQuotaDatas.value
    .map((item) => (item.total_amount ? item.total_amount : 0))
    .reduce((a, b) => a + b, 0)
);
const totalPayFinal = computed(
  () =>
    totalPlanCostQuota.value + totalCostInvoice.value - costPlanRequired.value
);
const mode = ref<string>("add");
const store = useStore();
const paymentRequestTypeFinal = computed(() => {
  if (totalPayFinal.value == 0) {
    return null;
  } else if (totalPayFinal.value > 0) {
    return paymentRequestType.DE_NGHI_CHI;
  } else {
    return paymentRequestType.DE_NGHI_THU;
  }
});
const isSendSign = ref<any>(
  props.form
    ? [planEnum.waiting_approve_end_work, planEnum.approve_end_work].includes(
        props.form.status
      )
    : false
);
const loginVOfficeData = ref<any>({});
const paymentRequestRules = ref<any>({
  expire_date: {
    required: true,
    message: "Vui lòng chọn ngày thanh toán",
  },
  user_payment_request: [
    {
      required: true,
      message: "Vui lòng nhập thông tin người nhận",
      trigger: "change",
      type: "object",
    },
  ],
});

const reportRules = ref<any>({
  content: {
    required: true,
    message: "Vui lòng nhập nội dung công việc đã làm",
  },
  result: [
    {
      required: true,
      message: "Vui lòng nhập kết quả công tác",
    },
  ],
  propose: [
    {
      required: true,
      message: "Vui lòng nhập Đề xuất",
    },
  ],
});

const columnCostByAmount = [
  {
    title: "Dịch vụ",
    dataIndex: "content",
    // width: "15%",
  },
  {
    title: "Số ngày",
    dataIndex: "total_day",
    // width: "15%",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    // width: "15%",
  },
  {
    title: "Định mức",
    dataIndex: "total_amount",
    // width: "15%",
    slots: { customRender: "currency" },
  },
];

const invoiceCostColumns = [
  {
    title: "STT",
    dataIndex: "STT",
    // width: "15%",
    slots: { customRender: "STT" },
  },
  {
    title: "Mẫu số",
    dataIndex: "type",
    // width: "15%",
  },
  {
    title: "Ký hiệu",
    dataIndex: "symbol",
    // width: "15%",
  },
  {
    title: "Số hóa đơn",
    dataIndex: "code",
    // width: "15%",
  },
  {
    title: "Ngày HĐ",
    dataIndex: "invoice_date",
    // width: "15%",
    slots: { customRender: "date" },
  },
  {
    title: "MST",
    dataIndex: "tax_code",
    // width: "15%",
  },
  {
    title: "NCC",
    dataIndex: "provider",
    // width: "15%",
  },
  {
    title: "Loại thanh toán",
    dataIndex: "payment_type",
    // width: "15%",
    slots: { customRender: "payment_type" },
  },
  {
    title: "Tên hàng hóa dịch vụ",
    dataIndex: "invoice_items",
    slots: { customRender: "invoice_items" },

    // width: "15%",
  },
];

const paymentRequestColumns = [
  {
    title: "Mã nhân viên",
    dataIndex: "code",
    width: "150px",
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "250px",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "150px",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "150px",
  },
  {
    title: "Người thụ hưởng",
    dataIndex: "name",
    width: "250px",
  },
  {
    title: "Số TK",
    dataIndex: "account_number",
    width: "150px",
  },
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    width: "250px",
  },
  {
    title: "Tổng số tiền",
    dataIndex: "total_amount",
    width: "150px",
    slots: { customRender: "currency" },
  },
];

const renderPlanStatus = (type) => {
  const item = Constant.planStatus.find((i) => i.value == type);
  return item?.label;
};

const renderInvoicePaymentType = (type) => {
  const item = Constant.invoicePaymentType.find((i) => i.value == type);
  return item?.label;
};
const openSendSignDetailModal = () => {
  showPlanEndSignDetailModal.value = true;
};
const cancelVoficeLogin = () => {
  showLoginVOfficeModal.value = false;
};

const cancelForm = () => {
  emit("hideModal");
};
const closePlanEndSignModal = () => {
  showPlanEndSignModal.value = false;
};
const closePlanEndSignDetailModal = () => {
  showPlanEndSignDetailModal.value = false;
};
const saveForm = async (isSign?: any) => {
  ruleForm.value
    .validate()
    .then((data) => {
      btnLoading.value = true;
      useSavePlanReport
        .mutateAsync({
          plan: planInfo.value.plan,
          content: form.value.content,
          result: form.value.result,
          propose: form.value.propose,
          mode: mode.value,
          id: form.value.planReportId ? form.value.planReportId : null,
        })
        .then((response: any) => {
          mode.value = "edit";
          form.value.id = response.id;
          btnLoading.value = false;
          message.success("Lưu báo cáo kết thúc công tác thành công");
          emit("hideModal");
        })
        .catch((error) => {
          message.error(error.message);
          btnLoading.value = false;
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

const saveFormBeforeSendSign = async () => {
  // formData.value = await { plan: planInfo.value.plan };
  ruleForm.value
    .validate()
    .then((data) => {
      useSavePlanReport
        .mutateAsync({
          plan: planInfo.value.plan,
          content: form.value.content,
          result: form.value.result,
          propose: form.value.propose,
          mode: mode.value,
          id: form.value.planReportId ? form.value.planReportId : null,
        })
        .then((response: any) => {
          mode.value = "edit";
          form.value.id = response.id;
          showLoginVOfficeModal.value = true;
        })
        .catch((error) => {
          message.error(error.message);
          btnLoading.value = false;
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleSaveAndSign = async () => {
  if (totalPayFinal.value != 0) {
    if (paymentRequestDetailData.value.length == 0) {
      message.error(
        `Vui lòng tạo  ${
          totalPayFinal.value > 0 ? "Đề nghị chi" : "Hoàn ứng"
        } chi trước khi trình ký`
      );
      return;
    }
  }
  saveFormBeforeSendSign();
};

const openSignModal = async (data: any) => {
  loginVOfficeData.value = data;
  showLoginVOfficeModal.value = false;
  showPlanEndSignModal.value = true;
  await loadFilePdfData();
  // endSignLoading.value = false;
};
const handleCreatePayRequest = () => {
  showPaymentRequestModal.value = true;
};

const { isLoading: getListInvoiceLoading } = useGetListInvoice(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetListInvoice,
  staleTime: 0,
  retry: false,
  onSuccess: async (val) => {
    invoicePlanData.value = val.data.content;
  },
});

const { isLoading: getPLanReportLoading } = getPLanReport(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetFormDefault,
  staleTime: 0,
  retry: false,
  onSuccess: async (val) => {
    let data = val.data.content[0];
    if (val.data.content[0]) {
      (form.value.content = data.content),
        (form.value.result = data.result),
        (form.value.propose = data.propose);
      form.value.planReportId = data.id;
      mode.value = "edit";
    }
  },
});

const { isLoading: getPlanCostQuotaLoading } = getCostQuotaByPlanId(planId, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetCostQuota,
  staleTime: 0,
  retry: false,
  onSuccess: (val) => {
    planCostQuotaDatas.value = val.data;
    generatePlanCostQuota(val.data);
    dataTableCostAmount.value = routeLevel.value;
  },
});

const { loading: getplanRequireLoading } = getListPlanRequire(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetListPlanRequire,
  staleTime: 0,
  retry: false,
  onSuccess: async (val) => {
    planRequiredData.value = val?.data?.content[0]?.plan_required_user?.amount;
  },
});

const { isLoading: paymentRequestLoading } = getListPaymentRequest(
  paramsPaymentRequest,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled: enabledGetPaymentRequest,
    staleTime: 0,
    retry: false,
    onSuccess: async (val) => {
      const data = val.data.content;
      if (data.length > 0 && data[0]?.type == paymentRequestTypeFinal.value) {
        paymentRequestDetailData.value = data;
        formPaymentRequest.value.expire_date = data[0].expire_date
          ? moment.utc(data[0].expire_date, "YYYY-MM-DD")
          : moment();
        formPaymentRequest.value.user_payment_request = {
          value: data[0].plan_user.id,
          label: data[0].plan_user.name,
          id: data[0].plan_user.id,
          key: data[0].plan_user.id,
        };
        paymentRequestData.value = [
          {
            id: data[0]?.id,
            code: data[0]?.plan_user.user?.username,
            name: data[0]?.plan_user.name,
            phone_number: data[0]?.plan_user.phone_number,
            email: data[0]?.plan_user.email,
            account_number: data[0]?.plan_user.account_number,
            bank: data[0]?.plan_user.bank,
            total_amount: data[0]?.total_amount,
            plan_id: data[0]?.plan_id,
            plan_user: formPaymentRequest.value.user_payment_request,
            is_active: data[0]?.is_active,
            user: data[0]?.user,
            type: data[0]?.type,
            mode: "edit",
          },
        ];
      } else {
        paymentRequestDetailData.value = [];
        paymentRequestData.value = [];
        formPaymentRequest.value.user_payment_request = { id: null, key: null };
        formPaymentRequest.value.expire_date = null;
      }
    },
  }
);
const generatePlanCostQuota = (data: any) => {
  // let key = 1;
  data.forEach(async (item: any) => {
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
      !serviceGroupLevel.value.filter(
        (a: any) =>
          a.plan_route_id == item.plan_route_id &&
          a.service_id == item.service_id
      )[0]
    ) {
      serviceGroupLevel.value.push({
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
      level: Constant.levelCostContants.CAP_NGUOI_DUNG,
    });
  });

  routeLevel.value.forEach((item: any) => {
    item.children = serviceGroupLevel.value.filter(
      (a: any) => a.plan_route_id == item.plan_route_id
    );
  });
  serviceGroupLevel.value.forEach((item: any) => {
    item.children = userLevel.value
      .filter(
        (a: any) =>
          a.service_id == item.service_id &&
          a.plan_route_id == item.plan_route_id
      )
      .map((i, index) => {
        return {
          ...i,
          STT: index + 1,
        };
      });
  });
};

const checkDateRange = (event: any) => {
  if (formPaymentRequest.value.expire_date) {
    let compare = moment(formPaymentRequest.value.expire_date).isSameOrAfter(
      moment(),
      "day"
    );
    if (!compare) {
      message.error("Thời hạn thanh toán phải từ hôm nay");
      formPaymentRequest.value.expire_date = null;
    }
  }
};

const choseMemberPaymentRequest = () => {
  if (formPaymentRequest.value.user_payment_request) {
    let response = formPaymentRequest.value.user_payment_request;
    if (response.account_number == null) {
      message.error("Nhân viên nhân thanh toán chưa cập nhật số tài khoản");
      paymentRequestData.value = [];
      return;
    }
    paymentRequestData.value = [
      {
        ...response,
        code: response.user ? response.user.user_name : null,
        name: response.name,
        email: response.email,
        phone_number: response.phone_number,
        bank: response.bank,
        account_number: response.account_number,
        total_amount: totalPayFinal ? totalPayFinal.value : null,
        type:
          totalPayFinal.value > 0
            ? paymentRequestType.DE_NGHI_CHI
            : paymentRequestType.DE_NGHI_THU,
      },
    ];
    // }
  }
};

const onChangePaymentRequestUser = async ($event: any) => {
  if ($event.value) {
    let res = await $event.value.options.find(
      (item) => item.id == $event.value.key
    );
    formPaymentRequest.value.user_payment_request = {
      ...res,
      id: $event.value.key,
      key: $event.value.key,
    };
  } else {
    formPaymentRequest.value.user_payment_request = {
      id: null,
      key: null,
    };
  }
};

const hidePaymentRequest = () => {
  showPaymentRequestModal.value = false;
};

const handleSavePaymentRequest = () => {
  btnSavePaymentLoading.value = true;
  paymentRequestForm.value
    .validate()
    .then((data) => {
      if (paymentRequestData.value.length <= 0) {
        message.error("Vui lòng thêm đầy đủ thông tin người nhận thanh toán");
        return;
      }
      useSavePaymentRequest
        .mutateAsync({
          ...paymentRequestData.value[0],
          plan_user: paymentRequestData.value[0],
          expire_date: data.expire_date,
          user: data.user_payment_request?.user,
          plan_id: form.value.id,
          is_active: paymentRequestData.value[0].is_active
            ? paymentRequestData.value[0].is_active
            : 1,
          ...paymentRequestData.value[0],
          total_amount: totalPayFinal.value,
        })
        .then((response) => {
          // if (listPaymentRequest.value.length > 0) {
          //   listPaymentRequest.value.map((p: any) => {
          //     useDeletePaymentRequest
          //       .mutateAsync(p.id)
          //       .then((response) => {
          //         if (response.status == 204) {
          //         } else {
          //           message.error(response.statusText);
          //         }
          //         hidePaymentRequest();
          //       })
          //       .catch((error) => {
          //         var data = error.response.data;
          //         var errorMessage = data.title || data.message;
          //         message.error(errorMessage);
          //         hidePaymentRequest();
          //       });
          //   });
          // }
          message.success("Lưu thành công");
          btnSavePaymentLoading.value = false;
          hidePaymentRequest();
        })
        .catch((error) => {
          console.log(error);
          btnSavePaymentLoading.value = false;
        });
    })
    .catch((error) => {
      console.log(error);
      btnSavePaymentLoading.value = false;
    });
};

const loadFilePdfData = async () => {
  (signModalProps.value.fileAppendix = []),
    (signModalProps.value.fileSign = []),
    uploadFilePdf(
      "costAppendix",
      {
        total_cost_amount_final: totalPlanCostQuota.value,
        cost_body: routeLevel.value, // flattenData(routeLevel.value),
        invoice_list_body: invoicePlanData.value,
      },
      signModalProps.value.fileAppendix,
      pdfSignPosition.PHU_LUC_CHI_PHI_KET_THUC_CONG_TAC,
      {}
    );
  if (paymentRequestTypeFinal.value != null) {
    // nếu có đề nghị thu/chi
    //upload file đề nghị thu/chi
    // uploadFilePdf(
    //   "advancePayment",
    //   {
    //     day_now: `${formatDate(moment())}`.split("/")[0],
    //     month_now: `${formatDate(moment())}`.split("/")[1],
    //     year_now: `${formatDate(moment())}`.split("/")[2],
    //     title:
    //       paymentRequestTypeFinal.value == paymentRequestType.DE_NGHI_CHI
    //         ? "Đề nghị chi tiền bổ sung chi phí còn thiếu"
    //         : "Giấy thanh toán thu tiền hoàn ứng",
    //     code: "",
    //     full_name:
    //       paymentRequestDetailData.value.length > 0
    //         ? paymentRequestDetailData.value[0]?.plan_user.name
    //         : "--",
    //     department_business:
    //       paymentRequestDetailData.value.length > 0
    //         ? paymentRequestDetailData.value[0]?.plan_user?.department?.name
    //         : "--",
    //     content_business:
    //       paymentRequestTypeFinal.value == paymentRequestType.DE_NGHI_CHI
    //         ? `Thanh toán chi phí ${props.form.name}`
    //         : `Thanh toán hoàn chi phí ${props.form.name}`,
    //     //data table
    //     advance_amount: costPlanRequired.value,
    //     cost_used_amount: totalPlanCostQuota.value + totalCostInvoice.value,
    //     diff_amount: Math.abs(totalPayFinal.value),
    //     advance_cost_not_used_up: 0,
    //     expenses_over_advance: 0,
    //     total_letter: DocTienBangChu(Math.abs(totalPayFinal.value)),
    //   },
    //   signModalProps.value.fileSign,
    //   pdfSignPosition.DE_NGHI_CHI_HOAN_UNG,
    //   null, //mode
    //   paymentRequestTypeFinal.value == paymentRequestType.DE_NGHI_CHI
    //     ? "De_nghi_chi_tien_bo_sung_chi_phi_con_thieu.pdf"
    //     : "Giay_thanh_toan_thu_tien_hoan_ung.pdf"
    // );
    // upload file yêu cầu chuyển khoản khi có đề nghị chi
    if (paymentRequestTypeFinal.value == paymentRequestType.DE_NGHI_CHI) {
      // uploadFilePdf(
      //   "planAdvanceRequestSign",
      //   {
      //     date_now: moment(),
      //     user_request:
      //       paymentRequestDetailData.value.length > 0
      //         ? paymentRequestDetailData.value[0]?.name
      //         : "--",
      //     user_department: form.value.department_process
      //       ? form.value.department_process?.name
      //       : "--",
      //     user_department_upper: form.value.department_process
      //       ? form.value.department_process.name.toUpperCase()
      //       : "--",
      //     plan_code: form.value.code ? form.value.code : "--",
      //     description: form.value.description ? form.value.description : "--",
      //     total_pay: Math.abs(totalPayFinal.value),
      //     total_letter: Math.abs(totalPayFinal.value)
      //       ? DocTienBangChu(Math.abs(totalPayFinal.value))
      //       : "--",
      //     day_now: `${formatDate(moment())}`.split("/")[0],
      //     month_now: `${formatDate(moment())}`.split("/")[1],
      //     year_now: `${formatDate(moment())}`.split("/")[2],
      //     table:
      //       paymentRequestDetailData.value.length > 0
      //         ? paymentRequestDetailData.value.map((item: any, index: any) => {
      //             const planUser = item.plan_user;
      //             return {
      //               STT: index + 1,
      //               user_department: planUser?.department?.name,
      //               description: "",
      //               name: planUser?.name,
      //               account_number: planUser?.account_number,
      //               bank: planUser?.bank,
      //               amount: Math.abs(totalPayFinal.value),
      //             };
      //           })
      //         : [],
      //   },
      //   signModalProps.value.fileAppendix,
      //   pdfSignPosition.GIAY_DE_NGHI_CHUYEN_KHOAN_KET_THUC_CONG_TAC,
      //   {},
      //   "Đề nghị chuyển khoản.pdf"
      // );
    }
  }
  //upload file kế hoạch kết thúc công tác
  // uploadFilePdf(
  //   "requestConfirmation",
  //   {
  //     day_now: `${formatDate(moment())}`.split("/")[0],
  //     month_now: `${formatDate(moment())}`.split("/")[1],
  //     year_now: `${formatDate(moment())}`.split("/")[2],

  //     from_department: props.form?.department_require
  //       ? props.form?.department_require?.name
  //       : "",
  //     from_address: props.form?.department_require
  //       ? props.form?.department_require?.address
  //       : "",
  //     to_department: props.form?.department_process
  //       ? props.form?.department_process?.name
  //       : "",
  //     to_address: props.form?.department_process
  //       ? props.form?.department_process?.address
  //       : "",
  //     content: form.value.content,
  //     result: form.value.result,
  //     propose: form.value.propose,
  //     body: customDataTable(planCostQuotaDatas.value),
  //     address_business_list: props.form?.plan_route
  //       ? props.form.plan_route.map((planRoute) => {
  //           return {
  //             department: planRoute?.to_department
  //               ? planRoute?.to_department?.name
  //               : "",
  //             address: planRoute?.to_department
  //               ? planRoute?.to_department?.address
  //               : "",
  //           };
  //         })
  //       : [],
  //   },
  //   signModalProps.value.fileSign,
  //   pdfSignPosition.KE_HOACH_KET_THUC_CONG_TAC
  // );
};

const customDataTable = (data: any[]) => {
  let res: any[] = [];
  data.forEach((item, index) => {
    item.STT = index + 1;
    let val = res.find((i) => i.user_id == item.user_id);
    if (typeof val == "undefined") {
      res.push(item);
    }
  });
  res.map((item) => {
    let itemTime: any[] = [];
    data
      .filter((i) => i.user_id == item.user_id)
      .map((i) => {
        itemTime.push(i.from_date);
        itemTime.push(i.to_date);
      });
    const sortedArray = _.orderBy(
      itemTime,
      (o: any) => {
        return moment(o).format("YYYYMMDD");
      },
      ["asc"]
    );
    item.arr = itemTime;
    item.start_time = sortedArray[0];
    item.end_time = sortedArray[sortedArray.length - 1];
    item.business_total_day =
      moment(item.end_time).diff(moment(item.start_time), "days") > 0
        ? moment(item.end_time).diff(moment(item.start_time), "days")
        : 1;
  });
  console.log(res, "//check res after custom");
  return res;
};
const uploadFilePdf = async (
  camelCasePdf: string,
  data: any,
  table: any,
  position?: any,
  mode?: any,
  fileNameCustom?: any
) => {
  endSignLoading.value = true;

  const { opt, content } = await downloadFilePdf(camelCasePdf, data, mode);
  html2pdf()
    .set(opt)
    .from(content)
    .toPdf()
    .get("pdf")
    .then(function (pdfObj) {
      const perBlob = pdfObj.output("blob");
      var formData = new FormData();
      formData.append(
        "file",
        perBlob,
        fileNameCustom ? fileNameCustom : opt.filename
      );
      uploadFile
        .mutateAsync({ data: formData, position: position })
        .then((response) => {
          // table.value.push(response.data);
          // s.value.push(response.data);
          table.push(response.data);
          endSignLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          endSignLoading.value = false;
        });
    });
};

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

watch(
  () => invoicePlanData.value,
  (val: any) => {
    invoiceCostData.value = val;
  },
  { immediate: true }
);

watch(
  () => paymentRequestTypeFinal.value,
  (val: any) => {
    if (val != null) {
      paramsPaymentRequest.value = {
        planId: props.form.id ? props.form.id : null,
        "type.in": val,
      };
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}

.card-border {
  border-radius: 4px;
  margin-bottom: 16px;
}

:deep() .ant-form-item-label > label {
  color: #747c87 !important;
}

:deep(.ant-tabs-bar) {
  margin: 0;
  background-color: white;
}

:deep(.ant-btn-primary) {
  background-color: #ed1b2f !important;
  border-color: #ed1b2f !important;
}
.ant-spin-nested-loading {
  width: 100%;
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

.width_item {
  width: 100%;
}

.title {
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 24px;
}

.button_custom_antd {
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
</style>
