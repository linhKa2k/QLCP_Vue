<template>
  <a-form
    ref="ruleFormSendSign"
    :rules="ruleFormSendSigns"
    :model="form"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 14 }"
    :layout="'horizontal'"
    labelAlign="left"
  >
    <a-row :gutter="24" class="form_padding">
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-card title="Thông tin trình ký" :bordered="false" size="small">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Trích yếu nội dung văn bản">
                    <span>{{ form.title ? form.title : "--" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Hình thức văn bản">
                    <span>{{
                      form.document_type ? form.document_type?.name : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Nội dung" name="description">
                    <span>{{
                      form.description ? form.description : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Độ khẩn">
                    <span>{{
                      form.priority_id ? formatPriority(form.priority_id) : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Ngành" name="domain">
                    <span>{{ form.domain ? form.domain.name : "--" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card title="Danh sách người ký" :bordered="false" size="small">
              <a-row :gutter="16">
                <a-col>{{ "Danh sách người ký duyệt :" }}</a-col>
                <a-col :span="18">
                  <span>{{ form.signner ? form.signner : "--" }}</span>
                </a-col>
              </a-row>

              <a-table
                :columns="signerColumns"
                :dataSource="dataSignner"
                :pagination="false"
              >
                <template #STT="{ index }">
                  {{ index + 1 }}
                </template>
                <template #display_name="{ record }">
                  {{ record.full_name ? record.full_name : "--" }}
                </template>
                <template #position="{ text, record }">
                  <span>{{ record.position }}</span>
                </template>

                <template #is_display="{ record }">
                  <a-form-item>
                    <a-checkbox v-model:checked="record.is_display" disabled />
                  </a-form-item>
                </template>
              </a-table>
              <a-col :span="24">
                <a-form-item>
                  <a-checkbox v-model:checked="form.isAutoPromulgate">{{
                    "Tự động ban hành"
                  }}</a-checkbox>
                </a-form-item>
              </a-col>
            </a-card>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-card title="Văn bản đính kèm" :bordered="false" size="small">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-table
                        :columns="attachDocFirtsColumn"
                        :dataSource="attachDocFirtsData"
                        :pagination="false"
                      >
                        <template #STT="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template #file_name="{ text, record }">
                          <a @click="downloadAndSaveFile(record)">{{ text }}</a>
                        </template>
                      </a-table>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card title="Văn bản phụ lục" :bordered="false" size="small">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-table
                        :columns="fileAppendixColumns"
                        :dataSource="dataFileAppendix"
                        :pagination="false"
                      >
                        <template #STT="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template #file_name="{ text, record }">
                          <a @click="downloadAndSaveFile(record)">{{ text }}</a>
                        </template>
                      </a-table>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-card title="Văn bản đính kèm" :bordered="false" size="small">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-table
                        :columns="attachDocSecondColumn"
                        :dataSource="attachDocSecondData"
                        :pagination="false"
                      >
                        <template #STT="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- <template #file_name="{ text, record }">
                            <a @click="downloadAndSaveFile(record)">{{
                              text
                            }}</a>
                          </template> -->
                        <template #file_name="{ text, record }">
                          <a-input
                            v-model:value="record.file_name"
                            placeholder="Số, ký hiệu văn bản"
                          />
                        </template>
                        <template #content="{ text, record }">
                          <a-input
                            v-model:value="record.content"
                            placeholder="Trích yếu nội dung văn bản"
                          />
                        </template>
                      </a-table>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button v-if="true" class="prev" @click="hidenModal" size="middle">
      <DoubleLeftOutlined />{{ "Đóng" }}
    </a-button>
  </a-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import i18n from "@/lang";
import VOfficeService from "@/services/VOfficeService";
import {
  uploadFileMutation,
  useGetListUser,
  useGetListUserRole,
  useGetListDocType,
  useGetListDomain,
} from "@/hooks/voffice";
import { PlusCircleTwoTone, DeleteOutlined } from "@ant-design/icons-vue";
import html2pdf from "html2pdf.js";
import {
  downloadFilePdf,
  downloadFile,
  downloadByUrl,
} from "@/common/pdfExportUtils";
// import { downloadFile } from "@/hooks/file";
import { SelectTypes } from "ant-design-vue/es/select";
import Constants from "@/constant";
import { sendAndSignVOfice } from "@/hooks/voffice";
import FileService from "@/services/FileService";
import {
  useDetail as getDocumentDetail,
  useGetList as getDocumentList,
} from "@/hooks/document";
import { message } from "ant-design-vue";
import { formatDate, getImage, formatNumber, formatTime } from "@/utility";
import moment from "moment/moment";
import {
  signStageType as signStageTypeEnum,
  pdfSignPosition,
} from "@/common/enumUtility";
const { t } = i18n.global;
interface Props {
  form: any;
  width: string;

  planId: any;
  type: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  planId: null,
  type: null,
});
console.log("run");
const form = ref<any>(Object.assign(props.form, { isAutoPromulgate: true }));
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
const signner_option = ref<any[]>([]);
const state = reactive({
  signner_option: [],
  role_option: [],
  fetching: false,
  signner_select: {},
});
const emit = defineEmits<{
  (e: "hideModal", data?: any): void;
  (e: "signSuccess", data?: any): void;
  (e: "sendSignSuccess"): void;
}>();

const dataSignner = ref<any[]>([]);
const dataFileAppendix = ref<any[]>([]);
const dataFileSign = ref<any[]>([]);
const optionsDocType = ref<any[]>([]);
const optionsDomain = ref<any[]>([]);
const ruleFormSendSign = ref();
const signVOfice = sendAndSignVOfice();
const btnLoading = ref<boolean>(false);

const getDocumentParams = ref<any>({
  planId: props.planId ? props.planId : null,
  "type.in": props.type ? props.type : null,
});

const enabledGetDocumentList = computed(
  () =>
    getDocumentParams.value.planId != null &&
    getDocumentParams.value["type.in"] != null
);
const attachDocFirtsColumn = [
  {
    title: "STT",
    dataIndex: "index",
    width: "20%",
    slots: { customRender: "STT" },
  },
  {
    title: "Tên file",
    dataIndex: "file_name",
    slots: { customRender: "file_name" },
  },
];
const attachDocFirtsData = ref<any[]>([]);
const attachDocSecondColumn = [
  {
    title: "STT",
    dataIndex: "index",
    width: "20%",
    slots: { customRender: "STT" },
  },
  {
    title: "Số, Ký hiệu văn bản",
    dataIndex: "file_name",
    slots: { customRender: "file_name" },
  },
  {
    title: "Trích yếu nội dung văn bản",
    dataIndex: "content",
    slots: { customRender: "content" },
  },
];
const attachDocSecondData = ref<any[]>([]);

const formatPriority = (value: any) => {
  const res = Constants.priorityIdType.find((item) => item.value == value);
  return res?.label;
};

const userParams = ref<any>({
  keyword: null,
  ...props.form.login,
});

const planParams = ref<any>({
  planId: props.form.plan ? props.form.plan.id : null,
});

const userRoleParams = ref<any>({
  keyword: null,
  ...props.form.login,
});
const enabledGetListUser = computed(() => {
  return userParams.value.keyword !== null;
});

const enabledGetListUserRole = computed(() => {
  return userRoleParams.value.keyword !== null;
});

const enabledGetDocumentDetail = computed(() => {
  return planParams.value.planId !== null;
});
const dataAppendix = ref<any>({});
const changeSignner = ($event) => {
  let data = signner_option.value.find(
    (item: any) => item.employee_id == $event
  );
  state.signner_select = data;
};
const changeUserRole = async (event: any, record: any) => {
  let res: any =
    (await state.role_option.find((i: any) => i.org_id == event)) || {};

  record.departmentSignId = event;
  record.sysUserId = res.sys_user_id;
  state.role_option = [];
};
const changeShowSignKey = (event: any, record: any) => {
  switch (event) {
    case true:
      record.isDisplay = 1;
      break;
    default:
      record.isDisplay = 0;
      break;
  }
};

const ruleFormSendSigns = ref<any>({
  title: {
    required: true,
    message: "Vui lòng nhập trích yếu nội dung văn bản",
  },
  docType: [
    {
      required: true,
      message: "Vui lòng chọn hình thức văn bản",
    },
  ],
});

const focusUserRole = (record) => {
  userRoleParams.value.keyword = record.employee_id;
};

const handleSearchUserSign = (val: any) => {
  userParams.value.keyword = val;
};

const fileAppendixColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "20%",
    // render: (text, record, index) => index,
    slots: { customRender: "STT" },
  },
  {
    title: "Tên file",
    dataIndex: "file_name",
    slots: { customRender: "file_name" },
  },
];

const signerColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "100px",
    slots: { customRender: "STT" },
  },
  {
    title: "Nhân viên",
    width: "250px",
    dataIndex: "display_name",
    slots: { customRender: "display_name" },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "250px",
  },
  {
    title: "Đơn vị - Chức vụ",
    dataIndex: "position",
    slots: { customRender: "position" },
    width: "450px",
  },
  {
    title: "Hiển thị chữ ký",
    width: "100px",
    dataIndex: "is_display",
    slots: { customRender: "is_display" },
  },
];

const hidenModal = () => {
  emit("hideModal");
};

const handleSign = () => {
  // planAppendixPdf();
  ruleFormSendSign.value
    .validate()
    .then(() => {
      let data = {
        // ...form.value,
        type: signStageTypeEnum.TRINH_KY_KET_THUC_CT,
        title: form.value.title,
        username: props.form.login.username,
        password: props.form.login.password,
        description: form.value.description,
        documentTypeId: form.value.documentTypeId,
        priorityId: form.value.priorityId,
        domainId: form.value.domainId,
        planId: form.value.plan.id,
        isAutoPromulgate: form.value.isAutoPromulgate,
        files: [
          ...dataFileAppendix.value.map((item) => {
            return item.file_id;
          }),
          ...dataFileSign.value.map((item) => {
            return item.file_id;
          }),
        ],
        usersSignDTOS: dataSignner.value,
      };

      signVOfice
        .mutateAsync(data)
        .then((response) => {
          if (!response.data.error && response.data.message == "OK") {
            message.success("Trình ký thành công");
            emit("sendSignSuccess");
          }
          if (response.data.error) {
            message.error(response.data.message || "Lỗi trình ký");
          }
          btnLoading.value = false;
        })
        .catch((error) => {
          console.log(error, " catch error trình ký vofice");
          btnLoading.value = false;
        });
    })
    .catch((error) => {
      console.log(error, "error_validate_client");
      btnLoading.value = false;
    });
};
const { isLoading: useGetListUserLoading } = useGetListUser(userParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 100,
  enabled: enabledGetListUser,
  retry: false,
  onSuccess: async (val) => {
    console.log(val, " check vallllllll user chose");
    if (val.data) {
      signner_option.value =
        val.data.data.length > 0
          ? val.data.data.map((item: any) => {
              return {
                label: item.display_name,
                value: item.employee_id,
                ...item,
              };
            })
          : [];
    }
  },
});
const { isLoading: useGetListUserRoleLoading } = useGetListUserRole(
  userRoleParams,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 100,
    enabled: enabledGetListUserRole,
    retry: false,
    onSuccess: async (val) => {
      if (val.data) {
        state.role_option =
          val.data.data.length > 0
            ? val.data.data.map((item: any) => {
                return {
                  label: `${item.org_name}-${item.position}`,
                  value: item.org_id,
                  ...item,
                };
              })
            : [];
      }
    },
  }
);

const { isLoading: getListDocTypeLoading } = useGetListDocType(
  { docType: true },
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 100,
    enabled: true,
    retry: false,
    onSuccess: async (val) => {
      if (val.data?.length > 0) {
        optionsDocType.value = await val.data.map((item) => {
          return { value: item.id, label: item.name, ...item };
        });
      }
    },
  }
);

const { isLoading: getListDomainLoading } = useGetListDomain(
  { domain: true },
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: true,
    retry: false,
    onSuccess: async (val) => {
      if (val.data?.length > 0) {
        optionsDomain.value = await val.data.map((item) => {
          return { value: item.id, label: item.name, ...item };
        });
      }
    },
  }
);

const downloadAndSaveFile = async (record: any) => {
  // downloadByUrl(record?.path);
  const res = await FileService.downloadFile(record.file_id);
  downloadFile(res.data, `${record.file_name}.pdf`);
};

const changeDocType = ($event: any) => {
  if ($event) {
    form.docType = optionsDocType.value.find((item: any) => item.id == $event);
    form.value.documentTypeId = $event;
  } else {
    form.docType = {
      id: null,
      key: null,
    };
    form.value.documentTypeId = null;
  }
};

const changeDomain = ($event: any) => {
  if ($event) {
    form.domain = optionsDomain.value.find((item: any) => item.id == $event);
    form.value.domainId = $event;
  } else {
    form.domain = {
      id: null,
      key: null,
    };
    form.value.domainId = null;
  }
};

const changeIsAutoPromulgate = ($event: any) => {
  if ($event) {
    form.value.isAutoPromulgate = 1;
  } else {
    form.value.isAutoPromulgate = 0;
  }
};

const { isLoading: getDocumentListLoading } = getDocumentList(
  getDocumentParams,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: enabledGetDocumentList,
    retry: false,
    onSuccess: (val) => {
      if (Array.isArray(val.data.content) && val.data.content.length > 0) {
        const res = val.data.content[0];
        dataSignner.value = res.document_user_list;
        form.value = {
          ...res,
          signner: res.document_user_list.map((i) => i.full_name).toString(),
        };
        if (
          Array.isArray(res.document_file_list) &&
          res.document_file_list.length > 0
        ) {
          res.document_file_list.forEach((file: any) => {
            if (
              file.position ==
                pdfSignPosition.PHU_LUC_CHI_PHI_KET_THUC_CONG_TAC ||
              file.position ==
                pdfSignPosition.DE_NGHI_CHI_HOAN_UNG
            ) {
              dataFileAppendix.value.push(file);
            } else if (
              file.position == pdfSignPosition.KE_HOACH_KET_THUC_CONG_TAC ||
              file.position == pdfSignPosition.GIAY_DE_NGHI_CHUYEN_KHOAN_KET_THUC_CONG_TAC
            ) {
              attachDocFirtsData.value.push(file);
            }
          });
        }
      }
    },
  }
);
onMounted(async () => {});
</script>
<style scoped lang="scss">
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

.form_padding {
  padding: 20px;
}

table.table_item {
  width: 100%;
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
