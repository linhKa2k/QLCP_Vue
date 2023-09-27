<template>
  <a-form
    ref="formRequestConfirm"
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
            {{ props?.form.dataSelect ? props?.form.dataSelect?.name : "--" }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item name="name" label="Đơn vị công tác">
            {{
              props?.form.dataSelect
                ? props?.form.dataSelect?.to_department?.name
                : "--"
            }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
            <a-table
              :columns="planConfirmColumns"
              :data-source="planConfirmDatas"
              bordered
              :pagination="false"
            >
              <template #title><h3>Chặng di chuyển thực tế</h3></template>
              <template #STT="{ index }">
                {{ index + 1 }}
              </template>
              <template #from_province="{ record }">
                <o-select
                  style="
                    width: 100%;
                    text-align: left;
                    margin: 0 auto;
                    padding: 10px 0;
                  "
                  v-model:value="record.from_province"
                  @input="onChangeFromProvince($event, record)"
                  :placeholder="'Thành phố đi'"
                  entity="provinces"
                  :isDisplay="'none'"
                  :textField="'name'"
                  ref="province"
                  valueField="id"
                  :filters="[
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: 1,
                    },
                  ]"
                />
              </template>
              <template #from_district="{ record }">
                <o-select
                  :disabled="record.from_province?.id == null ? true : false"
                  style="width: 100%; text-align: left; margin: 0 auto"
                  v-model:value="record.from_district"
                  @input="onChangeFromDistrict($event, record)"
                  :placeholder="'Từ huyện'"
                  entity="districts"
                  :isDisplay="'none'"
                  :textField="'name'"
                  ref="district"
                  valueField="id"
                  :filters="[
                    {
                      field: 'province_id',
                      operator: 'equal',
                      value: record?.from_province?.key
                        ? record?.from_province?.key
                        : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: 1,
                    },
                  ]"
                />
              </template>
              <template #to_province="{ record }">
                <o-select
                  style="
                    width: 100%;
                    text-align: left;
                    margin: 0 auto;
                    padding: 10px 0;
                  "
                  v-model:value="record.to_province"
                  @input="onChangeToProvince($event, record)"
                  :placeholder="'Thành phố đến'"
                  entity="provinces"
                  :isDisplay="'none'"
                  :textField="'name'"
                  ref="province"
                  valueField="id"
                  :filters="[
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: 1,
                    },
                  ]"
                />
              </template>
              <template #to_district="{ record }">
                <o-select
                  :disabled="record.to_province?.id == null ? true : false"
                  style="width: 100%; text-align: left; margin: 0 auto"
                  v-model:value="record.to_district"
                  @input="onChangeDistrict($event, record)"
                  :placeholder="'Tới huyện'"
                  entity="districts"
                  :isDisplay="'none'"
                  :textField="'name'"
                  ref="district"
                  valueField="id"
                  :filters="[
                    {
                      field: 'province_id',
                      operator: 'equal',
                      value: record?.to_province?.key
                        ? record?.to_province?.key
                        : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: 1,
                    },
                  ]"
                />
              </template>
              <template #vehicle="{ record }">
                <o-select
                  style="width: 100%; text-align: left; margin: 0 auto"
                  ref="vehicle"
                  :value="record.vehicle"
                  @input="onChangeVehicle($event, record)"
                  :placeholder="'Phương tiện'"
                  entity="vehicles"
                  :title="'Phương tiện'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </template>
            </a-table>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="form_padding">
        <a-col :span="24">
          <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
            <a-table
              :columns="planConfirmUserColumns"
              :data-source="planConfirmUserDatas"
              bordered
              :pagination="false"
            >
              <template #title><h3>Danh sách cán bộ</h3></template>

              <template #STT="{ index }">
                {{ index + 1 }}
              </template>
              <template #username="{ text }">
                <span>{{ text ? text : "--" }}</span>
              </template>
              <template #name="{ text }">
                <span>{{ text ? text : "--" }}</span>
              </template>
              <template #is_business="{ record }">
                <a-form-item
                  style="padding: 10px; display: flex; justify-content: center"
                >
                  <a-checkbox v-model:checked="record.is_business"></a-checkbox>
                </a-form-item>
              </template>
              <template #from_date="{ record }">
                <a-form-item>
                  <a-date-picker
                    v-model:value="record.from_date"
                    format="DD/MM/YYYY"
                    :placeholder="'Ngày bắt đầu'"
                    class="width_item"
                    :allowClear="false"
                    @change="onchangeFromDate(record)"
                  />
                </a-form-item>
              </template>
              <template #to_date="{ record }">
                <a-form-item>
                  <a-date-picker
                    v-model:value="record.to_date"
                    format="DD/MM/YYYY"
                    :placeholder="'Ngày kết thúc'"
                    class="width_item"
                    :allowClear="false"
                    @change="onchangeToDate(record)"
                  />
                </a-form-item>
              </template>
              <template #total_night="{ record }">
                <a-input-number
                  v-model:value="record.total_night"
                  :placeholder="'Số ngày qua đêm'"
                  style="width: 100%"
                  :max="1000"
                />
              </template>
              <template #checkin_time="{ text }">
                <span>{{ text ? formatDateTimeVN(text) : "--" }}</span>
              </template>
              <template #checkin_location="{ record }">
                <div v-html="renderLink(record)" />
              </template>
              <template #checkin_file="{ text }">
                <a>{{ text ? text : "--" }}</a>
              </template>
            </a-table>
          </a-form-item>
        </a-col>
      </a-row>
    </a-spin>
  </a-form>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      class="prev"
      @click="handleSendApprove()"
      size="middle"
      style="background-color: #ed1b2f; color: #fff"
      :loading="btnLoading"
    >
      <DoubleLeftOutlined />{{ isRouteInternal ? "Gửi duyệt" : "Lưu" }}
    </a-button>
    <a-button v-if="true" class="prev" @click="hiddenModal" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
    </a-button>
  </a-row>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSaveMutation as saveMutationPlanCofirm } from "@/hooks/plan_confirm";
import moment from "moment/moment";
import { message } from "ant-design-vue";
import { generateDataObject } from "@/common/generateData";
import { formatDateTimeVN } from "@/mixins";

interface Props {
  form: any;
  width: string;
  rules: any;
  dataDetail: any;
  formLoading: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  dataDetail: null,
  formLoading: false,
});
const formRequestConfirm = ref();
const useSavePlanConfirm = saveMutationPlanCofirm();
const mode = computed(() => (props.form.mode ? props.form.mode : "add"));
const form = ref<any>({});
const btnLoading = ref<boolean>(false);
const formLoading = computed(() => props.formLoading);
const planConfirmDetail = computed(() =>
  props.dataDetail ? generateCustomData(props.dataDetail) : null
);

const isRouteInternal = computed(() => {
  if (
    props.form.dataSelect.is_to_internal &&
    !props.form.dataSelect.is_moving_route
  ) {
    return true;
  } else {
    return false;
  }
});

const isBusiness = {
  DI_CONG_TAC: true,
  KHONG_DI_CONG_TAC: false,
};

const planConfirmUserDatas = ref<any[]>(
  props.form.dataTable
    ? props.form.dataTable.map((item) => {
        return {
          ...item,
          from_date: item.start_time_reality
            ? moment(item.start_time_reality)
            : null,
          to_date: item.end_time_reality ? moment(item.end_time_reality) : null,
          is_business: true,
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

const planConfirmDatas = ref<any[]>(
  props.form.dataSelect ? [generateCustomData(props.form.dataSelect)] : [{}]
);
const dataTable = ref<any[]>(
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
const dataTableEdit = computed(() => {
  return props.form.dataTable ? props.form.dataTable : [];
});
const onchangeFromDate = (record: any) => {
  if (record.to_date) {
    let compare = moment(record.from_date).isSameOrBefore(
      moment(record.to_date),
      "day"
    );
    if (!compare) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      record.from_date = null;
    }
  }
};

const onchangeToDate = (record: any) => {
  if (record.from_date) {
    let compare = moment(record.to_date).isSameOrAfter(
      moment(record.from_date),
      "day"
    );
    if (!compare) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      record.to_date = null;
    }
  }
};

watch(
  () => planConfirmDetail.value,
  (val: any) => {
    if (val) {
      planConfirmDatas.value[0] = val;
      planConfirmUserDatas.value = val.plan_confirm_user
        ? val.plan_confirm_user.map((item) => {
            return {
              ...item,
              username: item.code,
              name: item.full_name,
              checkin_time: item.plan_checkin
                ? item.plan_checkin.checkin_time
                : null,
              checkin_location: item.plan_checkin
                ? item.plan_checkin.checkin_location
                : null,
              checkin_file: item.plan_checkin
                ? item.plan_checkin.checkin_file
                : null,
            };
          })
        : [];
    }
  },
  { immediate: true }
);
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

const onChangeFromProvince = ($event, item) => {
  if ($event.value) {
    item.from_province = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    item.from_province = {
      key: null,
      id: null,
    };
  }
  delete item["from_district"];
};

const onChangeToProvince = ($event, item) => {
  if ($event.value) {
    item.to_province = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    item.to_province = {
      key: null,
      id: null,
    };
  }
  delete item["to_district"];
};
const onChangeFromDistrict = ($event, item) => {
  if ($event.value) {
    item.from_district = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    item.from_district = {
      key: null,
      id: null,
    };
  }
};
const onChangeDistrict = ($event, item) => {
  if ($event.value) {
    item.to_district = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    item.to_district = {
      key: null,
    };
  }
};
const onChangeVehicle = ($event, record) => {
  if ($event.value) {
    record.vehicle = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    record.vehicle = {
      key: null,
      id: null,
    };
  }
};
const handleSendApprove = async () => {
  btnLoading.value = true;
  try {
    await validateForm();
    useSavePlanConfirm
      .mutateAsync(
        mode.value == "add"
          ? {
              id: planConfirmDatas.value[0]?.id
                ? planConfirmDatas.value[0]?.id
                : null,
              plan_checkin: [],
              total_user:
                planConfirmUserDatas.value.length > 0
                  ? planConfirmUserDatas.value.filter(
                      (i) => i.is_business == isBusiness.DI_CONG_TAC
                    ).length
                  : null,
              plan_route: { id: props.form.dataSelect.id },
              plan_confirm_user: planConfirmUserDatas.value.map((item) => {
                return {
                  ...item,
                  status: 1,
                  plan_route_user: { id: item?.plan_route_user_id },
                  plan_user: { id: item?.plan_user_id },
                  code: item.username,
                  full_name: item.name,
                };
              }),
              plan: props.form.dataSelect.plan,
              from_province: planConfirmDatas.value[0].from_province,
              from_district: planConfirmDatas.value[0].from_district,
              to_province: planConfirmDatas.value[0].to_province,
              to_district: planConfirmDatas.value[0].to_district,
              vehicle: planConfirmDatas.value[0].vehicle,
              mode: mode.value,
            }
          : {
              ...planConfirmDatas.value[0],
              plan_confirm_user: planConfirmUserDatas.value,
              mode: mode.value,
            }
      )
      .then((response) => {
        message.success(
          mode.value == "edit" ? "Cập nhật thành công" : " Lưu thành công"
        );
        btnLoading.value = false;
        hiddenModal();
      })
      .catch((error) => {
        btnLoading.value = false;

        console.log(error);
      });
  } catch (error) {
    if (typeof error == "string") {
      message.error(error);
    }
    console.log("error", error);
    btnLoading.value = false;
  }
};

const validateForm = () => {
  planConfirmUserDatas.value.forEach((element) => {
    if (element.total_night == null) {
      throw "Vui Lòng nhập đầy đủ số ngày qua đêm ";
    }
    if (element.from_date == null) {
      throw "Vui Lòng chọn đầy đủ từ ngày";
    }
    if (element.to_date == null) {
      throw "Vui Lòng chọn đầy đủ đến ngày";
    }
  });
  planConfirmDatas.value.forEach((element) => {
    if (element.from_province?.id == null) {
      throw "Vui Lòng chọn đầy đủ thành phố đi";
    }
    if (element.to_province?.id == null) {
      throw "Vui Lòng chọn đầy đủ thành phố đến";
    }
    if (element.from_district?.id == null) {
      throw "Vui Lòng chọn đầy đủ quận/ huyện đi";
    }
    if (element.to_district?.id == null) {
      throw "Vui Lòng chọn đầy đủ quận/ huyện đến";
    }
    if (element.vehicle?.id == null) {
      throw "Vui Lòng chọn đầy đủ phương tiện";
    }
  });
};

const hiddenModal = () => {
  emit("hideModal");
};

const renderLink = (record) => {
  return record.checkin_location
    ? `<a target="blank" href="https://www.google.com/maps/@${
        record.checkin_latitude + "," + record.checkin_longitude
      }z?entry=ttu">${record.checkin_location}</a>`
    : "--";
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
    dataIndex: "username",
    key: "username",
    width: 150,
    slots: { customRender: "username" },
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    key: "name",
    width: 200,
    slots: { customRender: "name" },
  },
  {
    title: "Đi công tác",
    dataIndex: "is_business",
    key: "is_business",
    width: 120,
    slots: { customRender: "is_business" },
  },
  {
    title: "Từ ngày",
    dataIndex: "from_date",
    key: "from_date",
    width: 180,
    slots: { customRender: "from_date" },
  },
  {
    title: "Đến ngày",
    dataIndex: "to_date",
    key: "to_date",
    width: 180,
    slots: { customRender: "to_date" },
  },
  {
    title: "Số ngày qua đêm",
    dataIndex: "total_night",
    key: "total_night",
    width: 150,
    slots: { customRender: "total_night" },
  },
  {
    title: "TG checkin",
    dataIndex: "checkin_time",
    key: "checkin_time",
    width: 150,
    slots: { customRender: "checkin_time" },
  },
  {
    title: "Địa điểm checkin",
    dataIndex: "checkin_location",
    key: "checkin_location",
    width: 200,
    slots: { customRender: "checkin_location" },
  },
  {
    title: "Link ảnh checkIn",
    dataIndex: "checkin_file",
    key: "checkin_file",
    width: 180,
    slots: { customRender: "checkin_file" },
  },
];
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
