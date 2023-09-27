<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="false"
    :isAddSelect="true"
    :isViewType="true"
    :bodyStyleModal="bodyStyleModal"
    :widthModal="width"
    :wrapClassName="wrapClassName"
    :getList="useGetList"
    :getDetail="useDetail"
    :useSaveMutation="useSaveMutation"
    :baseUrl="baseUrl"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    @cancelRecord="hideModal"
  >
    <template #btnCustom="{ record }">
      <span class="btnCustom">
        <!-- <SelectOutlined
          :style="{ color: '#3f51b5', marginRight: '8px' }"
          @click="showModalImport(record)"
        /> -->
        <ImportTransferRequest
          v-if="record.status == constant.transferRequestStatus.DA_PHE_DUYET || record.status == constant.transferRequestStatus.DA_CAP_NHAT"
          :record="record"
          :entity="'transfer-request-item'"
        ></ImportTransferRequest>
      </span>
    </template>

    <!-- <template #buttonCustom>
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
    </template> -->
    <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('transferRequest.name', { code: detailData?.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="bodyStyleModal"
    :width="'100%'"
    centered
    :wrapClassName="wrapClassName"
    target="current_tab"
    ref="modal"
  >
    <template #footer>
      <a-button type="default" key="back" @click="hideModal">{{
        $t("common.back")
      }}</a-button>

      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        type="primary"
        @click="exportExcel"
        >{{ $t("Xuất excel") }}</a-button
      >
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        type="primary"
        @click="showSignInVO"
        v-if="detailData?.status == constant.transferRequestStatus.CHUA_TRINH_KY || detailData?.status == constant.transferRequestStatus.TU_CHOI"
        >{{ $t("Trình ký") }}</a-button
      >
      <a-button
        :size="'normal'"
        @click="openModalSignDetail"
        style="background-color: #ed1b2f; color: #fff"
        v-else
      >
        {{ "Xem trình ký" }}
      </a-button>
    </template>
    <Detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detailData"
      :showModalSignDetail="showModalSignDetail"
      @hideModal="hideModal"
      @closeDetail="closeModal"
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
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showCreateTable"
      >
        {{ "Xuất Excel" }}
      </a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showCreateTable"
      >
        {{ "Lưu lại" }}
      </a-button>
      <a-button
        :style="{
          color: 'white',
          background: '#ed1b2f',
          border: '1px solid red',
        }"
        @click="showCreateTable"
      >
        {{ "Lưu lại và trình kí" }}
      </a-button>
    </template>
    <AddTransferRequestTable :entity="entity" :fields="fields" :form="form" />
  </a-modal>
</template>

<script setup lang="ts">
import SignDetailModal from "./Modal/SignDetailModal.vue";
import BasePage from "@/views/BasePage/BasePage.vue";
import { SelectOutlined } from "@ant-design/icons-vue";
import Detail from "./Detail.vue";
import AddTransferRequestTable from "./Modal/AddTransferRequestTable.vue";
import LoginVOffice from "@/views/VOffice/LoginVOffice.vue";
import AdvanceRequestSign from "@/views/Plan/Modal/AdvanceRequestSign.vue";
import { useQueryClient } from "vue-query";
import ImportTransferRequest from "./Modal/ImportTransferRequest.vue";
import {
  signStageType,
} from "@/common/enumUtility";
import {
  formatDate,
  formatNumber,
  formatCurrency,
  DocTienBangChu,
} from "@/utility";
import Model from "@/config/models";
import {
  useGetList,
  useDetail,
  useSaveMutation,
} from "@/hooks/transfer_request";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
const { t } = i18n.global;
import { generateFields, generateFormData } from "@/formUtility";
import * as _ from "lodash";
import { useStore } from "vuex";
import FileSaver from "file-saver";
import TransferRequestService from "@/services/TransferRequestService";
import { downloadFilePdf } from "@/common/pdfExportUtils";
import html2pdf from "html2pdf.js";
import { uploadFileMutation } from "@/hooks/voffice";
import { pdfSignPosition } from "@/common/enumUtility";
import { useUpdateStatusMutation } from "@/hooks/transfer_request";
import { useAuth } from "@websanova/vue-auth";
import moment from "moment-timezone";
// import { constant } from "lodash";
import constant from "@/constant";
moment.tz.setDefault("Asia/Saigon");
const queryClient = useQueryClient();
const updateStatus = useUpdateStatusMutation();
const store = useStore();
const entity = "transfer-request";
const baseUrl = "transfer-requests";
const uploadFile = uploadFileMutation();
const fields = generateFields(_.camelCase(entity));
const isShowSignInVO = ref<boolean>(false);
const showSendSignModal = ref<boolean>(false);
const uploadPdfLoading = ref<boolean>(false);
const newTransferId = ref<number>();
const width = ref<string>("100%");
var authStore = useAuth();
const userInfo: any = authStore.user();
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
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>(
  generateFormData(Model[_.camelCase("summary-request")]) || {}
);
const isShowModal = ref<boolean>(false);
const showModalSignDetail = ref<boolean>(false);
const recordDetail = ref<any>();
const detailData = ref<any>();
const isShowCreateTable = ref<boolean>(false);
const AdvanceRequestSignProps = ref<any>({
  filePdf: [],
});
const openRecord = (record: any) => {
  newTransferId.value = record.id;
  detailData.value = record;
  isShowModal.value = true;
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
};
const showSignInVO = () => {
  isShowSignInVO.value = true;
};
const cancelVoficeLogin = () => {
  isShowSignInVO.value = false;
};
const openSignModal = async (data: any) => {
  isShowSignInVO.value = false;
  // formLoading.value = true;
  AdvanceRequestSignProps.value = { filePdf: [] };
  Object.assign(AdvanceRequestSignProps.value, data);

  loadFilePdfData();
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
const loadFilePdfData = () => {
  let data: any = JSON.parse(JSON.stringify(detailData.value));
  let dataSource: any = JSON.parse(
    JSON.stringify(detailData.value.transfer_request_item)
  );
  dataSource.forEach((p, index) => {
    p.key = index + 1;
  });
  uploadFilePdf(
    "unc",
    {
      date: `Ngày ${moment().get("date")} Tháng ${Number(
        moment().get("month") + 1
      )} Năm ${moment().get("year")}`,
      total_amount_text: DocTienBangChu(data.amount).replaceAll(",", ""),
      total_amount: formatNumber(data.amount, 0),
        year: moment().get("years")
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
const exportExcel = () => {
  let payload: any = {};
  let ids: any = [];
  console.log(detailData.value);
  detailData.value.transfer_request_item.map((p: any) => {
    ids.push(p.id);
  });
  payload["id.in"] = ids;
  TransferRequestService.exportItem(payload).then((response) => {
    let fileName = `Danh_sach_giao dịch.xlsx`;
    FileSaver.saveAs(new Blob([response.data]), fileName);
  });
};
const sendSignSuccess = () => {
  let payload: any = {
    id: detailData.value.id,
    status: constant.transferRequestStatus.CHO_PHE_DUYET,
  };
  updateStatus
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
};

const closeSignModal = () => {
  showSendSignModal.value = false;
};

const openModalSignDetail = () => {
  showModalSignDetail.value = true;
};
const closeModal = ()=>{
   showModalSignDetail.value = false;
}
</script>

<style scoped></style>
