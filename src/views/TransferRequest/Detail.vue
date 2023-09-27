<template>
  <a-row class="container">
    <a-col :span="24">
      <a-row type="flex" justify="center" align="middle">
        <a-col :span="24">
          <a-form layout="vertical" :model="form">
            <a-row :gutter="[16, 0]">
              <a-col :span="12">
                <a-form-item :label="fields['name'].label">
                  <span>{{ form.name ? form.name : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="fields['created_time'].label">
                  <span>{{
                    form.created_time
                      ? moment(form.created_time).format("DD/MM/YYYY")
                      : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="fields['status'].label">
                  <span>{{ renderStatus(form.status) }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-row style="font-weight: bold; color: black; margin-bottom: 24px">
        <span>Nguồn đi tiền</span>
      </a-row>
      <a-row type="flex" align="middle">
        <a-col :span="24">
          <a-form layout="vertical" :model="form">
            <a-row :gutter="[16, 0]">
              <a-col :span="12">
                <a-form-item label="Tên ngân hàng">
                  <span>{{ form.bank_name ? form.bank_name : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Số tài khoản">
                  <span>{{
                    form.bank_account_number ? form.bank_account_number : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="12">
                <a-form-item label="Tổng tiền">
                  <span>{{ form.amount ? form.amount : "--" }}</span>
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
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
    </a-col>
  </a-row>
  <a-modal
    :visible="showModalSignDetail"
    title="Chi tiết trình ký"
    :destroyOnClose="true"
    :closable="true"
    @ok="closeDetail()"
    @cancel="closeDetail()"
    :cancel-text="$t('common.back')"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
    target="current_tab"
    ref="modal"
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        marginRight: '8px',
      },
    }"
  >
    <SignDetailModal
      :transferRequestId="form.id ? form.id : null"
      :type="signStageType.TRINH_KY_DNCK"
    />
  </a-modal>
</template>
<script setup lang="ts">
import SignDetailModal from "./Modal/SignDetailModal.vue";
import { generateFields } from "@/formUtility";
import { formatDate, formatIsActive, formatNumber } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs, computed } from "vue";
import ColumnConfig from "@/config/columns";
import { signStageType } from "@/common/enumUtility";
import i18n from "@/lang";
import constant from "@/constant";
const { t } = i18n.global;
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Saigon");
const entity = "transfer_request";
interface Props {
  isShowModal: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isAction: boolean;
  form: any;
  showModalSignDetail: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isAutoLoad: false,
  isAdd: false,
  isAction: false,
  showModalSignDetail: false,
  form: {},
});
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
const wrapClassName = ref<string>("full-form");
const { isShowModal } = toRefs(props);
// const showModalSignDetail = ref<boolean>(false);
const emit = defineEmits<{
  (e: "hideModal"): void;
  (e: "closeDetail"): void;
}>();
const getActiveStatus = (value) => {
  switch (Boolean(value)) {
    case true:
      return t("common.active");
    case false:
      return t("common.inactive");
  }
};

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
    width: "15%",
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
];

const dataSource = computed(() => {
  let result = JSON.parse(JSON.stringify(props.form.transfer_request_item));
  result.forEach((p: any, index) => {
    p.key = index + 1;
  });
  return result;
});

const renderStatus = (status: number) => {
  switch (status) {
    case constant.transferRequestStatus.CHO_PHE_DUYET:
      return "Chờ phê duyệt";
    case constant.transferRequestStatus.CHUA_TRINH_KY:
      return "Chưa trình ký";
    case constant.transferRequestStatus.DA_CAP_NHAT:
      return "Đã cập nhật";
    case constant.transferRequestStatus.DA_PHE_DUYET:
      return "Đã phê duyệt";
    case constant.transferRequestStatus.TU_CHOI:
      return "Từ chối";
    default:
      return "--";
  }
};

const renderItemStatus = (status: number) => {
  switch (status) {
    case constant.summaryStatus.HOAN_THANH_CHI:
      return "Đã hoàn thành chi";
    case constant.summaryStatus.CHUYEN_KHOAN_LOI:
      return "Chi thất bại";
    case constant.summaryStatus.DANG_XU_LY_CHI_TIEN:
      return "Đang xử lý chi tiền";
    default:
      return "";
  }
};

let camelCaseEntity = ref<any>(_.camelCase(entity));
const fields = ref<any>(generateFields(camelCaseEntity.value));

const ColumnConfigs = ref<any>(ColumnConfig);
let columns = ref<any>(ColumnConfigs[camelCaseEntity] || []);
columns = columns.value.map((p?: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
const loading = ref<boolean>(false);
const grid: any = ref();
const hideModal = () => {
  emit("hideModal");
};
const closeDetail = () => {
  emit("closeDetail");
};
</script>

<style scoped lang="scss">
.container {
  padding: 24px;
  background: #ffffff;
}
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
</style>
<style lang="scss" scoped>
@import "../../assets/sass/global.scss";
</style>
