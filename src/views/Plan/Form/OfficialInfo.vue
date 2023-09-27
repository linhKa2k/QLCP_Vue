<template>
  <a-col :span="24">
    <a-row>
      <a-col :span="24">
        <a-collapse v-model:activeKey="activeStaffKey">
          <a-collapse-panel
            key="1"
            :header="$t('plan.attribute.plan_official_list')"
            style="font-weight: bold"
            ><a-spin :spinning="planUserLoading">
              <a-col :span="24">
                <a-form-item
                  name="staff_official"
                  :label-col="{ span: 24 }"
                  :wrapper-col="{ span: 24 }"
                  style="font-weight: normal !important"
                >
                  <table class="table_item">
                    <tr>
                      <th :width="'50px'">
                        {{ $t("STT") }}
                      </th>
                      <th :width="'250px'">
                        {{ $t("plan.staff_official.unit") }}
                      </th>
                      <th :width="'250px'">
                        {{ $t("plan.staff_official.code_staff") }}
                      </th>
                      <th :width="'200px'">
                        {{ $t("plan.staff_official.full_name") }}
                      </th>
                      <th :width="'100px'">
                        {{ $t("plan.staff_official.gender") }}
                      </th>
                      <th :width="'250px'">
                        {{ $t("plan.staff_official.bank") }}
                      </th>
                      <th :width="'150px'">
                        {{ $t("plan.staff_official.bank_account") }}
                      </th>

                      <th :width="'150px'">
                        {{ $t("plan.staff_official.numberPhone") }}
                      </th>
                      <th :width="'200px'">
                        {{ $t("plan.staff_official.email") }}
                      </th>
                      <th :width="'100px'">
                        {{ $t("common.action") }}
                      </th>
                    </tr>
                    <template v-for="(item, index) in staffData" :key="index">
                      <tr>
                        <td>{{ index + 1 }}</td>
                        <td>
                          <o-select
                            ref="department"
                            v-model:value="item.department"
                            @input="onChangeDepartment($event, item)"
                            :placeholder="'Đơn vị'"
                            entity="departments"
                            :icon="'environment'"
                            :isDisplay="'none'"
                            :isDisplayAdd="'none'"
                            :textField="['code', 'name']"
                            style="width: 100%"
                            :filters="[
                              {
                                field: 'is_active',
                                operator: 'in',
                                value: activeEnum.KICH_HOAT,
                              },
                            ]"
                          />
                        </td>
                        <td>
                          <o-select
                            ref="user"
                            v-model:value="item.user"
                            @input="onChangeUser($event, item)"
                            :placeholder="'Nhân viên'"
                            entity="user-departments/users"
                            :icon="'environment'"
                            :isDisplay="'none'"
                            :isDisplayAdd="'none'"
                            :textField="['username', 'fullName']"
                            valueField="id"
                            style="width: 100%"
                            :filters="[
                              {
                                field: 'departmentId',
                                operator: 'equal',
                                value: item?.department?.key
                                  ? item?.department?.key
                                  : null,
                              },
                              {
                                field: 'is_active',
                                operator: 'in',
                                value: activeEnum.KICH_HOAT,
                              },
                            ]"
                            :disabled="item?.department?.id == null"
                          />
                        </td>
                        <td>
                          <span> {{ item.name ? item.name : "--" }}</span>
                        </td>
                        <td>
                          <span>
                            {{
                              item.gender ? renderGender(item.gender) : "--"
                            }}</span
                          >
                        </td>
                        <td>
                          <span> {{ item.bank ? item.bank : "--" }}</span>
                        </td>
                        <td>
                          <span>
                            {{
                              item.account_number ? item.account_number : "--"
                            }}</span
                          >
                        </td>
                        <td>
                          <span>
                            {{
                              item.phone_number ? item.phone_number : "--"
                            }}</span
                          >
                        </td>
                        <td>
                          <span> {{ item.email ? item.email : "--" }}</span>
                        </td>
                        <td style="text-align: center">
                          <a-button
                            class="remove-item"
                            type="text"
                            @click="removeStaff(staffData, item, index)"
                            ><template #icon><DeleteOutlined /></template
                          ></a-button>
                        </td>
                      </tr>
                    </template>
                  </table>
                </a-form-item>
                <a-form-model-item
                  :label-col="{ span: 24 }"
                  :wrapper-col="{ span: 24 }"
                >
                  <a-button
                    type="dashed"
                    style="width: 100%"
                    @click="addStaffOfficial"
                  >
                    <PlusCircleTwoTone />
                    {{ $t("plan.title.official_info_add") }}
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-spin>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
      <a-col :span="24">
        <a-collapse
          v-model:activeKey="activePartnerKey"
          @change="changePartner"
        >
          <a-collapse-panel
            key="2"
            :header="$t('plan.attribute.plan_partner_list')"
            style="font-weight: bold"
            :disabled="false"
          >
            <a-spin :spinning="planUserLoading">
              <a-col :span="24">
                <a-row>
                  <a-col :span="24">
                    <a-row type="flex" justify="space-between"> </a-row>
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          name="partner_official"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                          style="font-weight: normal !important"
                        >
                          <table class="table_item">
                            <tr>
                              <th :width="'50px'">
                                {{ $t("STT") }}
                              </th>
                              <th :width="'250px'">
                                {{ $t("plan.partner_official.full_name") }}
                              </th>
                              <th>
                                {{ $t("plan.partner_official.organ_unit") }}
                              </th>
                              <th :width="'150px'">
                                {{ $t("plan.partner_official.numberPhone") }}
                              </th>
                              <th :width="'200px'">
                                {{ $t("plan.partner_official.email") }}
                              </th>
                              <th :width="'250px'">
                                {{ $t("plan.partner_official.position_group") }}
                              </th>
                              <th :width="'100px'" style="text-align: center">
                                {{ $t("common.action") }}
                              </th>
                            </tr>
                            <template
                              v-for="(item, index) in partnerData"
                              :key="index"
                            >
                              <tr>
                                <td>{{ index + 1 }}</td>
                                <td>
                                  <a-input
                                    :value="item.name"
                                    @input="onChangeName($event, item, index)"
                                    placeholder="Họ tên"
                                    style="width: 100%"
                                  ></a-input>
                                </td>
                                <td>
                                  <a-input
                                    :value="item.department_name"
                                    @input="
                                      onChangeDepartmentName(
                                        $event,
                                        item,
                                        index
                                      )
                                    "
                                    placeholder="Cơ quan đơn vị"
                                    style="width: 100%"
                                    :maxLength="100"
                                  ></a-input>
                                </td>
                                <td>
                                  <a-input
                                    v-model:value="item.phone_number"
                                    @input="
                                      onChangePhoneNumber($event, item, index)
                                    "
                                    :placeholder="
                                      $t('plan.partner_official.numberPhone')
                                    "
                                    style="width: 100%"
                                    :maxlength="12"
                                    @blur="onBlurPhoneNumber(item)"
                                  />
                                </td>
                                <td>
                                  <a-input
                                    :value="item.email"
                                    @input="onChangeEmail($event, item, index)"
                                    placeholder="Email"
                                    style="width: 100%"
                                    @blur="onBlurEmail(item)"
                                  ></a-input>
                                </td>
                                <td>
                                  <o-select
                                    ref="position_group"
                                    v-model:value="item.position_group"
                                    @input="onChangePositionGroup($event, item)"
                                    :placeholder="'Chức vụ'"
                                    entity="position-groups"
                                    :icon="'environment'"
                                    :isDisplay="'none'"
                                    :isDisplayAdd="'none'"
                                    textField="name"
                                    valueField="id"
                                    style="width: 100%"
                                    :filters="[
                                      {
                                        field: 'is_active',
                                        operator: 'in',
                                        value: activeEnum.KICH_HOAT,
                                      },
                                    ]"
                                  />
                                </td>
                                <td style="text-align: center">
                                  <a-button
                                    class="remove-item"
                                    type="text"
                                    style="width= 100%"
                                    @click="
                                      removePartner(partnerData, item, index)
                                    "
                                    ><template #icon
                                      ><DeleteOutlined /></template
                                  ></a-button>
                                </td>
                              </tr>
                            </template>
                          </table>
                        </a-form-item>
                        <a-form-model-item
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                        >
                          <a-button
                            type="dashed"
                            style="width: 100%"
                            @click="addPartnerOfficial"
                          >
                            <PlusCircleTwoTone />
                            {{ $t("plan.title.partner_info_add") }}
                          </a-button>
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
            </a-spin>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </a-col>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import i18n from "@/lang";
import { PlusCircleTwoTone, DeleteOutlined } from "@ant-design/icons-vue";
import {
  useGetList as getPlanUsers,
  useDelete as useDeletePlanUser,
} from "@/hooks/plan_user";
import { generateDataObject } from "@/common/generateData";
import {
  planUserType,
  regexEnum,
  isActive as activeEnum,
  planUserGender,
} from "@/common/enumUtility";
import { message } from "ant-design-vue";

const { t } = i18n.global;
const activeStaffKey = ref(["1"]);
const activePartnerKey = ref(["1"]);

interface Props {
  form: any;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  rules: {},
  fields: {},
});
const state = reactive({
  departmentData: [],
  userData: [],
  positionGroupData: [],
  value: [],
  fetching: false,
});
const paramsDefault = ref<any>({ planId: null, parentId: null });
const deletePlanUser = useDeletePlanUser();
const enabledGetPlanUsersDefault = computed(
  () => paramsDefault.value.planId != null
);
const form = ref<any>({
  ...props.form,
  id: props.form.id ? props.form.id : null,
});

const planParams = ref<any>({
  planId: props.form.id != null ? props.form.id : null,
});

const officialForm = ref<any>({
  staff_official: props.form.staff_official || [],
  partner_official: props.form.partner_official || [],
  ...props.form,
});

const staffData = computed(() => {
  return officialForm.value.staff_official;
});

const partnerData = computed(() => {
  return officialForm.value.partner_official;
});

const enabledGetPlanUsers = computed(() => {
  return planParams.value.planId != null;
});

const genderConstants = [
  { value: "O", label: "Chưa rõ" },
  { value: "M", label: "Nam" },
  { value: "G", label: "Nữ" },
];

const renderGender = (type) => {
  const item = genderConstants.find((i) => i.value == type);
  return item?.label;
};

const addStaffOfficial = () => {
  officialForm.value.staff_official.push({
    plan: { id: form.value.id },
    type: planUserType.staff,
    is_active: true,
    name: null,
    department_name: null,
    phone_number: null,
    email: null,
  });
};

const addPartnerOfficial = () => {
  officialForm.value.partner_official.push({
    plan: { id: form.value.id },
    type: planUserType.partner,
    is_active: true,
    name: null,
    department_name: null,
    phone_number: null,
    email: null,
  });
};

const changePartner = () => {
  if (officialForm.value.partner_official.length == 0) {
    addPartnerOfficial();
  }
};

const removeStaff = (data, item: any, index: any) => {
  if (item.id) {
    deletePlanUser
      .mutateAsync(item.id)
      .then((response) => {})
      .catch((error) => {
        var response = error?.response?.data;
        if (Array.isArray(response?.fieldErrors)) {
          message.error(
            response.fieldErrors.map((p: any) => p.message).join("\n")
          );
        } else {
          message.error(response.title || response.message);
        }
        console.log(error);
      });
  } else {
    officialForm.value.staff_official.splice(index, 1);
  }
};

const removePartner = (data, item: any, index: any) => {
  if (item.id) {
    deletePlanUser
      .mutateAsync(item.id)
      .then((response) => {})
      .catch((error) => {
        var response = error?.response?.data;
        if (Array.isArray(response?.fieldErrors)) {
          message.error(
            response.fieldErrors.map((p: any) => p.message).join("\n")
          );
        } else {
          message.error(response.title || response.message);
        }
        console.log(error);
      });
  } else {
    officialForm.value.partner_official.splice(index, 1);
  }
};

const onBlurEmail = (record: any) => {
  if (!regexEnum.email.test(record.email)) {
    message.error("Vui lòng nhập đúng định dạng email");
    record.email = null;
  }
};

const onBlurPhoneNumber = (record: any) => {
  if (!regexEnum.number.test(record.phone_number)) {
    message.error("Vui lòng nhập số điện thoại");
    record.phone_number = null;
  }
};

const onChangeUser = async ($event: any, record: any) => {
  if ($event.value) {
    let duplicate = staffData.value.find(
      (staff) => staff?.user?.id == $event.value.key
    );
    if (duplicate) {
      message.error("Nhân viên đã tham gia kế hoạch");
      record.user = {
        id: null,
        key: null,
      };
    } else {
      let data = await $event.value.options.find(
        (i) => i.id == $event.value.key
      );
      record.user = {
        ...data,
        id: $event.value.key,
        key: $event.value.key,
      };

      if (data) {
        record.code = data.entity_id;
        record.name = data.fullName;
        record.user_name = data.username;
        record.email = data.email;
        record.gender = data.gender;
        record.bank = data.bank_name;
        record.account_number = data.bank_account_number;
        record.phone_number = data.phone_number;
        record.position = data?.position?.name;
      }
    }
  } else {
    record.user = {
      id: null,
      key: null,
    };
    record.user = { id: null, key: null };
    record.name = null;
    record.gender = null;
    record.bank = null;
    record.account_number = null;
    record.phone_number = null;
    record.email = null;
  }
};

const onChangeDepartment = ($event, item: any) => {
  if ($event.value) {
    let data = $event.value.options.find((i) => i.id == $event.value.key);
    item.department = {
      ...data,
      id: $event.value.key,
      key: $event.value.key,
    };
  } else {
    item.department = {
      id: null,
      key: null,
    };
  }
  item.user = { id: null, key: null };
  item.name = null;
  item.gender = null;
  item.bank = null;
  item.account_number = null;
  item.phone_number = null;
  item.email = null;
};

const onChangePositionGroup = ($event, item: any) => {
  if ($event.value) {
    item.position_group = {
      id: $event.value.key,
      key: $event.value.key,
    };
  } else {
    item.position_group = {
      id: null,
      key: null,
    };
  }
};

const onChangeEmail = ($event: any, item: any, index: number) => {
  item.email = $event.target.value;
};

const onChangeName = ($event: any, item: any, index: number) => {
  item.name = $event.target.value;
};

const onChangeDepartmentName = ($event: any, item: any, index: number) => {
  item.department_name = $event.target.value;
};
const onChangePhoneNumber = ($event: any, item: any, index: number) => {
  item.phone_number = $event.target.value;
};

// Lấy danh sách cán bộ của kế hoạch
const { isLoading: planUserLoading } = getPlanUsers(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetPlanUsers,
  retry: true,
  onSuccess: async (val: any) => {
    if (val.data.content.length > 0) {
      officialForm.value.staff_official = [];
      officialForm.value.partner_official = [];
      val.data.content.forEach(async (item: any) => {
        if (item.type != null) {
          if (item.type == planUserType.staff) {
            officialForm.value.staff_official.push(generateUserInfo(item));
          } else {
            officialForm.value.partner_official.push(generateUserInfo(item));
          }
        }
      });
      if (officialForm.value.staff_official.length == 0) {
        addStaffOfficial();
      }
    } else if (props.form.is_add ? props.form.is_add : false) {
      paramsDefault.value = {
        planId: props.form?.parent?.id,
        parentId: props.form?.id,
      };
    }
  },
});

// Lấy danh sách cán bộ của kế hoạch bổ sung
const { isLoading: planUserDefaultLoading } = getPlanUsers(paramsDefault, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetPlanUsersDefault,
  retry: true,
  onSuccess: async (val: any) => {
    if (val.data.content.length > 0) {
      val.data.content.forEach((item: any) => {
        delete item.id;
        item.plan = { id: paramsDefault.value.parentId };
        if (item.type != null) {
          if (item.type == planUserType.staff) {
            officialForm.value.staff_official.push(generateUserInfo(item));
          } else {
            officialForm.value.partner_official.push(generateUserInfo(item));
          }
        }
      });
    }
  },
});

const generateUserInfo = (item: any) => {
  const keyWords = ["department", "plan", "user", "position_group"];
  const ruleKeys = {
    user: { value: "id", label: ["username", "fullName"] },
  };
  let res = generateDataObject(keyWords, ruleKeys, item);
  return res;
};

const validateForm = () => {
  let data = [
    ...officialForm.value.staff_official,
    ...officialForm.value.partner_official,
  ];
  let result: any = [];
  for (let item of data) {
    if (item.name == null || `${item.name}`.trim() == "") {
      result.push("Họ tên không được để trống");
    }
    if (
      typeof item?.gender != "undefined" &&
      item?.gender == planUserGender.ORTHER
    ) {
      result.push(" Vui lòng cập nhật giới tính cho cán bộ công tác");
    }
  }
  return result;
};
defineExpose({
  officialForm,
  validateForm,
});
</script>
<style scoped lang="scss">
.ant-input-number {
  width: 100%;
}
table.table_item {
  width: 100%;
}

table.table_item tr th {
  color: #ed1b2f;
  border: 1px solid #f0f0f0;
  background: #fafafa;
  text-align: center;
}

table.table_item tr td {
  color: #ed1b2f;
  border: 1px solid #f0f0f0;
}

.ant-form-item {
  margin-bottom: 12px;
  :deep(.ant-time-picker) {
    width: 100%;
  }
}
.ant-table-wrapper {
  width: 100%;
}

.ant-collapse {
  width: 100%;
}
</style>
