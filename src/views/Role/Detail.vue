<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('role.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" :model="form">
              <a-row :gutter="[16, 0]">
                <a-col :span="8">
                  <a-form-item :label="fields['code'].label">
                    <span>{{ form.code ? form.code : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="fields['name'].label">
                    <span>{{ form.name ? form.name : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="fields.is_active.label"
                    name="is_active"
                    disabled
                    class="border-none"
                  >
                    <a-switch
                      :checked="form.is_active == isActive.KICH_HOAT ? true : false"
                      disabled
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="8">
                  <a-form-item :label="fields['description'].label">
                    <span>{{ form.description ? form.description : "-" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item
            style="width: 100%"
            :wrapper-col="{ span: 24 }"
            name="role_has_permission"
          >
            <div class="list-permission">
              <div class="list-permission-sticky">
                <a-row style="justify-content: space-between">
                  <h2>{{ $t("role.title.permission_info") }}</h2>
                </a-row>
                <a-row class="title-permission">
                  <a-col span="5" class="text-center">
                    <a-button type="link" v-if="activeKey.length != 3">
                      <template #icon><PlusOutlined /></template>
                    </a-button>
                    <a-button type="link" v-else>
                      <template #icon><MinusOutlined /></template>
                    </a-button>
                  </a-col>
                  <a-col span="5">{{ $t("role.title.permission") }}</a-col>
                  <a-col
                    span="2"
                    class="text-center"
                    v-for="(item, index) in permissionNames"
                    :key="index"
                    >{{ item }}</a-col
                  >
                </a-row>
              </div>
              <a-skeleton active :loading="loading">
                <a-collapse :bordered="false">
                  <a-collapse-panel
                    v-for="(items, name) in permission"
                    :key="name"
                    :header="$t('role.groups.' + name)"
                  >
                    <a-row
                      v-for="(item, name) in items"
                      :key="name"
                      style="padding: 8px 0"
                    >
                      <a-col span="5"></a-col>
                      <a-col span="5">{{ $t("role.roles." + name) }}</a-col>
                      <a-col
                        class="text-center"
                        span="2"
                        v-for="(check, index) in item"
                        :key="index"
                      >
                        <a-checkbox
                          :checked="check.is_permission != 0 ? true : false"
                          :disabled="check.isDisabled"
                        ></a-checkbox>
                      </a-col>
                    </a-row>
                  </a-collapse-panel>
                </a-collapse>
              </a-skeleton>
            </div>
          </a-form-item>
        </a-row>
      </a-card>
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('role.title.system_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-form layout="vertical" :model="form">
              <a-row :gutter="[16, 0]">
                <a-col :span="8">
                  <a-form-item :label="fields['ins_id'].label">
                    <span>{{ form.ins_id ? form.ins_id : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="fields['ins_date'].label">
                    <span>{{
                      form.ins_date ? formatDate(form.ins_date) : "-"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 0]">
                <a-col :span="8">
                  <a-form-item :label="fields['upd_id'].label">
                    <span>{{ form.upd_id ? form.upd_id : "-" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
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
import { formatDate } from "@/utility";
import * as _ from "lodash";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
import RoleService from "@/services/RoleService";
import { message } from "ant-design-vue";
import {isActive} from "@/common/enumUtility"
const { t } = i18n.global;
const entity = "role";
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

const loading = ref<boolean>(false);
const grid: any = ref();
const permission = ref<any>({});
const permissionNames = ["Xem", "Thêm", "Sửa", "Xóa", "Nhập", "Xuất", "Duyệt"];
const activeKey = ref<Array<string>>([
  "dashboard",
  "trip",
  "vehicle",
  "driver",
  "partner",
  "revenue",
  "location",
  "user",
]);

const fetchPermission = () => {
  loading.value = true;
  RoleService.getPermission()
    .then((response) => {
      const data = response.data.content;
      const role_has_permission = props.form.role_has_permission.map(
        (element) => {
          element.permission.is_permission = element.permission.id;
          return element.permission;
        }
      );
      const data_no_permission = data.map((item) => ({
        ...item,
        is_permission: 0,
      }));
      const merge = (a1, a2) => {
        return a1
          .map((x) => {
            const y = a2.find((item) => x.id === item.id);
            if (y) {
              return Object.assign({}, x, y);
            } else {
              return x;
            }
          })
          .concat(a2.filter((item) => a1.every((x) => x.id !== item.id)));
      };
      const items = merge(data_no_permission, role_has_permission);
      console.log(items);

      const groups = formatRolePermission(items);
      console.log(groups);
      permission.value = groups;
      loading.value = false;
    })
    .catch((error) => {
      if (Array.isArray(error.response.data.fieldErrors)) {
        message.error(
          error.response.data.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(error.response.data.message);
      }
    });
};

const formatRolePermission = (data) => {
  const groups = data.reduce(function (r, a) {
    r[a.group] = r[a.group] || [];
    a.field = a.name ? a.name.split(" ")[1] : "";
    r[a.group].push(a);
    return r;
  }, {});

  for (let prop in groups) {
    groups[prop] = groups[prop].reduce(function (r, a) {
      r[a.field] = r[a.field] || [];
      r[a.field].push(a);
      return r;
    }, {});
  }

  console.log("groups2", groups);

  return groups;
};

const hideModal = () => {
  emit("hideModal");
};

watch(
  () => props.isShowModal,
  (val) => {
    if (isShowModal) {
      fetchPermission();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
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
