<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="true"
    :isAddSelect="true"
    :isViewType="true"
    :bodyStyleModal="bodyStyleModal"
    :widthModal="width"
    :wrapClassName="wrapClassName"
    :getList="useGetList"
    :getDetail="useDetail"
    :baseUrl="baseUrl"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    @cancelRecord="hideModal"
  >
    <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>

    <template #btnCustom="{ record }">
      <a-popconfirm
        title="Chắc chắn hủy kế hoạch ?"
        ok-text="Xác nhận"
        cancel-text="Hủy"
        @confirm="onCancel(record)"
      >
        <span class="btnCustom">
          <LockOutlined :style="{ color: '#3f51b5', marginRight: '8px' }" />
        </span>
      </a-popconfirm>
    </template>
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
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        marginRight: '8px',
        color: '#fff',
      },
    }"
  >
    <Detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detailData"
      @hideModal="hideModal"
    />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail } from "@/hooks/plan";
import { ref, computed, watch } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
import { LockOutlined } from "@ant-design/icons-vue";
import { useCancelPlan } from "@/hooks/plan";
import { planStatus } from "@/common/enumUtility";
const { t } = i18n.global;
const entity = "plan";
const baseUrl = "plans";
const width = ref<string>("100%");
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
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const detailData = ref<any>();
const cancelPlan = useCancelPlan();
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

const onCancel = (record: any) => {
  cancelPlan
    .mutateAsync(record.id)
    .then((response: any) => {
      console.log(response);
      message.success("Hủy kế hoạch thành công");
    })
    .catch((error) => {
      var response = error.response.data;
      if (Array.isArray(response.fieldErrors)) {
        message.error(
          response.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(response.title || response.message);
      }
    });
};
</script>

<style scoped lang="scss">
.btnCustom {
  cursor: pointer;
}
</style>
