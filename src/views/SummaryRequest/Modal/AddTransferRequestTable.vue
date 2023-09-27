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
            <a-input v-model:value="formData.name" placeholder="Tên lệnh chi" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="'Ngày tạo'" name="created_time">
            <a-date-picker
              v-model:value="formData.created_time"
              format="DD/MM/YYYY"
              :placeholder="fields.created_time.label"
              :allowClear="false"
              disabled
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row style="margin: 16px 0px; font-weight: 600">
        <span> Nguồn đi tiền : </span>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item name="bank_name" :label="'Tên ngân hàng'">
            <a-input
              v-model:value="formData.bank_name"
              placeholder="Tên ngân hàng"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="bank_account_number" :label="'Số tài khoản'">
            <a-input
              v-model:value="formData.bank_account_number"
              placeholder="Số tài khoản"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="amount" :label="fields.amount.label">
            <a-input
              v-model:value="formData.amount"
              placeholder="Tổng tiền"
              disabled
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
          :columns="summaryRequestColumns"
          :dataSource="dataSource"
          :pagination="false"
          bordered
        >
          <template #action="{ record }">
            <span>
              <DeleteOutlined
                :style="{ color: '#ee6e73', marginRight: '8px' }"
                @click="() => deleteItem(record)"
              />
            </span>
          </template>
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
        @click="addTrade"
      >
        {{ "Thêm giao dịch" }}
      </a-button>
    </template>
    <a-row :gutter="[0, 24]">
      <a-col :span="24">
        <a-col :span="12">
          <a-row :gutter="[0, 16]">
            <a-col :span="24">
              <span> Mã kế hoạch </span>
            </a-col>
            <a-col :span="24">
              <a-input-search
                v-model:value="searchValueAdd"
                placeholder="Mã kế hoạch"
                @search="
                  () => {
                    requestCode = searchValueAdd;
                  }
                "
              />
            </a-col>
          </a-row>
        </a-col>
      </a-col>
    </a-row>
    <a-col :span="24">
      <a-table
        :columns="tradeColumns"
        :dataSource="tradeList"
        :pagination="false"
        :row-key="(record) => record"
        :row-selection="{
          selectedRowKeys: listSelected,
          onChange: onSelectChange,
        }"
        bordered
      >
      </a-table>
    </a-col>

    <!-- <a-col :span="24">
      <a-pagination
        v-if="tradeList?.length > 0"
        v-model:current="currentPageAdd"
        :total="totalCount"
        :pageSize="pageSize"
        :size="sizeOfPage"
        :show-total="
          (total) =>
            `${$t('common.import.show_result_from')} ${pageRange} ${$t(
              'common.import.per_total'
            )} ${totalCount ? totalCount : 0} `
        "
        @change="changePage"
      />
    </a-col> -->
  </a-modal>
</template>
<script setup lang="ts">
import { useGetList } from "@/hooks/summary-request";
import { ref, computed, watch, onMounted } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import Model from "@/config/models";
import { generateFields, generateFormData } from "@/formUtility";
import * as _ from "lodash";
import moment from "moment-timezone";
import { useAuth } from "@websanova/vue-auth";
import constant from "@/constant"

var authStore = useAuth();
moment.tz.setDefault("Asia/Saigon");
interface Props {
  entity: string;
  fields: any;
  form: any;
  dataRecord: any;
  rules:any
}
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  fields: {},
  form: {},
  dataRecord: {},
  rule:{}
});

const formData = ref<any>(props.form);
const requestCode = ref<any>(void 0);
const searchValueAdd = ref<any>(void 0);
const pageSizeAdd = ref<any>(50);
const pageIndexAdd = ref<any>(0);
const dataTable = ref<any>(props.dataRecord);
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
const listSelected = ref<any>([]);
const wrapClassName = ref<string>("full-form");
const summaryRequestColumns = [
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
    dataIndex: "account_number",
    width: "10%",
    dataType: "string",
    key: "account_number",
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
    dataIndex: "bank_account_number",
    width: "10%",
    dataType: "string",
    key: "bank_account_number",
  },
  {
    title: "Số tiền",
    dataIndex: "total_amount",
    dataType: "number",
    width: "10%",
    key: "total_amount",
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
  {
    title: "Hành động",
    dataIndex: "action",
    width: "10%",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
];
const tradeColumns = [
    {
    title: "Mã kế hoạch",
    dataIndex: "code",
    width: "10%",
    dataType: "string",
    key: "code",
  },
  {
    title: "Tên đề nghị chuyển khoản",
    dataIndex: "transfer_request_name",
    width: "15%",
    dataType: "string",
    key: "transfer_request_name",
  },
  {
    title: "Họ và tên",
    dataIndex: "full_name",
    width: "10%",
    dataType: "string",
    key: "full_name",
  },
    {
    title: "Tên ngân hàng",
    dataIndex: "bank_name",
    width: "10%",
    dataType: "string",
    key: "bank_name",
  },
  {
    title: "Số tài khoản",
    dataIndex: "bank_account_number",
    width: "10%",
    dataType: "string",
    key: "bank_account_number",
  },
  {
    title: "Số tiền",
    dataIndex: "total_amount",
    dataType: "number",
    width: "10%",
    key: "total_amount",
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
]
const currentPageAdd = computed(() => pageIndexAdd + 1);
const dataSource = computed(() => {
  let result = JSON.parse(JSON.stringify(dataTable.value));
  result.forEach((p: any, index) => {
    p.key = index + 1;
  });
  return result;
});
const filterAdd = computed(() => {
  let result: any = {};
  result.pageSize = pageSizeAdd.value;
  result.pageIndex = pageIndexAdd.value;
  result['status.in'] = [constant.summaryStatus.TU_CHOI_BANG,constant.summaryStatus.DA_PHE_DUYET]
  result["code.contains"] = requestCode.value;
  return result;
});
const tradeList = ref<any>();
const enabledTable = computed(
  () => typeof filterAdd.value !== "undefined" && isShowTrade.value
);
const { isFetching: tableLoading } = useGetList(filterAdd, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledTable,
  stateTime: 10000,
  onSuccess: (val) => {
    let currentIds:any = [] 
    dataSource.value.map((p)=>{
      currentIds.push(p.id)
    })
  tradeList.value = val.data.content.filter((p)=> !currentIds.includes(p.id) );
  },
});
onMounted(()=>{
  formData.value.created_time = moment();
  formData.value.bank_name = "ViettelPay";
  formData.value.bank_account_number = "10979000899";
  // let userInfo:any = authStore.user();
  // formData.value.bank_name = userInfo.bank_name;
  // formData.value.bank_account_number = userInfo.bank_account_number;
})
watch(
  () => dataSource.value,
  (val) => {
    formData.value.amount = 0;
    val.map((p: any) => {
      formData.value.amount += Number(p.total_amount);
    });
  },
  { immediate: true }
);
const showAddTrade = () => {
  listSelected.value = [];
  isShowTrade.value = true;
};
const hideAddTrade = () => {
  isShowTrade.value = false;
};
const deleteItem = (record) => {
  dataTable.value = dataTable.value.filter((p) => p.id !== record.id);
};
const onSelectChange = (list: any) => {
  listSelected.value = list;
};
const addTrade = () => {
  dataTable.value = [...dataTable.value, ...listSelected.value];
  hideAddTrade();
};
defineExpose({
  dataSource,
  formData,
  ruleForm
});
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
