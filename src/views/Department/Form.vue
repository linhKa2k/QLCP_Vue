<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-row :gutter="[16, 0]">
      <a-col :span="12">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
            :maxlength="30"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
            :maxlength="255"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
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
            :filters="[
              {
                field: 'is_active',
                operator: 'in',
                value: form?.mode == 'add' ? 1 : null,
              },
            ]"
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
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
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
            ref="districts"
            valueField="id"
            :filters="[
              {
                field: 'province_id',
                operator: 'equal',
                value: form?.province?.key ? form?.province?.key : null,
              },
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="fields.ward_id.label" name="ward">
          <o-select
            :disabled="wardDisabled"
            v-model:value="form.ward"
            @input="onChangeWard"
            placeholder="Vui lòng chọn xã/phường"
            entity="wards"
            :isDisplay="'none'"
            :textField="'name'"
            ref="wards"
            valueField="id"
            :filters="[
              {
                field: 'district_id',
                operator: 'equal',
                value: form?.district?.key ? form?.district?.key : null,
              },
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item :label="fields.description.label" name="description">
          <a-textarea
            v-model:value="form.description"
            :placeholder="fields.description.placeholder"
            :maxlength="255"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
      <a-col :span="12">
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == true ? true : false"
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12"></a-col>
    </a-row>
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
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("vertical");
const form = ref<any>(props.formData);

const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const districtDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const wardDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const country = ref();
const province = ref();
const district = ref();
const ward = ref();

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
    wardDisabled.value = false;
  } else {
    form.value.district = {
      key: null,
    };
    wardDisabled.value = true;
  }
};
const onChangeWard = ($event) => {
  if ($event.value) {
    form.value.ward = {
      key: $event.value.key,
    };
  } else {
    form.value.ward = {
      key: null,
    };
  }
};
const onChangeBranch = ($event) => {
  if ($event.value) {
    form.value.branch = {
      key: $event.value.key,
    };
  } else {
    form.value.branch = {
      key: null,
    };
  }
};

const onChangeParent = ($event) => {
  if ($event.value) {
    form.value.parent = {
      key: $event.value.key,
    };
  } else {
    form.value.parent = {
      key: null,
    };
  }
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = false;
  } else {
    form.value.is_active = true;
  }
};
defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
