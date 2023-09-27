<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('department.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" model="vertical">
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['code'].label">
                    <span>{{ form.code ? form.code : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['name'].label">
                    <span>{{ form.name ? form.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['country_id'].label">
                    <span>{{
                      form.country.name ? form.country.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['province_id'].label">
                    <span>{{ form.province ? form.province.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['district_id'].label">
                    <span>{{ form.district ? form.district.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['ward_id'].label">
                    <span>{{ form.ward ? form.ward.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item :label="fields['branch_id'].label">
                    <span>{{ form.branch ? form.branch.name : "-" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </a-card>
    
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { generateFields } from "@/formUtility";
import { formatDate } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import Constant from "@/constant";

const { t } = i18n.global;
const entity = "department";
interface Props {
  isShowModal: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isAction: boolean;
  form: any;
}
const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isAutoLoad: false,
  isAdd: false,
  isAction: false,
  form: {},
});


let camelCaseEntity = ref<any>(_.camelCase(entity));
const fields = ref<any>(generateFields(camelCaseEntity.value));
const ColumnConfigs = ref<any>(ColumnConfig);
let columns = ref<any>(ColumnConfigs[camelCaseEntity] || []);
columns = columns.value.map((p?: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
console.log(fields, "form  props", props.form);
</script>


<style scoped lang="scss">
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
.card-border {
  border-radius: 4px;
  margin-bottom: 16px;
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
@import "../../assets/sass/global.scss";
</style>
<style>
.ant-modal {
  top: 16px;
}
</style>
