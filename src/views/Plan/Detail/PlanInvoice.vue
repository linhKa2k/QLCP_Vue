<template>
  <a-col :span="24" align="right" display="flex" class="table-button">
    <a-button
      @click="handleAddInvoice"
      style="background-color: #ed1b2f; color: #fff"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      {{ "Thêm mới" }}
    </a-button>
  </a-col>
  <a-table
    :columns="planInvoiceColumn"
    :data-source="planInvoiceDataSource"
    :row-selection="{
      selectedRowKeys: state.selectedRowKeys,
      onChange: onSelectChange,
    }"
    bordered
    :scroll="{ x: 1500, y: 500 }"
    style="width: 100%"
    key="id"
    :pagination="pagination"
    :loading="getListInvoiceLoading"
    @change="handleTableChange"
  >
    <template #invoice_files="{ record }">
      <template v-if="record.invoice_files.length > 0">
        <template v-for="(item, index) in record.invoice_files" :key="index">
          <span>
            <a @click="dowloadFileInvoiceFile(item)">{{ item.file_name }}</a>
          </span>
        </template>
      </template>
    </template>
    <template #dateTimeVN="{ text }">
      <span>{{ text ? formatDateTimeVN(text) : "--" }}</span>
    </template>
    <template #date="{ text }">
      <span>{{ text ? formatDate(text) : "--" }}</span>
    </template>
    <template #VND="{ text }">
      <span>{{ text ? formatVND(text) : "--" }}</span>
    </template>
    <template #payment_type="{ text }">
      <span>{{ text ? renderInvoicePaymentType(text) : "--" }}</span>
    </template>
    <template #invoice_items="{ text }">
      <span> {{ text[0] ? text[0].name : " --" }}</span>
    </template>

    <template #action="{ record }">
      <a-row :gutter="16">
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.detail") }} </span>
          </template>
          <EyeOutlined
            :style="{ color: '#3f51b5', marginRight: '8px' }"
            @click="onDetail(record)"
          />
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.edit") }} </span>
          </template>
          <EditOutlined
            :style="{ color: '#3f51b5', marginRight: '8px' }"
            @click="onEdit(record)"
          />
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span>{{ $t("common.delete") }}</span>
          </template>
          <DeleteOutlined
            :style="{ color: '#ee6e73', marginRight: '8px' }"
            @click="onDelete(record)"
          />
        </a-tooltip>
        <!-- <a-col @click="onDelete(record)"><a>Xóa</a></a-col> -->
      </a-row>
    </template>
  </a-table>

  <a-modal
    v-model:visible="isShowCreateModal"
    title="Thêm mới hóa đơn"
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
    <!-- <a-spin :spinning="getDetailInvoiceLoading"> -->
    <InvoiceFormModal
      @hideModal="hidenInvoiceFormModal"
      :form="{
        plan: { id: props.form.id },
        payment_type: invoicePaymentRequestType.HOAN_UNG,
      }"
    />
    <!-- </a-spin> -->
  </a-modal>
  <a-modal
    v-model:visible="isShowUpdateModal"
    title="Sửa hóa đơn"
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
    <!-- <a-spin :spinning="getDetailInvoiceLoading"> -->
    <InvoiceFormModal
      @hideModal="hidenInvoiceFormModal"
      :form="{ ...formData, plan: { id: props.form.id } }"
    />
    <!-- </a-spin> -->
  </a-modal>
  <a-modal
    v-model:visible="isShowDetailModal"
    title="Chi tiết hóa đơn"
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
    <!-- <a-spin :spinning="getDetailInvoiceLoading"> --> 
    <InvoiceDetailModal :form="formData" />
    <!-- </a-spin> -->
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import i18n from "@/lang";
import { useDetail } from "@/hooks/plan";
import Constant from "@/constant";
import Model from "@/config/models";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import InvoiceFormModal from "../Modal/InvoiceFormModal.vue";
import InvoiceDetailModal from "../Modal/InvoiceDetailModal.vue";
import {
  useGetList as useGetListInvoice,
  useDeleteMutation as useDeleteMutationInvoice,
  useDetail as useGetDetailInvoice,
} from "@/hooks/invoice";
import InvoiceService from "@/services/InvoiceService";
import FileService from "@/services/FileService";
import { downloadByUrl, downloadFile } from "@/common/pdfExportUtils";
import { message, Modal } from "ant-design-vue";
import { useQueryClient } from "vue-query";
import { formatDateTimeVN } from "@/mixins.js";
import { formatDate } from "@/utility";
import { useStore } from "vuex";
import camelCase from "lodash/camelCase";
import { invoicePaymentRequestType } from "@/common/enumUtility";
import payment_request from "@/store/modules/payment_request";
interface InvoicePagination {
  total: any;
  current: any;
  pageSize: any;
}

type paramsPage = {
  pageSize: number;
  pageIndex: number;
  [key: string]: any;
};

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
const queryClient = useQueryClient();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const Models = ref<any>(Model);
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
const plan_id = ref<any>(props.form.id ? props.form.id : null);
const isShowCreateModal = ref<boolean>(false);
const isShowUpdateModal = ref<boolean>(false);
const isShowDetailModal = ref<boolean>(false);
const invoiceTableLoading = ref<boolean>(false);
const modelsConfig = ref<any>(Models.value["plan"]);
const fields = ref<any>(Models.value["plan"] || {});
const formData = ref<any>({});
const params = ref<paramsPage>({
  pageSize: 100,
  pageIndex: 0,
  planId: props.form?.id ? props.form.id : null,
});
const state = reactive<{
  selectedRowKeys: any[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
}); 
const itemId = ref<any>();
const dataDetail = ref<any>({});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const enabledGetDetailInvoice = computed(() => itemId.value != null);
const onSelectChange = (selectedRowKeys: any[]) => {
  state.selectedRowKeys = selectedRowKeys;
};
const planInvoiceDataSource = ref<any[]>([]);
const InvoicePagination = ref<any>({});
const useDeleteInvoice = useDeleteMutationInvoice();
const store = useStore();
const service = computed(() => store.state[camelCase("planInvoice")].service);
// console.log(service.value, "check servie");
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

const formatVND = (value) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const renderInvoicePaymentType = (value) => {
  const res = Constant.invoicePaymentType.find((item) => item.value == value);
  return res?.label;
};

const handleTableChange = async (
  pagination: any
  // filters: TableStateFilters,
  // sorter: any
) => {
  // await queryClient.invalidateQueries("invoice");
  params.value = {
    pageSize: pagination?.pageSize,
    pageIndex: pagination?.current - 1,
  };
};

const pagination = computed(() => ({
  total: InvoicePagination.value ? InvoicePagination.value.total : 0,
  pageSize: InvoicePagination.value ? InvoicePagination.value.pageSize : 0,
}));

const onDelete = (record: any) => {
  Modal.confirm({
    title:
      "Bạn chắc chắn muốn xoá bản ghi " + (record.code || record.reg_no) + "?",
    content: "",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk  () {
      useDeleteInvoice
        .mutateAsync(record.id)
        .then((response) => {
          message.success(
            "Xóa thành công bản ghi" + (record.code || record.reg_no)
          );
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
    },
    onCancel() {},
  });
};

const handleAddInvoice = async () => {
  isShowCreateModal.value = true;
  console.log("handle add");
};

const hidenInvoiceFormModal = () => {
  isShowCreateModal.value = false;
  isShowUpdateModal.value = false;
};

const onEdit = (record) => {
  // itemId.value = record.id;
  // isShowUpdateModal.value = true;
  console.log(record, " select id");
  invoiceTableLoading.value = true;
  service.value
    .detail(record.id)
    .then(async (response) => {
      formData.value = await response.data;
      isShowUpdateModal.value = true;
      invoiceTableLoading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
};

const onDetail = (record) => {
  invoiceTableLoading.value = true;
  service.value
    .detail(record.id)
    .then(async (response) => {
      formData.value = await response.data;
      isShowDetailModal.value = true;
      invoiceTableLoading.value = false;
    })
    .catch((error) => {
      console.log(error);
    }); 
};

const dowloadFileInvoiceFile = async (file: any) => {
  // downloadByUrl(file?.path);
  const res = await FileService.downloadFile(file.file_id);
  downloadFile(res.data, file.file_name);
};

const { isLoading: getListInvoiceLoading, data: getListInvoiceData } =
  useGetListInvoice(params, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
    onSuccess: async (val) => {
      const res = await val.data;
      InvoicePagination.value = {
        total: res.totalElements,
        pageSize: res.size,
      };
      planInvoiceDataSource.value = res.content;
    },
  });
const { isLoading: getDetailInvoiceLoading, data: getDetailInvoiceData } =
  useGetDetailInvoice(itemId, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: enabledGetDetailInvoice,
    retry: false,
    onSuccess: async (val) => {
      formData.value = val.data;
    },
  });
const planInvoiceColumn = [
  {
    title: "Mẫu số",
    dataIndex: "type",
    width: 100,
    fixed: "left",
    slots: { customRender: "type" },
  },
  {
    title: "kí hiệu",
    dataIndex: "symbol",
    width: 170,
    key: "symbol",
  },
  {
    title: "Số hóa đơn",
    dataIndex: "code",
    width: 170,
    key: "code",
  },
  {
    title: "Đơn vị",
    dataIndex: "m4",
    width: 170,
    key: "m4",
  },
  {
    title: "Ngày HĐ",
    dataIndex: "invoice_date",
    width: 170,
    key: "invoice_date",
    slots: { customRender: "date" },
  },
  {
    title: "Mã số thuế",
    dataIndex: "tax_code",
    width: 170,
    key: "tax_code",
  },
  {
    title: "Nhà cung cấp",
    dataIndex: "provider",
    width: 270,
    key: "provider",
  },
  {
    title: "Loại thanh toán",
    dataIndex: "payment_type",
    width: 170,
    slots: { customRender: "payment_type" },
  },
  {
    title: "Tên HH,DV",
    dataIndex: "invoice_items",
    width: 170,
    slots: { customRender: "invoice_items" },
  },
  {
    title: "Tiền HH,DV",
    dataIndex: "total_amount",
    width: 170,
    slots: { customRender: "VND" },
  },
  {
    title: "Thuế GTGT",
    dataIndex: "total_vat_amount",
    width: 170,
    slots: { customRender: "VND" },
  },
  {
    title: "Phụ phí",
    dataIndex: "total_fee",
    width: 170,
    slots: { customRender: "VND" },
  },
  {
    title: "Tổng tiền",
    dataIndex: "total_final_amount",
    width: 170,
    slots: { customRender: "VND" },
  },

  {
    title: "Ngày cập nhật",
    dataIndex: "upd_date",
    width: 170,
    slots: { customRender: "dateTimeVN" },
  },
  {
    title: "Mã NV",
    dataIndex: "m16",
    width: 170,
  },
  {
    title: "Link chứng từ gốc",
    dataIndex: "invoice_files",
    width: 300,
    slots: { customRender: "invoice_files" },
    ellipsis: true,
  },
  {
    title: "Thao tác",
    key: "action",  
    fixed: "right",
    width: 150,
    slots: { customRender: "action" },
  },
];
</script>
<style scoped lang="scss">
.width_item {
  width: 100%;
}

.form_padding {
  padding: 20px;
  background-color: white;
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

.table-button {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
