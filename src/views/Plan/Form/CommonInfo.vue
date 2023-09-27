<template>
  <a-spin :spinning="planLoading">
    <a-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      :layout="layout"
      labelAlign="left"
      :loading="planLoading"
    >
      <a-row :gutter="[0, 16]">
        <a-col :span="24">
          <a-row :gutter="[24, 0]">
            <a-col :span="24">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item name="type" :label="fields.type.label">
                    <a-radio-group
                      v-model:value="form.type"
                      @change="changeType($event)"
                      :disabled="form.is_add"
                    >
                      <a-radio :value="1">{{ $t("plan.type.1") }}</a-radio>
                      <a-radio :value="2">{{ $t("plan.type.2") }}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-row>
                    <a-col>
                      <a-checkbox
                        v-model:checked="form.is_add"
                        @change="changeIsAdd"
                        >Kế hoạch bổ sung</a-checkbox
                      >
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="Mã kế hoạch"
                    name="code"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <a-input
                      v-model:value="form.code"
                      placeholder="Mã kế hoạch"
                      disabled
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="Kế hoạch gốc"
                    :name="'parent'"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="
                      form.is_add
                        ? [
                            {
                              required: true,
                              message: 'Vui lòng chọn kế hoạch công tác',
                            },
                          ]
                        : []
                    "
                  >
                    <o-select
                      :disabled="!form.is_add"
                      v-model:value="form.parent"
                      @input="onChangeParent($event)"
                      :placeholder="'Kế hoạch gốc'"
                      entity="plans"
                      :isDisplay="'none'"
                      ref="parent"
                      :textField="['code', 'name']"
                      valueField="id"
                      :filters="[
                        {
                          field: 'is_add',
                          operator: 'in',
                          value: form?.is_add ? planIsAdd.KE_HOACH_GOC : null,
                        },
                        {
                          field: 'status',
                          operator: 'in',
                          value: [
                            planStatusEnum.done_approve,
                            planStatusEnum.waiting_confirm_result_work,
                            planStatusEnum.confirm_result_work,
                          ],
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields.name.label" name="name">
                    <a-input
                      v-model:value="form.name"
                      :placeholder="fields.name.placeholder"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields.purpose_id.label" name="purpose">
                    <o-select
                      :disabled="form.is_add ? form.is_add : false"
                      v-model:value="form.purpose"
                      @input="onChangePurpose"
                      :placeholder="fields.purpose_id.placeholder"
                      entity="purposes"
                      :isDisplay="'none'"
                      :textField="'name'"
                      ref="purpose"
                      valueField="id"
                      :filters="[
                        {
                          field: 'is_active',
                          operator: 'in',
                          value: activeEnum.KICH_HOAT,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="fields.department_require_id.label"
                    name="department_require_id"
                  >
                    <o-select
                      ref="department_require_id"
                      v-model:value="form.department_require"
                      @input="onChangeRequestDepartment"
                      :placeholder="fields.department_require_id.placeholder"
                      entity="departments"
                      :title="fields.department_require_id.label"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      :textField="['code', 'name']"
                      valueField="id"
                      :filters="[
                        {
                          field: 'is_active',
                          operator: 'in',
                          value: activeEnum.KICH_HOAT,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="fields.user_require_id.label"
                    name="user_require_id"
                  >
                    <o-select
                      ref="user_require"
                      v-model:value="form.user_require"
                      @input="onChangeUserDepartment"
                      :placeholder="fields.user_require_id.placeholder"
                      entity="user-departments/users"
                      :title="fields.user_require_id.label"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="fullName"
                      valueField="id"
                      :disabled="!form.department_require?.id"
                      :filters="[
                        {
                          field: 'departmentId',
                          operator: 'equal',
                          value: form?.department_require?.key
                            ? form?.department_require?.key
                            : 0,
                        },
                        {
                          field: 'is_active',
                          operator: 'in',
                          value: activeEnum.KICH_HOAT,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item
                    :label="fields.department_process_id.label"
                    name="department_process"
                  >
                    <o-select
                      ref="department_process"
                      :disabled="form.is_add ? form.is_add : false"
                      v-model:value="form.department_process"
                      @input="onChangeDepartmentProcess"
                      :placeholder="fields.department_process_id.placeholder"
                      entity="departments"
                      :title="fields.department_process_id.label"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      :textField="['code', 'name']"
                      valueField="id"
                      :filters="[
                        {
                          field: 'is_active',
                          operator: 'in',
                          value: activeEnum.KICH_HOAT,
                        },
                      ]"
                    /> </a-form-item
                ></a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="fields.user_process_id.label"
                    name="user_process"
                  >
                    <o-select
                      :disabled="
                        form.is_add || !form.department_process?.id
                          ? true
                          : false
                      "
                      ref="user_process"
                      v-model:value="form.user_process"
                      @input="onChangeUserProcess"
                      :placeholder="fields.user_process_id.placeholder"
                      entity="user-departments/users"
                      :title="fields.user_process_id.label"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="fullName"
                      valueField="id"
                      :filters="[
                        {
                          field: 'departmentId',
                          operator: 'equal',
                          value: form?.department_process?.key
                            ? form?.department_process?.key
                            : null,
                        },
                        {
                          field: 'is_active',
                          operator: 'in',
                          value: activeEnum.KICH_HOAT,
                        },
                      ]"
                    /> </a-form-item
                ></a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="fields.start_time.label"
                    name="start_time"
                  >
                    <a-date-picker
                      v-model:value="form.start_time"
                      format="DD/MM/YYYY"
                      :placeholder="fields.start_time.label"
                      class="width_item"
                      :allowClear="false"
                      @change="onChangeStartTime"
                    /> </a-form-item
                ></a-col>
                <a-col :span="12">
                  <a-form-item :label="fields.end_time.label" name="end_time">
                    <a-date-picker
                      v-model:value="form.end_time"
                      format="DD/MM/YYYY"
                      :placeholder="fields.end_time.label"
                      class="width_item"
                      :allowClear="false"
                      @change="onChangeEndTime"
                    /> </a-form-item
                ></a-col>

                <a-col :span="24">
                  <a-form-item
                    :label="'Chi tiết công việc'"
                    name="description"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <a-textarea
                      :disabled="form.is_add ? form.is_add : false"
                      v-model:value="form.description"
                      placeholder="Chi tiết công việc"
                      :rows="4"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24" v-if="form.is_add ? form.is_add : false">
                  <a-form-item
                    :label="'Nội dung công tác bổ sung'"
                    name="note"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <a-textarea
                      v-model:value="form.note"
                      placeholder="Nội dung công tác bổ sung"
                      :rows="4"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="24" v-show="false">
          <a-form-item :label="fields.status.label" name="status">
            <a-select
              :value="
                form.status != ''
                  ? form.status
                  : (form.status = activeEnum.KICH_HOAT)
              "
              :options="Constant.planStatus"
              :placeholder="fields.status.placeholder"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import i18n from "@/lang";
import { useDetail } from "@/hooks/plan";
import { generateData } from "@/common/generateData";
import Constant from "@/constant";
import { message } from "ant-design-vue";
import Model from "@/config/models";
import {
  isActive as activeEnum,
  planStatus as planStatusEnum,
  planType as planTypeEnum,
  planIsAdd,
} from "@/common/enumUtility";
import moment from "moment";
import { useAuth } from "@websanova/vue-auth";

const { t } = i18n.global;
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
var authStore = useAuth();
const userInfo: any = authStore.user();
const layout = ref<string>("horizontal");
const Models = ref<any>(Model);
const plan_id = ref<any>(props.form.id ? props.form.id : null);
const modelsConfig = ref<any>(Models.value["plan"]);
const fields = ref<any>(Models.value["plan"] || {});
const form = ref<any>(props.form);
const ruleForm = ref();
const mode = ref<any>("add");
const enabledGetPlanDetail = computed(() => {
  return plan_id.value !== null;
});

const changeType = async ($event) => {
  form.value.type = $event.target.value;
};

const changeIsAdd = (event) => {
  if (!event.target.checked) {
    form.value.is_add = event.target.checked;
    form.value.type = planTypeEnum.TRONG_NUOC;
    delete form.value["parent"];
  }
};

const onChangeParent = async ($event) => {
  if ($event.value) {
    let data = await $event.value.options.find((i) => i.id == $event.value.key);
    let dataConfig = generateData(modelsConfig, data);
    if (data) {
      if (mode.value != "edit") {
        form.value = dataConfig;
        form.value.code = null;
        form.value.id = null;
        form.value.is_add = true;
      } else {
        const id = form.value.id;
        const code = form.value.code;
        form.value = { ...dataConfig };
        form.value.id = id;
        form.value.code = code;
        form.value.status = planStatusEnum.init;
        form.value.is_add = true;
      }
      // }
      form.value.parent = {
        key: $event.value.key,
        id: $event.value.key,
      };
    }
  } else {
    form.value.parent = {
      key: null,
      id: null,
    };
  }
};

const onChangePurpose = ($event) => {
  if ($event.value) {
    form.value.purpose = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.purpose = {
      key: null,
      id: null,
    };
  }
};

const onChangeRequestDepartment = ($event) => {
  if ($event.value) {
    form.value.department_require = {
      key: $event.value.key,
      id: $event.value.key,
    };

    delete form.value["user_require"];
  } else {
    form.value.department_require = {
      key: null,
      id: null,
    };
  }
};

const onChangeUserDepartment = ($event) => {
  if ($event.value) {
    form.value.user_require = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.user_require = {
      key: null,
      id: null,
    };
  }
};

const onChangeDepartmentProcess = ($event) => {
  if ($event.value) {
    form.value.department_process = {
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["user_process"];
  } else {
    form.value.department_process = $event.value;
    form.value.user_process = $event.value;
  }
};
const onChangeUserProcess = ($event) => {
  if ($event.value) {
    form.value.user_process = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.user_process = {
      key: null,
      id: null,
    };
  }
};

const onChangeStartTime = () => {
  if (form.value.end_time) {
    let compare = moment(form.value.start_time).isSameOrBefore(
      moment(form.value.end_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      form.value.start_time = null;
    }
  }
};

const onChangeEndTime = () => {
  if (form.value.start_time) {
    let compare = moment(form.value.end_time).isSameOrAfter(
      moment(form.value.start_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_time = null;
    }
  }
};
const { isLoading: planLoading } = useDetail(plan_id, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanDetail,
  retry: true,
  onSuccess: async (val) => {
    form.value = await generateData(modelsConfig, val.data);
    mode.value = "edit";
  },
});

const defaultValue = () => {
  if (mode.value == "add") {
    form.value.user_process = {
      id: userInfo.id,
      key: userInfo.id,
      label: userInfo.full_name,
    };
    if (userInfo.departments.length > 0) {
      form.value.department_process = {
        id: userInfo.departments[0].id,
        key: userInfo.departments[0].id,
        label: userInfo.departments[0].name,
      };
    }
  }
};
defineExpose({
  ruleForm,
  form,
});

onMounted(() => {
  defaultValue();
});
</script>
<style scoped>
.width_item {
  width: 100%;
}
</style>
