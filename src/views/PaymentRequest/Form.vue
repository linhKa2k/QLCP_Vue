<template>
  <a-steps
    v-model:current="current"
    type="navigation"
    size="small"
    :style="stepStyle"
    @change="onChangeCurrent"
  >
    <a-step
      :title="t('plan.title.general_information')"
      :disabled="current != 0"
    >
      <template #icon> <user-outlined /> </template
    ></a-step>
    <a-step :title="t('plan.title.official_info')" :disabled="current != 1">
      <template #icon> <user-outlined /> </template
    ></a-step>
    <!-- :disabled="current != 2" -->
    <a-step :title="t('plan.title.road_info')" :disabled="current != 2"
      ><template #icon> <user-outlined /> </template
    ></a-step>
    <!-- :disabled="current != 3" -->
    <a-step :title="t('plan.title.cost_estimate')" :disabled="current != 3"
      ><template #icon> <user-outlined /> </template
    ></a-step>
  </a-steps>

  <a-row v-if="current == 0" class="project-content">
    <CommonInfo
      :form="{
        id: props.formData.id ? props.formData.id : null,
        ...props.formData,
      }"
      :fields="fields"
      :rules="ruleForm"
      ref="commonInfo"
    />
  </a-row>
  <a-row v-if="current == 1" class="project-content">
    <OfficialInfo
      :form="{ ...form, mode: state.mode_current_0 }"
      ref="officialInfo"
    />
  </a-row>
  <a-row v-if="current == 2" class="project-content">
    <PlanRoute :form="form" ref="planForm" :rules="ruleForm" />
  </a-row>
  <a-row v-if="current == 3" class="project-content">
    <CostEstimate :form="form" :fields="fields" ref="costEstimate" />
  </a-row>

  <a-row type="flex" justify="end" class="footer" v-if="current <= 3">
    <a-button type="text" @click="cancelForm">{{ "Thoát" }}</a-button>
    <a-button v-if="current > 0" class="prev" @click="prev">
      <DoubleLeftOutlined />{{ t("common.prev") }}
    </a-button>
    <a-button v-if="true" type="primary" @click="saveForm">
      <SaveOutlined />{{ t("common.continue") }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import CommonInfo from "./Form/CommonInfo.vue";
import OfficialInfo from "./Form/OfficialInfo.vue";
import PlanRoute from "./Form/PlanRoute.vue";
import CostEstimate from "./Form/CostEstimate.vue";
// import AdvanceRequest from "./Form/AdvanceRequest.vue";
// import PlanEnd from "./Form/PlanEnd.vue";
import { onMounted, ref, computed, reactive } from "vue";
import { message, Modal } from "ant-design-vue";

import i18n from "@/lang";
import PlanService from "@/services/PlanService";
import PlanUserService from "@/services/PlanUserService";
import PlanRouteService from "@/services/PlanRouteService";
import { useSaveMutation as useSaveMutationPlan } from "@/hooks/plan";
import { useSavesMutation as useSaveMutationPlanUser } from "@/hooks/plan_user";
import { useQueryClient } from "vue-query";
import { useSaveMutation as useSaveMutationCostEstimate } from "@/hooks/plan_cost";
import { generateDataObject } from "@/common/generateData";
import { useSavesMutation as useSavesMutationPlanRoute } from "@/hooks/plan_route";
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
});
const { t } = i18n.global;
const current = ref<number>(0);
const ruleForm = ref<any>(props.rules);
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const formOffcialInfo = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const activeKey = ref<any>(1);
const queryClient = useQueryClient();
const state = reactive({
  mode_current_0: props.formData.mode,
  mode_current_1: props.formData.mode,
  mode_current_2: props.formData.mode,
  mode_current_3: props.formData.mode,
});

const emit = defineEmits<{
  (e: "cancelForm", data: any): void;
}>();

const useSavePlan = useSaveMutationPlan();
const useSavePlanUser = useSaveMutationPlanUser();
const useSavePlanRoute = useSavesMutationPlanRoute();
const useSaveCostEstimate = useSaveMutationCostEstimate();
const cancelForm = () => {
  emit("cancelForm", "gridLoad");
};
const prev = async () => {
  await pevStep();
};
const next = () => {
  nextStep();
};

const stepStyle = {
  // marginBottom: "60px",
  boxShadow: "0px -1px 0 0 #e8e8e8 inset",
};
const officialInfo = ref();
const planForm = ref();
const commonInfo = ref();
const costEstimate = ref();
const dataFormOfficialInfo = computed(() => officialInfo.value.officialForm);
const dataFormRoute = computed(() => planForm.value.dataRouteRecord);
const conmonInfoRef = computed(() => commonInfo.value);
const costEstimateRef = computed(() => costEstimate.value);

const saveForm = async () => {
  try {
    switch (current.value) {
      case 0:
        await handleSaveCommonInfo();
        break;
      case 1:
        await handleSaveOfficialInfo({
          data: [
            ...dataFormOfficialInfo.value.partner_official,
            ...dataFormOfficialInfo.value.staff_official,
          ],
          mode: state.mode_current_1,
          planId: props.formData.id,
        });
        break;
      case 2:
        await handleSavePlanRoute(dataFormRoute.value);
        break;
      case 3:
        await handleSaveCostEstimate(costEstimateRef.value.userLevel);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

const onChangeCurrent = (site: any) => {
  current.value = site;
};
const nextStep = () => {
  if (current.value < 3) current.value++;
};

const pevStep = async () => {
  if (current.value > 0) await current.value--;
  switch (current.value) {
    case 0:
      state.mode_current_0 = "edit";
      await queryClient.invalidateQueries("plan-user");
      await queryClient.invalidateQueries("plan");
      break;
    case 1:
      state.mode_current_1 = "edit";
      break;
    case 2:
      state.mode_current_2 = "edit";
      break;
    case 3:
      state.mode_current_3 = "edit";
      break;
    default:
      break;
  }
};

const handleSaveCommonInfo = async () => {
  try {
    conmonInfoRef.value.ruleForm
      .validate()
      .then(async () => {
        useSavePlan
          .mutateAsync({
            ...conmonInfoRef.value.form,
            mode: state.mode_current_0,
            id: props.formData.id,
          })
          .then((response) => {
            if (response.status !== 201 && response.status !== 200) {
              message.error(response.statusText);
              return false;
            }
            if (response.data) {
              form.value.id = response.data.id;
            }
            // message.success(t("common.save_success", {}));
            nextStep();
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
      })
      .catch((error: any) => {
        console.log("validate_client_error", error);
      });
  } catch (error) {
    message.error("Lỗi thêm mới thông tin kế hoạch");
    console.log(error);
  }
};

const handleSaveOfficialInfo = async (form: any) => {
  try {
    useSavePlanUser
      .mutateAsync(form)
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          message.error(response.statusText);
          return false;
        }
        // message.success(t("common.save_success", {}));
        nextStep();
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
  } catch (error) {
    message.error("Lỗi thêm mới thông tin cán bộ");
    console.log(error);
  }
};

const handleSavePlanRoute = async (form: any) => {
  try {
    useSavePlanRoute
      .mutateAsync({
        data: form.map((item) => {
          delete item.id;
          if (item.plan_route_user_dto_list.length > 0) {
            item.plan_route_user_dto_list.forEach((element) => {
              delete element.id;
            });
          }
          return item;
        }),
        mode: state.mode_current_2,
        id: props.formData.id,
      })
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          message.error(response.statusText);
          return false;
        }
        // message.success(t("common.save_success", {}));
        nextStep();
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
  } catch (error) {
    message.error("Lỗi thêm mới thông tin lộ trình");
    console.log(error);
  }
};

const handleSaveCostEstimate = (data: any) => {
  try {
    console.log(data, " check data estimate");
    useSaveCostEstimate
      .mutateAsync({
        data: data,
        mode: state.mode_current_3,
        planId: form.value.id,
      })
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          message.error(response.statusText);
          return false;
        }
        message.success(t("common.save_success", {}));
        nextStep();
        cancelForm();
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
  } catch (error) {
    message.error("Lỗi thêm mới thông tin cán bộ");
    console.log(error);
  }
};

// const saveFormData = (useSaveFormData: any, data: any) => {
//   useSaveFormData
//     .mutateAsync(data)
//     .then((response) => {
//       if (response.status !== 201 && response.status !== 200) {
//         message.error(response.statusText);
//         return false;
//       }
//       if (response.data) {
//         form.value.id = response.data.id;
//       }
//       message.success(t("common.save_success", {}));
//       nextStep();
//     })
//     .catch((error) => {
//       var response = error.response.data;
//       if (Array.isArray(response.fieldErrors)) {
//         message.error(
//           response.fieldErrors.map((p: any) => p.message).join("\n")
//         );
//       } else {
//         message.error(response.title || response.message);
//       }
//     });
// };

// const generateData = () => {
//   const keyWord = [
//       "purpose",
//       "department_require",
//       "department_process",
//       "user_process",
//       "user_require",
//     ];
//     const ruleKey = {
//       user_process: { value: "id", label: "username" },
//       user_require: { value: "id", label: "username" },
//     };
//     return generateDataObject(keyWord, ruleKey, form.value);
// }

defineExpose({ ruleForm, form });
</script>
<style scoped lang="scss">
.project-content {
  padding: 24px;
}

.footer {
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: white;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
  position: absolute;
  bottom: 0px;
  z-index: 1;

  .ant-btn {
    width: 120px;
    margin-left: 8px;
  }

  .ant-btn-text {
    border: none;
    width: fit-content;
  }

  .ant-btn-text:hover,
  .ant-btn-text:active,
  .ant-btn-text:focus {
    color: var(--mainColor);
  }

  .prev:hover,
  .prev:active,
  .prev:focus {
    border: 1px solid var(--mainColor);
    color: var(--mainColor);
  }

  .ant-btn-primary:hover,
  .ant-btn-primary:active,
  .ant-btn-primary:focus {
    border-color: var(--mainColor);
    // color: var(--mainColor);
    background: var(--mainColor);
  }
}
</style>
