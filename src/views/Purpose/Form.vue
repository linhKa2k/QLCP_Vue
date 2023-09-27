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
        :maxlength="30"
        :disabled="form?.mode == 'edit'"
      />
    </a-form-item>

    <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
        :maxlength="255"
      />
    </a-form-item>
    <a-form-item name="is_cost">
      <a-radio-group v-model:value="form.is_cost" @change="changeIsCost">
        <a-radio :value="true">Lập dự toán chi phí</a-radio>
        <a-radio :value="false">Không dự toán chi phí</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      :label="fields.purpose_service_group.label"
      name="purpose_service_group"
    >
      <o-select
        :disabled="isDisabled"
        v-model:value="form.service_group"
        @input="onChangeServiceGroup($event)"
        :placeholder="fields.purpose_service_group.placeholder"
        entity="service-groups"
        :isDisplay="'none'"
        :mode="'multiple'"
        :textField="'name'"
        :showSearch="false"
        ref="service-group"
        valueField="id"
        :filters="[
          {
            field: 'is_active',
            operator: 'in',
            value: isActive.KICH_HOAT,
          },
          {
            field: 'is_default',
            operator: 'in',
            value: true,
          },
        ]"
      />
    </a-form-item>

    <a-form-item :label="fields.description.label" name="description">
      <a-textarea
        v-model:value="form.description"
        :placeholder="fields.description.placeholder"
        :maxlength="255"
      />
    </a-form-item>
    <a-form-item :label="fields.is_active.label" name="is_active">
      <a-switch
        :checked="form.is_active == true ? true : false"
        @change="handleChangeActive"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref, onMounted } from "vue";
import { isActive } from "@/common/enumUtility";
import Default from "@/common/DefaultData";
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
const isDisabled = ref<boolean>(false);
const optionsAdditional = ref<any>();
const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = false;
  } else {
    form.value.is_active = true;
  }
};
const onChangeServiceGroup = ($event) => {
  console.log("event", $event.value);
  form.value.service_group = $event.value;
  form.value.purpose_service_group = $event.value.map((item) => {
    delete item?.label;
    return {
      service_group: { id: item.value, key: item.value },
    };
  });
};

const changeIsCost = ($event) => {
  if (!$event.target.value) {
    isDisabled.value = true;
  } else {
    isDisabled.value = false;
  }
};

defineExpose({ ruleForm, form });

onMounted(() => {
  form.value.service_group = [];

  if (form.value.mode == "edit") {
    form.value.purpose_service_group.map((p) => {
      form.value.service_group.push(p?.service_group);
    });
    isDisabled.value = !form.value.is_cost;
  }
});
</script>
<style scoped>
.ant-form-item,
.ant-radio-group {
  margin-bottom: 12px;
}
</style>
