<template>
  <a-form
    ref="ruleFormSendSign"
    :model="dataDetail"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
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
                  <a-form-item label="Trích yếu nội dung văn bản" name="title">
                    <span>
                      {{ form.title ? form.title : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Trạng thái trình ký" name="status">
                    <span>
                      {{
                        form.status
                          ? renderDocumentStatus(form.status)
                          : "Chờ phê duyệt"
                      }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Hình thức văn bản">
                    <span>
                      {{ form.document_type ? form.document_type.name : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Nội dung" name="description">
                    <span>
                      {{ form.description ? form.description : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Độ khẩn">
                    <span>
                      {{
                        form.priority_id
                          ? renderpriorityType(form.priority_id)
                          : "--"
                      }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Ngành">
                    <span>
                      {{ form.domain ? form.domain.name : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card title="Danh sách người ký" :bordered="false" size="small">
              <a-table
                :columns="signerColumns"
                :dataSource="dataSignner"
                :pagination="false"
                size="small"
              >
                <template #STT="{ index }">
                  <span>{{ index + 1 }}</span>
                </template>
                <template #display_name="{ record }">
                  <span>{{ record.full_name ? record.full_name : "--" }}</span>
                </template>
                <template #is_display="{ record }">
                  <a-form-item>
                    <a-checkbox v-model:checked="record.is_display" disabled />
                  </a-form-item>
                </template>
              </a-table>
              <a-col :span="24">
                <a-form-item>
                  <a-checkbox
                    v-model:checked="form.isAutoPromulgate"
                    disabled
                    >{{ "Tự động ban hành" }}</a-checkbox
                  >
                </a-form-item>
              </a-col>
            </a-card>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-card title="Văn bản trình ký" :bordered="false" size="small">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-table
                        :columns="fileColumns"
                        :dataSource="dataFileSign"
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
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
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
import { downloadFilePdf, downloadFile } from "@/common/pdfExportUtils";
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
import { pdfSignPosition } from "@/common/enumUtility";

const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
  transferRequestId: any;
  type: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
  transferRequestId: null,
  type: null,
});
console.log(props.form, "//check form");
const form = ref<any>({});
const propsForm = ref<any>(props.form);

const formLogin = ref<any>({
  username: props.form.username,
  password: props.form.password,
});
const emit = defineEmits<{
  (e: "hideModal", data?: any): void;
}>();
const dataDetail = ref<any>({});
const dataSignner = ref<any[]>([]);
const dataFileAppendix = ref<any[]>([]);
const dataFileSign = ref<any[]>([]);
const ruleFormSendSign = ref();
const getDocumentParams = ref<any>({
  transferRequestId: props.transferRequestId ? props.transferRequestId : null,
  "type.in": props.type ? props.type : null,
});

const enabledGetDocumentList = computed(
  () =>
    getDocumentParams.value.transferRequestId != null &&
    getDocumentParams.value["type.in"] != null
);

const enabledGetDocumentDetail = computed(() => {
  return props.transferRequestId !== null;
});

const userParams = ref<any>({
  keyword: null,
  ...formLogin.value,
});

const planParams = ref<any>({
  transferRequestId: props.form.plan ? props.form.plan.id : null,
});

const userRoleParams = ref<any>({
  keyword: null,
  ...formLogin.value,
});
const enabledGetListUser = computed(() => {
  return userParams.value.keyword !== null;
});

const enabledGetListUserRole = computed(() => {
  return userRoleParams.value.keyword !== null;
});

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

const fileColumns = [
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
    align: "center",
    dataIndex: "is_display",
    slots: { customRender: "is_display" },
  },
];

const { isLoading: useGetListUserRoleLoading } = useGetListUser(
  userRoleParams,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: enabledGetDocumentDetail,
    retry: false,
    onSuccess: async (val) => {
      console.log(val, " list user");
    },
  }
);

const { isLoading: getDocumentDetailLoading } = getDocumentDetail(
  props.transferRequestId,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled: enabledGetDocumentDetail,
    retry: false,
    onSuccess: async (val) => {
      if (val.data) {
        dataSignner.value = val.data?.document_user_list;
        dataDetail.value = val.data;
        if (val.data.document_file_list) {
          val.data.document_file_list.forEach((file) => {
            if (file.position == pdfSignPosition.UNC) {
              dataFileAppendix.value.push(file);
            } else {
              dataFileSign.value.push(file);
            }
          });
        }
      }
    },
  }
);

const downloadAndSaveFile = async (record: any) => {
  const res = await FileService.downloadFile(record.file_id);
  downloadFile(res.data, `${record.file_name}.pdf`);
};

const renderpriorityType = (value: any) => {
  let item = Constants.priorityIdType.find((item: any) => item.value == value);
  return item?.label;
};

const renderDocumentStatus = (value: any) => {
  let item = Constants.documentStatus.find((item: any) => item.value == value);
  return item?.label;
};

const { isLoading: getDocumentListLoading } = getDocumentList(
  getDocumentParams,
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: enabledGetDocumentList,
    retry: false,
    onSuccess: async (val) => {
      if (Array.isArray(val.data.content) && val.data.content.length > 0) {
        const res = await val.data.content[0];
        dataSignner.value = res.document_user_list;
        form.value = {
          ...props.form,
          ...res,
          signner: res.document_user_list.map((i) => i.full_name).toString(),
        };
        console.log(form.value, "form.value.signner");
        if (
          Array.isArray(res.document_file_list) &&
          res.document_file_list.length > 0
        ) {
          res.document_file_list.forEach((file: any) => {
            if (file.position == pdfSignPosition.DE_NGHI_CHUYEN_TIEN) {
              dataFileAppendix.value.push(file);
            } else {
              dataFileSign.value.push(file);
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
