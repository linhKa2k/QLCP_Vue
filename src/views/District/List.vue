<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="false"
    :isAddSelect="true"
    :isViewType="true"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    :getList="useGetList"
    :getDetail="useDetail"
    :useSaveMutation="useSaveMutation"
    :baseUrl="baseUrl"
    :widthModal="width"
    :isShowAction="false"
  >
    <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('district.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    centered
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: '#efeded',
    }"
    :width="'500px'"
    target="current_tab"
    ref="modal"
  >
    <detail :entity="entity" :is-show-modal="isShowModal" :form="detailData" />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail, useSaveMutation } from "@/hooks/district";
import { ref } from "vue";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "district";
const baseUrl = "districts";
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const detailData = ref<any>();
const width = ref<string>("500px");
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
</script>

<style scoped></style>
