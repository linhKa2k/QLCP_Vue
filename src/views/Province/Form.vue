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

    <a-form-item :label="fields.country_id.label" name="country">
      <o-select
        v-model:value="form.country"
        @input="onChangeCountry"
        :placeholder="fields.country_id.placeholder"
        entity="countries"
        :isDisplay="'none'"
        :textField="'name'"
        :valueField="'id'"
      />
    </a-form-item>
    <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
        :maxlength="30"
      />
    </a-form-item>
    <a-form-item :label="fields.area_id.label" name="area">
      <o-select
        v-model:value="form.area"
        @input="onChangeArea"
        :placeholder="fields.area_id.placeholder"
        entity="areas"
        :isDisplay="'none'"
        :textField="'name'"
        :filters="[
          {
            field: 'country_id',
            operator: 'equal',
            value: form?.country?.key ? form?.country?.key : null,
          },
          {
            field: 'is_active',
            operator: 'in',
            value: form?.mode == 'add' ? 1 : null,
          },
        ]"
      />
    </a-form-item>
    <a-form-item :label="fields.type.label" name="type">
      <a-radio-group v-model:value="form.type">
        <a-radio :value="2">{{ $t("province.type.1") }}</a-radio>
        <a-radio :value="1">{{ $t("province.type.2") }}</a-radio>
      </a-radio-group>
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
import { useGetList } from "@/hooks/country";
import formUtility from "@/formUtility";
import { ref } from "vue";
import { message } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;

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
const layout = ref<string>("Vertical");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);

const filterList = ref<any>();

const getFilterList = (params: any) => {
  filterList.value = params;
};

const checkError = (data) => {
  if (typeof data.data.errorCode !== "undefined") {
    if (data.data.errorCode !== 0) {
      message.error(data.data.errorMessage);
    }
  } else {
    message.error(t("common.system_error"));
  }
};
const onChangeCountry = ($event) => {
  if ($event.value) {
    form.value.country = {
      key: $event.value.key,
    };
  } else {
    form.value.country = {
      key: null,
    };
  }
};
const onChangeArea = ($event) => {
  if ($event.value) {
    form.value.area = {
      key: $event.value.key,
    };
  } else {
    form.value.area = {
      key: null,
    };
  }
};
const forms = ref<any>(props.formData);
const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = false;
  } else {
    form.value.is_active = true;
  }
};
const handleChangeType = ($event?: any) => {
  if (!$event) {
    forms.value.is_city = false;
  } else {
    forms.value.is_city = true;
  }
};
defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
