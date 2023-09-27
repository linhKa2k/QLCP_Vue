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
      <a-col span="12">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
            :maxlength="30"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == isActive.KICH_HOAT ? true : false"
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
      <a-col span="24">
        <a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
            :maxlength="30"
          />
        </a-form-item>
      </a-col>
      <a-col span="24">
        <a-form-item :label="fields.sort_order.label" name="sort_order">
          <a-input
            v-model:value="form.sort_order"
            :placeholder="fields.sort_order.placeholder"
            :maxlength="30"
            type="number"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.start_time.label" name="start_time">
          <a-date-picker
            v-model:value="form.start_time"
            format="DD/MM/YYYY"
            :placeholder="fields.start_time.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
      <a-col span="12">
        <a-form-item :label="fields.end_time.label" name="end_time">
          <a-date-picker
            v-model:value="form.end_time"
            format="DD/MM/YYYY"
            :placeholder="fields.end_time.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.publish_time.label" name="publish_time">
          <a-date-picker
            v-model:value="form.publish_time"
            format="DD/MM/YYYY"
            :placeholder="fields.publish_time.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
      <a-col span="12">
        <a-form-item :label="fields.expire_time.label" name="expire_time">
          <a-date-picker
            v-model:value="form.expire_time"
            format="DD/MM/YYYY"
            :placeholder="fields.expire_time.label"
            class="width_item"
            :allowClear="false"
          /> </a-form-item
      ></a-col>
    </a-row>

    <a-form-item :label="fields.description.label" name="description">
      <a-textarea
        v-model:value="form.description"
        :placeholder="fields.description.placeholder"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
import {isActive} from "@/common/enumUtility"
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
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const province = ref<any>();
const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);


const onChangeLocation = ($event, item, field) => {
  let value = $event.value ? $event.value.key : void 0;
  item.onLoad({ field, value });
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