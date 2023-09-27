<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="true"
    :isAddSelect="true"
    :isViewType="true"
    @emitDataTable="getFilterTable($event)"
    @emitDataList="getFilterList($event)"
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
    :title="$t('livingQuota.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'scroll',
      overflowX: 'hidden',
      backgroundColor: '#efeded',
      height: '640px'
    }"
    :width="'80%'"
    target="current_tab"
    ref="modal"
  >
    <Detail :entity="entity" :is-show-modal="isShowModal" :form="dataDetail" />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import {
  useGetList,
  useDetail,
  useSaveMutation,
} from "@/hooks/living_cost_quota";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
const { t } = i18n.global;
const entity = "living-cost-quota";
const baseUrl = "living-cost-quotas";
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const width = ref<string>("80%");
const dataDetail = ref<any>();

const getFilterTable = (params: any) => {
  filterTable.value = params;
};
const getFilterList = (params: any) => {
  filterList.value = params;
};

const openRecord = (record: number) => {
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
