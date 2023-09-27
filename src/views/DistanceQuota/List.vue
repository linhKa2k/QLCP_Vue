<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="true"
    :isAddSelect="true"
    :isViewType="true"
    :isImport="true"
    :isExport="true"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    :getList="useGetList"
    :getDetail="useDetail"
    :useSaveMutation="useSaveMutation"
    :baseUrl="baseUrl"
    :widthModal="width"
  >
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('distanceQuota.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'scroll',
      height: '600px',
      overflowX: 'hidden',
      backgroundColor: '#efeded',
    }"
    :width="'800px'"
    target="current_tab"
    ref="modal"
  >
    <Detail :entity="entity" :is-show-modal="isShowModal" :form="dataDetail" />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail, useSaveMutation } from "@/hooks/distance_quota";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
const { t } = i18n.global;
const entity = "distance-quota";
const baseUrl = "distance-quotas";
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const width = ref<string>("800px");
const dataDetail = ref<any>();

const openRecord = (record: number) => {
  console.log(record);
  isShowModal.value = true;
  dataDetail.value = record;
};
const hideModal = () => {
  isShowModal.value = false;
};
const setRecordDetail = (record: number) => {
  recordDetail.value = record;
};
</script>

<style scoped></style>
