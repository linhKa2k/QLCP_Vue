<template>
  <a-steps
    v-model:current="current"
    type="navigation"
    size="small"
    :style="stepStyle"
    @change="onChangeCurrent"
  >
    <a-step :title="t('plan.title.general_information')">
      <template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.official_info')">
      <template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.road_info')"
      ><template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.cost_estimate')"
      ><template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :span="4" :title="t('plan.title.advance_request')">
      <template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.plan_confirm')">
      <template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.plan_end')"
      ><template #icon> <user-outlined /> </template
    ></a-step>
    <!-- <a-step :title="t('plan.title.plan_pay')"
      ><template #icon> <user-outlined /> </template
    ></a-step> -->
  </a-steps>

  <a-row v-if="current == 0" class="project-content">
    <CommonInfoDetail :fields="fields" :form="form" />
  </a-row>
  <a-row v-if="current == 1" class="project-content">
    <OfficialInfoDetail ref="officialInfo" :form="form" />
  </a-row>
  <a-row v-if="current == 2" class="project-content">
    <PlanRouteDetail :form="form" />
  </a-row>
  <a-row v-if="current == 3" class="project-content">
    <CostEstimateDetail :fields="fields" :form="form" />
  </a-row>

  <a-row v-if="current == 4" class="project-content">
    <AdvanceRequest
      :form="{ ...form, ...planInfoData }"
      :fields="fields"
      @pev-step="prev"
      @hideModal="hideModal"
    />
  </a-row>
  <a-row v-if="current == 5" class="project-content">
    <PlanConfirm :form="form" :fields="fields" />
  </a-row>
  <a-row v-if="current == 6" class="project-content">
    <PlanEnd :form="form" :fields="fields" @pev-step="prev" />
  </a-row>
</template>
<script setup lang="ts">
import { generateFields } from "@/formUtility";
import { getImage } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs, computed } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import CommonInfoDetail from "./Detail/CommonInfoDetail.vue";
import CostEstimateDetail from "./Detail/CostEstimateDetail.vue";
import OfficialInfoDetail from "./Detail/OfficialInfoDetail.vue";
import PlanRouteDetail from "./Detail/PlanRouteDetail.vue";

import AdvanceRequest from "./Detail/AdvanceRequest.vue";
import PlanConfirm from "./Detail/PlanConfirm.vue";
import PlanEnd from "./Detail/PlanEnd.vue";
import UserService from "@/services/UserService";
import { useGetInfoData as getPlanAllInfo } from "@/hooks/plan";

const current = ref<number>(0);
const { t } = i18n.global;
const entity = "plan";

interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
});

const prev = async () => {
  await pevStep();
};

const next = () => {
  nextStep();
};

const nextStep = () => {
  // if (current.value < 3)
  current.value++;
};

const pevStep = () => {
  if (current.value > 0) current.value--;
};

const stepStyle = {
  // marginBottom: "60px",
  boxShadow: "0px -1px 0 0 #e8e8e8 inset",
};
const onChangeCurrent = (site: any) => {
  current.value = site;
};
const { isShowModal } = toRefs(props);
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
let camelCaseEntity = ref<any>(_.camelCase(entity));
const fields = ref<any>(generateFields(camelCaseEntity.value));
const ColumnConfigs = ref<any>(ColumnConfig);
let columns = ref<any>(ColumnConfigs[camelCaseEntity] || []);
const form = ref<any>(props.form);
const planParams = ref<any>({
  id: props.form.id != null ? props.form.id : null,
});
const planInfoData = ref<any>();
columns = columns.value.map((p?: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
const loading = ref<boolean>(false);
const grid: any = ref();
const enabledGetPlanAllInfo = computed(() => {
  return planParams.value.id != null;
});

const hideModal = () => {
  emit("hideModal");
};

const { isLoading: planLoading } = getPlanAllInfo(planParams.value, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanAllInfo,
  retry: false,
  onSuccess: async (val) => {
    planInfoData.value = val.data;
  },
});
</script>
