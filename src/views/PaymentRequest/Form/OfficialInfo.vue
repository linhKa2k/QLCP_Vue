<template :loading="planUserLoading">
  <a-col :span="24">
    <a-row>
      <a-col :span="24">
        <a-collapse v-model:activeKey="activeKey">
          <a-collapse-panel
            key="1"
            :header="$t('plan.attribute.plan_official_list')"
          >
            <a-col :span="24">
              <a-form-item
                name="staff_official"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }"
              >
                <table class="table_item">
                  <tr>
                    <th :width="'150px'">
                      {{ $t("plan.staff_official.unit") }}
                    </th>
                    <th :width="'150px'">
                      {{ $t("plan.staff_official.code_staff") }}
                    </th>
                    <th :width="'150'">
                      {{ $t("plan.staff_official.full_name") }}
                    </th>
                    <th :width="'100px'">
                      {{ $t("plan.staff_official.gender") }}
                    </th>
                    <th :width="'100px'">
                      {{ $t("plan.staff_official.bank") }}
                    </th>
                    <th :width="'100px'">
                      {{ $t("plan.staff_official.bank_account") }}
                    </th>

                    <th :width="'100px'">
                      {{ $t("plan.staff_official.numberPhone") }}
                    </th>
                    <th :width="'100px'">
                      {{ $t("plan.staff_official.email") }}
                    </th>
                    <th :width="'70px'">
                      {{ $t("common.action") }}
                    </th>
                  </tr>
                  <template v-for="(item, index) in staffData" :key="index">
                    <tr>
                      <td :width="'150px'">
                        <a-select
                          v-model:value="item.department"
                          label-in-value
                          placeholder="Đơn vị"
                          style="width: 150px"
                          :filter-option="false"
                          :show-search="true"
                          :not-found-content="state.fetching ? undefined : null"
                          :options="state.departmentData"
                          @search="getDepartment"
                          @focus="getDepartment(null)"
                          @change="onChangeDepartment($event, item)"
                        >
                          <template v-if="state.fetching" #notFoundContent>
                            <a-spin size="small" />
                          </template>
                        </a-select>
                      </td>
                      <td :width="'150px'">
                        <a-select
                          v-model:value="item.user"
                          label-in-value
                          placeholder="Nhân viên"
                          style="width: 150px"
                          :filter-option="false"
                          :show-search="true"
                          :not-found-content="state.fetching ? undefined : null"
                          :options="state.userData"
                          @search="getUser"
                          @change="onChangeUser($event, item)"
                          @focus="getUser(null)"
                        >
                          <template v-if="state.fetching" #notFoundContent>
                            <a-spin size="small" />
                          </template>
                        </a-select>
                      </td>
                      <td :width="'150px'">
                        <span>
                          {{ item.user_name ? item.user_name : "--" }}</span
                        >
                      </td>
                      <!-- <td>
                      <span> {{ item.position ? item.position : "--" }}</span>
                    </td> -->
                      <td :width="'50px'">
                        <span>
                          {{
                            item.gender ? renderGender(item.gender) : "--"
                          }}</span
                        >
                      </td>
                      <td :width="'50px'">
                        <span> {{ item.bank ? item.bank : "--" }}</span>
                      </td>
                      <td :width="'50px'">
                        <span>
                          {{
                            item.account_number ? item.account_number : "--"
                          }}</span
                        >
                      </td>
                      <td :width="'50px'">
                        <span>
                          {{
                            item.phone_number ? item.phone_number : "--"
                          }}</span
                        >
                      </td>
                      <td :width="'50px'">
                        <span> {{ item.email ? item.email : "--" }}</span>
                      </td>
                      <td :width="'50px'" type="flex" align="center">
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
                  @click="addStaffOfficical"
                >
                  <PlusCircleTwoTone />
                  {{ $t("plan.title.official_info_add") }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
      <a-col :span="24">
        <a-collapse v-model:activeKey="activeKey">
          <a-collapse-panel
            key="2"
            :header="$t('plan.attribute.plan_partner_list')"
            :disabled="false"
          >
            <a-col :span="24">
              <a-row>
                <a-col :span="24">
                  <a-row type="flex" justify="space-between">
                    <a-col>
                      <span>{{ t("plan.attribute.plan_partner_list") }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="24">
                      <a-form-item
                        name="partner_official"
                        :label-col="{ span: 24 }"
                        :wrapper-col="{ span: 24 }"
                      >
                        <table class="table_item">
                          <tr>
                            <th>
                              {{ $t("plan.partner_official.full_name") }}
                            </th>
                            <th :width="'200px'">
                              {{ $t("plan.partner_official.organ_unit") }}
                            </th>
                            <th>
                              {{ $t("plan.partner_official.numberPhone") }}
                            </th>
                            <th>
                              {{ $t("plan.partner_official.email") }}
                            </th>
                            <th :width="'200px'">
                              {{ $t("plan.partner_official.position_group") }}
                            </th>
                            <th>
                              {{ $t("common.action") }}
                            </th>
                          </tr>
                          <template
                            v-for="(item, index) in partnerData"
                            :key="index"
                          >
                            <tr>
                              <td>
                                <a-input
                                  :value="item.user_name"
                                  @input="onChangeName($event, item, index)"
                                  placeholder="Họ tên"
                                ></a-input>
                              </td>
                              <td>
                                <a-select
                                  v-model:value="item.department"
                                  label-in-value
                                  placeholder="Cơ quan đơn vị"
                                  style="width: 200px"
                                  :filter-option="false"
                                  :show-search="true"
                                  :not-found-content="
                                    state.fetching ? undefined : null
                                  "
                                  :options="state.departmentData"
                                  @search="getDepartment"
                                  @focus="getDepartment(null)"
                                  @change="onChangeDepartment($event, item)"
                                >
                                  <template
                                    v-if="state.fetching"
                                    #notFoundContent
                                  >
                                    <a-spin size="small" />
                                  </template>
                                </a-select>
                              </td>
                              <td>
                                <a-input
                                  :value="item.phone_number"
                                  @input="
                                    onChangePhoneNumber($event, item, index)
                                  "
                                  :placeholder="
                                    $t('plan.partner_official.numberPhone')
                                  "
                                />
                              </td>
                              <td>
                                <a-input
                                  :value="item.email"
                                  @input="onChangeEmail($event, item, index)"
                                  placeholder="Email"
                                ></a-input>
                              </td>
                              <td>
                                <a-select
                                  v-model:value="item.position_group"
                                  label-in-value
                                  placeholder="Chức vụ"
                                  style="width: 200px"
                                  :filter-option="false"
                                  :show-search="true"
                                  :not-found-content="
                                    state.fetching ? undefined : null
                                  "
                                  :options="state.positionGroupData"
                                  @search="getPositionGroup"
                                  @focus="getPositionGroup(null)"
                                  @change="onChangePositionGroup($event, item)"
                                >
                                  <template
                                    v-if="state.fetching"
                                    #notFoundContent
                                  >
                                    <a-spin size="small" />
                                  </template>
                                </a-select>
                              </td>
                              <td>
                                <a-button
                                  class="remove-item"
                                  type="text"
                                  style="width= 100%"
                                  @click="
                                    removePartner(partnerData, item, index)
                                  "
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
                          @click="addPartnerOfficical"
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
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </a-col>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import i18n from "@/lang";
import { PlusCircleTwoTone, DeleteOutlined } from "@ant-design/icons-vue";
import Derpartment from "@/services/DepartmentService";
import UserAdminService from "@/services/UserAdminService";
import UserService from "@/services/UserService";
import PositionGroupService from "@/services/PositionGroupService";
import { useGetList as getPlanUsers } from "@/hooks/plan_user";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import { generateDataObject } from "@/common/generateData";
import {paymentRequestType, planUserType} from "@/common/enumUtility"
const queryClient = useQueryClient();
const { t } = i18n.global;
const activeKey = ref(["1"]);

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
const fake = ref<any[]>([]);
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

const addStaffOfficical = () => {
  officialForm.value.staff_official.push({
    plan: { id: form.value.id },
    type: 1,
    is_active: true,
  });
};

const addPartnerOfficical = () => {
  officialForm.value.partner_official.push({
    plan: { id: form.value.id },
    type: 2,
    is_active: true,
  });
};

const removeStaff = (data, item: any, index: any) => {
  officialForm.value.staff_official.splice(index, 1);
};
const removePartner = (data, item: any, index: any) => {
  officialForm.value.partner_official.splice(index, 1);
};

const getDepartment = async (event: any) => {
  let params: any;
  if (event != null) {
    params = {
      "name.contains": event,
    };
  }
  const result = await Derpartment.get(params);
  state.departmentData =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      : [];
};

const getUser = async (event: any) => {
  let params: any;
  if (event != null) {
    params = {
      "fullName.contains": event,
    };
  }
  const result = await UserService.get(params);
  state.userData =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.fullName,
            value: item.id,
            ...item,
          };
        })
      : [];
};

const onChangeUser = async ($event: any, record: any) => {
  state.userData.forEach((item: any) => {
    if (item.id == $event.value) {
      record.user_name = item.fullName;
      record.email = item.email;
      record.gender = item.gender;
      record.bank = item.bank_location;
      record.account_number = item.bank_account_number;
      record.phone_number = item.phone_number;
    }
  });

  if ($event.value) {
    record.user = {
      id: $event.value,
      key: $event.key,
    };
  } else {
    record.user = {
      id: null,
      key: null,
    };
  }
};

const onChangeDepartment = ($event, item: any) => {
  if ($event.value) {
    item.department = {
      id: $event.value,
      key: $event.key,
    };
  } else {
    item.department = {
      id: null,
      key: null,
    };
  }
};

const getPositionGroup = async (event: any) => {
  let params: any;
  if (event != null) {
    params = {
      "name.contains": event,
    };
  }
  const result = await PositionGroupService.get(params);
  state.positionGroupData =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        })
      : [];
};

const onChangePositionGroup = ($event, item: any) => {
  if ($event.value) {
    item.position_group = {
      id: $event.value,
      key: $event.key,
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
  item.user_name = $event.target.value;
};

const onChangePhoneNumber = ($event: any, item: any, index: number) => {
  item.phone_number = $event.target.value;
};

const { isLoading: planUserLoading } = getPlanUsers(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanUsers,
  retry: false,
  onSuccess: async (val: any) => {
    if (val.data.content.length > 0) {
      val.data.content.forEach((item: any) => {
        if (item.type != null) {
          if (item.type == planUserType.staff) {
            officialForm.value.staff_official.push(generateUserinfo(item));
          } else {
            officialForm.value.partner_official.push(generateUserinfo(item));
          }
        }
      });
    }
  },
});

const generateUserinfo = (item: any) => {
  const keyWords = ["department", "plan", "user", "position_group"];
  const ruleKeys = {
    user: { value: "id", label: "fullName" },
  };
  let res = generateDataObject(keyWords, ruleKeys, item);
  return res;
};

defineExpose({
  officialForm,
});

</script>
<style scoped lang="scss">
.ant-input-number {
  width: 100%;
}
table.table_item {
  width: 100%;
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
