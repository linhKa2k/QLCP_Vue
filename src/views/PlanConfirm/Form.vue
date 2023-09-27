<template>
  <a-form
    ref="formRequestConfirm"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
  >
    <a-row :gutter="24" class="form_padding">
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Kế hoạch công tác'">
              <span> {{ form.plan ? form.plan.label : "--" }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :style="statusStyle(form.status)"
              :label="'Trạng thái'"
            >
              <span> {{ form.status ? renderStatus(form.status) : "--" }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Lộ trình công tác'">
              <span> {{ form.plan_route ? form.plan_route.label : "--" }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Đơn vị công tác'">
              <span>
                {{
                  form.department_require ? form.department_require.label : "--"
                }}</span
              >
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <h3 style="margin-bottom: 0px !important">Chặng di chuyển thực tế</h3>

          <a-table
            :columns="routeRealityColumns"
            :data-source="form.routeRealityData"
            :pagination="false"
            bordered
          >
            <template #STT="{ index }">
              {{ index + 1 }}
            </template>
            <template #from_province="{ record }">
              <span>{{
                record.from_province ? record.from_province.name : "--"
              }}</span>
            </template>
            <template #from_district="{ record }">
              <span>{{
                record.from_district ? record.from_district.name : "--"
              }}</span>
            </template>
            <template #to_province="{ record }">
              <span>{{
                record.to_province ? record.to_province.name : "--"
              }}</span>
            </template>
            <template #to_district="{ record }">
              <span>{{
                record.to_district ? record.to_district.name : "--"
              }}</span>
            </template>
            <template #vehicle="{ record }">
              <span>{{ record.vehicle ? record.vehicle.name : "--" }}</span>
            </template>
          </a-table>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <h3 style="margin-bottom: 0px">Danh sách cán bộ</h3>
          <a-table
            :columns="planConfirmUserColumns"
            :data-source="form.planConfirmUserData"
            :pagination="false"
            bordered
          >
            <template #STT="{ index }">
              {{ index + 1 }}
            </template>
            <template #code="{ record }">
              <span>{{
                record.plan_user ? record.plan_user.user_name : "--"
              }}</span>
            </template>
            <template #name="{ record }">
              <span>{{ record.plan_user ? record.plan_user.name : "--" }}</span>
            </template>
            <template #is_business="{ record }">
              <a-form-item
                style="padding: 10px; display: flex; justify-content: center"
              >
                <a-checkbox
                  v-model:checked="record.is_business"
                  disabled
                ></a-checkbox>
              </a-form-item>
            </template>
            <template #date="{ text }">
              <span>{{ text ? formatDate(text) : "--" }}</span>
            </template>
            <template #checkin_time="{ record }">
              <span>{{
                record.plan_checkin
                  ? formatDateTimeVN(record.plan_checkin.checkin_time)
                  : "--"
              }}</span>
            </template>
            <template #checkin_location="{ record }">
              <div v-html="renderLink(record?.plan_checkin)" />
            </template>
            <template #checkin_file="{ record }">
              <span>{{
                record.plan_checkin ? record.plan_checkin?.checkin_file : "--"
              }}</span>
            </template>
          </a-table>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      size="middle"
      style="background-color: #ed1b2f; color: white"
      @click="handleConfirmPlan()"
      :loading="confirmBtnLoading"
      :disabled="confirmBtnDisabled"
      v-if="isShowButton()"
    >
      <SaveOutlined />{{ "Xác nhận công tác" }}
    </a-button>
    <a-button
      size="middle"
      style="background-color: #ed1b2f; color: white"
      @click="handleDeny()"
      :loading="denyBtnLoading"
      :disabled="denyBtnDisabled"
      v-if="isShowButton()"
    >
      <DoubleLeftOutlined />{{ "Từ chối" }}
    </a-button>
    <a-button
      size="middle"
      style="background-color: #ed1b2f; color: white"
      @click="hiddenModal"
    >
      <DoubleLeftOutlined />{{ "Đóng" }}
    </a-button>
  </a-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import i18n from "@/lang";
import { useUpdatePlanConfirm } from "@/hooks/plan_confirm";
import { formatDate } from "@/utility";
import { message } from "ant-design-vue";
import { statusConfirmWorkRequest } from "@/common/enumUtility";
import { planConfirmStatus } from "@/common/enumUtility";
import { formatDateTimeVN } from "@/mixins";

interface Props {
  form: any;
  width: string;
  rules: any;
  formData: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  formData: {},
  width: "",
  rules: {},
});
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 18 });
const layout = ref<string>("horizontal");
const formRequestConfirm = ref();
const confirmBtnLoading = ref<boolean>(false);
const confirmBtnDisabled = ref<boolean>(false);
const denyBtnLoading = ref<boolean>(false);
const denyBtnDisabled = ref<boolean>(false);
const updatePlanConfirmStatus = useUpdatePlanConfirm();
const { t } = i18n.global;

const form = ref<any>({
  ...props.formData,
  routeRealityData: [
    {
      from_province: props?.formData?.from_province,
      to_province: props?.formData?.to_province,
      from_district: props?.formData?.from_district,
      to_district: props?.formData?.to_district,
      vehicle: props?.formData?.vehicle,
    },
  ],
  planConfirmUserData: props?.formData?.plan_confirm_user
    ? props?.formData?.plan_confirm_user.map((i) => {
        return {
          ...i,
          checkin_time: i.plan_checkin ? i.plan_checkin.checkin_time : null,
          checkin_location: i.plan_checkin
            ? i.plan_checkin.checkin_location
            : null,
          checkin_file: i.plan_checkin ? i.plan_checkin.checkin_file : null,
        };
      })
    : [],
});

const statusStyle = (status) => {
  let color = status
    ? status == planConfirmStatus.confirm
      ? "red"
      : "#FF8C00"
    : "black";
  return {
    color: color,
  };
};

const renderLink = (record) => {
  return record
    ? record.checkin_location
      ? `<a target="blank" href="https://www.google.com/maps/@${
          record.checkin_latitude + "," + record.checkin_longitude
        }z?entry=ttu">${record.checkin_location}</a>`
      : "--"
    : "--";
};

const isShowButton = () => {
  return ![planConfirmStatus.confirm, planConfirmStatus.refuse].includes(
    props.formData?.status
  );
};

const renderStatus = (value) => {
  let transit = "";
  switch (value) {
    case 1:
      transit = t("planConfirm.status.1");
      break;
    case 2:
      transit = t("planConfirm.status.2");
      break;
    case 3:
      transit = t("planConfirm.status.3");
      break;
    default:
      transit = "--";
      break;
  }
  return transit;
};

const routeRealityColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "5%",
    slots: { customRender: "STT" },
  },
  {
    title: "Thành phố đi",
    dataIndex: "from_province",
    slots: { customRender: "from_province" },
  },
  {
    title: "Quận/ Huyện",
    dataIndex: "from_district",
    slots: { customRender: "from_district" },
  },
  {
    title: "Thành phố đến",
    dataIndex: "to_province",
    slots: { customRender: "to_province" },
  },
  {
    title: "Quận/ Huyện",
    dataIndex: "to_district",
    slots: { customRender: "to_district" },
  },
  {
    title: "Phương tiện công tác",
    dataIndex: "vehicle",
    slots: { customRender: "vehicle" },
  },
];

const planConfirmUserColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: "5%",
    slots: { customRender: "STT" },
  },
  {
    title: "Mã nhân viên",
    dataIndex: "plan_user",
    slots: { customRender: "code" },
  },
  {
    title: "Họ tên",
    dataIndex: "plan_user",
    slots: { customRender: "name" },
  },
  {
    title: "Đi công tác",
    dataIndex: "is_business",
    slots: { customRender: "is_business" },
  },
  {
    title: "Từ ngày",
    dataIndex: "from_date",
    slots: { customRender: "date" },
  },
  {
    title: "Đến ngày",
    dataIndex: "to_date",
    slots: { customRender: "date" },
  },
  {
    title: "Số ngày nghỉ qua đêm",
    dataIndex: "total_night",
    slots: { customRender: "total_night" },
  },
  {
    title: "Thời gian checkIn",
    dataIndex: "checkin_time",
    slots: { customRender: "checkin_time" },
  },
  {
    title: "Địa điểm checkIn",
    dataIndex: "checkin_location",
    slots: { customRender: "checkin_location" },
  },
  {
    title: "Link ảnh checkIn",
    dataIndex: "checkin_file",
    slots: { customRender: "checkin_file" },
  },
];

const emit = defineEmits<{
  (e: "hideModal"): void;
  (e: "cancelForm", data?: any): void;
}>();

const handleConfirmPlan = () => {
  confirmBtnLoading.value = true;
  denyBtnDisabled.value = true;
  updatePlanConfirmStatus
    .mutateAsync({
      plan_route_id: form.value?.plan_route?.id,
      status: statusConfirmWorkRequest.confirm,
      plan_confirm_id: form.value?.id,
    })
    .then((response) => {
      message.success("Xác nhận thành công");
      confirmBtnLoading.value = false;
      denyBtnDisabled.value = false;
      hiddenModal();
    })
    .catch((error) => {
      message.error(error.message);
      denyBtnDisabled.value = false;
      confirmBtnLoading.value = false;
    });
};

const handleDeny = () => {
  denyBtnLoading.value = true;
  confirmBtnDisabled.value = true;
  updatePlanConfirmStatus
    .mutateAsync({
      plan_route_id: form.value?.plan_route?.id,
      status: statusConfirmWorkRequest.refuse,
      plan_confirm_id: form.value?.id,
    })
    .then((response) => {
      message.success("Từ chối thành công");
      hiddenModal();
      denyBtnLoading.value = false;
      confirmBtnDisabled.value = false;
    })
    .catch((error) => {
      message.error(error);
      denyBtnLoading.value = false;
      confirmBtnDisabled.value = false;
    });
};

const hiddenModal = () => {
  emit("cancelForm");
};
</script>

<style scoped lang="scss">
table.table_item {
  width: 100%;
  border: 1px;
}

.table_item tr th {
  color: #ed1b2f;
}
.form_padding {
  padding: 20px;
}
.footer {
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: white;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
  position: absolute;
  bottom: 0px;
  z-index: 1;

  .ant-btn {
    margin-left: 15px;
  }

  .ant-btn-text {
    border: none;
    width: fit-content;
  }

  .ant-btn-text:hover,
  .ant-btn-text:active,
  .ant-btn-text:focus {
    color: var(--mainColor);
  }

  .prev:hover,
  .prev:active,
  .prev:focus {
    border: 1px solid var(--mainColor);
    color: var(--mainColor);
  }

  .ant-btn-primary:hover,
  .ant-btn-primary:active,
  .ant-btn-primary:focus {
    border-color: var(--mainColor);
    // color: var(--mainColor);
    background: var(--mainColor);
  }
}
</style>
