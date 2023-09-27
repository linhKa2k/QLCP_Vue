<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="false"
    :isAddSelect="false"
    :isViewType="false"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    @beforeEditRecord="beforeEditRecord($event)"
    :getList="useGetList"
    :getDetail="useDetail"
    :useSaveMutation="useSaveMutation"
    :baseUrl="baseUrl"
    :bodyStyleModal="bodyStyleModal"
    :widthModal="width"
    :wrapClassName="wrapClassName"
    :isShowEditAction="false"
  >
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('planConfirm.name', { code: form.code })"
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
    <Detail :entity="entity" :is-show-modal="isShowModal" :form="detailData" />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail, useSaveMutation } from "@/hooks/plan_confirm";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
import { planConfirmStatus } from "@/common/enumUtility";

const { t } = i18n.global;
const entity = "plan-confirm";
const baseUrl = "plan-confirms";
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const detailData = ref<any>();
const width = ref<string>("100%");
const wrapClassName = ref<string>("full-form");
const bodyStyleModal = ref<{
  overflowX: string;
  overflowY: string;
  padding: string;
  height: string;
}>({
  overflowX: "hidden",
  overflowY: "scroll",
  padding: "0",
  height: "calc(100vh - 112px)",
});
const openRecord = (record: number) => {
  console.log(record);
  isShowModal.value = true;
  detailData.value = record;
};
const hideModal = () => {
  isShowModal.value = false;
};
const setRecordDetail = (record: number) => {
  recordDetail.value = record;
};

const beforeEditRecord = (record: any) => {
  if (record.status != null && record.status != planConfirmStatus.init) {
    message.error("Phiếu xác nhận đã xác nhận, không thể xử lý");
    isShowModal.value = false;
  }
};
</script>

<style scoped></style>
