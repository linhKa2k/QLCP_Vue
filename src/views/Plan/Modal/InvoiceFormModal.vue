<template>
  <a-form
    ref="formInvoice"
    :rules="invoiceRules"
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
              <a-col :span="24" style="text-align: right">
                <a-upload
                  :multiple="false"
                  :before-upload="beforeUploadFileImport"
                  :customRequest="customRequestFileImport"
                  @change="handleChangeFileAndSaveForm($event)"
                  v-model:file-list="fileListInfo"
                >
                  <a-button
                    style="
                      background-color: #ed1b2f;
                      color: #fff;
                      border-color: #ed1b2f;
                    "
                  >
                    <UploadOutlined />
                    {{ "Tải lên file XML" }}
                  </a-button>
                </a-upload>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Mẫu hóa đơn" name="type">
                  <a-input
                    v-model:value="form.type"
                    placeholder="Mẫu hóa đơn"
                    style="width: 100%"
                    :maxlength="100"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Kí hiệu" name="symbol">
                  <a-input v-model:value="form.symbol" placeholder="Kí hiệu" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Số hóa đơn" name="code">
                  <a-input v-model:value="form.code" placeholder="Số hóa đơn" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Ngày hóa đơn" name="invoice_date">
                  <a-date-picker
                    v-model:value="form.invoice_date"
                    format="DD/MM/YYYY"
                    :placeholder="'Ngày hóa đơn'"
                    class="width_date"
                    :allowClear="false"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Mã số thuế" name="tax_code">
                  <a-input
                    v-model:value="form.tax_code"
                    placeholder="Mã số thuế"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Tên nhà cung cấp" name="provider">
                  <a-input
                    v-model:value="form.provider"
                    placeholder="Tên nhà cung cấp"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Địa chỉ" name="address">
                  <a-input v-model:value="form.address" placeholder="Địa chỉ" />
                </a-form-item>
              </a-col> 
              <a-col :span="24">
                <a-form-item label="Loại thanh toán" name="payment_type">
                  <a-radio-group
                    v-model:value="form.payment_type"
                    @change="changePaymentType($event)"
                  >
                    <a-radio :value="1">{{ $t("Hoàn ứng") }}</a-radio>
                    <a-radio :value="2">{{
                      $t("Phải trả nhà cung cấp")
                    }}</a-radio>
                  </a-radio-group>
                </a-form-item>

                
              </a-col>
              <a-col :span="24">
                <a-form-item label="Link chứng từ gốc" name="invoice_file">
                  <a-upload
                    :multiple="true"
                    :customRequest="customRequest"
                    :before-upload="beforeUpload"
                    @change="handleChangeInvoiceFile($event)"
                    v-model:file-list="fileList"
                  >
                    <a-button
                      style="
                        background-color: #ed1b2f;
                        color: #111111;
                        border-color: #ed1b2f;
                      "
                    >
                      <UploadOutlined />
                      {{ "Tải lên chứng từ" }}
                    </a-button>
                  </a-upload>
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
                      <!-- <a-col :span="24" type="flex" align="right">
                        <a-form-item
                          name="is_fee"
                          :label-col="{ span: 0 }"
                          :wrapper-col="{ span: 24 }"
                          style="font-weight: normal !important"
                        >
                          <a-checkbox v-model:checked="form.is_fee"
                            >Có phụ phí</a-checkbox
                          >
                        </a-form-item>
                      </a-col> -->
                      <a-table
                        :columns="invoice_item_column"
                        :data-source="invoiceDataResource"
                        :pagination="false"
                      >
                        <template #index="{ index }">
                          {{ index + 1 }}
                        </template>
                        <template #name="{ record }">
                          <a-input
                            v-model:value="record.name"
                            placeholder="Hàng hóa , dịch vụ"
                          />
                        </template>
                        <template #cost_id="{ text, record }">
                          <!-- <a-input
                            v-model:value="record.cost_id"
                            placeholder="Loại chi phí"
                          />  -->
                          <o-select
                            v-model:value="record.cost"
                            @input="onChangeCost($event, record)"
                            :placeholder="'Loại chi phí'"
                            entity="costs"
                            :isDisplay="'none'"
                            :textField="'name'"
                            :valueField="'id'"
                            style="width: 170px"
                          />
                        </template>
                        <template #amount="{ record }">
                          <a-input-number
                            class="input-number"
                            v-model:value="record.amount"
                            placeholder="Tiền HH, DV"
                            :formatter="
                              (value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            "
                            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                            :min="0"
                          ></a-input-number>
                        </template>
                        <template #vat="{ record }">
                          <a-select
                            v-model:value="record.vat"
                            show-search
                            placeholder="Thuế suất"
                            style="width: 100%"
                            :options="optionsVat"
                            @change="handleChangeVat($event, record)"
                          >
                          </a-select>
                        </template>
                        <template #vat_amount="{ record }">
                          <a-input-number
                            v-model:value="record.vat_amount"
                            placeholder="Thuế GTGT"
                            :min="0"
                            :formatter="
                              (value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            "
                            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                            :disabled="record.vat_amount_disabled"
                          ></a-input-number>
                        </template>
                        <template #fee_id="{ record }">
                          <a-input-number
                            v-model:value="record.fee"
                            placeholder="Phụ phí"
                            :min="0"
                            :formatter="
                              (value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            "
                            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                          ></a-input-number>
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
                    <a-col :span="24">
                      <a-button
                        type="dashed"
                        style="width: 100%"
                        @click="addInvoiceItem"
                      >
                        <template #icon>
                          <PlusCircleTwoTone />
                        </template>
                        {{ "Thêm hàng hóa" }}</a-button
                      >
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
  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      v-if="true"
      @click="handleAddBill"
      size="middle"
      style="background-color: #ed1b2f; color: #fff"
      :loading="addLoading"
    >
      {{ t("Lưu") }}
    </a-button>
    <a-button v-if="true" class="prev" @click="hiddenModal" size="middle">
      <DoubleLeftOutlined />{{ "Đóng" }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import moment from "moment/moment";

import i18n from "@/lang";
import Constant from "@/constant";
import { message } from "ant-design-vue";
import Model from "@/config/models";
import {
  DeleteOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons-vue";
import xml2js from "xml2js";
import { useSaveMutation as saveMutationBill } from "@/hooks/invoice";
import FileService from "@/services/FileService";
import { SelectTypes } from "ant-design-vue/es/select";
import { generateFormData, generateRules } from "@/formUtility";
import { generateData } from "@/common/generateData";
import { formatCurrency } from "@/utility";
import { invoiceTypeCostItem } from "@/common/enumUtility";
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
const invoiceRules = ref<any>(generateRules("invoice") || {});
const modelsConfig = ref<any>(Models.value["invoice"]);
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
const handleSaveForm = saveMutationBill();
const formInvoice = ref();
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const addLoading = ref<boolean>(false);
const fileList = ref<FileItem[]>([]);
const fileListInfo = ref<FileItem[]>([]);
const dataFileXml = ref<any>({});
const dataFileLink = ref<any[]>([]);

const optionsVat = ref<SelectTypes["options"]>(Constant.vatType);

watch(
  () => props.form,
  (val: any) => {
    form.value = generateData(modelsConfig, val);
    if (Array.isArray(val?.invoice_items) && val?.invoice_items.length > 0) {
      invoiceDataResource.value = val?.invoice_items.map((item) => {
        delete item.id;
        return {
          ...item,
          cost: item.cost
            ? {
                id: item.cost.id,
                label: item.cost.name,
                value: item.cost.id,
              }
            : undefined,
        };
      });
    }
    if (Array.isArray(val?.invoice_files)) {
      fileList.value = val?.invoice_files.map((item) => {
        delete item.id;
        return {
          ...item,
          name: item.file_name,
        };
      });
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

const addInvoiceItem = () => {
  invoiceDataResource.value.push({});
};

const hiddenModal = () => {
  emit("hideModal");
};

const changePaymentType = (event: any) => {
  if (event) {
    form.value.payment_type = event.target.value;
  } else {
    form.value.payment_type = null;
  }
};

const onChangeCost = (event: any, record: any) => {
  if (event.value) {
    record.cost = {
      id: event.value.key,
      key: event.value.key,
    };
  } else {
    record.cost = {
      id: null,
      key: null,
    };
  }
};

const renderVatType = (event) => {
  let res = Constant.vatType.find((item) => item.label == event);
  if (typeof res?.label == "undefined") {
    return invoiceTypeCostItem["0%"];
  } else {
    return res?.value;
  }
};

const handleChangeVat = async (event, record) => {
  let data = Constant.vatType.find((item) => item.value == event);
  if (event == invoiceTypeCostItem.KHONG_THU_PHI) {
    record.vat_amount_disabled = true;
    record.vat_amount = 0;
  } else {
    record.vat_amount_disabled = false;
    record.vat = await event;
    record.vat_amount =
      (parseInt(data?.label || "0") * parseInt(record.amount || "0")) / 100;
  }
};

const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error(t("permission.xml.memory_file"));
  }
  return isLt5M;
};

const beforeUploadFileImport = (file) => {
  const isJpgOrPng = file.type === "text/xml";
  if (!isJpgOrPng) {
    message.error(t("permission.xml.file_type"));
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error(t("permission.xml.memory_file"));
  }
  return isJpgOrPng && isLt5M;
};

const customRequest = (options) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data);
    })
    .catch((err) => {
      onError(err);
    });
};

const customRequestFileImport = (options) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data);
    })
    .catch((err) => {
      onError(err);
    });
};

const handleChangeInvoiceFile = (info) => {
  const status = info.file.status;
  if (status !== "uploading") {
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded thành công.`);
    dataFileLink.value = info.fileList.map((item) => {
      return item.response;
    });
  } else if (status === "error") {
    message.error(`${info.file.name} file upload thất bại.`);
  }
  fileList.value = info.fileList.filter((item) => item.size / 1024 / 1024 < 5);
};

const handleChangeFileAndSaveForm = async (info) => {
  if (info.file.type == "text/xml" && info.fileList.length > 0) {
    var reader = new FileReader();
    let xml;
    await reader.addEventListener("load", function () {
      xml = reader.result;
      toJson(xml);
    });
    await reader.readAsText(info.file.originFileObj);
    fileListInfo.value = [info.file];
  } else {
    fileListInfo.value = [];
  }
};

async function toJson(xml: string) {
  xml2js.parseString(xml, { explicitArray: false }, function (error, result) {
    const arrKey = "DLHDon";
    const DLHDon = getObjectByKey(result, arrKey);
    if (typeof DLHDon == "undefined" || DLHDon == null) {
      message.error("file không đúng định dạng");
      fileListInfo.value = [];
      return;
    }
    const TTChung = DLHDon?.TTChung;
    const NDHDon = DLHDon?.NDHDon;
    const invoiceItem = NDHDon?.DSHHDVu?.HHDVu;

    var item: any[] = [];
    if (Array.isArray(invoiceItem)) {
      item = invoiceItem.map((i) => {
        console.log(parseInt(i.TSuat), "/parse");
        return {
          name: i?.THHDVu,
          amount: i?.ThTien,
          vat: renderVatType(i?.TSuat),
          vat_amount: mathVatAmount(i.ThTien, i.TSuat),
        };
      });
    } else {
      item = [
        {
          name: invoiceItem?.THHDVu,
          amount: invoiceItem?.ThTien,
          vat: renderVatType(invoiceItem?.TSuat),
          vat_amount: mathVatAmount(invoiceItem.ThTien, invoiceItem.TSuat),
        },
      ];
    }

    if (result) {
      form.value.type = TTChung ? TTChung.KHMSHDon : null;
      form.value.symbol = TTChung ? TTChung.KHHDon : null;
      form.value.code = TTChung ? TTChung.SHDon : null;
      form.value.invoice_date = TTChung ? moment(TTChung.NLap) : null;
      form.value.tax_code = NDHDon?.NBan ? NDHDon?.NBan?.MST : null;
      form.value.provider = NDHDon?.NBan ? NDHDon?.NBan?.Ten : null;
      form.value.address = NDHDon?.NBan ? NDHDon?.NBan?.DChi : null;
      invoiceDataResource.value = item;
    }
  });
}

const mathVatAmount = (thTien: any, tSuat: any) => {
  let amount = parseInt(thTien);
  let vatAmount = Number.isNaN(parseInt(tSuat))
    ? parseInt("0%")
    : parseInt(tSuat);
  return (amount * vatAmount) / 100;
};

const getObjectByKey = (data: any, k: any) => {
  let res: any;
  const getByKey = (obj, keyIn) => {
    for (let key in obj) {
      if (key == keyIn) {
        res = obj[key];
      }
      if (typeof obj[key] == "object") {
        getByKey(obj[key], keyIn);
      }
    }
  };
  getByKey(data, k);

  return res;
};

const handleAddBill = () => {
  addLoading.value = true;
  let data = {
    ...form.value,
    invoice_items: invoiceDataResource.value,
    invoice_files: dataFileLink.value,
    ...totalFooter.value,
    total_final_amount: totalFinalAmount.value,
    plan: props.form?.plan,
  };

  formInvoice.value
    .validate()
    .then(() => {
      if (Array.isArray(data.invoice_files) && data.invoice_files.length == 0) {
        throw "Vui lòng bổ sung file chứng từ";
      }
      if (Array.isArray(data.invoice_items) && data.invoice_items.length > 0) {
        data.invoice_items.forEach((element) => {
          if (element?.cost?.id == null) {
            throw "Vui lòng chọn đầy đủ loại chi phí hàng hóa";
          }
        });
      }
      handleSaveForm
        .mutateAsync({
          data: data,
          mode: props.form.id != null ? "edit" : "add",
          id: props.form.id != null ? props.form.id : null,
        })
        .then((response) => {
          message.success(
            props.form.id ? " Cập nhật thành công" : "Thêm mới thành công"
          );
          emit("hideModal");
          addLoading.value = false;
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
          addLoading.value = false;
        });
    })
    .catch((error) => {
      addLoading.value = false;
      console.log(error);
      if (typeof error == "string") {
        message.error(error);
      }
    });
};

const invoice_item_column = [
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
    dataIndex: "cost_id",
    width: "14%",
    slots: { customRender: "cost_id" },
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
  {
    title: "Thao tác",
    dataIndex: "action",
    width: "10%",
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

.width_date {
  width: 100%;
}
</style>
