<template>
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
                  <a-form-item label="Trích yếu nội dung văn bản" name="title">
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
                      @focus="handleFocus"
                      @blur="handleBlur"
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
                    <a-select
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
                    >
                    </a-select>
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
                      style="background-color: #137adb; color: white"
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
                <template #position="{ text, record }">
                  <a-select
                    v-model:value="record.position_id"
                    show-search
                    placeholder="Chọn đơn vị - chức vụ"
                    style="width: 400px"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :options="state.role_option"
                    @change="changeUserRole($event, record)"
                    @focus="focusUserRole(record.employee_id)"
                  />
                </template>
                <template #show_sign_key="{ record }">
                  <a-form-item>
                    <a-checkbox
                      v-model:checked="record.show_sign_key"
                      :defaulValue="true"
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

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      v-if="true"
      @click="handleSign"
      size="middle"
      style="background-color: #137adb; color: white"
    >
      <SaveOutlined />{{ t("Trình ký") }}
    </a-button>
    <a-button v-if="true" class="prev" @click="hidenModal" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
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
const form = ref<any>(props.form);
console.log(props.form, "check data props");

const role_option = ref<any[]>([]);
const signner_option = ref<any[]>([]);
const state = reactive({
  signner_option: [],
  role_option: [],
  fetching: false,
  signner_select: {},
});
const formLogin = ref<any>({
  username: props.form.username,
  password: props.form.password,
});
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
const data = ref<any[]>([]);
const file_id = ref<any>();
const dataSignner = ref<any[]>([]);
const dataFileAppendix = ref<any[]>([]);
const dataFileSign = ref<any[]>([]);
const optionsDocType = ref<any[]>([]);
const optionsDomain = ref<any[]>([]);
const options = ref<SelectTypes["options"]>(Constants.priorityIdType);
let timeout: any;
let currentValue = "";
const ruleFormSendSign = ref();
const signVOfice = sendAndSignVOfice();
const value = ref<string | undefined>(undefined);
const changePriorityId = (value: any) => {
  form.priority = Constants.priorityIdType.find((item) => item.value == value);
  form.priorityId = value;
};
const handleBlur = () => {
  console.log("blur");
};
const handleFocus = () => {
  console.log("focus");
};
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const userParams = ref<any>({
  keyword: null,
  ...formLogin.value,
});

const planParams = ref<any>({
  plan: props.form.plan ? props.form.plan : null,
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

const enabledGetDocumentVOffice = computed(() => {
  return planParams.value.plan !== null;
});
// const getUserSignVOffice = useGetListUser();
const uploadFile = uploadFileMutation();
const dataAppendix = ref<any>({});
const changeSignner = ($event) => {
  let data = signner_option.value.find(
    (item: any) => item.employee_id == $event
  );
  state.signner_select = data;
};
const changeUserRole = (event: any, record: any) => {
  record.position_id = event;
};
const changeShowSignKey = (event: any, record: any) => {
  switch (event.target.checked) {
    case true:
      record.show_sign_key = 1;
      break;
    default:
      record.show_sign_key = 0;
      break;
  }
};
const checktem = (text, record, index) => {
  console.log(text, record, index, " logogogoggo");
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

const focusUserRole = ($event) => {
  userRoleParams.value.keyword = $event;
};

const handleSearchUserSign = (val: string) => {
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
    dataIndex: "employee_id",
    width: "50px",
    render: (text, record, index) => index,
  },
  {
    title: "Nhân viên",
    dataIndex: "display_name",
    width: "300px",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "250px",
  },
  {
    title: "Đơn vị - Chức vụ",
    dataIndex: "position",
    width: "200px",
    slots: { customRender: "position" },
  },
  {
    title: "Hiển thị chữ ký",
    width: "150px",
    dataIndex: "show_sign_key",
    slots: { customRender: "show_sign_key" },
  },
  {
    title: "Hành động",
    width: "100px",
    dataIndex: "action",
    slots: { customRender: "action" },
  },
];

const addSignnerTable = () => {
  if (
    !dataSignner.value.find(
      (item: any) => item.employee_id == state.signner_select.employee_id
    )
  ) {
    dataSignner.value.push(state.signner_select);
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

const handleSign = () => {
  // planAppendixPdf();
  console.log(form, " check form siggggg");
  ruleFormSendSign.value
    .validate()
    .then(() => {
      let data = {
        ...form.value,
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
          console.log(response, "res trình ký voffice");
        })
        .catch((error) => {
          console.log(error, " catch error trình ký vofice");
        });
    })
    .catch((error) => {
      console.log(error, "error_validate_client");
    });
};
const { isLoading: useGetListUserLoading } = useGetListUser(userParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetListUser,
  retry: false,
  onSuccess: async (val) => {
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
    staleTime: 10000,
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
    staleTime: 10000,
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

const uploadFilePdf = async (camelCasePdf: string, data: any, table: any) => {
  const { opt, content } = await downloadFilePdf(camelCasePdf, data);
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
        .mutateAsync(formData)
        .then((response) => {
          table.value.push(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
};
const planProcessPdf = async () => {
  const { opt, content } = await downloadFilePdf("planProcess", {});
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
        .mutateAsync(formData)
        .then((response) => {
          dataFileSign.value.push(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  // html2pdf()
  // .set(opt)
  // .from(content)
  // .toPdf()
  // .get("pdf").save()
};
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
  // console.log(record.file_id, " check record PDF");
  // file_id.value = record.file_id;
  const res = await FileService.downloadFile(record.file_id);
  downloadFile(res.data, record.file_name);
};

const changeDocType = ($event: any) => {
  if ($event) {
    form.docType = optionsDocType.value.find((item: any) => item.id == $event);
    form.documentTypeId = $event;
  } else {
    form.docType = {
      id: null,
      key: null,
    };
    form.documentTypeId = null;
  }
};

const changeDomain = ($event: any) => {
  if ($event) {
    form.domain = optionsDomain.value.find((item: any) => item.id == $event);
    form.domainId = $event;
  } else {
    form.domain = {
      id: null,
      key: null,
    };
    form.domainId = null;
  }
};

const renderCostType = (value: any) => {
  let item = Constants.planCostType.find((item: any) => item.value == value);
  return item?.label;
};
const generateDataAppendix = (data: any) => {
  if (!data) return [];
  let levelRoute = ref<any>([]);
  let levelCost = ref<any>([]);
  let levelUser = ref<any>([]);
  data.forEach((item: any) => {
    if (
      levelRoute.value.filter((i) => i.id == item.plan_route.id).length == 0
    ) {
      levelRoute.value.push({
        id: item.plan_route.id,
        content: item.plan_route.name,
      });
    }
    if (
      levelCost.value.filter(
        (i) => i.id == item.cost_id && i.route_id == item.plan_route.id
      ).length == 0
    ) {
      levelCost.value.push({
        id: item.cost_id,
        content: renderCostType(item.cost_id),
        route_id: item.plan_route.id,
      });
    }
    if (
      levelUser.value.filter(
        (i) =>
          i.id == item.user.id &&
          i.id == item.cost_id &&
          i.route_id == item.plan_route.id
      ).length == 0
    ) {
      levelUser.value.push({
        id: item.user.id,
        content: item.user.fullName,
        cost_id: item.cost_id,
        route_id: item.plan_route.id,
        quantity: item.quantity,
        limit_amount: item.limit_amount,
        estimated_amount: item.estimated_amount,
      });
    }
  });
  levelRoute.value.forEach((item) => {
    item.children = levelCost.value.filter((i) => i.route_id == item.id);
  });
  levelCost.value.forEach((item) => {
    item.children = levelUser.value.filter(
      (i) => item.id == i.cost_id && item.route_id == i.route_id
    );
  });
  dataAppendix.value.table = dataFlaten(levelRoute.value);
};


onMounted(async () => {
  await generateDataAppendix(props.form.plan_cost);
});
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
