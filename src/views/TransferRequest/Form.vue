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
          <a-form-item :label="'Ngày tạo'" name="created_time">
            <a-date-picker
              v-model:value="form.created_time"
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
              v-model:value="form.bank_name"
              placeholder="Tên ngân hàng"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="bank_account_number" :label="'Số tài khoản'">
            <a-input
              v-model:value="form.bank_account_number"
              placeholder="Số tài khoản"
              disabled
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item name="amount" :label="fields.amount.label">
            <a-input
              v-model:value="form.amount"
              placeholder="Tổng tiền"
              disabled
            />
          </a-form-item>
        </a-col> -->
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
          :dataSource="dataTable"
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
          <template #status="{ record }">
            <span>{{ renderItemStatus(record.status) }}</span>
          </template>
          <template #footer>
            <div style="width: 100%; display: flex">
              <template
                v-for="footer in summaryRequestColumns"
                :key="footer.dataIndex"
              >
                <div
                  v-if="footer.dataIndex == 'amount'"
                  :style="`width: ${footer.width}; height: 100%;text-align:center;padding:0px 16px;font-size: 16px;
    font-weight: 600;`"
                >
                  <span>{{
                    form.amount ? formatNumber(form.amount, 0) : "--"
                  }}</span>
                </div>
                <div
                  v-else-if="footer.dataIndex == 'name'"
                  :style="`width: ${footer.width}; height: 100%; color: red;text-align:center;padding:0px 16px;font-size: 18px;
    font-weight: bold;`"
                >
                  <span>{{ "Tổng tiền" }}</span>
                </div>
                <div
                  v-else
                  :style="`width: ${footer.width}; height: 100%; text-align:center;padding:0px 16px`"
                ></div>
              </template>
            </div>

            <!-- <div style="width: 5%; height: 100%; color: red">
                <span>123</span>
              </div> -->
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
              <span> Mã đề nghị chuyển khoản </span>
            </a-col>
            <a-col :span="24">
              <a-input-search
                v-model:value="searchValueAdd"
                placeholder="Mã đề nghị chuyển khoản"
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
import formUtility from "@/formUtility";
import { onMounted, ref, computed, watch } from "vue";
import Constant from "@/constant";
import { formatDate, formatNumber } from "@/mixins/utility";
import { message } from "ant-design-vue";
import moment from "moment-timezone";
import { useAuth } from "@websanova/vue-auth";
import { useGetList } from "@/hooks/summary-request";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { useSaveMutation } from "@/hooks/transfer_request";
import { useUpdateStatusMutation as cancelPaymentRequest } from "@/hooks/payment_request";
import { useUpdateStatusMutation as cancelPlanRequired } from "@/hooks/plan_required";
import { useQueryClient } from "vue-query";
import i18n from "@/lang";
import { constant, differenceBy } from "lodash";
const { t } = i18n.global;
var authStore = useAuth();
const useSave = useSaveMutation();
const useCancelPaymentRequest = cancelPaymentRequest();
const useCancelPlanRequired = cancelPlanRequired();
const queryClient = useQueryClient();
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
  handleCallback: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
  handleCallback: false,
});
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const transferRequestItemOld = ref<any>(
  JSON.parse(JSON.stringify(props.formData.transfer_request_item))
);
// const districtDisabled = ref<boolean>(true);
// const provinceDisabled = ref<boolean>(true);
onMounted(() => {
  //    transferRequestItemOld.value = JSON.parse(JSON.stringify(props.formData.transfer_request_item))
  // debugger;
  // console.log(transferRequestItemOld.value);
});
const isCallBack = ref<boolean>(true);
const requestCode = ref<any>(void 0);
const searchValueAdd = ref<any>(void 0);
const pageSizeAdd = ref<any>(50);
const pageIndexAdd = ref<any>(0);
const dataTable = ref<any>(form.value.transfer_request_item);
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
    dataIndex: "name",
    width: "10%",
    dataType: "string",
    key: "name",
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
    dataIndex: "bank_account_number",
    width: "10%",
    dataType: "string",
    key: "bank_account_number",
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
    width: "10%",
    dataType: "string",
    key: "content_sms",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    width: "10%",
    dataType: "string",
    key: "content",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: "10%",
    key: "status",
    slots: { customRender: "status" },
  },
    {
    title: "Lý do lỗi",
    dataIndex: "import_error",
    width: "10%",
    key: "import_error"
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "5%",
    key: "action",
    slots: {
      customRender: "action",
    },
  },
];
const tradeColumns = [
  //   {
  //   title: "STT",
  //   dataIndex: "key",
  //   key: "key",
  //   // dataType: "number",
  //   width: "5%",
  // },
  {
    title: "Tên đề nghị chuyển khoản",
    dataIndex: "name",
    width: "15%",
    dataType: "string",
    key: "name",
  },
  {
    title: "Mã kế hoạch",
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
];
const currentPageAdd = computed(() => pageIndexAdd + 1);
// const dataSource = computed(() => {
//   let result =   JSON.parse(JSON.stringify(dataTable.value)) ;
//   result.forEach((p: any, index) => {
//     p.key = index + 1;
//   });
//   return result;
// });
const filterAdd = computed(() => {
  let result: any = {};
  result.pageSize = pageSizeAdd.value;
  result.pageIndex = pageIndexAdd.value;
  result["status.in"] = [
    Constant.summaryStatus.TU_CHOI_BANG,
    Constant.summaryStatus.DA_PHE_DUYET,
  ];
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
    let currentIds: any = [];
    dataTable.value.map((p) => {
      currentIds.push(p.entity_id);
    });
    tradeList.value = val.data.content.filter(
      (p) => !currentIds.includes(p.id)
    );
  },
});
const emit = defineEmits<{
  (e: "reload"): void;
}>();

const handleCancel = () => {
  emit("reload");
};
onMounted(() => {
  if (form.value.mode !== "edit") {
    form.value.created_time = moment();
  }
  let userInfo: any = authStore.user();
  form.value.bank_name = userInfo.bank_name;
  form.value.bank_account_number = userInfo.bank_account_number;
});

const renderItemStatus = (status: number) => {
  switch (status) {
    case Constant.summaryStatus.HOAN_THANH_CHI:
      return "Đã hoàn thành chi";
    case Constant.summaryStatus.CHUYEN_KHOAN_LOI:
      return "Chi thất bại";
    case Constant.summaryStatus.DANG_XU_LY_CHI_TIEN:
      return "Đang xử lý chi tiền";
    default:
      return "";
  }
};
const changeStatus = (entity_id, type) => {
  let payload = {
    id: entity_id,
    status: Constant.summaryStatus.DA_PHE_DUYET,
    reason: "",
  };

  if (type == Constant.summaryRequestType.DE_NGHI_CHI) {
    useCancelPaymentRequest
      .mutateAsync(payload)
      .then((response) => {
        if (response.status == 200) {
          queryClient.invalidateQueries("summary-request");
        } else {
          message.error(response.statusText);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  } else if (type == Constant.summaryRequestType.DE_NGHI_TAM_UNG) {
    useCancelPlanRequired
      .mutateAsync(payload)
      .then((response) => {
        if (response.status == 200) {
          queryClient.invalidateQueries("summary-request");
        } else {
          message.error(response.statusText);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  }
};
const saveForm = (data: any) => {
  useSave
    .mutateAsync(data)
    .then((response?: any) => {
      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
      } else {
        if (itemRemoved.value.length > 0) {
          itemRemoved.value.map((p) => {
            changeStatus(p.entity_id, p.type);
          });
        }
        const messages: string = t("common.save_success");
        message.success(messages);
        handleCancel();
      }
    })
    .catch((error?: any) => {
      message.error(error.message);
    });
};
watch(
  () => dataTable.value,
  (val) => {
    form.value.amount = 0;
    val.map((p: any) => {
      form.value.amount += Number(p.amount);
    });
    dataTable.value.forEach((p, index) => {
      p.key = index + 1;
    });
  },
  { immediate: true }
);
const itemRemoved = ref<any>([]);
watch(
  () => props.handleCallback,
  (val) => {
    if (val == true) {
      console.log(props.formData);
      let formData = JSON.parse(JSON.stringify(props.formData));
      // formData.mode = 'edit'
      formData.transfer_request_item = dataTable.value;
      formData.transfer_request_item.forEach((p) => {
        // p.entity_id = p.id;
        // p.status = Constant.summaryStatus.TAO_BANG;
        delete p.id;
      });
      if (formData.status == Constant.transferRequestStatus.TU_CHOI) {
        let itemOld: any = [];
        transferRequestItemOld.value.map((p) => {
          itemOld.push({ entity: p.entity_id, type: p.type });
        });
        let itemNew: any = [];
        formData.transfer_request_item.map((p) => {
          itemNew.push({ entity: p.entity_id, type: p.type });
        });
        itemOld.map((p) => {
          itemNew.map((q) => {
            if (JSON.stringify(p) !== JSON.stringify(q)) {
              itemRemoved.value.push(p);
            }
          });
        });
      }
      saveForm(formData);
    }
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
  debugger;
  console.log(record);
  dataTable.value = dataTable.value.filter((p) => p.key !== record.key);
};
const onSelectChange = (list: any) => {
  listSelected.value = list;
};
const addTrade = () => {
  debugger;
  let listAdd: any = JSON.parse(JSON.stringify(listSelected.value));
  listAdd.forEach((p) => {
    p.entity_id = p.id;
    p.amount = p.total_amount;
  });
  dataTable.value = [...dataTable.value, ...listAdd];
  console.log("11111", dataTable.value);
  hideAddTrade();
};

defineExpose({ ruleForm, form, isCallBack });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}

.width_item {
  width: 100%;
}
</style>
<style scoped lang="scss">
.container {
  padding: 24px;
  background: white;
  .table-container {
    margin-top: 16px;
  }
}
</style>
