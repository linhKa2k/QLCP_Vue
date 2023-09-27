<template>
  <a-form
    ref="ruleForm"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
    class="form_padding"
  >
    <a-row :gutter="[0, 16]">
      <a-col :span="24">
        <a-row :gutter="[24, 0]">
          <a-col :span="24">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Mã kế hoạch: ">
                  <span>{{ form.code ? form.code : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Tên kế hoạch: '">
                  <span>{{ form.name ? form.name : "--" }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Trạng thái kế hoạch: '">
                  <span>{{
                    form.status ? renderPlanStatus(form.status) : "--"
                  }}</span>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item :label="'Mục đích công tác'">
                  <span>{{ form.purpose ? form.purpose.name : "--" }}</span>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item :label="'Hình thức công tác: '">
                  <span>{{ form.type ? renderType(form.type) : "--" }}</span>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item :label="'Kế hoạch bổ sung'" >
                  <a-checkbox v-model:checked="form.is_add" disabled></a-checkbox>
                  <!-- <span>{{
                    form?.is_add === true ? "Kế hoạch bổ sung" : "--"
                  }}</span> -->
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item :label="'Đơn vị yêu cầu: '">
                  <span>{{
                    form.department_require
                      ? form.department_require.name
                      : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Người yêu cầu'">
                  <span>{{
                    form.user_require ? form.user_require.fullName : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Đơn vị thực hiện: '">
                  <span>{{
                    form.department_process
                      ? form.department_process.name
                      : "--"
                  }}</span>
                </a-form-item></a-col
              >
              <a-col :span="12">
                <a-form-item :label="'Người thực hiện: '">
                  <span>{{
                    form.user_process ? form.user_process.fullName : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Ngày bắt đầu: '">
                  <span>{{
                    form.start_time ? formatDate(form.start_time) : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'Ngày kết thúc: '">
                  <span>{{
                    form.end_time ? formatDate(form.end_time) : "--"
                  }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label="'Chi tiết công việc'"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <span>{{ form.description ? form.description : "--" }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import i18n from "@/lang";
import PlanService from "@/services/PlanService";
import Constant from "@/constant";
import { formatDate, formatIsActive } from "@/utility";
import Constants from "@/constant";
const { t } = i18n.global;
interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
});
const ruleForm = ref<any>();
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 18 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.form);
const CommonInfoDetail = ref<any>({});

const handleDetail = (id: any) => {
  PlanService.detail(id)
    .then((response) => {
      CommonInfoDetail.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderType = (type) => {
  const item = Constant.planType.find((i) => i.value == type);
  return item?.label;
};

const renderPlanStatus = (type) => {
  const item = Constant.planStatus.find((i) => i.value == type);
  return item?.label;
};
handleDetail(form.value.id);
</script>
<style scoped lang="scss">
.form_padding {
  padding: 40px;
  background-color: white;
}
:deep() .ant-form-item-label > label {
  color: #747c87 !important;
}

:deep(.ant-tabs-bar) {
  margin: 0;
  background-color: white;
}

:deep(.ant-btn-primary) {
  background-color: #ed1b2f !important;
  border-color: #ed1b2f !important;
}
</style>
<style lang="scss" scoped>
@import "../../../assets/sass/global.scss";
</style>
