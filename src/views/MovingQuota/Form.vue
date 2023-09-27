<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item name="type" :label="fields.type.label">
          <a-radio-group v-model:value="form.type" @change="changeType($event)">
            <a-radio :value="QuotaCommonType.CONG_TAC_TRONG_NUOC">{{ $t("livingQuota.type.1") }}</a-radio>
            <a-radio :value="QuotaCommonType.CONG_TAC_NUOC_NGOAI">{{ $t("livingQuota.type.2") }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.country_id.label" name="country">
          <o-select
            :disabled="form.type == QuotaCommonType.CONG_TAC_TRONG_NUOC"
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

    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item
          :label="fields.from_distance.label"
          name="from_distance"
          v-if="form.type != QuotaCommonType.CONG_TAC_NUOC_NGOAI"
        >
          <a-input-number
            :style="'width: 100%;'"
            v-model:value="form.from_distance"
            :placeholder="fields.from_distance.placeholder"
            @blur="onChangeFromDistance"
            :min="0"
            :maxlength="20"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item
          :label="fields.to_distance.label"
          name="to_distance"
          v-if="form.type != QuotaCommonType.CONG_TAC_NUOC_NGOAI"
        >
          <a-input-number
            :style="'width: 100%;'"
            v-model:value="form.to_distance"
            :placeholder="fields.to_distance.placeholder"
            :min="0"
            :maxlength="20"
            @blur="onchangeToDistance"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item :label="fields.amount.label" name="amount">
          <a-input-number
            v-model:value="form.amount"
            :placeholder="fields.amount.placeholder"
            :min="1"
            :max="1000000000"
            :maxlength="14"
            style="width: 100%"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == isActive.KICH_HOAT "
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item :label="fields.start_time.label" name="start_time">
          <a-date-picker
            v-model:value="form.start_time"
            format="DD/MM/YYYY"
            :placeholder="fields.start_time.label"
            class="width_item"
            :allowClear="false"
            @change="onchangeStartTime"
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
import { ref } from "vue";
import { message } from "ant-design-vue";
import moment from "moment";
import Default from "@/common/DefaultData"
import {QuotaCommonType,isActive}from "@/common/enumUtility"
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
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = isActive.KHONG_KICH_HOAT;
  } else {
    form.value.is_active = isActive.KICH_HOAT;
  }
};

function precise_round(num, decimals) {
  var t = Math.pow(10, decimals);
  return parseFloat(
    (
      Math.round(
        num * t +
          (decimals > 0 ? 1 : 0) *
            (Math.sign(num) * (10 / Math.pow(100, decimals)))
      ) / t
    ).toFixed(decimals)
  );
}

const onChangeFromDistance = () => {
  form.value.from_distance = precise_round(form.value.from_distance, 2);
  if (`${form.value.to_distance}`.length > 0) {
    let to = precise_round(form.value.to_distance, 2);
    if (form.value.from_distance > to) {
      message.error("Từ khoảng cách phải nhỏ hơn đến khoảng cách");
      form.value.from_distance = null;
    }
  }
};

const onchangeToDistance = () => {
  form.value.to_distance = precise_round(form.value.to_distance, 2);
  if (`${form.value.from_distance}`.length > 0) {
    let from = precise_round(form.value.from_distance, 2);
    if (form.value.to_distance < from) {
      message.error("Đến khoảng cách phải lớn hơn từ khoảng cách");
      form.value.to_distance = null;
    }
  }
};


const onchangeStartTime = () => {
  if (form.value.end_time) {
    if (
      !moment(form.value.start_time).isSameOrBefore(
        moment(form.value.end_time),
        "day"
      )
    ) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      form.value.start_time = null;
    }
  }
};

const onchangeEndTime = () => {
  if (form.value.start_time) {
    if (
      !moment(form.value.end_time).isSameOrAfter(
        moment(form.value.start_time),
        "day"
      )
    ) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_time = null;
    }
  }
};

const onChangeCountry = ($event) => {
  if ($event) {
    form.value.country = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.country = {
      key: null,
      id: null,
    };
  }
  form.value.province = void 0;
};

const changeType = ($event) => {
  form.value.type = $event.target.value;
  if ($event.target.value == QuotaCommonType.CONG_TAC_NUOC_NGOAI) {
    delete form.value["country"];
  } else {
    form.value["country"] = Default.categoryDefault.vietNamCountry;
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
