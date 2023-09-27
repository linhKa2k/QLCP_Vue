<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('distanceQuota.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" :model="form">
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['code'].label">
                    <span>{{ form.code ? form.code : "-" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['type'].label">
                    <span>{{ form.type ? renderType(form.type) : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['is_active'].label">
                    <span>{{ formatIsActive(form.is_active) }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['from_province_id'].label">
                    <span>{{
                      form.from_province ? form.from_province.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['to_province_id'].label">
                    <span>{{
                      form.to_province ? form.to_province.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row
                :gutter="[16, 0]"
                v-if="form.type == distanceQuotaType.NGOAI_TINH"
              >
                <a-col :span="12">
                  <a-form-item :label="fields['from_district_id'].label">
                    <span>{{
                      form.from_district ? form.from_district.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['to_district_id'].label">
                    <span>{{
                      form.to_district ? form.to_district.name : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['distance'].label">
                    <span>{{ form.distance ? form.distance : "-" }}</span>
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

      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('distanceQuota.title.additional_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" :model="form">
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['ins_id'].label">
                    <span>{{ form.ins_id ? form.ins_id : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['ins_date'].label">
                    <span>{{
                      form.ins_date ? formatDate(form.ins_date) : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['upd_id'].label">
                    <span>{{ form.upd_id ? form.upd_id : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['upd_date'].label">
                    <span>{{
                      form.upd_date ? formatDate(form.upd_date) : "-"
                    }}</span>
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
import * as _ from "lodash";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import Constant from "@/constant";
import { formatDate, formatIsActive } from "@/utility";
import { distanceQuotaType } from "@/common/enumUtility";
const { t } = i18n.global;
const entity = "distance_quota";
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
const { isShowModal } = toRefs(props);
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
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

const renderType = (type) => {
  const item = Constant.distanceQuotaType.find((i) => i.value == type);
  return item?.label;
};

const loading = ref<boolean>(false);
const grid: any = ref();
const hideModal = () => {
  emit("hideModal");
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
  background-color: #00885a !important;
  border-color: #00885a !important;
}
</style>
<style>
.ant-btn-primary {
  background-color: #00885a;
  border-color: #00885a;
}
</style>
<style lang="scss" scoped>
@import "../../assets/sass/global.scss";
</style>
