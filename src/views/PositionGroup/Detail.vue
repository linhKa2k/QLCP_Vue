<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('positionGroup.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" :model="form">
              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item :label="fields['code'].label">
                    <span>{{ form.code ? form.code : "-" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item :label="fields['name'].label">
                    <span>{{ form.name ? form.name : "-" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item :label="fields['is_cost_prediction'].label">
                    <span>{{
                      formatIsCostPrediction(form.is_cost_prediction)
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item :label="fields['department_id'].label">
                    <span>{{
                      form.department ? form.department.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item :label="'Chức vụ'" name="position">
                    {{ renderArray(form.positions, "position", "name") }}
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item :label="fields['is_active'].label">
                    <span>{{ formatIsActive(form.is_active) }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item :label="fields['description'].label">
                    <span>{{ form.description ? form.description : "-" }}</span>
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
import { formatDate, formatIsActive } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import Constant from "@/constant";
const { t } = i18n.global;
const entity = "position-group";
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
const formatIsCostPrediction = (value) => {
  let transit = "";
  switch (value) {
    case false:
      transit = t("positionGroup.is_cost_prediction.no");
      break;
    case true:
      transit = t("positionGroup.is_cost_prediction.yes");
      break;
    default:
      transit = t("positionGroup.is_cost_prediction.yes");
      break;
  }
  return transit;
};

const renderArray = (array: any, name: string, field: string) => {
  let result: any = [];
  if (array) {
    array.map((p) => {
      result.push(p?.[name][field]);
    });
    return result.toString();
  } else {
    return "--";
  }
};
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
