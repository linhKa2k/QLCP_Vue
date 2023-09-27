<template>
  <a-form ref="ruleForm" :model="form" :rules="rules">
    <a-row :gutter="[16, 0]">
      <a-col span="8">
        <a-form-item
          :label="fields.code.label"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          name="code"
        >
          <a-input
            v-model:value="form.code"
            :placeholder="fields.code.placeholder"
          />
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item
          :label="fields.name.label"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          name="name"
        >
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
          />
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == isActive.KICH_HOAT ? true : false"
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
      <a-col span="16">
        <a-form-item
          :label="fields.description.label"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          name="description"
        >
          <a-textarea
            v-model:value="form.description"
            :placeholder="fields.description.placeholder"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
      <a-form-item
        style="width: 100%"
        :wrapper-col="{ span: 24 }"
        name="role_has_permission"
      >
        <div class="list-permission">
          <div class="list-permission-sticky">
            <a-row style="justify-content: space-between">
              <h2>{{ $t("role.extend.permission_info") }}</h2>
              <div class="option">
                <a-button @click="handleCheckAll">
                  <template #icon
                    ><CheckCircleOutlined style="color: #12509b"
                  /></template>
                  {{ $t("common.select_all") }}</a-button
                >
                <a-button style="margin-left: 8px" @click="handleUncheckAll">
                  <template #icon
                    ><CloseCircleOutlined style="color: #12509b"
                  /></template>
                  {{ $t("common.unselect_all") }}</a-button
                >
              </div>
            </a-row>
            <a-row class="title-permission">
              <a-col span="5" class="text-center">
                <a-button
                  type="link"
                  @click="showCollapse"
                  v-if="activeKey.length != 3"
                >
                  <template #icon><PlusOutlined /></template>
                </a-button>
                <a-button type="link" @click="hiddenCollapse" v-else>
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
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
              <template #expandIcon="{ isActive }">
                <PlusOutlined v-if="!isActive" />
                <MinusOutlined v-else />
              </template>
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
                  <a-col span="5">
                    {{ $t("role.roles." + name) }}
                  </a-col>
                  <a-col
                    class="text-center"
                    span="2"
                    v-for="(check, index) in item"
                    :key="index"
                  >
                    <a-checkbox
                      :checked="check.is_permission != 0 ? true : false"
                      @change="changeCheckBox(check, index, item, $event)"
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
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import RoleService from "@/services/RoleService";
import { useSaveMutation } from "@/hooks/role";

import { watch, ref, toRefs } from "vue";
import { message } from "ant-design-vue";
import i18n from "@/lang";
import {
  PlusOutlined,
  MinusOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";
import { isActive } from "@/common/enumUtility";
const { t } = i18n.global;

interface Props {
  formData: any;
  show: boolean;
  visible: boolean;
  mode: string;
  entity: string;
  handleCallback: boolean;

  width: string;
  fields: any;
  rules: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  show: false,
  visible: false,
  mode: "",
  entity: "",
  handleCallback: false,

  width: "",
  fields: {},
  rules: {},
});
console.log("fieldsfields", props.fields);

const permissionNames = ["Xem", "Thêm", "Sửa", "Xóa", "Nhập", "Xuất", "Duyệt"];
const activeKey = ref<Array<string>>([
  "dashboard",
  "calendar",
  "vehicle",
  "location",
  "user",
  "plan",
  "service",
  "policy",
  "position",
  "purpose",
  "quota",
]);
const permission = ref<any>({});
const data = ref<Array<any>>([]);
const option = ref<Array<any>>([]);
const form = ref<any>(props.formData);
const confirmLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const isCallBack = ref<boolean>(true);
const ruleForm = ref();
const emit = defineEmits<{
  (e: "reloadGrid"): void;
  (e: "reload"): void;
  (e: "hiddenModal"): void;
  (e: "cancelLoading"): void;
}>();

const showCollapse = () => {
  activeKey.value = [
    "dashboard",
    "calendar",
    "vehicle",
    "location",
    "user",
    "plan",
    "service",
    "policy",
    "position",
    "purpose",
    "quota",
  ];
};

const useSave = useSaveMutation();
const hiddenCollapse = () => {
  activeKey.value = [];
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

const fetchPermission = () => {
  loading.value = true;
  RoleService.getPermission()
    .then((response) => {
      if (response.status != 200) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p) => p.errorMessage).join("\n")
          );
        } else {
          message.error(response.data.errorMessage);
        }
        return false;
      } else {
        const data = response.data.content;
        if (form.value.mode == "add") {
          const groups = formatRolePermission(data);
          form.value.name = "";
          form.value.title = "";
          form.value.role_has_permission = [];
          form.value.id = null;
          permission.value = groups;
        } else {
          const role_has_permission = props.formData.role_has_permission.map(
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
          form.value.id = props.formData.id;
        }

        loading.value = false;
      }
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

const changeCheckBox = (check, index, item, $event) => {
  if (!$event.target.checked) {
    check.is_permission = 0;
    if (index == 0) {
      item
        .filter((p) => p.id != check.id)
        .map((p) => {
          p.isDisabled = true;
          p.is_permission = 0;
        });
    }
  } else {
    check.is_permission = check.id;
    if (index == 0) {
      item
        .filter((p) => p.id != check.id)
        .map((p) => {
          p.isDisabled = false;
          p.is_permission = 0;
        });
    }
  }
};
const handleCheckAll = () => {
  let role_has_permission = convertPermissionList();
  role_has_permission.map((item: any) => {
    item.is_permission = item?.id;
    item.isDisabled = false;
  });
};
const handleUncheckAll = () => {
  let role_has_permission = convertPermissionList();
  role_has_permission.map((item: any) => {
    if (item.name.slice(0, 4) != "view") {
      item.isDisabled = true;
    } else {
      item.isDisabled = false;
    }
    item.is_permission = 0;
  });
};
const handleCancel = () => {
  emit("reload");
};

const convertPermissionList = () => {
  let data = permission.value;
  let groupData = {};
  let role_has_permission: any = [];
  for (const prop in data) {
    groupData[prop] = {};
    for (const per in data[prop]) {
      groupData[prop][per] = [];
      for (let i = 0; i < data[prop][per].length; i++) {
        let item = data[prop][per][i];

        if (item.id) {
          item.permission = {
            id: item.id,
          };
          delete item.id;
        }
        role_has_permission.push(item);
      }
    }
  }

  return role_has_permission;
};
const saveFormData = (form) => {
  useSave
    .mutateAsync(form)
    .then((response?: any) => {
      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
        return false;
      }

      message.success(
        t("common.save_success", {
          entity: t(`role.name`),
        })
      );
      handleCancel();
    })
    .catch((error?: any) => {
      message.error(error.message);
      if (Array.isArray(error.response.data.fieldErrors)) {
        message.error(
          error.response.data.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(error.response.data.fieldErrors);
      }
      handleCancelLoading();
    });
};
const handleCancelLoading = () => {
  emit("cancelLoading");
};
watch(
  () => props.show,
  (val) => {
    fetchPermission();
  },
  { immediate: true }
);
watch(
  () => props.handleCallback,
  (val) => {
    if (val == true) {
      let role_has_permission = convertPermissionList();
      let forms = JSON.parse(JSON.stringify(form.value));
      forms.id = props.formData.id || null;
      forms.role_has_permission = role_has_permission.filter(
        (p: any) => p.is_permission != 0
      );
      console.log(forms);

      saveFormData(forms);
    }
  },
  { immediate: true }
);

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
defineExpose({ ruleForm, form, isCallBack });
</script>
<style scoped lang="scss">
.ant-form-item {
  margin-bottom: 12px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  // margin-top: 8px;
  color: #666;
}
.text-center {
  text-align: center;
}
.list-permission {
  max-height: 680px;
  overflow: auto;
}

.list-permission-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
  background: #fafafa;
  .title-permission {
    justify-content: center;
    border-bottom: 1px solid #d9d9d9;
  }
}
</style>
