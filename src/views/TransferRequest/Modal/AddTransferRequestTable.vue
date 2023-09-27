<template>
  <div class="container">
    <a-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :layout="layout"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item name="name" :label="fields.name.label">
            <a-input v-model:value="form.name" placeholder="Tên lệnh chi" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="'Ngày tạo'" name="ins_date">
            <a-date-picker
              v-model:value="form.ins_date"
              format="DD/MM/YYYY"
              :placeholder="fields.ins_date.label"
              :allowClear="false"
              @onChange="onChangrInsDate"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row style="margin: 16px 0px; font-weight: 600">
        <span> Nguồn đi tiền : </span>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item name="bank" :label="'Tên ngân hàng'">
            <a-input v-model:value="form.name" placeholder="Tên ngân hàng" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="account_number" :label="'Số tài khoản'">
            <a-input
              v-model:value="form.account_number"
              placeholder="Số tài khoản"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="total_amount" :label="fields.total_amount.label">
            <a-input
              v-model:value="form.total_amount"
              placeholder="Tổng tiền"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-row type="flex" justify="end" align="middle">
      <a-col>
        <a-button
          :style="{
            color: 'white',
            background: '#ed1b2f',
            border: '1px solid red',
          }"
          @click="showAddTrade"
        >
          {{ "Thêm giao dịch" }}
        </a-button>
      </a-col>
    </a-row>
    <a-row class="table-container">
      <a-col :span="24">
        <a-table
          :columns="transferRequestColumns"
          :dataSource="[]"
          :pagination="false"
          bordered
        >
        </a-table>
      </a-col>
    </a-row>
  </div>
  <a-modal
    v-model:visible="isShowTrade"
    :title="$t('Thêm giao dịch')"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideAddTrade"
    @ok="hideAddTrade"
    :cancel-text="$t('common.back')"
    :ok-text="'Thêm giao dịch'"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
    target="current_tab"
    ref="modal"
  >
  <template #footer>
      <a-button @click="hideAddTrade">Trở lại</a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="hideAddTrade"
      >
        {{ "Thêm giao dịch" }}
      </a-button>
  </template>
    <a-row :gutter="[0, 24]">
      <a-col :span="24">
        <a-col :span="12">
          <a-row :gutter="[0, 16]">
            <a-col :span="24">
              <span> Mã đề nghị chuyển khoản </span>
            </a-col>
            <a-col :span="24">
              <a-input
                v-model:value="form.name"
                placeholder="Mã đề nghị chuyển khoản"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-col>
    </a-row>
    <a-col :span="24">
      <a-table
        :columns="tradeColumns"
        :dataSource="[]"
        :pagination="false"
        bordered
      >
      </a-table>
    </a-col>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
interface Props {
  entity: string;
  fields: any;
  form: any;
}
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  fields: {},
  form: {},
});
console.log(props.form);
const ruleForm = ref<any>();
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const isShowTrade = ref<boolean>(false);
const bodyStyleModal = ref<{
  overflowX: string;
  height: string;
  overflowY: string;
  padding: string;
}>({
  overflowX: "hidden",
  height: "calc(100vh - 112px)",
  overflowY: "scroll",
  padding: "24px",
});
const wrapClassName = ref<string>("full-form");
const transferRequestColumns = [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    // dataType: "number",
    width: "5%",
  },
  {
    title: "Tên đề nghị chuyển khoản",
    dataIndex: "transfer_request_name",
    width: "15%",
    dataType: "string",
    key: "transfer_request_name",
  },
  {
    title: "Mã nhân viên / Số CMND",
    dataIndex: "code",
    width: "10%",
    dataType: "string",
    key: "code",
  },
  {
    title: "Họ và tên",
    dataIndex: "full_name",
    width: "10%",
    dataType: "string",
    key: "full_name",
  },
  {
    title: "Số tài khoản",
    dataIndex: "account_number",
    width: "10%",
    dataType: "string",
    key: "account_number",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    dataType: "number",
    width: "10%",
    key: "amount",
  },
  {
    title: "Nội dung gửi SMS",
    dataIndex: "content_sms",
    width: "15%",
    dataType: "string",
    key: "content_sms",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    width: "15%",
    dataType: "string",
    key: "content",
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "10%",
    key: "action",
    slots: { customRender: "action" },
  },
];
const tradeColumns = [
    {
    title: "STT",
    dataIndex: "key",
    key: "key",
    // dataType: "number",
    width: "5%",
  },
  {
    title: "Tên đề nghị chuyển khoản",
    dataIndex: "name",
    width: "15%",
    dataType: "string",
    key: "name",
  },
  {
    title: "Mã đề nghị chuyển khoản",
    dataIndex: "code",
    width: "10%",
    dataType: "string",
    key: "code",
  },
  {
    title: "Họ và tên",
    dataIndex: "full_name",
    width: "10%",
    dataType: "string",
    key: "full_name",
  },
  {
    title: "Số tài khoản",
    dataIndex: "account_number",
    width: "10%",
    dataType: "string",
    key: "account_number",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    dataType: "number",
    width: "10%",
    key: "amount",
  },
  {
    title: "Nội dung gửi SMS",
    dataIndex: "sms_content",
    width: "15%",
    dataType: "string",
    key: "sms_content",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    width: "15%",
    dataType: "string",
    key: "content",
  },
]
const showAddTrade = () => {
  isShowTrade.value = true;
};
const hideAddTrade = () => {
  isShowTrade.value = false;
};
</script>
<style scoped lang="scss">
.container {
  padding: 24px;
  background: white;
  .table-container {
    margin-top: 16px;
  }
}
</style>
