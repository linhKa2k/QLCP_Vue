<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('user.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" model="vertical">
              <a-row :gutter="[16, 0]">
                <a-col :span="12">
                  <a-form-item :label="fields['username'].label">
                    <span>{{ form.username ? form.username : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['fullName'].label">
                    <span>{{ form.fullName ? form.fullName : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['email'].label">
                    <span>{{ form.email ? form.email : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['phone_number'].label">
                    <span>{{
                      form.phone_number ? form.phone_number : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="fields['activated'].label">
                    <span>{{ formatIsActive(form.activated) }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['bank_name'].label">
                    <span>{{ form.bank_name ? form.bank_name : "-" }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['bank_account_number'].label">
                    <span>{{
                      form.bank_account_number ? form.bank_account_number : "-"
                    }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['bank_location'].label">
                    <span>{{
                      form.bank_location ? form.bank_location : "-"
                    }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['gender'].label">
                    <span>{{ formatGender(form.gender) }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['position'].label">
                    <span>{{ form.position ? form.position : "-" }}</span>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item :label="fields['department'].label">
                    <span>{{ form.department ? form.department : "-" }}</span>
                  </a-form-item>
                </a-col>

                <!-- <a-col :span="24">
                    <a-form-item :label="fields['description'].label">
                      <span>{{ form.description ? form.description : "-" }}</span>
                    </a-form-item>
                  </a-col> -->
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </a-card>
      <!-- <a-card
          :bordered="false"
          class="card-border"
          :title="$t('district.title.additional_information')"
        >
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="24">
              <a-form layout="vertical" :model="form">
                <a-row :gutter="[16, 0]">
                  <a-col :span="12">
                    <a-form-item :label="fields['name_of_ins_id'].label">
                      <span>{{
                        form.name_of_ins_id ? form.name_of_ins_id : "-"
                      }}</span>
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
                    <a-form-item :label="fields['name_of_upd_id'].label">
                      <span>{{
                        form.name_of_upd_id ? form.name_of_upd_id : "-"
                      }}</span>
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
        </a-card> -->
    </a-col>
  </a-row>
</template>
  <script setup lang="ts">
import { generateFields } from "@/formUtility";
import { formatDate, formatIsActive, formatGender } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "user";
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

const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
let camelCaseEntity = ref<any>(_.camelCase(entity));
const fields = ref<any>(generateFields(camelCaseEntity.value));
console.log("form", props.form);
const ColumnConfigs = ref<any>(ColumnConfig);
let columns = ref<any>(ColumnConfigs[camelCaseEntity] || []);
columns = columns.value.map((p?: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
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
  background-color: #ed1b2f !important;
  border-color: #ed1b2f !important;
}
</style>
  <style lang="scss" scoped>
@import "../../assets/sass/global.scss";
</style>
  