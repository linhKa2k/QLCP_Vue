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
      <!-- type-->
      <a-col span="12">
        <a-form-item name="type" :label="fields.type.label">
          <a-radio-group v-model:value="form.type" @change="changeType($event)">
            <a-radio :value="QuotaCommonType.CONG_TAC_TRONG_NUOC">{{ $t("livingCostQuota.type.1") }}</a-radio>
            <a-radio :value="QuotaCommonType.CONG_TAC_NUOC_NGOAI">{{ $t("livingCostQuota.type.2") }}</a-radio>
          </a-radio-group>
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
    </a-row>
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item
          :label="fields.service_group_id.label"
          name="service_group"
        >
          <o-select
            :disabled="true"
            v-model:value="form.service_group"
            @input="onChangeServiceGroup"
            :placeholder="fields.service_group_id.placeholder"
            entity="service-groups"
            :isDisplay="'none'"
            :textField="'name'"
            ref="service-group"
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
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.country_id.label" name="country">
          <o-select
            :disabled="disabledCountry"
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
    </a-row>
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.service_id.label" name="service">
          <o-select
            v-model:value="form.service"
            @input="onChangeService"
            :placeholder="fields.service_id.placeholder"
            entity="services"
            :isDisplay="'none'"
            :textField="'name'"
            ref="service"
            valueField="id"
            :filters="[
              {
                field: 'service_group_id',
                operator: 'equal',
                value: form?.service_group?.key
                  ? form?.service_group?.key
                  : null,
              },
              {
                field: 'is_active',
                operator: 'in',
                value: isActive.KICH_HOAT,
              },
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.amount.label" name="amount">
          <a-input-number
            style="width: 100%"
            v-model:value="form.amount"
            :placeholder="fields.amount.placeholder"
            :min="1"
            :max="1000000000"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
            :maxlength="14"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col span="6">
        <a-form-item :label="fields.start_date.label" name="start_date">
          <a-date-picker
            v-model:value="form.start_date"
            format="DD/MM/YYYY"
            :placeholder="fields.start_date.label"
            class="width_item"
            :allowClear="false"
            @change="onchangeStartTime"
          /> </a-form-item
      ></a-col>
      <a-col span="6">
        <a-form-item :label="fields.end_date.label" name="end_date">
          <a-date-picker
            v-model:value="form.end_date"
            format="DD/MM/YYYY"
            :placeholder="fields.end_date.label"
            class="width_item"
            :allowClear="false"
            @change="onchangeEndTime"
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
import Constant from "@/constant";
import { message } from "ant-design-vue";
import moment from "moment";
import { QuotaCommonType, isActive } from "@/common/enumUtility";
import DefaultData from "@/common/DefaultData";
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
const provinceDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const serviceDisabled = ref<boolean>(true);
const province = ref<any>();
const disabledCountry = ref<boolean>(true);
const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = isActive.KHONG_KICH_HOAT;
  } else {
    form.value.is_active = isActive.KICH_HOAT;
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

const onchangeStartTime = () => {
  if (form.value.end_date) {
    let compare = moment(form.value.start_date).isSameOrBefore(
      moment(form.value.end_date),
      "day"
    );
    if (!compare) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      form.value.start_date = null;
    }
  }
};

const onchangeEndTime = () => {
  if (form.value.start_date) {
    let compare = moment(form.value.end_date).isSameOrAfter(
      moment(form.value.start_date),
      "day"
    );
    if (!compare) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_date = null;
    }
  }
};

const onChangeProvince = ($event) => {
  if ($event.value) {
    form.value.province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    let item = province.value;
    onChangeLocation($event, item, "country_id");
    districtDisabled.value = false;
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

const onChangeServiceGroup = ($event) => {
  if ($event) {
    form.value.service_group = {
      key: $event.value.key,
      id: $event.value.key,
    };
    serviceDisabled.value = false;
  } else {
    serviceDisabled.value = true;

    form.value.service_group = {
      key: null,
      id: null,
    };
  }
};

const onChangePositionGroup = ($event) => {
  if ($event) {
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

const onChangeService = ($event) => {
  if ($event.value) {
    form.value.service = {
      key: $event.value.key,
      id: $event.value.key,
    };
    // let item = province.value;
    // onChangeLocation($event, item, "country_id");
  } else {
    form.value.service = {
      key: null,
      id: null,
    };
  }
};

const changeType = ($event) => {
  form.value.type = $event.target.value;
  if (form.value.type == QuotaCommonType.CONG_TAC_TRONG_NUOC) {
    disabledCountry.value = true;
    form.value.country = DefaultData.categoryDefault.vietNamCountry;
  } else {
    disabledCountry.value = false;
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
