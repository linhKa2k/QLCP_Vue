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
    :baseUrl="baseUrl"
  >
     <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
  </base-page>
    <a-modal
    v-model:visible="isShowModal"
    :title="$t('hotel.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'auto',
      overflowX: 'hidden',
    }"
    wrapClassName="dialog-class"
    target="current_tab"
    ref="modal"
  >
    <detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detail?.data?.data?.data"
    />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail } from "@/hooks/hotel";
import { ref,computed,watch } from "vue";
import i18n from "@/lang";
import { message } from 'ant-design-vue';
const { t } = i18n.global;
const entity = "hotel";
const baseUrl = "hotels"
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const openRecord = (record: number) => {
  isShowModal.value = true;
  itemId.value = record;
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