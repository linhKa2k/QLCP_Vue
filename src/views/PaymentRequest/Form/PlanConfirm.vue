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
      <a-col :span="24">
        <a-row :gutter="[24, 0]">
          <a-col :span="24" display="flex">
            <strong>{{ "Thông tin xác nhận công tác" }}</strong>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="Lộ trình công tác"
              name="code"
              >{{
            }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Đơn vị đi: " name="code">{{}} </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Đơn vị đến: " name="code">{{}} </a-form-item>
          </a-col>
          <a-col>
            <strong>Danh sách cán bộ</strong>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
  <a-col :span="24">
    <a-table :columns="staffColumn" :dataSource="OfficlePartnerDetail">
    </a-table>
  </a-col>
  <a-col>
    <a-checkbox v-model:checked="form">Ở nhà khách viettel</a-checkbox>
  </a-col>
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

const staffColumn = [
  {
    title: "STT",
    dataIndex: "id",
    width: "10%",
  },
  {
    title: "Mã nhân viên",
    dataIndex: "department",
    width: "10%",
  },
  {
    title: "Họ tên",
    dataIndex: "account_number",
    width: "10%",
  },
  {
    title: "Đi công tác",
    dataIndex: "user_name",
    width: "10%",
  },
  {
    title: "không đi công tác",
    dataIndex: "position",
    width: "10%",
  },
  {
    title: "kết thúc công tác",
    dataIndex: "gender",
    width: "10%",
  },
  {
    title: "Từ ngày",
    dataIndex: "bank",
    width: "10%",
  },
  {
    title: "Đến ngày",
    dataIndex: "",
    width: "10%",
  },
];
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.form);
const fields = ref<any>(props.fields);
const OfficlePartnerDetail = ref<any[]>([]);
</script>

  