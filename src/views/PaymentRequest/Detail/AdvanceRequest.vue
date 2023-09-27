<template>
  <a-col :span="24">
    <a-row>
      <a-col :span="24">
        <a-collapse v-model:activeKey="activeKey">
          <a-collapse-panel key="1" :header="'Thông tin chung'">
            <a-form
              ref="formRequest"
              :rules="rulesPlanRequired"
              :model="form"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              :layout="layout"
              labelAlign="left"
            >
              <a-row :gutter="[0, 16]">
                <a-col :span="24">
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24" align="right" display="flex">
                      <a-button
                        :size="'normal'"
                        @click="handleDownloadPayRequest"
                        style="background-color: #137adb; color: white"
                      >
                        <template #icon>
                          <DownloadOutlined />
                        </template>
                        Tải về đề nghị chuyển khoản
                      </a-button>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24" align="right" display="flex">
                      <a-button
                        :size="'normal'"
                        @click="handleDownloadTest"
                        style="background-color: #137adb; color: white"
                      >
                        <template #icon>
                          <DownloadOutlined />
                        </template>
                        kế hoạch công tác
                      </a-button>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item label="Người đề nghị" name="user_require">{{
                        form.user_require ? form.user_require.fullName : "--"
                      }}</a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item label="Tên đề nghị" name="name"
                        >{{ form.name ? form.name : "--" }}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item
                        label="Đơn vị đề nghị"
                        name="department_require"
                        >{{
                          form.department_require
                            ? form.department_require.name
                            : "--"
                        }}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="12">
                      <a-form-item label="Căn cứ kế hoạch số" name="code"
                        >{{ form.code ? form.code : "--" }}
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="Ngày" name="start_time"
                        >{{ form.start_time ? form.start_time : "--" }}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item label="Hình thức công tác" name="type"
                        >{{ form.type ? renderType(form.type) : "--" }}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="12">
                      <a-form-item
                        label="Số tiền yêu cầu"
                        name="amount"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 16 }"
                      >
                        <a-input-number
                          v-model:value="form.amount"
                          :placeholder="'Số tiền yêu cầu'"
                          style="width: 100%"
                          :maxlength="20"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item
                        label="Diễn giải chi tiết"
                        name="description"
                      >
                        <a-textarea
                          v-model:value="form.description"
                          :placeholder="'Diễn giải chi tiết'"
                          show-count
                          :maxlength="500"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                      <a-form-item
                        label="Thời hạn thanh toán"
                        name="expired_time"
                      >
                        <a-date-picker
                          v-model:value="form.expired_time"
                          format="DD/MM/YYYY"
                          :placeholder="'Thời hạn thanh toán'"
                          class="width_item"
                          :allowClear="false"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-form>
          </a-collapse-panel>
          <a-collapse-panel key="2" :header="'Thông tin chuyển khoản tạm ứng'">
            <a-form
              ref="userformRequest"
              :rules="rulesPlanRequired"
              :model="form"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
              :layout="layout"
              labelAlign="left"
            >
              <a-col :span="24">
                <a-row :gutter="[24, 0]">
                  <!-- <a-col :span="24" display="flex">
            <strong>{{ "Thông tin chuyển khoản tạm ứng" }}</strong>
          </a-col> -->
                  <a-col :span="12">
                    <a-form-item
                      label="Chọn thành viên"
                      :label-col="{ span: 24 }"
                      :wrapper-col="{ span: 12 }"
                      name="plan_required_user"
                      width="100%"
                    >
                      <o-select
                        ref="plan_required_user"
                        v-model:value="form.plan_required_user"
                        @input="onChangeUser"
                        :placeholder="'Chọn thành viên'"
                        entity="plan-users"
                        :title="fields.user_process_id.label"
                        :icon="'environment'"
                        :isDisplay="'none'"
                        :isDisplayAdd="'none'"
                        textField="user_name"
                        valueField="id"
                        :filters="[
                          {
                            field: 'planId',
                            operator: 'equal',
                            value: props.form.id ? props.form.id : null,
                          },
                        ]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-form>

            <a-col :span="24">
              <a-table :columns="columnStaff" :dataSource="dataStaff">
              </a-table>
            </a-col>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </a-col>
  <a-col>
    <a-modal
      v-model:visible="showModalVofficeLogin"
      title="Thông tin đăng nhập"
      @ok="vofficeLogin"
      :okText="'Đăng nhập'"
      :cancelText="'Đóng'"
      :ok-button-props="{}"
      :cancel-button-props="{}"
    >
      <div>
        <a-form
          ref="vofficeLoginRef"
          :model="state"
          :rules="rulesVofficeLogin"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="Tên đăng nhập Voffice" name="username">
            <a-input v-model:value="state.username" size="large" />
          </a-form-item>
          <a-form-item label="Mật khẩu Voffice" name="password">
            <a-input-password v-model:value="state.password" size="large" />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <!-- <a-button
              @click="vofficeLogin"
              style="background-color: #137adb; color: white"
              >Đăng nhập</a-button
            > -->
            <!-- <a-button
              @click="vofficeLogin"
              style="background-color: #137adb; color: white"
              >Đăng nhập</a-button
            > -->
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </a-col>
  <div>
    <!-- <a-button type="primary" @click="showSignModal">Open Modal</a-button> -->
    <a-modal
      v-model:visible="isShowSignModal"
      title="Trình ký kế hoạch công tác"
      :destroyOnClose="true"
      :closable="true"
      :cancel-text="$t('common.back')"
      :bodyStyle="bodyStyleModal"
      :width="'100%'"
      centered
      :wrapClassName="wrapClassName"
      target="current_tab"
      ref="modal"
    >
      <AdvanceRequestSign
        :form="{
          ...state,
          plan: { id: props.form.id },
          plan_cost: props.form.plan_cost ? props.form.plan_cost : null,
          advance_request_sign_pdf_data: planAdvanceRequestSignPdfData,
          process_pdf_data: planProcessPdfData,
        }"
        @hideModal="closeSignModal"
      >
      </AdvanceRequestSign>
    </a-modal>
  </div>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      v-if="true"
      @click="saveForm"
      size="middle"
      style="background-color: #137adb; color: white"
    >
      <SaveOutlined />{{ t("order.attribute.save") }}
    </a-button>
    <a-button
      v-if="true"
      @click="handleSaveAndSign"
      size="middle"
      style="background-color: #137adb; color: white"
      >{{ "Lưu và trình kí " }}
      <DoubleRightOutlined />
    </a-button>
    <a-button v-if="true" class="prev" @click="cancelForm" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import i18n from "@/lang";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { formatDate, getImage, formatNumber, formatTime } from "@/utility";
import Utility from "@/utility";
import { formatDateTimeVN } from "@/mixins";
import html2pdf from "html2pdf.js";
import ColumnConfig from "@/config/columns";
import PrintConfig from "@/config/prints";
import moment from "moment/moment";
import UserStore from "@/store/modules/user";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import Constant from "@/constant";
import PlanUserService from "@/services/PlanUserService";
import UserService from "@/services/UserService";
import { vOfficeLogin } from "@/hooks/voffice";
import { message, Modal } from "ant-design-vue";
import { useSaveMutation as saveMutationPlanRequired } from "@/hooks/plan_required";
import { generateFields, generateRules, generateFormData } from "@/formUtility";
import Model from "@/config/models";
import { generateData } from "@/common/generateData";
import { useGetList as getListPlanRequired } from "@/hooks/plan_required";
import { useGetList as getListPlanRequiredUser } from "@/hooks/plan_required_user";
import AdvanceRequestSign from "../Modal/AdvanceRequestSign.vue";
import { uploadFileMutation } from "@/hooks/voffice";
import { useGetList as getPlanRouteUser } from "@/hooks/plan_route_user";
import { useGetList as getPlanRequire } from "@/hooks/plan_required";
import { useGetInfoData as getPlanAllData } from "@/hooks/plan";
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
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
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
const wrapClassName = ref<string>("full-form");
const rulesPlanRequired = ref<any>(generateRules("planRequired") || {});
const Models = ref<any>(Model);
const modelsConfig = ref<any>(Models.value["planRequired"]);
const dataResponse = ref<any>({});

const form = ref<any>({
  code: props.form.code,
  plan_base: props.form.code,
  type: props.form.type,
  department_require: props.form.department_require,
  plan: { id: props.form.id },
  name: props.form.code
    ? `Đề nghị chuyển khoản tạm ứng công tác phí cho kế hoạch số ${props.form.code}`
    : null,
});
// const formPlan = ref<any>(props.form.plan? props.form.plan: {})
const fields = ref<any>(props.fields);
const dataStaff = ref<any[]>([]);
const showModalVofficeLogin = ref<boolean>(false);
const isShowSignModal = ref<boolean>(false);
const activeKey = ref(["1", "2"]);
const mode = ref<any>("add");
const state = reactive({
  valueSearch: "",
  username: "",
  password: "",
});
const vofficeLoginRef = ref();
const formRequest = ref();
const userformRequest = ref();
const paramsPlanRequired = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const planRequiredId = ref<any>(null);
const paramsPlanRequiredUser = ref<any>({
  planRequiredId: planRequiredId.value ? planRequiredId.value : null,
});
const enabledGetListPlanRequired = computed(() => {
  return props.form.id !== null;
});

const enabledGetListPlanRequiredUser = computed(() => {
  return planRequiredId.value !== null;
});

const enableGetPlanInfo = computed(() => {
  return planInfoParams.value !== null;
});
const uploadFile = uploadFileMutation();
const planAdvanceRequestSignPdfData = ref<any>();
const planProcessPdfData = ref<any>();
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

const userMutationVOfficeLogin = vOfficeLogin();

const emit = defineEmits<{
  (e: "pevStep"): void;
  (e: "hideModal"): void;
}>();

const useSavePlanRequired = saveMutationPlanRequired();

const dataTablePlan = ref<any[]>([]);
const dataPlan = ref<any>({});
const planInfoParams = ref<any>({
  id: null,
});

const dulieu1 = ref<any[]>([]);
const planParams1 = ref<any>({});
const { isLoading: staffLoading1 } = getPlanRequire(planParams1, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: true,
  retry: false,
  onSuccess: async (val) => {
    dulieu1.value = val.data.content;
  },
});

const handleDownloadPayRequest = async () => {
  const { opt, content } = await downloadFilePdf(
    "planAdvanceRequestSign",
    {
      date_now: moment(),
      user_request: form.value.user_require
        ? form.value.user_require.fullName
        : "--",
      user_department: form.value.department_require
        ? form.value.department_require.name
        : "--",
      plan_code: form.value.code ? form.value.code : "--",
      description: form.value.description ? form.value.description : "--",
      pay_total: form.value.amount
        ? `${formatNumber(form.value.amount)}`
        : "--",
      total_letter: "--", // form.value.amount? Utility.methods.DocTienBangChu(form.value.amount): "--",
      day_now: `${formatDate(moment())}`.split("/")[0],
      month_now: `${formatDate(moment())}`.split("/")[1],
      year_now: `${formatDate(moment())}`.split("/")[2],
      table:
        dataStaff.value.length > 0
          ? dataStaff.value.map((item, index) => {
              return {
                ...item,
                STT: index + 1,
                user_department: item.department ? item.department.name : "--",
                description: form.value.description
                  ? form.value.description
                  : "--",
              };
            })
          : [],
    },
    {}
  );
  html2pdf().set(opt).from(content).toPdf().get("pdf").save();
};

//1

const handleDownloadTest = async () => {
  console.log(props.form, " check props.form.plan");
  const { opt, content } = await downloadFilePdf("planProcess", {
    table: props.form.plan_route_user
      ? props.form.plan_route_user.map((item, index) => {
          return {
            STT: index + 1,
            ...item,
          };
        })
      : [],
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
  });

  html2pdf().set(opt).from(content).toPdf().get("pdf").save();
};

//2
const handleDownloadTest1 = async () => {
  const { opt, content } = await downloadFilePdf("planAdvanceRequestSign", {
    table: dulieu1.value,
  });
  html2pdf().set(opt).from(content).toPdf().get("pdf").save();
};

const columnStaff = [
  {
    title: "Họ tên",
    dataIndex: "user_name",
    // width: "15%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    // width: "15%",
  },
  {
    title: "Người thụ hưởng",
    dataIndex: "user_extend",
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
    slot: { customRender: "amount" },
    // width: "15%",
  },
];
const cancelForm = () => {
  emit("pevStep");
};

const showSignModal = () => {
  isShowSignModal.value = true;
};

const closeSignModal = () => {
  isShowSignModal.value = false;
};

const saveForm = () => {
  // openModalVofficeLogin();
  formRequest.value
    .validate()
    .then(() => {
      let dataStaffNew = dataStaff.value[0];
      delete dataStaffNew.id;
      saveFormData(useSavePlanRequired, {
        id: props.form.id,
        data: { ...form.value, plan_required_user: dataStaffNew },
        mode: mode.value,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleSaveAndSign = async () => {
  planAdvanceRequestSignPdfData.value = await {
    date_now: moment(),
    user_request: form.value.user_require
      ? form.value.user_require.fullName
      : "--",
    user_department: form.value.department_require
      ? form.value.department_require.name
      : "--",
    plan_code: form.value.code ? form.value.code : "--",
    description: form.value.description ? form.value.description : "--",
    pay_total: form.value.amount ? `${formatNumber(form.value.amount)}` : "--",
    total_letter: "--", // form.value.amount? Utility.methods.DocTienBangChu(form.value.amount): "--",
    day_now: `${formatDate(moment())}`.split("/")[0],
    month_now: `${formatDate(moment())}`.split("/")[1],
    year_now: `${formatDate(moment())}`.split("/")[2],
    table:
      dataStaff.value.length > 0
        ? dataStaff.value.map((item, index) => {
            return {
              ...item,
              STT: index + 1,
              user_department: item.department ? item.department.name : "--",
              description: form.value.description
                ? form.value.description
                : "--",
            };
          })
        : [],
  };

  planProcessPdfData.value = await {
    table: props.form.plan_route_user
      ? props.form.plan_route_user.map((item, index) => {
          return {
            STT: index + 1,
            ...item,
          };
        })
      : [],
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
  };
  formRequest.value
    .validate()
    .then(() => {
      let dataStaffNew = dataStaff.value[0];
      delete dataStaffNew.id;
      saveFormData(
        useSavePlanRequired,
        {
          id: props.form.id,
          data: { ...form.value, plan_required_user: dataStaffNew },
          mode: mode.value,
        },
        true
      );
    })
    .catch((error) => {
      console.log(error);
    });

  // openModalVofficeLogin();
};

// const handleExportPlanProcess = async () => {
//   const prints = ref<any>(PrintConfig);
//   let template = prints.value["planProcess"] || {};
//   const response = await fetch(template.content);
//   const text = await response.text();
//   let content = text;
//   const data = {
//     description: "t",
//     name: "Vũ Công Sơn",
//     created_at: moment(),
//   };
//   template.fields.map((p) => {
//     switch (p.dataType) {
//       case "number":
//         content = content.replaceAll(
//           `##${p.dataIndex}##`,
//           formatNumber(data[p.dataIndex]) || ""
//         );

//         break;
//       case "datetime":
//         content = content.replaceAll(
//           `##${p.dataIndex}##`,
//           formatDateTimeVN(data[p.dataIndex]) || ""
//         );

//         break;
//       case "date":
//         content = content.replaceAll(
//           `##${p.dataIndex}##`,
//           formatDate(data[p.dataIndex])
//         );

//         break;
//       case "time":
//         content = content.replaceAll(
//           `##${p.dataIndex}##`,
//           formatTime(data[p.dataIndex])
//         );

//         break;
//       default:
//         content = content.replaceAll(`##${p.dataIndex}##`, data[p.dataIndex]);
//         break;
//     }
//   });

//   var worker = html2pdf().from(content).save();

//   // const parser = new DOMParser();
//   // const doc = parser.parseFromString(text, "text/html");
//   // return doc;
// };

const renderType = (type) => {
  const item = Constant.planType.find((i) => i.value == type);
  return item?.label;
};

const onChangeUser = async ($event) => {
  formRequest.value
    .validate()
    .then(async () => {
      if ($event) {
        form.value.plan_required_user = await {
          key: $event.value.key,
          id: $event.value.key,
        };
      }
      const res = await PlanUserService.detail($event.value.key);
      dataStaff.value = [
        {
          ...res.data,
          amount: form.value.amount,
          plan_user_id: { id: res.data.id },
        },
      ];
    })
    .catch((error) => {
      form.value.plan_required_user = {
        key: null,
        id: null,
      };
      console.log("error", error);
    });
};

const renderUser = async (id: any) => {
  const res = await UserService.detail(id);
  return res.data;
};

const openModalVofficeLogin = () => {
  showModalVofficeLogin.value = true;
};

const vofficeLogin = () => {
  vofficeLoginRef.value
    .validate()
    .then(async () => {
      userMutationVOfficeLogin
        .mutateAsync(state)
        .then(async (response) => {
          if (response.data.errorCode) {
            message.error(response.data.message || "Lỗi hệ thống");
          } else {
            message.success("Đăng nhập thành công");
            showModalVofficeLogin.value = false;
            showSignModal();
          }
        })
        .catch((error) => {
          message.error(error || "Lỗi hệ thống");
        });
    })
    .catch((error) => {
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
      message.success(t("common.save_success", {}));
      // emit("hideModal");
      if (sign && sign == true) {
        openModalVofficeLogin();
      }
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
    });
};

const { isLoading: planRequiredLoading } = getListPlanRequired(
  paramsPlanRequired,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: enabledGetListPlanRequired,
    retry: false,
    onSuccess: async (val) => {
      let response = val.data.content[0];
      if (response) {
        mode.value = "edit";
        form.value.description = response.description;
        planRequiredId.value = response.id;
      }
    },
  }
);

const { isLoading: planRequiredUserLoading } = getListPlanRequiredUser(
  paramsPlanRequiredUser,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: enabledGetListPlanRequiredUser,
    retry: false,
    onSuccess: async (val) => {
      let response = val.data.content[0];
      if (typeof response != undefined) {
        form.value.amount = response.amount;
        form.value.plan_required_user = {
          value: response.plan_user_id.id,
          label: response.plan_user_id.user_name,
          ...response.plan_user_id,
        };
        dataStaff.value = [
          { ...response.plan_user_id, amount: response.amount },
        ];
      }
    },
  }
);

onMounted(async () => {
  const res = await renderUser(props.form.ins_id);
  form.value.user_require = await res;
});
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
</style>
