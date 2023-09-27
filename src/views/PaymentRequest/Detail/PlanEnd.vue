<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :layout="layout"
    labelAlign="left"
  >
    <a-row :gutter="[0, 16]">
      <a-col :span="24" style="margin: 2%">
        <a-row :gutter="[24, 0]">
          <a-col :span="24" display="flex">
            <strong>{{ "Thông tin chung" }}</strong>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Mã kế hoạch" name="code">{{
              form.user_request ? form.user_request : "--"
            }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái" name="code"
              >{{ form.user_request ? form.user_request : "--" }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Tên kế hoạch" name="code"
              >{{ form.user_request ? form.unit_request : "--" }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Lý do" name="code"
              >{{ form.user_request ? form.user_request : "--" }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Ngày bắt đầu" name="code"
              >{{ form.date ? form.date : "--" }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Ngày kết thúc" name="code"
              >{{ form.date ? form.date : "--" }}
            </a-form-item>
          </a-col>
          <a-col :span="24" display="flex">
            <strong>{{ "Báo cáo kết thúc công tác" }}</strong>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Nội dung công việc đã làm" name="note">
              <a-textarea
                v-model:value="form.description"
                :placeholder="'Nội dung công việc đã làm'"
                show-count
                :maxlength="500"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Kết quả thực hiện" name="note">
              <a-textarea
                v-model:value="form.description"
                :placeholder="'Kết quả thực hiện'"
                show-count
                :maxlength="500"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Đề xuất" name="note">
              <a-textarea
                v-model:value="form.description"
                :placeholder="'Đề xuất'"
                show-count
                :maxlength="500"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
  <a-col :span="24" style="margin-left: 2%">
    <strong>{{ "Thông tin chi phí thực tế" }}</strong>
  </a-col>
  <a-col :span="24" style="margin-left: 2%">
    <a-collapse v-model:activeKey="activeKey" style="width: 100%">
      <a-collapse-panel key="1" :header="'Chi phí theo định mức'">
        <a-table
          :columns="columnCostByAmount"
          :dataSource="dataTableCostAmount"
        >
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="2" :header="'Chi phí có hóa đơn'">
        <a-table :columns="columnCostByBill" :dataSource="dataTableCostBill">
        </a-table>
      </a-collapse-panel>
    </a-collapse>
  </a-col>

  <a-col :span="24" style="margin-left: 2%">
    <strong>{{ "Tổng chi phí" }}</strong>
  </a-col>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    :layout="layout"
    labelAlign="left"
  >
    <a-row :gutter="16" style="margin-left: 2%">
      <a-col :span="24">
        <a-form-item label="Tổng chi phí định mức" name="note">
          {{ form.idx ? form.idx : "--" }}
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Tổng chi phí hóa đơn" name="note">
          {{ form.idx ? form.idx : "--" }}
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Số tiền đã tạm ứng" name="note">
          {{ form.idx ? form.idx : "--" }}
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Số tiền phải thu" name="note">
          {{ form.idx ? form.idx : "--" }}
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Số tiền phải chi" name="note">
          {{ form.idx ? form.idx : "--" }}
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <a-col :span="24" style="margin-left: 2%; margin-bottom: 3%">
    <a-button
      @click="handleCreatePayRequest"
      style="background-color: #137adb; color: white"
    >
      {{ "Tạo đề nghị chi" }}</a-button
    >
  </a-col>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button v-if="true" class="prev" @click="cancelForm" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
    </a-button>
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
      >{{ "Trình kí" }}
      <DoubleRightOutlined />
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import i18n from "@/lang";
import { DownloadOutlined } from "@ant-design/icons-vue";

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
const form = ref<any>(props.form);
const fields = ref<any>(props.fields);
const dataTableCostAmount = ref<any[]>([]);
const dataTableCostBill = ref<any[]>([]);
const activeKey = ref(["1", "2"]);

const state = reactive({
  valueSearch: "",
});

const emit = defineEmits<{
  (e: "pevStep"): void;
}>();
const handleDownloadPayRequest = () => {
  console.log("handleDownloadPayRequest");
};

const onSearch = (searchValue: string) => {
  console.log("use value", searchValue);
};

const columnCostByAmount = [
  {
    title: "Dịch vụ",
    dataIndex: "service",
    // width: "15%",
  },
  {
    title: "Số ngày",
    dataIndex: "total_day",
    // width: "15%",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    // width: "15%",
  },
  {
    title: "Định mức",
    dataIndex: "amount",
    // width: "15%",
  },
];

const columnCostByBill = [
  {
    title: "Mẫu số",
    dataIndex: "template",
    // width: "15%",
  },
  {
    title: "Ký hiệu",
    dataIndex: "total_day",
    // width: "15%",
  },
  {
    title: "Số hóa đơn",
    dataIndex: "quantity",
    // width: "15%",
  },
  {
    title: "Ngày HĐ",
    dataIndex: "amount",
    // width: "15%",
  },
  {
    title: "MST",
    dataIndex: "amount",
    // width: "15%",
  },
  {
    title: "NCC",
    dataIndex: "amount",
    // width: "15%",
  },
  {
    title: "Loại thanh toán",
    dataIndex: "amount",
    // width: "15%",
  },
  {
    title: "Tên hàng hóa dịch vụ",
    dataIndex: "amount",
    // width: "15%",
  },
];
const cancelForm = () => {
  emit("pevStep");
};

const saveForm = () => {
  console.log("saveForm");
};

const handleSaveAndSign = () => {
  console.log("handleSaveAndSign");
};
const handleCreatePayRequest = () => {
  console.log("handleCreatePayRequest");
};
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
</style>
