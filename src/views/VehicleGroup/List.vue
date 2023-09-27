<template>
    <base-page
      :entity="entity"
      :isCustomColumn="true"
      :isAdd="true"
      :isAddSelect="true"
      :isViewType="true"
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
      :title="$t('vehicleGroup.name', { code: form.code })"
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
      :width="'560px'"
      target="current_tab"
      ref="modal"
    >
      <Detail :entity="entity" :is-show-modal="isShowModal" :form="detailData" />
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import BasePage from "@/views/BasePage/BasePage.vue";
  import Detail from "./Detail.vue";
  import { useGetList, useDetail, useSaveMutation } from "@/hooks/vehicle_group";
  import { ref, computed, watch } from "vue";
  import i18n from "@/lang";
  import { message } from "ant-design-vue";
  const { t } = i18n.global;
  const entity = "vehicle-group";
  const baseUrl = "vehicle-groups";
  const form = ref<any>({});
  const isShowModal = ref<boolean>(false);
  const recordDetail = ref<any>();
  const detailData = ref<any>();
  const width = ref<string>("560px");
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