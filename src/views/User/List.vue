<template>
  <base-page
    ref="page"
    :entity="entity"
    :isShowBack="false"
    :isAdd="false"
    :isImport="false"
    :isAction="true"
    :widthModal="width"
    :isCustomColumn="true"
    :isAddSelect="true"
    :isViewType="true"
    @emitDataTable="getFilterTable($event)"
    @emitDataList="getFilterList($event)"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    :dataTable="dataTable?.data?.data"
    :dataList="dataList?.data?.data"
    :tableLoading="dataTable?.isLoading"
    :listLoading="dataList?.isLoading"
    :getList="useGetList"
    :getDetail="useDetail"
    :useSaveMutation="useSaveMutation"
    :baseUrl="baseUrl"
    :isShowAction="false"
  >
    <!-- <template #tabs>
      <a-tabs
        v-model:activeKey="activeKey"
        :tabBarGutter="0"
        :tabBarStyle="styleTabs"
        @change="changeTab"
      >
        <a-tab-pane v-for="item in statuses" :key="item.value" :tab="item.text">
          <template #detailList>
            <a-spin :spinning="dataList?.isLoading">
              <detail :form="recordDetail"></detail>
            </a-spin>
          </template>
        </a-tab-pane>
      </a-tabs>
    </template> -->
  </base-page>
  <a-modal
    v-model:visible="isShowModal"
    :title="$t('user.name', { code: form.code })"
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
    :width="'600px'"
    target="current_tab"
    ref="modal"
  >
    <detail :entity="entity" :is-show-modal="isShowModal" :form="detailData" />
  </a-modal>
</template>
<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useGetList, useDetail, useSaveMutation } from "@/hooks/user";
import user from "@/store/modules/user";
import { message } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "user";
const baseUrl = "users";
const filterTable = ref<any>();
const filterList = ref<any>();
const form = ref<any>({});
const styleTabs = { margin: 0 };
const width = "900px";
const page: any = ref();
const recordDetail = ref<any>();
const detailData = ref<any>();
const isShowModal = ref<boolean>(false);
const enabledTable = computed(() => typeof filterTable.value !== "undefined");
// const statuses = [
//   {
//     value: -1,
//     text: t("user.extend.all"),
//   },
//   {
//     value: 1,
//     text: t("user.extend.active"),
//   },
//   {
//     value: 0,
//     text: t("user.extend.inactive"),
//   },
// ];
// const getFilterTable = (params: any) => {
//   filterTable.value = params;
// };
// const getFilterList = (params: any) => {
//   filterList.value = params;
// };
// const filterRole = () => {
//   filterTable.value.filters.push({
//     field: "role",
//     value: user.state.loginObj.role,
//   });
//   filterTable.value.filters.push({
//     field: "entity_id",
//     value: user.state.loginObj.entity_id,
//   });
// };
// watch(filterTable, filterRole);
// const changeTab = (key) => {
//   let filter = {};
//   filter = {
//     field: "is_active",
//     operator: key != -1 ? "in" : "isNotNull",
//     value: key != -1 ? [key] : null,
//   };
//   page.value.reload(filter);
// };
const dataTable = ref<any>(
  useGetList(filterTable, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled: enabledTable,
    staleTime: 10000,
    onSuccess: (data) => {
      checkError(data);
    },
  })
);

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
const checkError = (data) => {
  if (typeof data.data.errorCode !== "undefined") {
    if (data.data.errorCode !== 0) {
      message.error(data.data.errorMessage);
    }
  } else {
    message.error(t("common.system_error"));
  }
};
</script>
