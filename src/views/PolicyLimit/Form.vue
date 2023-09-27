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
        <a-form-item name="type" :label="fields.type.label">
          <a-radio-group v-model:value="form.type" @change="changeType($event)">
            <a-radio :value="1">{{ $t("policyLimit.type.1") }}</a-radio>
            <a-radio :value="2">{{ $t("policyLimit.type.2") }}</a-radio>
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

    <!-- <a-row :gutter="16">
      <a-col span="24">
        <a-form-item :label="fields.code.label" name="code">
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
            :maxlength="100"
          />
        </a-form-item>
      </a-col>
    </a-row> -->

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
      <a-col span="12">
        <a-form-item
          :label="fields.service_group_id.label"
          name="service_group"
        >
          <o-select
            :disabled="false"
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
                value: form?.mode == 'add' ? 1 : null,
              },
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item :label="fields.service_id.label" name="service">
          <o-select
            :disabled="form.service_group == null"
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
                value: form?.mode == 'add' ? 1 : null,
              },
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item :label="fields.limit_amount.label" name="limit_amount">
          <a-input-number
            class="width_item"
            v-model:value="form.limit_amount"
            :placeholder="fields.limit_amount.placeholder"
            :maxlength="14"
            :min="1"
            :max="1000000000"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
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

    <a-col span="24">
      <a-form-item :label="fields.description.label" name="description">
        <a-textarea
          v-model:value="form.description"
          :placeholder="fields.description.placeholder"
          :maxlength="4000"
        />
      </a-form-item>
    </a-col>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
import { message } from "ant-design-vue";
import moment from "moment";
import {isActive} from "@/common/enumUtility"
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
const serviceDisabled = ref<boolean>(true);
const onChangeServiceGroup = ($event) => {
  if ($event) {
    form.value.service_group = {
      key: $event.value.key,
      id: $event.value.key,
    };
    delete form.value["service"];
  } else {
    form.value.service_group = {
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
  } else {
    form.value.service = {
      key: null,
      id: null,
    };
  }
};

const onChangePositionGroup = ($event) => {
  if ($event.value) {
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

const changeType = ($event) => {
  form.value.type = $event.target.value;
};

const onChangeDepartmentGroup = ($event) => {
  if ($event.value) {
    form.value.department = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.department = {
      key: null,
      id: null,
    };
  }
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};

const onchangeStartTime = () => {
  if (form.value.end_time) {
    let compare = moment(form.value.start_time).isSameOrBefore(
      moment(form.value.end_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      form.value.start_time = null;
    }
  }
};

const onchangeEndTime = () => {
  if (form.value.start_time) {
    let compare = moment(form.value.end_time).isSameOrAfter(
      moment(form.value.start_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_time = null;
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
