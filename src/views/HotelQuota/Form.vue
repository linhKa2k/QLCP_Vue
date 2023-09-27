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
            <a-radio :value="hotelQuotaType.NOI_DIA">{{
              $t("hotelQuota.type.1")
            }}</a-radio>
            <a-radio :value="hotelQuotaType.NUOC_NGOAI">{{
              $t("hotelQuota.type.2")
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
                value: Constant.serviceGroup.PHONG_NGHI,
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
        <a-form-item
          :label="fields.position_group_id.label"
          name="position_group"
        >
          <o-select
            :disabled="false"
            v-model:value="form.position_group"
            @input="onChangePositionGroup"
            :placeholder="fields.position_group_id.placeholder"
            entity="position-groups"
            :isDisplay="'none'"
            :textField="'name'"
            ref="position-group"
            valueField="id"
          />
        </a-form-item>
      </a-col>
      <a-col
        span="12"
        v-if="form.type === hotelQuotaType.NOI_DIA ? false : true"
      >
        <a-form-item :label="fields.country_id.label" name="country">
          <o-select
            v-model:value="form.country"
            @input="onChangeCountry"
            :placeholder="fields.country_id.placeholder"
            entity="countries"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
            :defaultValue="
              form.type === hotelQuotaType.NOI_DIA
                ? Default.categoryDefault.vietNamCountry
                : false
            "
            :disabled="form.type === hotelQuotaType.NOI_DIA ? true : false"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col
        span="12"
        v-if="form.type === hotelQuotaType.NUOC_NGOAI ? false : true"
      >
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
                value: isActive.KICH_HOAT,
              },
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col
        span="12"
        v-if="form.type === hotelQuotaType.NUOC_NGOAI ? false : true"
      >
        <a-form-item :label="fields.district_id.label" name="district">
          <o-select
            :disabled="form.province ? false : true"
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
    <a-row :gutter="16">
      <a-col span="12"
        ><a-form-item :label="fields.amount.label" name="amount">
          <a-input-number
            :style="'width: 100%;'"
            v-model:value="form.amount"
            :placeholder="fields.amount.placeholder"
            :min="1"
            :max="1000000000"
            :maxlength="14"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
          /> </a-form-item
      ></a-col>
      <a-col span="12"
        ><a-form-item :label="fields.amount_month.label" name="amount_month">
          <a-input-number
            :style="'width: 100%;'"
            v-model:value="form.amount_month"
            :placeholder="fields.amount_month.placeholder"
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

    <a-row :gutter="16">
      <a-col span="6">
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
      <a-col span="6">
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
      <a-col
        span="12"
        v-if="
          form.service
            ? form.service.id == Default.categoryDefault.service.PHONG_DOI.id
            : false
        "
        ><a-form-item
          :label="fields.single_room_amount.label"
          name="single_room_amount"
        >
          <a-input-number
            :style="'width: 100%;'"
            v-model:value="form.single_room_amount"
            :placeholder="fields.single_room_amount.placeholder"
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
import { onMounted, ref } from "vue";
import Constant from "@/constant";
import { formatDate } from "@/mixins/utility";
import { message } from "ant-design-vue";
import moment from "moment";
import {
  isActive,
  hotelQuotaType,
  QuotaCommonType,
} from "@/common/enumUtility";
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
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
// const districtDisabled = ref<boolean>(true);
// const provinceDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const serviceDisabled = ref<boolean>(true);
const singleRoomAmountHidden = ref<boolean>(true);
const province = ref<any>();
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
    // provinceDisabled.value = false;
  } else {
    // provinceDisabled.value = true;

    form.value.country = $event.value;
  }
  form.value.province = void 0;
};

const onChangeProvince = ($event) => {
  if ($event.value) {
    form.value.province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["district"];
  } else {
    form.value.province = $event.value;
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
      id: $event.value.key,
    };
  } else {
    form.value.district = $event.value;
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

    form.value.service_group = $event.value;
  }
};

const onChangePositionGroup = ($event) => {
  if ($event.value) {
    form.value.position_group = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.position_group = $event.value;
  }
};

const onChangeService = ($event) => {
  if ($event.value) {
    form.value.service = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.service = $event.value;
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

const changeType = ($event) => {
  form.value.type = $event.target.value;
  if (form.value.type == hotelQuotaType.NOI_DIA) {
    delete form.value["country"];
  }
};

defineExpose({ ruleForm, form });

onMounted(() => {});
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}

.width_item {
  width: 100%;
}
</style>
