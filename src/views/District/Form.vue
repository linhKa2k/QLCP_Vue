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
            :maxlength="10"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
            :maxlength="30"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="fields.country_id.label" name="country">
          <o-select
            v-model:value="form.country"
            @input="onChangeCountry"
            :placeholder="fields.country_id.placeholder"
            entity="countries"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="fields.province_id.label" name="province">
          <o-select
            :disabled="provinceDisabled"
            v-model:value="form.province"
            @input="onChangeProvince"
            :placeholder="fields.province_id.placeholder"
            entity="provinces"
            :isDisplay="'none'"
            :textField="'name'"
            ref="province"
            valueField="id"
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
      </a-col>
    </a-row>
    <a-form-item :label="fields.type.label" name="type">
      <a-radio-group v-model:value="form.type">
        <a-radio :value="1">{{ $t("district.type.1") }}</a-radio>
        <a-radio :value="2">{{ $t("district.type.2") }}</a-radio>
        <a-radio :value="3">{{ $t("district.type.3") }}</a-radio>
        <a-radio :value="4">{{ $t("district.type.4") }}</a-radio>
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
import formUtility from "@/formUtility";
import { computed, ref } from "vue";
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
const provinceDisabled = ref<boolean>((form.value.mode == "edit" ? false : true));
const province = ref<any>();
const district = ref<any>();

console.log("fields", props.fields);

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = false;
  } else {
    form.value.is_active = true;
  }
};

const onChangeCountry = ($event) => {
  if ($event) {
    form.value.country = {
      key: $event.value.key,
      id: $event.value.key,
    };
    provinceDisabled.value = false;
  } else {
    provinceDisabled.value = true;

    form.value.country = {
      key: null,
      id: null,
    };
  }
  form.value.province = void 0;
};
const onChangeProvince = ($event) => {
  if ($event.value) {
    form.value.province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    let item = province.value;
    onChangeLocation($event, item, "country_id");
  } else {
    form.value.province = {
      key: null,
      id: null,
    };
  }
};

const onChangeLocation = ($event, item, field) => {
  let value = $event.value ? $event.value.key : void 0;
  item.onLoad({ field, value });
};

defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
