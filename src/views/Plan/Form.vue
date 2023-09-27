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
    <!-- :disabled="current != 3"  :disabled="current != 3" -->
    <a-step :title="t('plan.title.cost_estimate')" :disabled="current != 3"
      ><template #icon> <user-outlined /> </template
    ></a-step>
  </a-steps>

  <a-row v-if="current == 0" class="project-content">
    <CommonInfo
      :form="form"
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
    <PlanRoute
      :form="form"
      ref="planRouteForm"
      :rules="ruleForm"
      @prev="prev"
      @cancelForm="cancelForm"
      @nextStep="nextStep"
    />
  </a-row>
  <a-row v-if="current == 3" class="project-content">
    <CostEstimate :form="form" :fields="fields" ref="costEstimate" />
  </a-row>

  <a-row type="flex" justify="end" class="footer" v-if="current != 2">
    <a-button type="text" @click="cancelForm">{{ "Thoát" }}</a-button>
    <a-button v-if="current > 0" class="prev" @click="prev">
      <DoubleLeftOutlined />{{ t("common.prev") }}
    </a-button>
    <a-button
      v-if="true"
      style="background-color: #ed1b2f; color: #fff"
      @click="saveForm"
      :loading="saveLoading"
    >
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
import { useSavesMutation as useSavesMutationPlanRoute } from "@/hooks/plan_route";
import { useGetInfoData as getPlanAllInfo } from "@/hooks/plan";
import { planStatus } from "@/common/enumUtility";
import { generateData } from "@/common/generateData";
import Model from "@/config/models";

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
const form = ref<any>(props.formData);
const saveLoading = ref<any>(false);
const state = reactive({
  mode_current_0: props.formData.mode,
  mode_current_1: props.formData.mode,
  mode_current_2: props.formData.mode,
  mode_current_3: props.formData.mode,
});
const Models = ref<any>(Model);
const modelsConfig = ref<any>(Models.value["plan"]);
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
  await prevStep();
};

const stepStyle = {
  // marginBottom: "60px",
  boxShadow: "0px -1px 0 0 #e8e8e8 inset",
};
const officialInfo = ref();
const planRouteForm = ref();
const commonInfo = ref();
const costEstimate = ref();
const dataFormOfficialInfo = computed(() => officialInfo.value.officialForm);
const officialInfoEx = computed(() => officialInfo.value);
const dataFormRoute = computed(() => planRouteForm.value.dataRouteRecord);
const commonInfoRef = computed(() => commonInfo.value);
const costEstimateRef = computed(() => costEstimate.value);
const planParams = ref<any>({
  id: props.formData.id != null ? props.formData.id : null,
});

const saveForm = async () => {
  saveLoading.value = true;
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
          planId: form.value.id,
        });
        break;
      case 2:
        await handleSavePlanRoute(dataFormRoute.value);
        break;
      case 3:
        await handleSaveCostEstimate(costEstimateRef.value);
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

const prevStep = async () => {
  if (current.value > 0) await current.value--;
  switch (current.value) {
    case 0:
      state.mode_current_0 = "edit";
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
const checkMessageStatus = (status: any) => {
  let mes;
  switch (status) {
    case 2:
      mes = "Kế hoạch chờ phê duyệt";
      break;
    case 3:
      mes = "Kế hoạch đã phê duyệt";
      break;
    case 5:
      mes = "Kế hoạch chờ xác nhận kết quả công tác";
      break;
    case 6:
      mes = "Kế hoạch đã xác nhận kết quả công tác";
      break;
    case 7:
      mes = "Kế hoạch chờ phê duyệt kết thúc công tác";
      break;
    case 8:
      mes = "Kế hoạch chờ phê duyệt kết thúc công tác";
      break;
    case 9:
      mes = "Kế hoạch đã kết thúc công tác";
      break;
    case 9:
      mes = "Kế hoạch đã bị từ chối kết thúc công tác";
      break;
    default:
      mes = "Kế hoạch đã được sử dụng";
      break;
  }
  return mes;
};

const handleSaveCommonInfo = async () => {
  if (
    props.formData.status
      ? ![planStatus.init, planStatus.refuse_approve].includes(
          props.formData.status
        )
      : false
  ) {
    const alert = checkMessageStatus(props.formData.status);
    message.error(alert + " không được chỉnh sửa");
    saveLoading.value = false;
  } else {
    try {
      commonInfoRef.value.ruleForm
        .validate()
        .then(async () => {
          useSavePlan
            .mutateAsync({
              ...commonInfoRef.value.form,
              mode: state.mode_current_0,
            })
            .then((response) => {
              if (response.status !== 201 && response.status !== 200) {
                message.error(response.statusText);
                return false;
              }
              if (response.data) {
                form.value = generateData(modelsConfig, response.data);
                // form.value.id = response.data.id;
                // form.value.is_add = response.data.is_add;
                // form.value.department_process =
                //   commonInfoRef.value.form.department_process;
                // form.value.start_time = commonInfoRef.value.form.start_time;
                // form.value.end_time = commonInfoRef.value.form.end_time;
                // form.value.parent = commonInfoRef.value.form.parent;
              }
              // message.success(t("common.save_success", {}));
              saveLoading.value = false;
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
              saveLoading.value = false;
            });
        })
        .catch((error: any) => {
          saveLoading.value = false;
          console.log("validate_client_error", error);
        });
    } catch (error) {
      message.error("Lỗi thêm mới thông tin kế hoạch");
      console.log(error);
    }
  }
};

const handleSaveOfficialInfo = async (form: any) => {
  if (Array.isArray(form.data) && form.data.length == 0) {
    message.error("Vui lòng chọn ít nhất 1 người đi công tác");
    saveLoading.value = false;

    return;
  }

  let result = officialInfoEx.value.validateForm();
  if (result.length != 0) {
    message.error(result.join(", "));
    saveLoading.value = false;

    return;
  }
  saveLoading.value = true;
  useSavePlanUser
    .mutateAsync(form)
    .then((response) => {
      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
        return false;
      }
      saveLoading.value = false;
      nextStep();
    })
    .catch((error) => {
      console.log(error);
      var response = error?.response?.data;
      if (Array.isArray(response.fieldErrors)) {
        message.error(
          response.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(response.title || response.message);
      }
      saveLoading.value = false;
    });
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
        id: form.value.id,
      })
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          message.error(response.statusText);
          return false;
        }
        // message.success(t("common.save_success", {}));
        nextStep();
        saveLoading.value = false;
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
        saveLoading.value = false;
      });
  } catch (error) {
    message.error("Lỗi thêm mới thông tin lộ trình");
    saveLoading.value = false;
    console.log(error);
  }
};

const handleSaveCostEstimate = (data: any) => {
  try {
    validateSaveCostEstimate(data.userLevel);
    useSaveCostEstimate
      .mutateAsync({
        data: data.userLevel,
        mode: data.mode,
      })
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          message.error(response.statusText);
          return false;
        }
        message.success(t("common.save_success", {}));
        nextStep();
        cancelForm();
        saveLoading.value = false;
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
        saveLoading.value = false;
      });
  } catch (error) {
    if (typeof error == "string") {
      message.error(error);
    }
    saveLoading.value = false;
  }
};
const validateSaveCostEstimate = (data: any) => {
  if (data.length == 0) {
    if (props.formData?.purpose?.is_cost) {
      throw "Chưa có dự tính chi phí";
    }
  }
};


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

.container {
}
</style>
