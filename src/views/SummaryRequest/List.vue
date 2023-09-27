<template>
  <base-page
    ref="base"
    :entity="entity"
    :isCustomColumn="true"
    :isShowDeleteAction="false"
    :isShowEditAction="false"
    :isAdd="false"
    :isAddSelect="true"
    :isViewType="true"
    :bodyStyleModal="bodyStyleModal"
    :widthModal="width"
    :wrapClassName="wrapClassName"
    :getList="useGetList"
    :getDetail="useDetail"
    :baseUrl="baseUrl"
    :disabledRows="disabledRows"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    @cancelRecord="hideModal"
    @emitDataRecord="setDataRecord($event)"
    :isMultipleDelete="false"
  >
    <template #btnCustom="{ record }">
      <span class="btnCustom">
        <MinusCircleOutlined
          v-if="record.status !== constant.summaryStatus.KE_TOAN_TU_CHOI"
          :style="{ color: '#3f51b5', marginRight: '8px' }"
          @click="showCancelRequest(record)"
        />
      </span>
    </template>
    <template #buttonCustom>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showCreateTable"
      >
        {{ t("transferRequest.title.create_table") }}
      </a-button>
    </template>
    <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
    <!-- <template #header>
      <a-range-picker
        :style="{
          display: 'inline-flex',
          margin: '0 8px',
        }"
        :default-value="defaultValue"
        v-model:value="dateRange"
        :ranges="{
          'Hôm qua': [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
          ],
          'Hôm nay': [moment(), moment()],
          'Tháng này': [moment().startOf('month'), moment().endOf('month')],
          'Tháng trước': [
            moment().subtract(1, 'months').startOf('month'),
            moment().subtract(1, 'months').endOf('month'),
          ],
        }"
        :locale="locale"
        :format="'DD/MM/YYYY'"
        @change="onChangeRangeDate"
      >
        <template #suffixIcon>
          <CalendarOutlined />
        </template>
      </a-range-picker>
    </template> -->
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('plan.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
    target="current_tab"
    ref="modal"
  >
    <Detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detailData"
      @hideModal="hideModal"
    />
  </a-modal>

  <a-modal
    v-model:visible="isShowCreateTable"
    :title="$t('transferRequest.title.collection_transfer_request')"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideCreateTable"
    @ok="hideCreateTable"
    :cancel-text="$t('common.back')"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
    target="current_tab"
    ref="modal"
  >
    <template #footer>
      <a-button @click="hideCreateTable">Trở lại</a-button>
      <!-- <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showCreateTable"
      >
        {{ "Xuất Excel" }}
      </a-button> -->
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        :loading="saveLoading"
        @click="saveTransferRequestTable"
      >
        {{ "Lưu lại" }}
      </a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showSignInVO"
      >
        {{ "Lưu lại và trình kí" }}
      </a-button>
    </template>
    <AddTransferRequestTable
      ref="add_transfer_table"
      :entity="entity"
      :fields="fields"
      :form="form"
      :dataRecord="dataRecord"
      :rules="rules"
    />
  </a-modal>
  <a-modal
    centered
    v-model:visible="isCancelRequest"
    title="Lý do từ chối"
    :cancel-text="'Đóng'"
    :ok-text="'Từ chối'"
    @cancel="hideCancelRequest"
    @ok="cancelRequest"
  >
    <template #footer>
      <a-button @click="hideCancelRequest">Đóng</a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="cancelRequest"
      >
        {{ "Từ chối" }}
      </a-button>
    </template>
    <a-textarea
      v-model:value="reasonCancel"
      placeholder="Lý do từ chối"
      :rows="4"
    />
  </a-modal>
  <a-row>
    <LoginVOffice
      @loginSucces="openSignModal"
      :show="isShowSignInVO"
      @hideModal="cancelVoficeLogin"
    >
    </LoginVOffice>
  </a-row>
  <a-modal
    v-model:visible="showSendSignModal"
    :title="'Trình ký'"
    okText="Trình ký"
    cancelText="Hủy"
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        marginRight: '8px',
      },
    }"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
  >
    <AdvanceRequestSign
      :form="AdvanceRequestSignProps"
      :uploadLoading="uploadPdfLoading"
      :isSummaryRequest="true"
      :newTransferId="newTransferId"
      @hideModal="closeSignModal"
      @sendSignSuccess="sendSignSuccess"
    >
    </AdvanceRequestSign>
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import LoginVOffice from "@/views/VOffice/LoginVOffice.vue";
import AdvanceRequestSign from "@/views/Plan/Modal/AdvanceRequestSign.vue";
import Detail from "./Detail.vue";
import AddTransferRequestTable from "./Modal/AddTransferRequestTable.vue";
import Model from "@/config/models";
import { useGetList, useDetail } from "@/hooks/summary-request";
import { useSaveMutation as useSaveTransferRequest } from "@/hooks/transfer_request";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
const { t } = i18n.global;
import { generateFields, generateFormData } from "@/formUtility";
import {
  formatDate,
  formatNumber,
  formatCurrency,
  DocTienBangChu,
} from "@/utility";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Saigon");
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import * as _ from "lodash";
import { MinusCircleOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useQueryClient } from "vue-query";
import { useUpdateStatusMutation as cancelPaymentRequest } from "@/hooks/payment_request";
import { useUpdateStatusMutation as cancelPlanRequired } from "@/hooks/plan_required";

import { useUpdateStatusMutation as updateStatusTransferRequest } from "@/hooks/transfer_request";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import { uploadFileMutation } from "@/hooks/voffice";
import { pdfSignPosition } from "@/common/enumUtility";
import html2pdf from "html2pdf.js";
import constant from "@/constant";
import { generateRules } from "@/formUtility";
import { useAuth } from "@websanova/vue-auth";
import { useGetContentMax } from "@/hooks/transfer_request_item";
var authStore = useAuth();
const updateStatusTransfer = updateStatusTransferRequest();
const userInfo: any = authStore.user();
const uploadFile = uploadFileMutation();
const useCancelPaymentRequest = cancelPaymentRequest();
const useCancelPlanRequired = cancelPlanRequired();
const queryClient = useQueryClient();
const entity = "summary-request";
const baseUrl = "summary-requests";
const fields = generateFields(_.camelCase(entity));
const add_transfer_table = ref<any>();
const width = ref<string>("100%");
const base = ref();
const isShowSignInVO = ref<boolean>(false);
const uploadPdfLoading = ref<boolean>(false);
const rules = generateRules(_.camelCase(entity));
const AdvanceRequestSignProps = ref<any>({
  filePdf: [],
});
const showSendSignModal = ref<boolean>(false);
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
const defaultValue = ref<moment.Moment[]>([
  moment().startOf("month"),
  moment().endOf("month"),
]);
const store = useStore();
const setSelectedRows = async (data: any) => {
  await store.commit(`${_.camelCase(entity)}/SET_SELECTED_ROW`, data);
};
const reasonCancel = ref<string>();
const isCancelRequest = ref<boolean>(false);
const useSaveTransfer = useSaveTransferRequest();
const dateRange = ref<moment.Moment[]>(defaultValue.value);
const wrapClassName = ref<string>("full-form");
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>(generateFormData(Model[_.camelCase(entity)]) || {});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const detailData = ref<any>();
const isShowCreateTable = ref<boolean>(false);
const isActionCustom = ref<boolean>(false);
const actionCustom = {};
const dataRecord = ref<any>();
const recordSelected = ref<any>();
const newTransferId = ref<number>();
const numberStart = ref<number>(0);
const enabledNumberStart = computed(() => isShowCreateTable.value);
const filterNumberStart = moment().format("YYYY-MM-DD");
const saveLoading = ref<boolean>(false);
const { isFetching: tableLoading } = useGetContentMax(filterNumberStart, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledNumberStart,
  stateTime: 10000,
  onSuccess: (val) => {
    numberStart.value = val.data.content ? getNumberStart(val.data.content) : 0;
  },
});
const getNumberStart = (content) => {
  let result = Number(
    content.split(`${moment().format("DDMMYYYY")}00000000000000`)[1]
  );
  return result;
};
const openRecord = (record: number) => {
  isShowModal.value = true;
  detailData.value = record;
};
const hideModal = () => {
  isShowModal.value = false;
};
const setRecordDetail = (record: number) => {
  recordDetail.value = record;
};
const showCreateTable = () => {
  isShowCreateTable.value = true;
};
const hideCreateTable = () => {
  isShowCreateTable.value = false;
  form.value = generateFormData(Model[_.camelCase(entity)]);
};
const setDataRecord = (record: any) => {
  dataRecord.value = record;
};
const saveTransferRequestTable = () => {
  saveLoading.value = true;
  let begin = numberStart.value;
  add_transfer_table.value.ruleForm.validate().then(() => {
    let payload: any = JSON.parse(
      JSON.stringify(add_transfer_table.value.formData)
    );
    payload.transfer_request_item = JSON.parse(
      JSON.stringify(add_transfer_table.value.dataSource)
    );
    payload.request_amount = payload.transfer_request_item.length;
    if (payload.transfer_request_item.length > 0) {
      payload.transfer_request_item.forEach((p: any) => {
        begin++;
        p.amount = p.total_amount;
        p.status = constant.summaryStatus.TAO_BANG;
        p.name = p.transfer_request_name;
        // p.content = `${moment().format('DDMMYYYY')}00000000000000${begin}`;
        p.entity_id = p.id;
      });
    }
    useSaveTransfer
      .mutateAsync(payload)
      .then((response) => {
        if (response.status == 201) {
          newTransferId.value = response.data.id;
          message.success("Tạo bảng đề nghị chuyển khoản thành công");
          base.value.reload();
          setSelectedRows([]);
          saveLoading.value = false;
          hideCreateTable();
        } else {
          message.error(response.statusText);
          saveLoading.value = false;
        }
      })
      .catch((error) => {
        message.error(error);
        saveLoading.value = false;
      });
  });
};
const showCancelRequest = (record) => {
  recordSelected.value = record;
  isCancelRequest.value = true;
};
const hideCancelRequest = () => {
  isCancelRequest.value = false;
  recordSelected.value = void 0;
  reasonCancel.value = void 0;
};

const showSignInVO = () => {
  add_transfer_table.value.ruleForm.validate().then(() => {
    isShowSignInVO.value = true;
  });
};

const cancelVoficeLogin = () => {
  isShowSignInVO.value = false;
};
const openSignModal = async (data: any) => {
  saveTransferRequestTable();
  isShowSignInVO.value = false;
  // formLoading.value = true;
  AdvanceRequestSignProps.value = { filePdf: [] };
  Object.assign(AdvanceRequestSignProps.value, data);

  await loadFilePdfData();
  // setTimeout(() => {
  showSendSignModal.value = true;
  // formLoading.value = false;
  // }, 5000);
};
const uploadFilePdf = async (
  camelCasePdf: string,
  data: any,
  // table: any,
  position?: any,
  mode?: any
) => {
  uploadPdfLoading.value = true;
  const { opt, content } = await downloadFilePdf(camelCasePdf, data, mode);
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
        .mutateAsync({ data: formData, position: position })
        .then((response) => {
          // table.value.push(response.data);

          AdvanceRequestSignProps.value.filePdf.push(response.data);
          uploadPdfLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
        });
    });
};

const disabledRows = (record) => ({
  disabled:
    record.status == constant.summaryStatus.TAO_BANG ||
    record.status == constant.summaryStatus.CHO_DUYET_BANG ||
    record.status == constant.summaryStatus.DA_PHE_DUYET_BANG ||
    record.status == constant.summaryStatus.KE_TOAN_TU_CHOI ||
    record.status == constant.summaryStatus.HOAN_THANH_CHI ||
    record.status == constant.summaryStatus.TU_CHOI_BANG ||
    record.status == constant.summaryStatus.CHUYEN_KHOAN_LOI,
});

const loadFilePdfData = () => {
  let data: any = JSON.parse(JSON.stringify(add_transfer_table.value.formData));
  let dataSource: any = JSON.parse(
    JSON.stringify(add_transfer_table.value.dataSource)
  );
  dataSource.forEach((p, index) => {
    p.key = index + 1;
    p.amount = p.total_amount;
  });
  uploadFilePdf(
    "unc",
    {
      date: `Ngày ${moment().get("date")} Tháng ${Number(
        moment().get("month") + 1
      )} Năm ${moment().get("year")}`,
      total_amount_text: DocTienBangChu(data.amount).replaceAll(",", ""),
      total_amount: formatNumber(data.amount, 0),
      year: moment().get("years"),
    },
    pdfSignPosition.UNC,
    {}
  );
  uploadFilePdf(
    "vofficeSignTransferRequest",
    {
      date: moment().format("DD/MM"),
      user: userInfo.full_name,
      table: dataSource,
    },
    pdfSignPosition.DE_NGHI_CHUYEN_TIEN,
    {}
  );
};

const cancelRequest = () => {
  let payload = {
    id: recordSelected.value.id,
    status: constant.summaryStatus.KE_TOAN_TU_CHOI,
    reason: reasonCancel.value,
  };

  if (recordSelected.value.type == constant.summaryRequestType.DE_NGHI_CHI) {
    useCancelPaymentRequest
      .mutateAsync(payload)
      .then((response) => {
        if (response.status == 200) {
          message.success(
            `Từ chối đề nghị ${recordSelected.value.code} thành công`
          );
          queryClient.invalidateQueries("summary-request");
          hideCancelRequest();
        } else {
          message.error(response.statusText);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  } else if (
    recordSelected.value.type == constant.summaryRequestType.DE_NGHI_TAM_UNG
  ) {
    useCancelPlanRequired
      .mutateAsync(payload)
      .then((response) => {
        if (response.status == 200) {
          message.success(
            `Từ chối đề nghị ${recordSelected.value.code} thành công`
          );
          queryClient.invalidateQueries("summary-request");
          hideCancelRequest();
        } else {
          message.error(response.statusText);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  }
};

const sendSignSuccess = () => {
  let payload: any = {
    id: newTransferId.value,
    status: constant.transferRequestStatus.CHO_PHE_DUYET,
  };
  updateStatusTransfer
    .mutateAsync(payload)
    .then((response) => {
      if (response.status == 200) {
        console.log(response);
        queryClient.invalidateQueries("transfer-request");
      } else {
        message.error(response.statusText);
      }
    })
    .catch((error) => {
      message.error(error);
    });

  newTransferId.value = void 0;
};
const closeSignModal = () => {
  showSendSignModal.value = false;
};
</script>

<style scoped></style>
