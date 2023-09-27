<template>
  <a-form
    ref="ruleForm"
    :rules="ruleCustom"
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
            <a-radio :value="1">{{ $t("distanceQuota.type.1") }}</a-radio>
            <a-radio :value="2">{{ $t("distanceQuota.type.2") }}</a-radio>
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
          :label="fields.from_province_id.label"
          name="from_province"
        >
          <o-select
            v-model:value="form.from_province"
            @input="onChangeFromProvince"
            :placeholder="fields.from_province_id.placeholder"
            entity="provinces"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
            :filters="[
              {
                field: 'country_id',
                operator: 'equal',
                value: form?.from_country?.key ? form?.from_country?.key : null,
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
      <a-col span="12" v-if="form.type == distanceQuotaType.TRONG_TINH">
        <a-form-item
          :label="fields.from_district_id.label"
          name="from_district"
        >
          <o-select
            ref="from_district"
            v-model:value="form.from_district"
            @input="onChangeSetDistrict($event, 'from_district')"
            :placeholder="fields.from_district_id.placeholder"
            entity="districts"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
            :disabled="form?.from_province?.id == null"
            :filters="[
              {
                field: 'province_id',
                operator: 'equal',
                value: form?.from_province?.key
                  ? form?.from_province?.key
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

      <a-col span="12">
        <a-form-item :label="fields.to_province_id.label" name="to_province">
          <o-select
            v-model:value="form.to_province"
            @input="onChangeToProvince"
            :placeholder="fields.to_province_id.placeholder"
            entity="provinces"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
            :filters="[
              {
                field: 'country_id',
                operator: 'equal',
                value: form?.to_country?.key ? form?.to_country?.key : null,
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
      <a-col span="12" v-if="form.type == distanceQuotaType.TRONG_TINH">
        <a-form-item :label="fields.to_district_id.label" name="to_district">
          <o-select
            ref="to_district"
            v-model:value="form.to_district"
            @input="onChangeSetDistrict($event, 'to_district')"
            :placeholder="fields.to_district_id.placeholder"
            entity="districts"
            :isDisplay="'none'"
            :textField="'name'"
            valueField="id"
            :disabled="form?.to_province?.id == null"
            :filters="[
              {
                field: 'province_id',
                operator: 'equal',
                value: form?.to_province?.key ? form?.to_province?.key : null,
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
      <a-col span="12"
        ><a-form-item :label="fields.distance.label" name="distance">
          <a-input-number
            style="width: 100%"
            v-model:value="form.distance"
            :placeholder="fields.distance.placeholder"
            :maxlength="20"
            min="0"
          /> </a-form-item
      ></a-col>
    </a-row>

    <!-- <a-row :gutter="16">
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
    </a-row> -->

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
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import { distanceQuotaType } from "@/common/enumUtility";
import { isActive } from "@/common/enumUtility";
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
const disabledFromDistrict = ref<boolean>(false);
const disabledToDistrict = ref<boolean>(false);

const ruleCustom = computed(() => {
  if (form.value.type == distanceQuotaType.NGOAI_TINH) {
    return props.rules;
  } else {
    return {
      ...props.rules,
      from_district: [
        {
          required: true,
          message: "Vui lòng nhập Quận/ Huyện đi",
          trigger: "change",
          type: "object",
        },
      ],
      to_district: [
        {
          required: true,
          message: "Vui lòng nhập Quận/ Huyện đến",
          trigger: "change",
          type: "object",
        },
      ],
    };
  }
});
const changeType = ($event) => {
  form.value.type = $event.target.value;
  if ($event.target.value == distanceQuotaType.TRONG_TINH) {
    disabledFromDistrict.value = true;
    disabledFromDistrict.value = true;
    form.value.from_district = {
      key: null,
      id: null,
    };
    form.value.to_district = {
      key: null,
      id: null,
    };
  }
  if ($event.target.value == distanceQuotaType.NGOAI_TINH) {
    if (form.value.from_province && form.value.from_province.id != null) {
      disabledFromDistrict.value = false;
    } else {
      disabledFromDistrict.value = true;
    }
    if (form.value.to_province && form.value.to_province.id != null) {
      disabledToDistrict.value = false;
    } else {
      disabledToDistrict.value = true;
    }
  }
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};

const onChangeFromCountry = ($event) => {
  if ($event) {
    form.value.from_country = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.from_country = {
      key: null,
      id: null,
    };
  }
};

const onChangeToCountry = ($event) => {
  if ($event) {
    form.value.to_country = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.to_country = {
      key: null,
      id: null,
    };
  }
};

const onChangeFromProvince = ($event) => {
  if ($event.value) {
    let item = $event.value.options.find((i) => i.id == $event.value.key);
    form.value.from_province = {
      ...item,
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["from_district"];
    if (form.value.type == distanceQuotaType.TRONG_TINH) {
      form.value.to_province = form.value.from_province;
      delete form.value["to_district"];
    }
  } else {
    form.value.from_province = {
      key: null,
      id: null,
    };
  }
};

const onChangeToProvince = ($event) => {
  if ($event.value) {
    form.value.to_province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["to_district"];
    if (form.value.type == distanceQuotaType.TRONG_TINH) {
      form.value.from_province = form.value.to_province;
      delete form.value["from_district"];
    }
  } else {
    form.value.to_province = {
      key: null,
      id: null,
    };
  }
};

const onChangeSetDistrict = ($event, key: any) => {
  if ($event.value) {
    form.value[key] = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value[key] = {
      key: null,
      id: null,
    };
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
