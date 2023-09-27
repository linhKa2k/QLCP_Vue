<template>
  <a-form
    ref="formRequestCofirm"
    :model="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :layout="'horizontal'"
    labelAlign="left"
  >
    <a-spin :spinning="formLoading">
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item name="name" label="Lộ trình công tác">
            {{ formProps?.dataSelect ? formProps?.dataSelect?.name : "--" }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item name="name" label="Đơn vị công tác">
            {{
              formProps?.dataSelect
                ? formProps?.dataSelect?.to_department?.name
                : "--"
            }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
            <h3 style="margin-bottom: 0px !important">
              Chặng di chuyển thực tế
            </h3>
            <a-table
              :columns="planConfirmColumns"
              :data-source="planConfirmData"
              bordered
              :pagination="false"
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
                  record.to_district ? record.to_district.name : " --"
                }}</span>
              </template>
              <template #vehicle="{ record }">
                <span>{{ record.vehicle ? record.vehicle.name : "--" }}</span>
              </template>
            </a-table>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
            <h3 style="margin-bottom: 0px">Danh sách cán bộ</h3>
            <a-table
              :columns="planConfirmUserColumns"
              :data-source="planConfirmUserData"
              bordered
              :pagination="false"
            >
              <template #STT="{ index }">
                {{ index + 1 }}
              </template>
              <template #user_name="{ text }">
                <span>{{ text ? text : "--" }}</span>
              </template>
              <template #name="{ text }">
                <span>{{ text ? text : "--" }}</span>
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
              <template #from_date="{ record }">
                <span>{{
                  record.from_date ? formatDate(record.from_date) : "--"
                }}</span>
              </template>
              <template #to_date="{ record }">
                <span>{{
                  record.to_date ? formatDate(record.to_date) : "--"
                }}</span>
              </template>
              <template #total_night="{ record }">
                <span>{{
                  record.total_night ? record.total_night : "--"
                }}</span>
              </template>
              <template #checkin_time="{ record }">
                <span>{{
                  record.plan_checkin
                    ? formatDateTimeVN(record.plan_checkin?.checkin_time)
                    : "--"
                }}</span>
              </template>
              <template #checkin_location="{ record }">
                <template v-if="record.plan_checkin != null">
                  <div v-html="renderLink(record.plan_checkin)"></div>
                </template>
                <template v-else>
                  <span> {{ "--" }}</span>
                </template>
              </template>
              <template #checkin_file="{ record }">
                <span>{{
                  record.plan_checkin
                    ? record.plan_checkin?.checkin_file_id
                      ? record.plan_checkin.checkin_file_id
                      : "--"
                    : "--"
                }}</span>
              </template>
            </a-table>
          </a-form-item>
        </a-col>
      </a-row>
    </a-spin>
  </a-form>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      v-if="true"
      class="prev"
      @click="hiddenModal"
      size="middle"
      style="background-color: #ed1b2f; color: #fff"
    >
      <DoubleLeftOutlined />{{ "OK" }}
    </a-button>
  </a-row>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { generateDataObject } from "@/common/generateData";
import { formatDate } from "@/utility";
import { formatDateTimeVN } from "@/mixins";
import moment from "moment/moment";

interface Props {
  form: any;
  width: string;
  rules: any;
  formLoading: boolean;
  dataDetail: any;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  formLoading: false,
  dataDetail: null,
});
const formRequestCofirm = ref();
const mode = computed(() => (props.form.mode ? props.form.mode : "add"));
const form = ref<any>({});
const formProps = ref<any>(props.form);
const planConfirmDetail = computed(() =>
  props.dataDetail ? generateCustomData(props.dataDetail) : null
);
const formLoading = computed(() => props.formLoading);

const planConfirmUserData = ref<any[]>(
  props.form.dataTable
    ? props.form.dataTable.map((item) => {
        return {
          ...item,
          from_date: item.start_time_reality
            ? moment(item.start_time_reality)
            : null,
          to_date: item.end_time_reality ? moment(item.end_time_reality) : null,
        };
      })
    : []
);
const generateCustomData = (data: any) => {
  const keyWords = [
    "from_province",
    "to_province",
    "from_district",
    "to_district",
    "vehicle",
  ];
  const ruleKeys = {};
  let res = generateDataObject(keyWords, ruleKeys, data);
  return res;
};

const planConfirmData = ref<any[]>(
  props.form.dataSelect ? [generateCustomData(props.form.dataSelect)] : [{}]
);

watch(
  () => planConfirmDetail.value,
  (val: any) => {
    if (val) {
      console.log("setUpdate data update", val);
      planConfirmData.value[0] = val;
      planConfirmUserData.value = val.plan_confirm_user
        ? val.plan_confirm_user.map((item) => {
            return {
              ...item,
              user_name: item.code,
              name: item.full_name,
            };
          })
        : [];
    }
    console.log(planConfirmUserData.value, "///planConfirmUserData.value");
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

const hiddenModal = () => {
  emit("hideModal");
};

const planConfirmColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: 70,
    slots: { customRender: "STT" },
  },
  {
    title: "Thành phố đi",
    dataIndex: "from_province",
    slots: { customRender: "from_province" },
  },
  {
    title: "Quận/ Huyện đi",
    dataIndex: "from_district",
    slots: { customRender: "from_district" },
  },
  {
    title: "Thành phố đến",
    dataIndex: "to_province",
    slots: { customRender: "to_province" },
  },
  {
    title: "Quận/ Huyện đến",
    dataIndex: "to_district",
    slots: { customRender: "to_district" },
  },
  {
    title: "Phương tiện công tác",
    dataIndex: "vehicle",
    key: "vehicle",
    slots: { customRender: "vehicle" },
  },
];

const planConfirmUserColumns = [
  {
    title: "STT",
    dataIndex: "index",
    width: 70,
    slots: { customRender: "STT" },
  },
  {
    title: "Mã nhân viên",
    dataIndex: "user_name",
    key: "user_name",
    slots: { customRender: "user_name" },
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    key: "name",
    slots: { customRender: "name" },
  },
  {
    title: "Đi công tác",
    dataIndex: "is_business",
    key: "is_business",
    slots: { customRender: "is_business" },
  },
  {
    title: "Từ ngày",
    dataIndex: "from_date",
    key: "from_date",
    slots: { customRender: "from_date" },
  },
  {
    title: "Đến ngày",
    dataIndex: "to_date",
    key: "to_date",
    slots: { customRender: "to_date" },
  },
  {
    title: "Số ngày nghỉ qua đêm",
    dataIndex: "total_night",
    key: "to_date",
    slots: { customRender: "total_night" },
  },
  {
    title: "Thời gian checkIn",
    dataIndex: "checkin_time",
    key: "checkin_time",
    slots: { customRender: "checkin_time" },
  },
  {
    title: "Địa điểm checkIn",
    dataIndex: "checkin_location",
    key: "checkin_location",
    slots: { customRender: "checkin_location" },
  },
  {
    title: "Link ảnh checkIn",
    dataIndex: "checkin_file",
    key: "checkin_file",
    slots: { customRender: "checkin_file" },
  },
];

const renderLink = (record) => {
  console.log(record, " //check record");
  return `<a href="https://www.google.com/maps/@${
    record.checkin_latitule + "," + record.checkin_longitude
  }z?entry=ttu">${record.checkin_location}</a>`;
};
</script>

<style scoped lang="scss">
table.table_item {
  width: 100%;
  border: none;
}
.table_item tr th {
  color: #ed1b2f;
  background-color: #fafafa;
}
table,
th,
td {
  border: 1px solid #ccc;
  text-align: center;
}
table {
  border-collapse: collapse;
}
tr:hover {
  background-color: #ddd;
  cursor: pointer;
}

.table_item tr th {
  color: #ed1b2f;
}

.ant-form-item {
  margin-bottom: 1px !important;
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
.width_item {
  width: 100%;
}
</style>
