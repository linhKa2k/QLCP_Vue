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
        :maxLength="100"
      />
    </a-form-item>

    <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
        :maxLength="100"
      />
    </a-form-item>

    <a-row :gutter="16">
      <a-col :span="24">
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
      <a-col :span="24">
        <a-form-item :label="fields.province_id.label" name="province">
          <o-select
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

    <a-row :gutter="16">
      <a-col span="24">
        <a-form-item :label="fields.description.label" name="description">
          <a-textarea
            v-model:value="form.description"
            :placeholder="fields.description.placeholder"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item :label="fields.is_active.label" name="is_active">
      <a-switch
        :checked="form.is_active"
        @change="handleChangeActive"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
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
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const province = ref<any>();
const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
console.log(props.rules);
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

const handleChangeActive = ($event?: any) => {
    form.value.is_active = $event;

};
defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
