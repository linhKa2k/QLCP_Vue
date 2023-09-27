<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('service.title.general_information')"
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
                <a-col :span="12">
                  <a-form-item :label="fields['name'].label">
                    <span>{{ form.name ? form.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['name_of_country_id'].label">
                    <span>{{ form.country ? form.country.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['name_of_province_id'].label">
                    <span>{{ form.province ? form.province.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['description'].label">
                    <span>{{ form.description ? form.description : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['is_active'].label">
                    <span>{{ form ? formatIsActive(form.is_active) : "-" }}</span>
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
import { formatIsActive } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import { formatDate } from "@/utility";
import Constant from '@/constant';
const { t } = i18n.global;
const entity = "airport";
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
console.log(props.form, " check props form ")
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

:deep() .ant-form-item-label>label {
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