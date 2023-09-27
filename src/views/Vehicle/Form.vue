<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-row>
      <a-col :span="24">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
            :maxlength="20"
          />
        </a-form-item>
        <a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item
          :label="fields.vehicle_group_id.label"
          name="vehicle_group"
        >
          <o-select
            v-model:value="form.vehicle_group"
            @input="onChangeVehicleGroup"
            :placeholder="fields.vehicle_group_id.placeholder"
            entity="vehicle-groups"
            :isDisplay="'none'"
            :textField="'name'"
            :valueField="'id'"
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
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
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
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("vertical");
const form = ref<any>(props.formData);

const onChangeVehicleGroup = ($event) => {
  if ($event.value) {
    form.value.vehicle_group = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.vehicle_group = {
      key: null,
      id: null,
    };
  }
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
