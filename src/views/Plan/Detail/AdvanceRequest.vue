<template>
  <a-col :span="24" :disabled="true">
    <a-row>
      <a-col :span="24">
        <a-spin :spinning="planRequiredLoading">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" :header="'Thông tin chung'" style="font-weight: bold">
              <a-form ref="formRequest" :rules="rulesPlanRequired" :model="form" :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }" :layout="layout" labelAlign="left" style="font-weight: normal !important">
                <a-row :gutter="[0, 24]">
                  <a-col :span="24">
                    <a-row :gutter="[24, 0]">
                      <a-col :span="12">
                        <a-form-item label="Người đề nghị" name="user_require" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">{{
                            form.user_require
                            ? form.user_require.fullName
                            : "--"
                          }}</a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Trạng thái đề nghị tạm ứng" name="plan_required_status"
                          :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">{{
                            form.status
                            ? formatPlanRequireStatus(form.status)
                            : "Khởi tạo"
                          }}</a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="12">
                        <a-form-item label="Tên đề nghị" name="name" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">{{ form.name ? form.name : "--" }}
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Lý do KTNH từ chối" name="reason" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">{{ form?.reason ? form.reason : "--" }}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="24">
                        <a-form-item label="Đơn vị đề nghị" name="department_process">{{
                          form.department_process
                          ? form.department_process.name
                          : "--"
                        }}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="12">
                        <a-form-item label="Căn cứ kế hoạch số" name="code" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">{{ form.code ? form.code : "--" }}
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Ngày" name="approve_date" :label-col="{ span: 3 }"
                          :wrapper-col="{ span: 16 }">{{
                            form.approve_date
                            ? formatDate(form.approve_date)
                            : "--"
                          }}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="24">
                        <a-form-item label="Hình thức công tác" name="type">{{ form.type ? renderType(form.type) : "--" }}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="12">
                        <a-form-item label="Số tiền yêu cầu" name="amount" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">
                          <template v-if="isDisabled">
                            <span>{{ formatCurrency(form.amount) }}</span>
                          </template>
                          <template v-else>
                            <a-input-number v-model:value="form.amount" :placeholder="'Số tiền yêu cầu'"
                              style="width: 100%" :maxlength="20" :formatter="(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                " :parser="(value) => value.replace(/\\s?|(,*)/g, '')
    " @blur="onBlurAmount" />
                          </template>
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Số tiền tạm ứng tối đa" name="amount_max" :label-col="{ span: 8 }"
                          :wrapper-col="{ span: 16 }">
                          <span>{{
                            form.total_estimated_amount
                            ? `${formatCurrency(
                              form.total_estimated_amount
                            )} VNĐ`
                            : "0 VNĐ"
                          }}</span>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="24">
                        <a-form-item label="Thời hạn thanh toán" name="expired_time">
                          <template v-if="isDisabled">
                            <span>{{
                              form.expired_time
                              ? formatDate(form.expired_time)
                              : "--"
                            }}</span>
                          </template>
                          <template v-else>
                            <a-date-picker v-model:value="form.expired_time" format="DD/MM/YYYY"
                              :placeholder="'Thời hạn thanh toán'" class="width_item" :allowClear="false"
                              @change="onchangeExpiredTime" />
                          </template>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="[24, 0]">
                      <a-col :span="24">
                        <a-form-item label="Diễn giải chi tiết" name="description" :rules="[
                          {
                            required: true,
                            pattern: new RegExp('^[A-Z a-z 0-9]*$'),
                            message:
                              'Vui lòng nhập kí tự không dấu, không chứa kí tự đặc biệt',
                          },
                        ]">
                          <template v-if="isDisabled">
                            <span>{{
                              form.description ? form.description : `--`
                            }}</span>
                          </template>
                          <template v-else>
                            <a-textarea v-model:value="form.description" :placeholder="'Diễn giải chi tiết'"
                              :maxlength="95" />
                          </template>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-form>
            </a-collapse-panel>
            <a-collapse-panel key="2" :header="'Thông tin chuyển khoản tạm ứng'" style="font-weight: bold">
              <a-form ref="userFormRequest" :rules="rulesPlanRequired" :model="form" :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }" :layout="layout" labelAlign="left" style="font-weight: normal !important">
                <a-col :span="24">
                  <a-row :gutter="[24, 0]">
                    <a-col :span="12" v-if="!isDisabled || isRefuseStatus">
                      <a-form-item label="Chọn thành viên" :label-col="{ span: 24 }" :wrapper-col="{ span: 12 }"
                        name="plan_required_user" width="100%">
                        <o-select ref="plan_required_user" v-model:value="form.plan_required_user"
                          @input="onChangeUser($event)" @deSelect="onDeSelect" :placeholder="'Chọn thành viên'"
                          entity="plan-users" :title="fields.user_process_id.label" :icon="'environment'"
                          :isDisplay="'none'" :isDisplayAdd="'none'" textField="name" valueField="id" :filters="[
                            {
                              field: 'planId',
                              operator: 'equal',
                              value: props.form.id ? props.form.id : null,
                            },
                            {
                              field: 'type',
                              operator: 'equals',
                              value: planUserType.staff,
                            },
                          ]" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-form>

              <a-col :span="24">
                <a-table :columns="columnStaff" :dataSource="dataStaff" style="font-weight: normal !important"
                  :pagination="false">
                  <template #phone_number="{ text }">
                    <a :href="`tel:${text}`">{{ text }}</a>
                  </template>
                  <template #amount="{ text }">
                    <span>
                      {{ text != null ? formatCurrency(text) : " --" }}</span>
                  </template>
                </a-table>
              </a-col>
            </a-collapse-panel>
          </a-collapse>
        </a-spin>
      </a-col>
    </a-row>
  </a-col>

  <a-col>
    <a-modal v-model:visible="showModalVofficeLogin" title="Thông tin đăng nhập" @ok="vofficeLogin" :okText="'Đăng nhập'"
      :cancelText="'Đóng'" :ok-button-props="{
        style: {
          background: '#ed1b2f',
          borderColor: '#ed1b2f',
          marginRight: '8px',
          color: '#fff',
        },
        loading: btnLoading,
      }" :cancel-button-props="{
  style: {
    marginRight: '8px',
  },
}">
      <div>
        <a-form ref="vofficeLoginRef" :model="state" :rules="rulesVofficeLogin" :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-form-item label="Tên đăng nhập Voffice" name="username">
            <a-input v-model:value="state.username" size="large" />
          </a-form-item>
          <a-form-item label="Mật khẩu Voffice" name="password">
            <a-input-password v-model:value="state.password" size="large" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </a-col>
  <div>
    <a-modal v-model:visible="isShowSignModal" title="Trình ký kế hoạch công tác" :destroyOnClose="true" :closable="true"
      :cancel-text="$t('common.back')" :bodyStyle="bodyStyleModal" :width="'100%'" centered :wrapClassName="wrapClassName"
      target="current_tab" ref="modal">
      <AdvanceRequestSign :form="{
        ...state,
        plan: { id: props.form.id },
        plan_cost: props.form.plan_cost ? props.form.plan_cost : null,
        advance_request_sign_pdf_data: planAdvanceRequestSignPdfData,
        process_pdf_data: planProcessPdfData,
        advance: props.form,
        filePdf: filePDFs,
      }" :uploadLoading="uploadPdfLoading" @hideModal="closeSignModal" @sendSignSuccess="sendSignSuccess">
      </AdvanceRequestSign>
    </a-modal>
  </div>
  <div>
    <a-modal v-model:visible="showModalSignDetail" title="Chi tiết trình ký" :destroyOnClose="true" :closable="true"
      @ok="() => (showModalSignDetail = false)" :cancel-text="$t('common.back')" :bodyStyle="bodyStyleModal"
      :width="'100%'" centered :wrapClassName="wrapClassName" target="current_tab" ref="modal" :ok-button-props="{
        style: {
          background: '#ed1b2f',
          borderColor: '#ed1b2f',
          marginRight: '8px',
        },
      }">
      <SignDetailModal :form="props.form" :planId="props.form.id ? props.form.id : null"
        :type="signStageType.TRINH_KY_DE_NGHI_TM" />
    </a-modal>
  </div>

  <a-row type="flex" class="footer" style="justify-content: flex-end" v-if="!isDisabled || isRefuseStatus">
    <a-spin :spinning="planRequiredLoading">
      <a-button @click="saveForm" size="middle" style="background-color: #ed1b2f; color: white" :loading="btnSaveLoading">
        <SaveOutlined />{{ t("common.save") }}
      </a-button>
      <a-button @click="handleSaveAndSign" size="middle" style="background-color: #ed1b2f; color: white"
        :loading="btnSaveAndSignLoading">{{ "Lưu và trình kí " }}
        <DoubleRightOutlined />
      </a-button>
      <a-button :size="'middle'" @click="handleDownloadPayRequest" :loading="btnDownloadPayRequestLoading"
        style="background-color: #ed1b2f; color: #fff">
        <template #icon>
          <DownloadOutlined />
        </template>
        {{ "Tải về đề nghị chuyển khoản" }}
      </a-button>
      <a-button class="prev" @click="cancelForm" size="middle">
        <DoubleLeftOutlined />{{ "Hủy" }}
      </a-button>
    </a-spin>
  </a-row>
  <a-row v-else type="flex" class="footer" style="justify-content: flex-end">
    <a-button class="prev" @click="cancelForm" size="middle">
      <DoubleLeftOutlined />{{ "Trở về" }}
    </a-button>
    <a-button :size="'normal'" @click="openModalSignDetail" style="background-color: #ed1b2f; color: #fff"
      v-if="isDisabled">
      {{ "Xem trình ký" }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import i18n from "@/lang";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { formatDate, formatNumber, formatCurrency } from "@/utility";
import { DocTienBangChu } from "@/utility";
import html2pdf from "html2pdf.js";
import moment from "moment/moment";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import Constant from "@/constant";
import UserService from "@/services/UserService";
import { vOfficeLogin, useGetSapAccounting } from "@/hooks/voffice";
import { message } from "ant-design-vue";
import { useSaveMutation as saveMutationPlanRequired } from "@/hooks/plan_required";
import { generateRules } from "@/formUtility";
import Model from "@/config/models";
import { useGetList as getListPlanRequired } from "@/hooks/plan_required";
import AdvanceRequestSign from "../Modal/AdvanceRequestSign.vue";
import SignDetailModal from "../Modal/SignDetailModal.vue";
import { uploadFileMutation } from "@/hooks/voffice";
import { useQueryClient } from "vue-query";
import { planRequiredStatus as planRequiredStatusEnum } from "@/common/enumUtility";
import {
  pdfSignPosition,
  planUserType,
  planStatus,
  signStageType,
} from "@/common/enumUtility";
import { useGetPlanCostByPlanId } from "@/hooks/plan_cost";
import { useAuth } from "@websanova/vue-auth";
import _ from "lodash";
const queryClient = useQueryClient();

const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
});
const isDisabled = ref<boolean>(
  [planStatus.init, planStatus.refuse_approve].includes(props.form.status)
    ? false
    : true
);
const uploadPdfLoading = ref<boolean>(false);
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
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
var authStore = useAuth();
const userInfo: any = authStore.user();

const wrapClassName = ref<string>("full-form");
const rulesPlanRequired = ref<any>(generateRules("planRequired") || {});
const Models = ref<any>(Model);
const planCost = ref<any[]>([]);
const form = ref<any>({
  code: props.form.code,
  plan_base: props.form.code,
  type: props.form.type,
  plan_cost: props.form.plan_cost || [],
  department_require: props.form.department_require,
  department_process: props.form.department_process,
  plan: props.form,
  name: props.form.code
    ? `Đề nghị chuyển khoản tạm ứng công tác phí cho kế hoạch số ${props.form.code}`
    : null,
  description: `VTP CHUYEN TIEN TAM UNG CONG TAC PHI THEO KE HOACH SO ${props.form.code}`,
});
// const formPlan = ref<any>(props.form.plan? props.form.plan: {})
const fields = ref<any>(props.fields);
const dataStaff = ref<any[]>([]);
const showModalVofficeLogin = ref<boolean>(false);
const showModalSignDetail = ref<boolean>(false);
const isShowSignModal = ref<boolean>(false);
const btnLoading = ref<boolean>(false);
const btnSaveLoading = ref<boolean>(false);
const btnSaveAndSignLoading = ref<boolean>(false);
const btnDownloadPayRequestLoading = ref<boolean>(false);
const btnGroupLoading = ref<boolean>(false);
const activeKey = ref(["1", "2"]);
const mode = ref<any>("add");
const state = reactive({
  valueSearch: "",
  username: "",
  password: "",
});
const vofficeLoginRef = ref();
const formRequest = ref();
const userFormRequest = ref();
const paramsPlanRequired = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const params = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const planRequiredId = ref<any>(null);
const filePDFs = ref<any[]>([]);
const enabledGetListPlanRequired = computed(() => {
  return props.form.id !== null;
});
console.log(form.value, "form.value");
const isRefuseStatus = computed(
  () => form.value.status == planRequiredStatusEnum.KE_TOAN_TU_CHOI
);
const key = ref<number>(1);
const uploadFile = uploadFileMutation();
const userMutationVOfficeLogin = vOfficeLogin();
const useSavePlanRequired = saveMutationPlanRequired();
const planAdvanceRequestSignPdfData = ref<any>();
const planProcessPdfData = ref<any>();
const dataBefore = ref<any>({});
const sapAcountingDatas = ref<any[]>([]);
const emit = defineEmits<{
  (e: "pevStep"): void;
  (e: "hideModal"): void;
}>();

const rulesVofficeLogin = ref<any>({
  username: {
    required: true,
    message: "Vui lòng nhập tên đăng nhập",
  },
  password: [
    {
      required: true,
      message: "Vui lòng nhập mật khẩu",
    },
  ],
});

const planRequiredStatus = [
  { value: 0, label: "Chờ phê duyệt" },
  { value: 1, label: "Đã phê duyệt" },
  { value: 2, label: "Tạo bảng tổng hợp chuyển khoản" },
  { value: 3, label: "Chờ duyệt bảng tổng hợp chuyển khoản" },
  { value: 4, label: "Đã phê duyệt bảng tổng hợp chuyển khoản" },
  { value: 5, label: "Từ chối bảng tổng hợp chuyển khoản" },
  { value: 6, label: "Kế toán ngân hàng từ chối" },
  { value: 7, label: "Đã hoàn thành chi" },
  { value: 8, label: "Chuyển khoản lỗi" },
];

const formatPlanRequireStatus = (value) => {
  let data = planRequiredStatus.find((i) => i.value == value);
  return data?.label;
};
const handleDownloadPayRequest = async () => {
  btnDownloadPayRequestLoading.value = true;

  if (isRefuseStatus.value && isDisabled.value) {
    const staffInfo = dataStaff.value[0];
    const staffInfoOld = dataBefore?.value?.plan_required_user;
    const { opt, content } = await downloadFilePdf(
      "advanceRequestTransferInfo",
      {
        created_at: moment().utc(),
        reason: `Thanh toán lại các khoản tiền bị trả lại do sai thông tin chuyển khoản trong đề nghị tạm ứng số ${form.value.code}`,
        before_code: `${form.value.code}`,
        plan_code: `${form.value?.plan?.code}`,
        department_require: `${form.value?.plan?.department_process?.name}`,
        user_synthetic: `${form.value?.plan?.user_process?.fullName}`,
        //table
        name_bank_acount: staffInfoOld ? staffInfoOld?.plan_user_id?.name : "",
        acount_number: staffInfoOld
          ? staffInfoOld?.plan_user_id?.account_number
          : "",
        bank: staffInfoOld ? staffInfoOld?.plan_user_id?.bank : "",
        send_content: staffInfo ? staffInfo?.account_number : "",
        amount: staffInfoOld ? staffInfoOld?.amount : "",
        // transfer
        name_bank_acount_diff: staffInfo ? staffInfo?.name : "",
        acount_number_diff: staffInfo ? staffInfo?.account_number : "",
        bank_diff: staffInfo ? staffInfo?.bank : "",
        reason_change: "",
        file_proof: "",
        //footer
        total_amount: staffInfo ? staffInfo?.amount : 0,
        total_amount_letter: staffInfo
          ? DocTienBangChu(staffInfo?.amount)
          : `0`,
        //table right
        staff_code: staffInfo ? staffInfo?.username : "",
        staff_name: staffInfo ? staffInfo?.name : "",
        CN_code: "",
        give_back_date: "",
        account_debt: "",
        total_profit: "",
      },
      {}
    );
    html2pdf().set(opt).from(content).toPdf().get("pdf").save();
  } else {
    let SAP: any = null;
    if (dataStaff.value.length > 0) {
      let departmentUserRequire = dataStaff.value[0]?.department?.id;
      SAP = sapAcountingDatas.value.find(
        (s) => s?.postId == departmentUserRequire
      );
    }

    const { opt, content } = await downloadFilePdf(
      "planAdvanceRequestSign",
      {
        date_now: moment(),
        user_request: form.value.user_require
          ? form.value.user_require.fullName
          : "--",
        user_department: form.value.department_process
          ? form.value.department_process.name
          : "--",
        user_department_upper: form.value.department_process
          ? form.value.department_process.name.toUpperCase()
          : "--",
        plan_code: form.value.code ? form.value.code : "--",
        description: form.value.description ? form.value.description : "--",
        total_pay: form.value.amount ? form.value.amount : "--",
        total_letter: form.value.amount
          ? DocTienBangChu(Number(form.value.amount))
          : "--",
        day_now: `${formatDate(moment())}`.split("/")[0],
        month_now: `${formatDate(moment())}`.split("/")[1],
        year_now: `${formatDate(moment())}`.split("/")[2],
        table:
          dataStaff.value.length > 0
            ? dataStaff.value.map((item, index) => {
              return {
                ...item,
                STT: index + 1,
                user_department: item.department
                  ? item.department.name
                  : "--",
                description: form.value.description
                  ? form.value.description
                  : "--",
                sap_debt: "1411200000",
                BP_code: item?.code,
                cost_center: SAP ? SAP?.costCenter : "",
                prof_center: SAP ? SAP?.profCenter : "",
              };
            })
            : [],
      },
      {}
    );
    html2pdf().set(opt).from(content).toPdf().get("pdf").save();
  }
  btnDownloadPayRequestLoading.value = false;
};

const onchangeExpiredTime = () => {
  let compare = moment(form.value.expired_time).isSameOrAfter(moment(), "day");
  if (!compare) {
    message.error("Thời hạn thanh toán phải từ hôm nay");
    form.value.expired_time = null;
  }
};

const onBlurAmount = () => {
  if (form.value.total_estimated_amount >= 0) {
    if (form.value.amount > form.value.total_estimated_amount) {
      message.error("Số tiền yêu cầu phải nhỏ hơn số tiền tạm ứng tối đa");
      form.value.amount = 0;
    }
  }
};
const columnStaff = [
  {
    title: "Mã nhân viên",
    dataIndex: "code",
    // width: "15%",
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    // width: "15%",
  },
  {
    title: "Email",
    dataIndex: "email",
    // width: "15%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    // width: "15%",
    slots: { customRender: "phone_number" },
  },
  {
    title: "Người thụ hưởng",
    dataIndex: "name",
    // width: "15%",
  },
  {
    title: "Số TK",
    dataIndex: "account_number",
    // width: "15%",
  },
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    // width: "15%",
  },
  {
    title: "Tổng số tiền",
    dataIndex: "amount",
    slots: { customRender: "amount" },
    // width: "15%",
  },
];
const cancelForm = () => {
  emit("hideModal");
};

const showSignModal = () => {
  loadFilePdfData();
  isShowSignModal.value = true;
};

const closeSignModal = (data?: any) => {
  isShowSignModal.value = false;
  if (data) {
    emit("hideModal");
  }
};

const saveForm = () => {
  formRequest.value
    .validate()
    .then(async () => {
      btnSaveLoading.value = true;
      if (dataStaff.value.length == 0) {
        throw "Vui lòng thêm thông tin chuyển khoản tạm ứng";
      }
      saveFormData(useSavePlanRequired, {
        id: props.form.id,
        data: {
          ...form.value,
          plan_required_user: dataStaff.value[0],
        },
        mode: mode.value,
      });
    })
    .catch((error) => {
      if (typeof error == "string") {
        message.error(error);
      }
      console.log(error);
      btnSaveLoading.value = false;
    });
};

const loadFilePdfData = () => {
  if (isRefuseStatus.value && isDisabled.value) {
    const staffInfo = dataStaff.value[0];
    const staffInfoOld = dataBefore?.value?.plan_required_user;
    uploadFilePdf(
      "advanceRequestTransferInfo",
      {
        created_at: moment().utc(),
        reason: `Thanh toán lại các khoản tiền bị trả lại do sai thông tin chuyển khoản trong đề nghị tạm ứng số ${form.value.code}`,
        before_code: `${form.value.code}`,
        plan_code: `${form.value?.plan?.code}`,
        department_require: `${form.value?.plan?.department_process?.name}`,
        user_synthetic: `${form.value?.plan?.user_process?.fullName}`,
        //table
        name_bank_acount: staffInfoOld ? staffInfoOld?.plan_user_id?.name : "",
        acount_number: staffInfoOld
          ? staffInfoOld?.plan_user_id?.account_number
          : "",
        bank: staffInfoOld ? staffInfoOld?.plan_user_id?.bank : "",
        send_content: staffInfo ? staffInfo?.account_number : "",
        amount: staffInfoOld ? staffInfoOld?.amount : "",
        // transfer
        name_bank_acount_diff: staffInfo ? staffInfo?.name : "",
        acount_number_diff: staffInfo ? staffInfo?.account_number : "",
        bank_diff: staffInfo ? staffInfo?.bank : "",
        reason_change: "",
        file_proof: "",
        //footer
        total_amount: staffInfo ? staffInfo?.amount : 0,
        total_amount_letter: staffInfo
          ? DocTienBangChu(staffInfo?.amount)
          : `0`,
        //table right
        staff_code: staffInfo ? staffInfo?.username : "",
        staff_name: staffInfo ? staffInfo?.name : "",
        CN_code: "",
        give_back_date: "",
        account_debt: "",
        total_profit: "",
      },
      pdfSignPosition.DE_NGHI_CHUYEN_KHOAN_DO_SAI_THONG_TIN_TAI_KHOAN,
      {}
    );
  } else {
    filePDFs.value = [];
    const planCostEstimate = flattenData(planCost.value);
    uploadFilePdf(
      "planAppendix",
      {
        table: planCost.value,
        total_amount_final:
          planCostEstimate.length > 0
            ? planCostEstimate
              .map((i: any) => (i.total_amount ? i.total_amount : 0))
              .reduce((a: any, b: any) => a + b, 0)
            : 0,
      },
      pdfSignPosition.PHU_LUC_CHI_PHI
    );
    //

    let SAP: any = null;
    if (dataStaff.value.length > 0) {
      let departmentUserRequire = dataStaff.value[0]?.department?.id;
      SAP = sapAcountingDatas.value.find(
        (s) => s?.postId == departmentUserRequire
      );
    }
    uploadFilePdf(
      "planAdvanceRequestSign",
      {
        date_now: moment(),
        user_request: form.value.user_require
          ? form.value.user_require.fullName
          : "--",
        user_department: form.value.department_process
          ? form.value.department_process?.name
          : "--",
        user_department_upper: form.value.department_process
          ? form.value.department_process.name.toUpperCase()
          : "--",
        plan_code: form.value.code ? form.value.code : "--",
        description: form.value.description ? form.value.description : "--",
        total_pay: form.value.amount ? Math.abs(form.value.amount) : "--",
        total_letter: form.value.amount
          ? DocTienBangChu(form.value.amount)
          : "--",
        day_now: `${formatDate(moment())}`.split("/")[0],
        month_now: `${formatDate(moment())}`.split("/")[1],
        year_now: `${formatDate(moment())}`.split("/")[2],
        table:
          dataStaff.value.length > 0
            ? dataStaff.value.map((item, index) => {
              return {
                ...item,
                STT: index + 1,
                user_department: item.department
                  ? item.department.name
                  : "--",
                description: form.value.description
                  ? form.value.description
                  : "--",
                sap_debt: "1411200000",
                BP_code: item?.code,
                cost_center: SAP ? SAP?.costCenter : "",
                prof_center: SAP ? SAP?.profCenter : "",
              };
            })
            : [],
      },
      pdfSignPosition.DE_NGHI_TAM_UNG,
      {}
    );

    uploadFilePdf(
      "planProcess",
      {
        name_of_plan: props.form?.name ? props.form?.name : "",
        day_now: `${formatDate(moment())}`.split("/")[0],
        month_now: `${formatDate(moment())}`.split("/")[1],
        year_now: `${formatDate(moment())}`.split("/")[2],
        department_process: props.form.plan.department_process
          ? props.form.plan.department_process.name
          : "--",
        address1: props.form.plan.department_require
          ? props.form.plan.department_require.address
          : "--",
        department_require: props.form.plan.department_require
          ? props.form.plan.department_require.name
          : "--",
        address2: props.form.plan.department_process
          ? props.form.plan.department_process.address
          : "--",
        start_time: props.form.plan.start_time,
        end_time: props.form.plan.end_time,
        description: props.form.plan.description,
        table: props.form.plan_route_user
          ? customDataTable(props.form.plan_route_user)
          : [],
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
  }
};
console.log(props.form?.plan_route, "//props.form?.plan_route");

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
        itemTime.push(i.start_time);
        itemTime.push(i.end_time);
      });
    const sortedArray = _.orderBy(
      itemTime,
      (o: any) => {
        return moment(o).format("YYYYMMDD");
      },
      ["asc"]
    );
    item.start_time = sortedArray[0];
    item.end_time = sortedArray[sortedArray.length - 1];
    item.business_total_day = moment(item.end_time).diff(
      moment(item.start_time),
      "days"
    );
    item.department_user = item?.plan_user?.department?.name;
  });
  return res;
};
const uploadFilePdf = async (
  camelCasePdf: string,
  data: any,
  // table: any,
  position?: any,
  mode?: any
) => {
  uploadPdfLoading.value = true;
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
          if (response.data) {
            filePDFs.value.push(response.data);
            uploadPdfLoading.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          var response = error?.response?.data;
          if (Array.isArray(response.fieldErrors)) {
            message.error(
              response.fieldErrors.map((p: any) => p.message).join("\n")
            );
          } else {
            message.error(
              response.title ||
              response.message ||
              "Lỗi upload file sang VOffice"
            );
          }
        });
    });
};

const sendSignSuccess = () => {
  useSavePlanRequired
    .mutateAsync({
      id: props.form.id,
      data: {
        ...form.value,
        plan_required_user: dataStaff.value[0],
        status: planRequiredStatusEnum.CHO_PHE_DUYET,
      },
      mode: mode.value,
    })
    .then((response) => {
      console.log("Cập nhật trạng thái: Chờ phê duyệt");
    })
    .catch((error) => {
      message.error("Cập nhật trạng thái đề nghị tạm ứng lỗi ");
    });
};

const handleSaveAndSign = async () => {
  btnSaveAndSignLoading.value = true;
  formRequest.value
    .validate()
    .then(() => {
      // openModalVofficeLogin();
      saveFormData(
        useSavePlanRequired,
        {
          id: props.form.id,
          data: {
            ...form.value,
            plan_required_user: dataStaff.value[0],
          },
          mode: mode.value,
        },
        true
      );
    })
    .catch((error) => {
      console.log(error);
      btnSaveAndSignLoading.value = false;
    });

  // openModalVofficeLogin();
};

const renderType = (type) => {
  const item = Constant.planType.find((i) => i.value == type);
  return item?.label;
};

const onDeSelect = () => {
  dataStaff.value = [];
};

const onChangeUser = async ($event) => {
  formRequest.value
    .validate()
    .then(async () => {
      if ($event.value) {
        let item = await $event.value.options.find(
          (i) => i.id == $event.value.key
        );
        if (item.bank == null) {
          message.error(
            "Nhân viên nhận chuyển khoản tạm ứng chưa cập nhật số tài khoản"
          );
          dataStaff.value = [];
          form.value.plan_required_user = {
            key: null,
            id: null,
          };
        } else {
          form.value.plan_required_user = {
            key: $event.value.key,
            id: $event.value.key,
          };
          dataStaff.value = [
            {
              ...item,
              amount: form.value.amount,
              plan_user_id: { id: item.id },
              code: item.code ? item.code : null,
            },
          ];
        }
      }
    })
    .catch((error) => {
      form.value.plan_required_user = {
        key: null,
        id: null,
      };
    });
};

const renderUser = async (id: any) => {
  const res = await UserService.detail(id);
  return res.data;
};

const openModalVofficeLogin = () => {
  showModalVofficeLogin.value = true;
};

const openModalSignDetail = () => {
  showModalSignDetail.value = true;
};

const vofficeLogin = () => {
  btnLoading.value = true;
  vofficeLoginRef.value
    .validate()
    .then(async () => {
      btnLoading.value = true;
      userMutationVOfficeLogin
        .mutateAsync(state)
        .then((response) => {
          if (response.data.errorCode) {
            message.error(response.data.message || "Lỗi hệ thống");
            btnLoading.value = false;
          } else {
            message.success("Đăng nhập thành công");
            showModalVofficeLogin.value = false;
            showSignModal();
            btnLoading.value = false;
          }
        })
        .catch((error) => {
          btnLoading.value = false;
          message.error(error || "Lỗi hệ thống");
        });
    })
    .catch((error) => {
      btnLoading.value = false;

      console.log("error", error);
    });
};

const saveFormData = (useSaveFormData: any, data: any, sign?: boolean) => {
  useSaveFormData
    .mutateAsync(data)
    .then((response) => {
      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
        return false;
      }
      mode.value = "edit";
      // emit("hideModal");
      if (sign && sign == true) {
        openModalVofficeLogin();
        // emit("hideModal");
      } else {
        message.success(t("common.save_success", {}));
      }
      btnSaveLoading.value = false;
      btnSaveAndSignLoading.value = false;
    })
    .catch((error) => {
      var response = error.response.data;
      if (Array.isArray(response.fieldErrors)) {
        message.error(
          response.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(response.title || response.message);
      }
      btnSaveLoading.value = false;
      btnSaveAndSignLoading.value = false;
    });
};

const { isLoading: planRequiredLoading } = getListPlanRequired(
  paramsPlanRequired,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: enabledGetListPlanRequired,
    retry: false,
    onSuccess: async (val) => {
      let response = val.data.content[0];
      if (response) {
        mode.value = "edit";
        form.value.user_require = response.user_require
          ? response.user_require
          : null;
        form.value.status = response.status;
        form.value.description = response.description;
        planRequiredId.value = response.id;
        form.value.id = response.id;
        form.value.approve_date = response.approve_date
          ? moment.utc(response.approve_date, "YYYY-MM-DD")
          : null;
        form.value.expired_time = response.expired_time
          ? moment.utc(response.expired_time, "YYYY-MM-DD") //moment.utc(data[prop], "YYYY-MM-DD")
          : moment();
        form.value.amount = response.plan_required_user.amount;
        form.value.reason = response?.reason;
        const plan_requried_user = response.plan_required_user;
        if (plan_requried_user.plan_user_id) {
          form.value.plan_required_user = {
            value: plan_requried_user.plan_user_id.id,
            label: plan_requried_user.plan_user_id.name,
            ...response.plan_required_user,
          };
          dataStaff.value = [
            {
              ...plan_requried_user.plan_user_id,
              plan_user_id: plan_requried_user.plan_user_id,
              amount: response.plan_required_user.amount,
              code: plan_requried_user.code,
              bank: plan_requried_user.plan_user_id.bank,
              account_number: plan_requried_user.plan_user_id.account_number,
            },
          ];
        }
        dataBefore.value = response;
      } else {
        // default form create
        form.value.user_require = {
          id: userInfo.id,
          fullName: userInfo.full_name,
        };
      }
    },
  }
);

const { isLoading: planCostLoading } = useGetPlanCostByPlanId(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  retry: false,
  onSuccess: async (val) => {
    if (Array.isArray(val.data) && val.data.length > 0) {
      (form.value.total_estimated_amount = val.data
        ? val.data
          .map((i: any) => (i.total_amount ? i.total_amount : 0))
          .reduce((a: any, b: any) => a + b, 0)
        : 0),
        (planCost.value = await generateDataCostEstimate(val.data));
    }
  },
});

const { } = useGetSapAccounting(
  {},
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
    onSuccess: async (val) => {
      sapAcountingDatas.value = val.data;
    },
  }
);

const flattenData = (data) => {
  let res: any[] = [];
  const mapData = (array, items) => {
    items.forEach((i, index) => {
      if (i.level == Constant.levelCostContants.CAP_NGUOI_DUNG.value) {
        array.push({ ...i, STT: index + 1 });
      } else {
        array.push(i);
      }
      if (i.children?.length > 0) {
        mapData(array, i.children);
      }
    });
  };
  mapData(res, data);
  return res;
};

const generateDataCostEstimate = async (data: any) => {
  const routeLevel = ref<any[]>([]);
  const serviceGroupLevel = ref<any[]>([]);
  const userLevel = ref<any[]>([]);
  await data.forEach(async (item: any) => {
    if (
      !routeLevel.value.filter(
        (a: any) => a.plan_route_id == item.plan_route_id
      )[0]
    ) {
      await routeLevel.value.push({
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
      await serviceGroupLevel.value.push({
        key: key.value++,
        content: item.name_of_service,
        plan_route_id: item.plan_route_id,
        service_id: item.service_id,
        level: Constant.levelCostContants.CAP_DICH_VU,
      });
    }
    item.key = key.value++;
    await userLevel.value.push({
      ...item,
      content: item.name_of_plan_route_user,
      is_active: true,
      level: Constant.levelCostContants.CAP_NGUOI_DUNG,
    });
    // }
  });

  await routeLevel.value.forEach((item: any) => {
    item.children = serviceGroupLevel.value.filter(
      (a: any) => a.plan_route_id == item.plan_route_id
    );
  });
  await serviceGroupLevel.value.forEach((item: any) => {
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
  return routeLevel.value;
  // dataCostEstimate.value = routeLevel.value;
};

watch(
  () => props.form,
  (val: any) => {
    if (val.plan_cost && val.plan_cost.length > 0) {
      form.value.total_estimated_amount = val.plan_cost[0]
        .total_estimated_amount
        ? val.plan_cost[0].total_estimated_amount
        : 0;
    } else {
      form.value.total_estimated_amount = 0;
    }
  },
  { immediate: true }
);

onMounted(async () => { });
</script>
<style scoped lang="scss">
.ant-form {
  :deep(label) {
    font-weight: bold !important;
    color: black !important;
  }
}

.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}

.card-border {
  border-radius: 4px;
  margin-bottom: 16px;
}

:deep() .ant-form-item-label>label {
  color: #000000 !important;
}

:deep(.ant-tabs-bar) {
  margin: 0;
  background-color: white;
}

:deep(.ant-btn-primary) {
  background-color: #ed1b2f !important;
  border-color: #ed1b2f !important;
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

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

.button_header {
  .ant-btn {
    margin-right: 2%;
  }
}
</style>
