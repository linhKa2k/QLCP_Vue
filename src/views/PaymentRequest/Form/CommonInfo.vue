<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
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
                <a-form-item label="Mã kế hoạch" name="code">
                  <a-input
                    v-model:value="form.code"
                    placeholder="Mã kế hoạch"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="type" :label="fields.type.label">
                  <a-radio-group
                    v-model:value="form.type"
                    @change="changeType($event)"
                  >
                    <a-radio :value="1">{{ $t("plan.type.1") }}</a-radio>
                    <a-radio :value="2">{{ $t("plan.type.2") }}</a-radio>
                  </a-radio-group>
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
                    :disabled="false"
                    v-model:value="form.purpose"
                    @input="onChangePurpose"
                    :placeholder="fields.purpose_id.placeholder"
                    entity="purposes"
                    :isDisplay="'none'"
                    :textField="'name'"
                    ref="purpose"
                    valueField="id"
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
                    textField="name"
                    valueField="id"
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
                    entity="users"
                    :title="fields.user_require_id.label"
                    :icon="'environment'"
                    :isDisplay="'none'"
                    :isDisplayAdd="'none'"
                    textField="fullName"
                    valueField="id"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  :label="fields.department_process_id.label"
                  name="department_process_id"
                >
                  <o-select
                    ref="execution_department"
                    v-model:value="form.department_process"
                    @input="onChangeDepartmentProcess"
                    :placeholder="fields.department_process_id.placeholder"
                    entity="departments"
                    :title="fields.department_process_id.label"
                    :icon="'environment'"
                    :isDisplay="'none'"
                    :isDisplayAdd="'none'"
                    textField="name"
                    valueField="id"
                  /> </a-form-item
              ></a-col>
              <a-col :span="12">
                <a-form-item
                  :label="fields.user_process_id.label"
                  name="user_process_id"
                >
                  <o-select
                    ref="user_process"
                    v-model:value="form.user_process"
                    @input="onChangeUserProcess"
                    :placeholder="fields.user_process_id.placeholder"
                    entity="users"
                    :title="fields.user_process_id.label"
                    :icon="'environment'"
                    :isDisplay="'none'"
                    :isDisplayAdd="'none'"
                    textField="fullName"
                    valueField="id"
                  /> </a-form-item
              ></a-col>
              <a-col :span="12">
                <a-form-item :label="fields.start_time.label" name="start_time">
                  <a-date-picker
                    v-model:value="form.start_time"
                    format="DD/MM/YYYY"
                    :placeholder="fields.start_time.label"
                    class="width_item"
                    :allowClear="false"
                    @onChange="onChangrStartTime"
                    @change="checkDateRange"
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
                    @change="checkDateRange"
                  /> </a-form-item
              ></a-col>

              <a-col :span="24">
                <a-form-item
                  :label="'Chi tiết công việc'"
                  name="description"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <a-textarea
                    v-model:value="form.description"
                    placeholder="Chi tiết công việc"
                    :rows="4"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row>
          <a-col>
            <a-checkbox v-model:checked="form.is_add"
              >Kế hoạch bổ sung</a-checkbox
            >
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24" v-show="false">
        <a-form-item :label="fields.status.label" name="status">
          <a-select
            :value="form.status != '' ? form.status : (form.status = activeEnum.KICH_HOAT)"
            :options="Constant.planStatus"
            :placeholder="fields.status.placeholder"
            @change="handleChangeStatus(form, $event)"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import i18n from "@/lang";
import { useDetail } from "@/hooks/plan";
import { generateData } from "@/common/generateData";
import Constant from "@/constant";
import { message } from "ant-design-vue";
import Model from "@/config/models";
import { isActive as activeEnum} from "@/common/enumUtility";

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

let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const Models = ref<any>(Model);

const plan_id = ref<any>(props.form.id ? props.form.id : null);
const modelsConfig = ref<any>(Models.value["plan"]);
const fields = ref<any>(Models.value["plan"] || {});
const form = ref<any>(props.form);
const ruleForm = ref();
const enabledGetPlanDetail = computed(() => {
  return plan_id.value !== null;
});

const changeType = async ($event) => {
  form.value.type = $event.target.value;
};

const handleChangeStatus = (form, value) => {
  if (form.status != "") {
    form.status = value;
  } else form.status = 2;
};

const onChangePurpose = ($event) => {
  if ($event) {
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
  if ($event) {
    form.value.department_require = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.department_require = {
      key: null,
      id: null,
    };
  }
};

const onChangeUserDepartment = ($event) => {
  if ($event) {
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
  if ($event) {
    form.value.department_process = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.department_process = {
      key: null,
      id: null,
    };
  }
};
const onChangeUserProcess = ($event) => {
  if ($event) {
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
const onChangrStartTime = (event) => {
  console.log(event);
};
const { isLoading: planLoading } = useDetail(plan_id, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanDetail,
  retry: false,
  onSuccess: async (val) => {
    form.value = await generateData(modelsConfig, val.data);
  },
});

const checkDateRange = () => {
  if (form.value.start_time && form.value.end_time) {
    const start = new Date(form.value.start_time);
    const end = new Date(form.value.end_time);
    if (end <= start) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_time = null;
    }
  }
};

// const commonInfoData = () => {
//   const keyWord = [
//     "purpose",
//     "department_require",
//     "department_process",
//     "user_process",
//     "user_require",
//   ];
//   const ruleKey = {
//     user_process: { value: "id", label: "username" },
//     user_require: { value: "id", label: "username" },
//   };
//   form.value = generateDataObject(keyWord, ruleKey, formProps.value);
// };

defineExpose({
  ruleForm,
  form,
});
</script>
<style scoped>
.width_item {
  width: 100%;
}
</style>
