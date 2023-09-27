<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
            :maxlength="20"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24"
        ><a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
            :maxlength="50"
          /> </a-form-item
      ></a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="fields.start_date.label" name="start_date">
          <a-date-picker
            v-model:value="form.start_date"
            format="DD/MM/YYYY"
            :placeholder="fields.start_date.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
      <a-col :span="12">
        <a-form-item :label="fields.end_date.label" name="end_date">
          <a-date-picker
            v-model:value="form.end_date"
            format="DD/MM/YYYY"
            :placeholder="fields.end_date.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
    </a-row>
    <a-col :span="24"
      ><a-form-item :label="fields.description.label" name="description">
        <a-textarea
          v-model:value="form.description"
          :placeholder="fields.description.placeholder"
        /> </a-form-item
    ></a-col>

    <a-col :span="24">
      <a-form-item :label="fields.is_active.label" name="is_active">
        <a-switch
          :checked="form.is_active == isActive.KICH_HOAT ? true : false"
          @change="handleChangeActive"
        />
      </a-form-item>
    </a-col>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
import { isActive} from "@/common/enumUtility"
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

const onChangePositionGroup = ($event) => {
  if ($event.value) {
    form.value.position_group = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.position_group = {
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
.width_item {
  width: 100%;
}
</style>
  