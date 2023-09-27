<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-form-item :label="fields.code.label" name="code">
      <a-input
        v-model:value="form.code"
        :placeholder="fields.code.placeholder"
        :maxlength="10"
      />
    </a-form-item>

    <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
        :maxlength="30"
      />
    </a-form-item>

    <a-form-item name="is_cost_prediction">
      <a-radio-group
        v-model:value="form.is_cost_prediction"
        @change="changeIsCostPrediction($event)"
      >
        <a-radio :value="true">{{
          $t("positionGroup.is_cost_prediction.yes")
        }}</a-radio>
        <a-radio :value="false">{{
          $t("positionGroup.is_cost_prediction.no")
        }}</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item :label="fields.department_id.label" name="department">
      <o-select
        v-model:value="form.department"
        @input="onChangeDepartment"
        :placeholder="fields.department_id.placeholder"
        entity="departments"
        :isDisplay="'none'"
        :textField="'name'"
        :valueField="'id'"
      />
    </a-form-item>
    <a-form-item :label="'Chức vụ'" name="position">
      <o-select
        ref="positions"
        :value="form.positions"
        @input="onChangePosition"
        placeholder="Vui lòng chọn  chức vụ"
        entity="positions"
        :icon="'environment'"
        :isDisplay="'none'"
        mode="multiple"
        textField="name"
        valueField="id"
        :filters="[
          {
            field: 'is_active',
            operator: 'in',
            value: isActive.KICH_HOAT,
          },
        ]"
      />
    </a-form-item>
    <a-form-item :label="fields.description.label" name="description">
      <a-textarea
        v-model:value="form.description"
        :placeholder="fields.description.placeholder"
      />
    </a-form-item>

    <a-form-item :label="fields.is_active.label" name="is_active">
      <a-switch
        :checked="form.is_active == isActive.KICH_HOAT ? true : false"
        @change="handleChangeActive"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref, onMounted } from "vue";
import { isActive } from "@/common/enumUtility";
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
const ruleForm = ref<any>();
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("vertical");
const form = ref<any>(props.formData);

const changeType = ($event) => {
  form.value.type = $event.target.value;
};

const onChangePosition = ($event) => {
  if ($event.value.length > 0) {
    let data = $event.value;
    data.forEach((p) => {
      delete p.label;
    });
    form.value.positions = data;
  } else {
    form.value.positions = [];
  }
};

const onChangeDepartment = ($event) => {
  if ($event.value) {
    form.value.department = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.department = {
      key: null,
      id: null,
    };
  }
};

const changeIsCostPrediction = ($event?: any) => {
  form.value.is_cost_prediction = $event.target.value;
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
defineExpose({ ruleForm, form });

onMounted(() => {
  form.value.positions = form.value.positions.map((item) => {
    return {
      ...item,
      label: item.name,
      value: item.id,
    };
  });
});
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
