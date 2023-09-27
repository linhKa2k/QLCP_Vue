<template>
  <a-col :span="24">
    <a-row>
      <a-col :span="24">
        <a-collapse v-model:activeKey="activeKey">
          <a-collapse-panel
            key="1"
            :header="'Danh sách cán bộ đi công tác'"
            style="font-weight: bold"
          >
            <a-col :span="24">
              <a-col>
                <a-form-item
                  :label-col="{ span: 24 }"
                  :wrapper-col="{ span: 24 }"
                  style="font-weight: normal !important"
                >
                  <a-table
                    :columns="staffColumns"
                    :data-source="staffDatas"
                    :pagination="false"
                    bordered
                    :loading="planUserLoading"
                  >
                    <template #STT="{ index }">
                      <span>{{ index + 1 }}</span>
                    </template>
                    <template #department="{ text }">
                      <span>{{ text ? text.name : "--" }}</span>
                    </template>
                    <template #user_code="{ text }">
                      <span>{{ text ? text.user_name : "--" }}</span>
                    </template>
                    <template #gender="{ text }">
                      <span>
                        {{ text ? renderGender(text) : null }}
                      </span>
                    </template>

                    <template #phone_number="{ text }">
                      <a :href="`tel:${text}`">{{ text }}</a>
                    </template>

                    <template #email="{ text }">
                      <a :href="`mailto:${text}`">{{ text }}</a>
                    </template>
                  </a-table>
                </a-form-item>
              </a-col>
            </a-col>
          </a-collapse-panel>
        </a-collapse>
      </a-col>

      <a-col :span="24">
        <a-collapse v-model:activeKey="activeKey">
          <a-collapse-panel
            key="2"
            :header="'Danh sách đối tác'"
            style="font-weight: bold"
          >
            <a-form-item
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
              style="font-weight: normal !important"
            >
              <a-table
                :columns="partnerColumns"
                :dataSource="partnerDatas"
                :pagination="false"
                bordered
                :loading="planUserLoading"
              >
                <template #STT="{ index }">
                  <span>{{ index + 1 }}</span>
                </template>
                <template #phone_number="{ text }">
                  <a :href="`tel:${text}`">{{ text }}</a>
                </template>
                <template #email="{ text }">
                  <a :href="`mailto:${text}`">{{ text }}</a>
                </template>
              </a-table>
            </a-form-item>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </a-col>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import i18n from "@/lang";
import PlanRouteUser from "@/services/PlanRouteUser";
import PlanUserService from "@/services/PlanUserService";
import { useGetList as getPlanUsers } from "@/hooks/plan_user";
import { generateDataObject } from "@/common/generateData";
import { planUserType } from "@/common/enumUtility";
const staffDatas = ref<any[]>([]);
const partnerDatas = ref<any[]>([]);
const activeKey = ref(["1", "2"]);
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
const form = ref<any>(props.form);
const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
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
const { isLoading: planUserLoading } = getPlanUsers(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetPlanUsers,
  retry: true,
  onSuccess: async (val: any) => {
    if (val.data.content.length > 0) {
      val.data.content.forEach((item: any) => {
        if (item.type != null) {
          if (item.type == planUserType.staff) {
            staffDatas.value.push(item);
          } else {
            partnerDatas.value.push(item);
          }
        }
      });
    }
  },
});

const generateUserinfo = (item: any) => {
  const keyWords = ["department", "plan", "user", "position_group"];
  const ruleKeys = {
    user: { value: "id", label: "username" },
  };
  let res = generateDataObject(keyWords, ruleKeys, item);
  return res;
};

const staffColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "5%",
    slots: { customRender: "STT" },
  },
  {
    title: "Đơn vị ",
    dataIndex: "department",
    width: "10%",
    slots: { customRender: "department" },
  },
  {
    title: "Mã nhân viên",
    dataIndex: "user",
    width: "7%",
    slots: { customRender: "user_code" },
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "8%",
  },
  {
    title: "Chức danh",
    dataIndex: "user.position.name",
    width: "8%",
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: "5%",
    slots: { customRender: "gender" },
  },
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    width: "8%",
  },
  {
    title: "Tài khoản",
    dataIndex: "user.bank_account_number",
    width: "8%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "10%",
    slots: { customRender: "phone_number" },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "12%",
    slots: { customRender: "email" },
  },
];

const partnerColumns = [
  {
    title: "STT",
    dataIndex: "",
    width: "5%",
    slots: { customRender: "STT" },
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "15%",
  },
  {
    title: "Cơ quan đơn vị",
    dataIndex: "department_name",
    width: "15%",
  },
  {
    title: "Nhóm chức vụ",
    dataIndex: "position_group.name",
    width: "15%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "15%",
    slots: { customRender: "phone_number" },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "15%",
    slots: { customRender: "email" },
  },
];
</script>
<style>
.ant-table-thead tr th {
  color: #ed1b2f;
}

/* table.table_item {
  width: 100%;
}

.ant-table-wrapper {
  width: 100%;
}

.ant-collapse {
  width: 100%;
} */
</style>
