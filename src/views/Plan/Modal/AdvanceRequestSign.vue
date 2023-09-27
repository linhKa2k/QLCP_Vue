<template>
  <a-spin :spinning="uploadLoading">
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
                        :filterOption="false"
                        @search="onSearchDocType($event)"
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
                        placeholder="Độ khẩn"
                        style="width: 100%"
                        :options="optionsPriority"
                        :showSearch="false"
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
                        @search="onSearchDomain"
                        :not-found-content="state.fetching ? undefined : null"
                        :showSearch="true"
                        :filterOption="false"
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
                  bordered
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
                        v-model:checked="record.is_display"
                        :value="
                          record.is_display == isDisplaySign.HIEN_THI_CHU_KY
                            ? isDisplaySign.HIEN_THI_CHU_KY
                            : isDisplaySign.KHONG_HIEN_THI_CHU_KY
                        "
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
                    title="Văn bản trình ký"
                    :bordered="false"
                    size="small"
                  >
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
import { downloadFilePdf, downloadFile } from "@/common/pdfExportUtils";
// import { downloadFile } from "@/hooks/file";
import { SelectTypes } from "ant-design-vue/es/select";
import Constants from "@/constant";
import { sendAndSignVOfice } from "@/hooks/voffice";
import FileService from "@/services/FileService";
import { useDetail as getDocumentDetail } from "@/hooks/document";
import { message } from "ant-design-vue";
import { planSignType } from "@/common/enumUtility";
import { pdfSignPosition } from "@/common/enumUtility";
import { downloadByUrl } from "@/common/pdfExportUtils";
const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
  uploadLoading: boolean;
  isSummaryRequest: boolean;
  newTransferId: number;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
  uploadLoading: false,
  isSummaryRequest: false,
});
const form = ref<any>(Object.assign(props.form, { isAutoPromulgate: true }));
const state = reactive({
  signner_option: [],
  role_option: [],
  fetching: false,
  signner_select: {},
  doc_type_options: [],
  domain_options: [],
});
const formLogin = ref<any>({
  username: props.form.username,
  password: props.form.password,
});
const emit = defineEmits<{
  (e: "hideModal", data?: any): void;
  (e: "sendSignSuccess"): void;
}>();

const dataSignner = ref<any[]>([]);
const dataFileSign = computed(() => {
  let result: any = [];
  if (props.form.filePdf.length > 0) {
    props.form.filePdf.map((item: any) => {
      if (
        item.position == pdfSignPosition.DE_NGHI_TAM_UNG ||
        item.position == pdfSignPosition.KE_HOACH_CONG_TAC ||
        item.position == pdfSignPosition.UNC ||
        item.position ==
          pdfSignPosition.DE_NGHI_CHUYEN_KHOAN_DO_SAI_THONG_TIN_TAI_KHOAN
      ) {
        result.push(item);
      }
    });
  }
  return result;
});

const dataFileAppendix = computed(() => {
  let result: any = [];
  if (props.form.filePdf.length > 0) {
    props.form.filePdf.map((item: any) => {
      if (
        item.position !== pdfSignPosition.DE_NGHI_TAM_UNG &&
        item.position !== pdfSignPosition.KE_HOACH_CONG_TAC &&
        item.position !== pdfSignPosition.UNC &&
        item.position !==
          pdfSignPosition.DE_NGHI_CHUYEN_KHOAN_DO_SAI_THONG_TIN_TAI_KHOAN
      ) {
        result.push(item);
      }
    });
  }
  return result;
});
const optionsDocType = ref<any[]>([]);
const optionsDomain = ref<any[]>([]);
const optionsPriority = ref<any[]>(Constants.priorityIdType);
let timeout: any;
let currentValue = "";
const ruleFormSendSign = ref();
const signVOfice = sendAndSignVOfice();
const value = ref<string | undefined>(undefined);
const btnLoading = ref<boolean>(false);
const filePdfDefaults = ref<any[]>([]);
const changePriorityId = (value: any) => {
  form.priority = Constants.priorityIdType.find((item) => item.value == value);
  form.value.priorityId = value;
};
const enum isDisplaySign {
  HIEN_THI_CHU_KY = 1,
  KHONG_HIEN_THI_CHU_KY = 0,
}

const userParams = ref<any>({
  keyword: null,
  ...formLogin.value,
});

const planParams = ref<any>({
  planId: props.form.plan ? props.form.plan.id : null,
});

const userRoleParams = ref<any>({
  keyword: null,
  ...formLogin.value,
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

const onSearchDomain = async ($event) => {
  state.fetching = true;
  const res = await state.domain_options.filter((item: any) => {
    return item.name.toLowerCase().search($event.toLowerCase()) !== -1;
  });
  optionsDomain.value = res;
  state.fetching = false;
};

const onSearchDocType = async ($event: any) => {
  const res = await state.doc_type_options.filter((item: any) => {
    return item.name.toLowerCase().search($event.toLowerCase()) !== -1;
  });
  optionsDocType.value = res;
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
    width: 50,
    slots: { customRender: "STT" },
  },
  {
    title: "Nhân viên",
    dataIndex: "display_name",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 150,
  },
  {
    title: "Đơn vị - Chức vụ",
    dataIndex: "position",
    width: 300,
    slots: { customRender: "position" },
  },
  {
    title: "Hiển thị chữ ký",
    dataIndex: "show_sign_key",
    align: "center",
    width: 200,
    slots: { customRender: "show_sign_key" },
  },
  {
    title: "Hành động",
    dataIndex: "action",
    align: "center",
    width: 50,
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

const validateSendSign = () => {
  if (dataSignner.value.length == 0) {
    throw "Vui lòng thêm người ký";
  } else {
    dataSignner.value.forEach((i) => {
      if (i.departmentSignId == null) {
        throw "Vui lòng chọn đầy đủ đơn vị - chức vụ người ký";
      }
    });
  }
};

const handleSign = () => {
  // planAppendixPdf();
  ruleFormSendSign.value
    .validate()
    .then(async () => {
      await validateSendSign();
      btnLoading.value = true;
      let data = props.isSummaryRequest
        ? {
            type: planSignType.transfer_stage,
            title: form.value.title,
            username: form.value.username,
            password: form.value.password,
            description: form.value.description,
            documentTypeId: form.value.documentTypeId,
            priorityId: form.value.priorityId,
            domainId: form.value.domainId,
            planId: props.newTransferId,
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
          }
        : {
            // ...form.value,
            type: planSignType.firts_stage,
            title: form.value.title,
            username: form.value.username,
            password: form.value.password,
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
            emit("hideModal", "done");
            emit("sendSignSuccess");

            btnLoading.value = false;
          }
          if (response.data.error) {
            message.error(response.data.message || "Lỗi trình ký");
          }
          btnLoading.value = false;
        })
        .catch((error) => {
          btnLoading.value = false;
          console.log(error, " catch error trình ký vofice");
        });
    })
    .catch((error) => {
      if (typeof error == "string") {
        message.error(error);
      }
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
        state.doc_type_options = await val.data.map((item) => {
          return { value: item.id, label: item.name, ...item };
        });
        optionsDocType.value = state.doc_type_options;
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
        state.domain_options = await val.data.map((item) => {
          return { value: item.id, label: item.name, ...item };
        });
        optionsDomain.value = state.domain_options;
      }
    },
  }
);

const dataFlaten = (data) => {
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

const downloadAndSaveFile = async (record: any) => {
  const res = await FileService.downloadFile(record.file_id);
  downloadFile(res.data, `${record.file_name}`);
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
