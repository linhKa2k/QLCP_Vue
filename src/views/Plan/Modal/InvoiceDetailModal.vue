<template>
  <a-form
    ref="formInvoice"
    :rules="rulesInvoice"
    :model="form"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    :layout="layout"
    labelAlign="left"
    class="form_padding"
  > 
    <a-row :gutter="[0, 16]">
      <a-col :span="24">
        <a-row :gutter="[24, 0]">
          <a-col :span="24">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Mẫu hóa đơn" name="type">
                  <span>{{ form.type ? form.type : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Kí hiệu" name="symbol">
                  <span>{{ form.symbol ? form.symbol : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Số hóa đơn" name="code">
                  <span>{{ form.code ? form.code : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Ngày hóa đơn" name="invoice_date">
                  <span>{{
                    form.invoice_date ? formatDate(form.invoice_date) : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Mã số thuế" name="tax_code">
                  <span>{{ form.tax_code ? form.tax_code : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Tên nhà cung cấp" name="provider">
                  <span>{{ form.provider ? form.provider : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Địa chỉ" name="address">
                  <span>{{ form.address ? form.address : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Loại thanh toán" name="payment_type">
                  <span>{{
                    form.payment_type
                      ? renderInvoicePaymentType(form.payment_type)
                      : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Link chứng từ gốc" name="invoice_file">
                  <template v-for="(item, index) in dataFileLink" :key="index">
                    <div>
                      <a @click="downloadFileInvoiceFile(item)">{{
                        item.file_name
                      }}</a>
                    </div>
                  </template>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-collapse v-model:activeKey="activeKey">
                  <a-collapse-panel
                    key="1"
                    :header="'Danh sách hàng hóa'"
                    :disabled="false"
                    style="font-weight: bold"
                  >
                    <a-col :span="24">
                      <a-table
                        :columns="inVoiceItemColumns"
                        :data-source="invoiceDataResource"
                        :pagination="false"
                      >
                        <template #index="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template #name="{ record }">
                          <span>{{ record.name ? record.name : "--" }}</span>
                        </template>
                        <template #cost="{ text, record }">
                          <span>{{ text ? text.name : "--" }}</span>
                        </template>
                        <template #amount="{ text }">
                          <span>{{ text ? formatCurrency(text) : "--" }}</span>
                        </template>
                        <template #vat="{ text }">
                          <span> {{ text ? renderVatType(text) : "--" }}</span>
                        </template>
                        <template #vat_amount="{ text }">
                          <span> {{ text ? formatCurrency(text) : "--" }}</span>
                        </template>
                        <template #fee_id="{ text }">
                          <span> {{ text ? formatCurrency(text) : "--" }}</span>
                        </template>

                        <template #action="{ index }">
                          <a-popconfirm
                            v-if="invoiceDataResource.length"
                            title="Chắc chắn xóa?"
                            :ok-text="'OK'"
                            :cancel-text="'Hủy'"
                            @confirm="onDelete(index)"
                          >
                            <a-button class="remove-item" type="text"
                              ><template #icon><DeleteOutlined /></template
                            ></a-button>
                          </a-popconfirm>
                        </template>
                        <template #footer>
                          <a-row :gutter="16">
                            <a-col :span="2">{{ "Tổng" }}</a-col>
                            <a-col :span="6"></a-col>
                            <a-col :span="3">{{
                              formatCurrency(totalFooter.total_amount)
                            }}</a-col>
                            <a-col :span="4"></a-col>
                            <a-col :span="3">{{
                              formatCurrency(totalFooter.total_vat_amount)
                            }}</a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="3">{{
                              formatCurrency(totalFooter.total_fee)
                            }}</a-col>
                          </a-row>
                        </template>
                      </a-table>
                    </a-col>
                  </a-collapse-panel>
                </a-collapse>
              </a-col>
              <a-col
                :span="24"
                style="
                  border-bottom: 1px solid rgb(227, 227, 227);
                  margin-top: 2%;
                "
              >
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="Tổng giá trị của hóa đơn"
                  name="total_final_amount"
                  :label-col="{ span: 12 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <span>
                    {{
                      totalFinalAmount ? formatCurrency(totalFinalAmount) : "--"
                    }}</span
                  >
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  name="is_distribute"
                  :label-col="{ span: 12 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-checkbox v-model:checked="form.is_distribute"
                    >Phân bổ chi phí</a-checkbox
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import Constant from "@/constant";
import Model from "@/config/models";
import { DeleteOutlined } from "@ant-design/icons-vue";
import xml2js from "xml2js";
import { useSaveMutation as saveMutationBill } from "@/hooks/invoice";
import FileService from "@/services/FileService";
import { generateFormData, generateRules } from "@/formUtility";
import { downloadFile } from "@/common/pdfExportUtils";
import { formatDate } from "@/mixins/utility";
import { formatCurrency } from "@/utility";

const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  // rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  // rules: {},
  fields: {},
});

const layout = ref<string>("horizontal");
const Models = ref<any>(Model);
const form = ref<any>(generateFormData(Models.value["invoice"]) || {});
const activeKey = ref<any>(["1"]);
const invoiceDataResource = ref<any[]>([]);
const rulesInvoice = ref<any>(generateRules("invoice") || {});
const formInvoice = ref();
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const fileList = ref<FileItem[]>([]);
const dataFileLink = ref<any[]>([]);

watch(
  () => props.form,
  (val: any) => {
    form.value = Object.assign(generateFormData(Models.value["invoice"]), val);
    if (Array.isArray(val?.invoice_items)) {
      invoiceDataResource.value = val?.invoice_items;
    }
    if (Array.isArray(val?.invoice_files)) {
      fileList.value = val?.invoice_files;
      dataFileLink.value = val?.invoice_files;
    }
  },
  { immediate: true }
);

const totalFooter = computed(() => {
  return {
    total_amount: invoiceDataResource.value
      .map((item) => (item.amount ? parseInt(item.amount) : 0))
      .reduce((a, b) => a + b, 0),
    total_vat_amount: invoiceDataResource.value
      .map((item) => (item.vat_amount ? parseInt(item.vat_amount) : 0))
      .reduce((a, b) => a + b, 0),
    total_fee: invoiceDataResource.value
      .map((item) => (item.fee ? parseInt(item.fee) : 0))
      .reduce((a, b) => a + b, 0),
  };
});

const totalFinalAmount = computed(
  () =>
    totalFooter.value.total_amount +
    totalFooter.value.total_vat_amount +
    totalFooter.value.total_fee
);

const onDelete = (index) => {
  invoiceDataResource.value.splice(index, 1);
};

const downloadFileInvoiceFile = async (file: any) => {
  const res = await FileService.downloadFile(file.file_id);
  downloadFile(res.data, file.file_name);
};

const renderVatType = (event) => {
  let res = Constant.vatType.find((item) => item.value == event);
  return res?.label;
};

const renderInvoicePaymentType = (event) => {
  let res = Constant.invoicePaymentType.find((item) => item.value == event);
  return res?.label;
};

const inVoiceItemColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "5%",
    slots: { customRender: "index" },
  },
  {
    title: "Hàng hóa, dịch vụ",
    dataIndex: "name",
    width: "14%",
    slots: { customRender: "name" },
  },
  {
    title: "Loại chi phí",
    dataIndex: "cost",
    width: "14%",
    slots: { customRender: "cost" },
  },
  {
    title: "Tiền HH, DV",
    dataIndex: "amount",
    width: "14%",
    slots: { customRender: "amount" },
  },
  {
    title: "Thuế suất",
    dataIndex: "vat",
    width: "14%",
    slots: { customRender: "vat" },
  },
  {
    title: "Thuế GTGT",
    dataIndex: "vat_amount",
    width: "14%",
    slots: { customRender: "vat_amount" },
  },
  {
    title: "Phụ phí",
    dataIndex: "fee",
    width: "14%",
    slots: { customRender: "fee_id" },
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

.width_date {
  width: 100%;
}
</style>
