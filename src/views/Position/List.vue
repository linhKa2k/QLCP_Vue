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
      :title="$t('position.name', { code: form.code })"
      :destroyOnClose="true"
      :closable="true"
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
      <Detail :entity="entity" :is-show-modal="isShowModal" :form="detailData" />
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import BasePage from "@/views/BasePage/BasePage.vue";
  import Detail from "./Detail.vue";
  import { useGetList, useDetail, useSaveMutation } from "@/hooks/position";
  import { ref, computed, watch } from "vue";
  import i18n from "@/lang";
  import { message } from "ant-design-vue";
  const { t } = i18n.global;
  const entity = "position";
  const baseUrl = "positions";
  const form = ref<any>({});
  const isShowModal = ref<boolean>(false);
  const recordDetail = ref<any>();
  const detailData = ref<any>();
  const width = ref<string>("30%");
  const openRecord = (record: number) => {
    console.log(record)
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
  
  <style scoped>
  </style>