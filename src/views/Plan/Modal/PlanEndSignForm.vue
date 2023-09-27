<template>
  <a-spin :spinning="uploadLoading">
    <a-form
      ref="ruleFormSendSign"
      :rules="ruleFormSendSigns"
      :model="form"
      :label-col="{ span: 6 }"
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
                    <a-form-item
                      label="Trích yếu nội dung văn bản"
                      name="title"
                    >
                      <a-input
                        v-model:value="form.title"
                        placeholder="Trích yếu nội dung văn bản"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="Hình thức văn bản" name="docType">
                      <a-select
                        ref="docType"
                        v-model:value="form.docType"
                        placeholder="Hình thức văn bản"
                        style="width: 100%"
                        :options="optionsDocType"
                        @change="changeDocType"
                        :loading="getListDocTypeLoading"
                        :showSearch="true"
                        :filterOption="true"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="Nội dung" name="description">
                      <a-input
                        v-model:value="form.description"
                        placeholder="Nội dung"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="Độ khẩn" name="priorityId">
                      <a-select
                        v-model:value="form.priority"
                        show-search
                        placeholder="Độ khẩn"
                        style="width: 100%"
                        :options="options"
                        @change="changePriorityId"
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="Ngành" name="domain">
                      <a-select
                        ref="domain"
                        v-model:value="form.domain"
                        placeholder="Ngành"
                        style="width: 100%"
                        :options="optionsDomain"
                        @change="changeDomain"
                        :loading="getListDomainLoading"
                        :showSearch="true"
                        :filterOption="true"
                        :allowClear="true"
                        :autoClearSearchValue="true"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>
              <a-card title="Danh sách người ký" :bordered="false" size="small">
                <a-col :span="24">{{ "Danh sách người ký duyệt :" }}</a-col>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item
                      name="signner"
                      :label-col="{ span: 0 }"
                      :wrapper-col="{ span: 24 }"
                    >
                      <!-- <a-select
                        v-model:value="form.signner"
                        show-search
                        placeholder="Nhập tên"
                        style="width: 100%"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        :options="signner_option"
                        @Search="handleSearchUserSign"
                        @change="changeSignner"
                        @focus="handleSearchUserSign('')"
                      >
                      </a-select> -->
                      <o-select
                        v-model:value="form.signner"
                        @input="changeSignner($event)"
                        :placeholder="'Nhập tên'"
                        entity="voffice/users"
                        :isDisplay="'none'"
                        ref="signner"
                        :textField="['display_name']"
                        valueField="employee_id"
                        :searchField="'keyWord'"
                        :operatorFieldSearch="'equal'"
                        :filters="[
                          {
                            field: 'username',
                            operator: 'equal',
                            value: formLogin.username
                              ? formLogin.username
                              : null,
                          },
                          {
                            field: 'password',
                            operator: 'equal',
                            value: formLogin.password
                              ? formLogin.password
                              : null,
                          },
                        ]"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="2"
                    ><a-form-item
                      name="signner"
                      :label-col="{ span: 0 }"
                      :wrapper-col="{ span: 24 }"
                      class="button_custom_antd"
                    >
                      <a-button
                        @click="addSignnerTable"
                        style="background-color: #ed1b2f; color: white"
                      >
                        Thêm
                      </a-button>
                    </a-form-item>
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
                  <template #action="{ record }">
                    <a-popconfirm
                      v-if="dataSignner.length"
                      title="Chắc chắn xóa?"
                      :ok-text="'OK'"
                      :cancel-text="'Hủy'"
                      @confirm="onDelete(record.employee_id)"
                    >
                      <a-button class="remove-item" type="text"
                        ><template #icon><DeleteOutlined /></template
                      ></a-button>
                    </a-popconfirm>
                  </template>
                  <template #position="{ record }">
                    <o-select
                      style="width: 400px"
                      v-model:value="form.departmentRole"
                      @input="changeUserRole($event, record)"
                      :placeholder="'Chọn đơn vị - chức vụ'"
                      entity="voffice/users-role"
                      :isDisplay="'none'"
                      ref="users-role"
                      :textField="['position', 'org_name']"
                      valueField="org_id"
                      :filters="[
                        {
                          field: 'keyword',
                          operator: 'equal',
                          value: record?.employee_id
                            ? record?.employee_id
                            : null,
                        },
                        {
                          field: 'username',
                          operator: 'equal',
                          value: formLogin.username ? formLogin.username : null,
                        },
                        {
                          field: 'password',
                          operator: 'equal',
                          value: formLogin.password ? formLogin.password : null,
                        },
                      ]"
                    />
                  </template>
                  <template #show_sign_key="{ record }">
                    <a-form-item>
                      <a-checkbox
                        v-model:checked="record.show_sign_key"
                        :defaulValue="true"
                        @change="changeShowSignKey($event, record)"
                      />
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
                  <a-card
                    title="Văn bản đính kèm"
                    :bordered="false"
                    size="small"
                  >
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
                            <a @click="downloadAndSaveFile(record)">{{
                              text
                            }}</a>
                          </template>
                        </a-table>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-col>
                <a-col :span="12">
                  <a-card
                    title="Văn bản phụ lục"
                    :bordered="false"
                    size="small"
                  >
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
                            <a @click="downloadAndSaveFile(record)">{{
                              text
                            }}</a>
                          </template>
                        </a-table>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-card
                    title="Văn bản đính kèm"
                    :bordered="false"
                    size="small"
                  >
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
  </a-spin>
  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      v-if="true"
      @click="handleSign"
      size="middle"
      style="background-color: #ed1b2f; color: white"
      :loading="btnLoading || uploadLoading"
    >
      <SaveOutlined />{{ t("Trình ký") }}
    </a-button>
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
import { useDetail as getDocumentDetail } from "@/hooks/document";
import { message } from "ant-design-vue";
import { formatDate, getImage, formatNumber, formatTime } from "@/utility";
import moment from "moment/moment";
import {
  signStageType as signStageTypeEnum,
  pdfSignPosition as pdfPositionEnum,
} from "@/common/enumUtility";
const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
  uploadLoading: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
  uploadLoading: false,
});
const form = ref<any>(
  Object.assign(props.form, { isAutoPromulgate: true, description: null })
);

const state = reactive({
  signner_option: [],
  role_option: [],
  fetching: false,
  signner_select: {},
});
const formLogin = ref<any>({
  username: props.form?.login?.username,
  password: props.form?.login?.password,
});
const emit = defineEmits<{
  (e: "hideModal", data?: any): void;
  (e: "signSuccess", data?: any): void;
  (e: "sendSignSuccess"): void;
}>();
const dataSignner = ref<any[]>([]);
const dataFileAppendix = ref<any[]>(
  props.form.fileAppendix ? props.form.fileAppendix : []
);
const dataFileSign = ref<any[]>([]);
const optionsDocType = ref<any[]>([]);
const optionsDomain = ref<any[]>([]);
const options = ref<SelectTypes["options"]>(Constants.priorityIdType);
const ruleFormSendSign = ref();
const signVOfice = sendAndSignVOfice();
const btnLoading = ref<boolean>(false);
const enum isDisplaySign {
  HIEN_THI_CHU_KY = 1,
  KHONG_HIEN_THI_CHU_KY = 0,
}
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
const attachDocFirtsData = ref<any[]>(
  props.form.fileSign ? props.form.fileSign : []
);
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

const changePriorityId = (value: any) => {
  form.priority = Constants.priorityIdType.find((item) => item.value == value);
  form.value.priorityId = value;
};

const userParams = ref<any>({
  keyword: null,
  ...props.form.login,
});

const userRoleParams = ref<any>({
  keyword: null,
  ...props.form.login,
});

const changeSignner = ($event) => {
  if ($event.value) {
    let data = $event.value.options.find(
      (item: any) => item.employee_id == $event.value.key
    );
    form.value.signner = {
      ...data,
      id: $event.value.key,
      key: $event.value.key,
    };
    state.signner_select = data;
  } else {
    form.value.signner = {
      id: null,
      key: null,
    };
  }
};
const changeUserRole = async (event: any, record: any) => {
  if (event.value) {
    let data = event.value.options.find((i) => i.org_id == event.value.key);
    record.departmentSignId = event.value.key;
    record.sysUserId = data.sys_user_id;
    record.departmentRole = {
      ...data,
      id: event.value.key,
      key: event.value.key,
    };
  } else {
    record.departmentSignId = null;
    record.sysUserId = null;
    record.departmentRole = {
      id: null,
      key: null,
    };
  }
};
const changeShowSignKey = (event: any, record: any) => {
  switch (event) {
    case true:
      record.isDisplay = isDisplaySign.HIEN_THI_CHU_KY;
      break;
    default:
      record.isDisplay = isDisplaySign.KHONG_HIEN_THI_CHU_KY;
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
  priorityId: [
    {
      required: true,
      message: "Vui lòng chọn độ khẩn",
    },
  ],
  domain: [
    {
      required: true,
      message: "Vui lòng chọn ngành",
    },
  ],
  description: {
    required: true,
    message: "Vui lòng nhập nội dung",
  },
});

const fileAppendixColumns = [
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
    width: "350px",
    dataIndex: "display_name",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "300px",
  },
  {
    title: "Đơn vị - Chức vụ",
    dataIndex: "position",
    slots: { customRender: "position" },
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "150px",
    slots: { customRender: "action" },
  },
];

const addSignnerTable = () => {
  if (
    !dataSignner.value.find(
      (item: any) => item.employee_id == form?.value?.signner?.employee_id
    )
  ) {
    dataSignner.value.push({
      ...form?.value?.signner,
      fullName: form?.value?.signner?.display_name,
      isDisplay: isDisplaySign.KHONG_HIEN_THI_CHU_KY,
    });
  }
};

const onDelete = (key: string) => {
  dataSignner.value = dataSignner.value.filter(
    (item) => item.employee_id !== key
  );
};

const hidenModal = () => {
  emit("hideModal");
};

const validateSendSign = async (data) => {
  if (!Array.isArray(data) || data.length == 0) {
    throw "Vui lòng thêm người ký";
  }
  data.forEach((item) => {
    if (
      typeof item.departmentSignId == "undefined" ||
      item.departmentSignId == null
    ) {
      throw "Vui lòng chọn đơn vị - chức vụ người ký";
    }
  });
};

const handleSign = () => {
  // planAppendixPdf();
  ruleFormSendSign.value
    .validate()
    .then(async () => {
      try {
        await validateSendSign(dataSignner.value);
        btnLoading.value = true;
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
            ...attachDocFirtsData.value.map((item) => {
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
      } catch (error) {
        if (typeof error == "string") {
          message.error(error);
        }
        console.log(typeof error, "error");
      }
    })
    .catch((error) => {
      console.log(error, "error_validate_client");
      btnLoading.value = false;
    });
};

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
