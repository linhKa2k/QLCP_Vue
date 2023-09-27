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
          <a-radio-group
            v-model:value="form.type"
            @change="changeType($event)"
            disabled
          >
            <a-radio :value="QuotaCommonType.CONG_TAC_TRONG_NUOC">{{
              $t("airportQuota.type.1")
            }}</a-radio>
            <a-radio :value="QuotaCommonType.CONG_TAC_NUOC_NGOAI">{{
              $t("airportQuota.type.2")
            }}</a-radio>
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
      <!-- <a-col span="12">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
          />
        </a-form-item>
      </a-col> -->
      <!-- <a-col span="12">
        <a-form-item :label="fields.name.label" name="name">
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
          />
        </a-form-item>
      </a-col> -->

      <a-col span="12">
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
                field: 'is_active',
                operator: 'in',
                value: isActive.KICH_HOAT,
              },
            ]"
          />
        </a-form-item>
      </a-col>

      <a-col span="12">
        <a-form-item :label="fields.airport_id.label" name="airport">
          <o-select
            :disabled="form?.province?.id == null"
            v-model:value="form.airport"
            @input="onChangeAirport"
            :placeholder="fields.airport_id.placeholder"
            entity="airports"
            :isDisplay="'none'"
            :textField="'name'"
            ref="airport"
            valueField="id"
            :filters="[
              {
                field: 'provinceId',
                operator: 'equal',
                value: form?.province?.id ? form?.province?.id : 0,
              },
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.start_date.label" name="start_date">
          <a-date-picker
            v-model:value="form.start_date"
            format="DD/MM/YYYY"
            :placeholder="fields.start_date.label"
            class="width_item"
            :allowClear="false"
            @change="onchangeStartDate"
          /> </a-form-item
      ></a-col>
      <a-col span="12">
        <a-form-item :label="fields.end_date.label" name="end_date">
          <a-date-picker
            v-model:value="form.end_date"
            format="DD/MM/YYYY"
            :placeholder="fields.end_date.label"
            class="width_item"
            :allowClear="false"
            @change="onchangeEndDate"
          /> </a-form-item
      ></a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col span="24">
        <a-form-item :label="fields.amount.label" name="amount">
          <a-input-number
            v-model:value="form.amount"
            :placeholder="fields.amount.label"
            style="width: 100%"
            :min="1"
            :max="1000000000"
            :maxlength="14"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
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
import { message } from "ant-design-vue";
import moment from "moment/moment";
import { QuotaCommonType, isActive } from "@/common/enumUtility";
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

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = isActive.KHONG_KICH_HOAT;
  } else {
    form.value.is_active = isActive.KICH_HOAT;
  }
};

const changeType = ($event) => {
  form.value.type = $event.target.value;
};

const onChangeAirport = ($event) => {
  if ($event) {
    form.value.airport = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.airport = {
      key: null,
      id: null,
    };
  }
};

const onChangeProvince = ($event) => {
  if ($event.value) {
    form.value.province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["airport"];
  } else {
    form.value.province = {
      key: null,
      id: null,
    };
  }
};

const onchangeStartDate = () => {
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

const onchangeEndDate = () => {
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
