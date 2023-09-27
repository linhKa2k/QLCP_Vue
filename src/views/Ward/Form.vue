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
          /> </a-form-item
      ></a-col>
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
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="fields.district_id.label" name="district">
          <o-select
            :disabled="districtDisabled"
            v-model:value="form.district"
            @input="onChangeDistrict"
            :placeholder="fields.district_id.placeholder"
            entity="districts"
            :isDisplay="'none'"
            :textField="'name'"
            ref="district"
            valueField="id"
            :filters="[
              {
                field: 'province_id',
                operator: 'equal',
                value: form?.province?.key ? form?.province?.key : null,
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
    <a-row gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.type.label" name="type">
          <a-radio-group v-model:value="form.type">
            <a-radio :value="1">{{ $t("common.village") }}</a-radio>
            <a-radio :value="2">{{ $t("common.sub_district") }}</a-radio>
            <a-radio :value="3">{{ $t("common.town") }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
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
import { ref, watch } from "vue";
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

const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const districtDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);

const province = ref();
const district = ref();

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
    };
    provinceDisabled.value = false;
  } else {
    provinceDisabled.value = true;

    form.value.country = {
      key: null,
    };
  }
};
const onChangeProvince = ($event) => {
  if ($event.value) {
    form.value.province = {
      key: $event.value.key,
    };
    districtDisabled.value = false;
  } else {
    form.value.province = {
      key: null,
    };
    districtDisabled.value = true;
  }
};
const onChangeDistrict = ($event) => {
  if ($event.value) {
    form.value.district = {
      key: $event.value.key,
    };
  } else {
    form.value.district = {
      key: null,
    };
  }
};

defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
