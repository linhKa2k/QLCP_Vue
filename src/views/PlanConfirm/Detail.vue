<template>
  <a-form ref="formRequestCofirm" :model="form" labelAlign="left">
    <a-row :gutter="24" class="form_padding">
      <a-col :span="24">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Kế hoạch công tác'">
              <span> {{ form.plan ? form.plan.name : "--" }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="'Trạng thái'"
              :style="statusStyle(form.status)"
            >
              <span> {{ form.status ? renderStatus(form.status) : "--" }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Lộ trình công tác'">
              <span> {{ form.plan_route ? form.plan_route.name : "--" }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="'Đơn vị công tác'">
              <span>
                {{
                  form.department_require ? form.department_require.name : "--"
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
            :data-source="routeRealityData"
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
            :data-source="form.plan_confirm_user"
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
            <template #checkin_file="{ text }">
              <span>{{ text ? text : "--" }}</span>
            </template>
          </a-table>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import i18n from "@/lang";
import { formatDate, formatStatus } from "@/utility";
import { formatDateTimeVN } from "@/mixins";
import { planConfirmStatus } from "@/common/enumUtility";

const routeRealityData = ref<any>([]);

const { t } = i18n.global;

interface Props {
  form: any;
  width: string;
  rules: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
});

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
    width: "80px",
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
    width: "80px",
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

watch(
  () => props.form,
  (val: any) => {
    routeRealityData.value = [
      {
        from_province: props?.form?.from_province,
        to_province: props?.form?.to_province,
        from_district: props?.form?.from_district,
        to_district: props?.form?.to_district,
        vehicle: props?.form?.vehicle,
      },
    ];
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.form_padding {
  padding: 20px;
}
</style>
