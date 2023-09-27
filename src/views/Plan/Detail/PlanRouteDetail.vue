<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="6">
        <a-row style="margin: 3%">
          <a-col :span="24">
            <a-input-search
              v-model:value="state.textSearchRoute"
              placeholder="Tìm kiếm"
              @search="onSearchRoute"
              @input="onSearchRoute"
            />
          </a-col>
          <a-col :span="24" class="tab_pane">
            <a-spin :spinning="PlanRouteLoading">
              <a-row>
                <a-col :span="24">
                  <a-row :gutter="[0, 24]">
                    <a-col
                      :span="24"
                      v-for="(item, key) in dataRouteRecord"
                      :key="key"
                    >
                      <a-row
                        @click="handleSelect(item, key)"
                        class="item_chose"
                        :style="
                          custom[key]
                            ? {
                                backgroundColor: ' #ed1b2f',
                                color: 'white',
                              }
                            : {}
                        "
                      >
                        <a-col
                          :span="24"
                          class="btn_box"
                          @click="handleSelectt(item, key)"
                        >
                          <a-row
                            class="route_item"
                          >
                            <a-col
                              ><strong>{{ "Đơn vị đi :" }}</strong></a-col
                            >
                            <!-- <a-col :span="1">:</a-col> -->
                            <a-col
                              ><span>{{
                                item.from_department
                                  ? item.from_department.label
                                  : "--"
                              }}</span></a-col
                            >
                          </a-row>
                          <a-row
                            class="route_item"
                          >
                            <a-col
                              ><strong>{{ "Đơn vị đến :" }}</strong></a-col
                            >
                            <!-- <a-col :span="1">:</a-col> -->
                            <a-col
                              ><span>{{
                                item.is_to_internal
                                  ? item.to_department
                                    ? item.to_department.label
                                    : "--"
                                  : item.to_department_name
                              }}</span></a-col
                            >
                          </a-row>
                          <a-row
                           class="route_item"
                          >
                            <a-col
                              ><strong>{{ "Ngày bắt đầu :" }}</strong></a-col
                            >
                            <!-- <a-col :span="1">:</a-col> -->
                            <a-col
                              ><span>{{
                                item.start_time
                                  ? formatDate(item.start_time)
                                  : "--"
                              }}</span></a-col
                            >
                          </a-row>
                          <a-row
                            class="route_item"
                          >
                            <a-col
                              ><strong>{{ "Ngày kết thúc :" }}</strong></a-col
                            >
                            <!-- <a-col :span="1">:</a-col> -->
                            <a-col
                              ><span>{{
                                item.end_time ? formatDate(item.end_time) : "--"
                              }}</span></a-col
                            >
                          </a-row>
                        </a-col>
                      </a-row>
                      <a-row class="border_bottom"></a-row>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-spin>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="18">
        <a-form
          ref="ruleForm"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          labelAlign="left"
        >
          <a-row :gutter="[24, 0]">
            <a-col :span="24">
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <strong class="title_form__end">
                    {{ t("plan.attribute.location_destination") }}
                  </strong>
                </a-col>
                <a-col :span="12">
                  <strong class="title_form__end">
                    {{ t("plan.attribute.location_arrival") }}
                  </strong>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_from_internal" disabled
                      >Nội bộ</a-checkbox
                    >
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_to_internal" disabled
                      >Nội bộ</a-checkbox
                    >
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Đơn vị đi'" name="from_department">
                    <span>
                      {{
                        form.from_department ? form.from_department.label : "--"
                      }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="'Đơn vị đến'" name="to_department">
                    <span>{{
                      form.to_department ? form.to_department.label : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Quốc gia đi'" name="from_country">
                    <span>
                      {{ form.from_country ? form.from_country.label : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="'Quốc gia đến'" name="to_country">
                    <span>{{
                      form.to_country ? form.to_country.label : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Thành phố đi'" name="from_province">
                    <span>
                      {{ form.from_province ? form.from_province.label : "--" }}
                    </span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="'Thành phố đến'" name="to_province">
                    <span>{{
                      form.to_province ? form.to_province.label : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Quận/Huyện đi'" name="from_district">
                    <span>{{
                      form.from_district ? form.from_district.label : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="'Quận/Huyện đến'" name="to_district">
                    <span>{{
                      form.to_district ? form.to_district.label : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item label="Phố" name="from_address">
                    <span>{{
                      form.from_address ? form.from_address : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Phố" name="to_address">
                    <span>{{ form.to_address ? form.to_address : "--" }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Ngày bắt đầu'" name="start_time">
                    <span>{{
                      form.start_time ? formatDate(form.start_time) : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="'Ngày kết thúc'" name="end_time">
                    <span>{{
                      form.end_time ? formatDate(form.end_time) : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="12">
                  <a-form-item :label="'Phương tiện'" name="vehicle">
                    <span>{{ form.vehicle ? form.vehicle.label : "--" }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Khoảng cách" name="distance">
                    <span>{{
                      form.distance ? formatNumber(form.distance) : "--"
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[24, 0]">
                <a-col :span="8">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_over_night" disabled
                      >Qua đêm</a-checkbox
                    >
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="[24, 0]">
                <a-col :span="6">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_moving_route" disabled>
                      {{ "Là lộ trình di chuyển" }}
                    </a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_sea" disabled>
                      {{ "Tính chi phí công tác biển" }}
                    </a-checkbox>
                  </a-form-item></a-col
                >
                <a-col :span="8">
                  <a-form-item>
                    <a-checkbox v-model:checked="form.is_island" disabled>
                      {{ "Tính chi phí công tác đảo/ nhà giàn" }}
                    </a-checkbox>
                  </a-form-item></a-col
                >
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Nhân viên công tác'" name="plan_user_id">
                <span>{{
                  form.plan_route_user_dto_list
                    ? form.plan_route_user_dto_list
                        .map((item) => item.label)
                        .toString()
                        .replaceAll(",", " , ")
                    : "--"
                }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-row>
          <a-col :span="24">
            <a-row>
              <a-col :span="24">
                <a-table
                  :columns="officialColumn"
                  :dataSource="dataTable"
                  :pagination="false"
                  :scroll="{ x: '500px' }"
                >
                  <template #title
                    ><b>{{
                      t("plan.attribute.plan_official_with_road_list")
                    }}</b></template
                  >
                  <template #start_time="{ text }">
                    {{ text ? formatDate(text) : "" }}
                  </template>
                  <template #date_work="{ text }">
                    {{
                      form.start_time && form.end_time
                        ? `${formatDate(form.start_time)}-${formatDate(
                            form.end_time
                          )}`
                        : ""
                    }}
                  </template>
                  <template #STT="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template #type="{ text }">
                    {{ text ? renderType(text) : "" }}
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-col>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import i18n from "@/lang";
import { formatDate, formatNumber } from "@/utility";
import PlanUserService from "@/services/PlanUserService";
import { useGetList as userGetListPlanRoute } from "@/hooks/plan_route";
import { useQueryClient } from "vue-query";
import { generateData } from "@/common/generateData";
import Model from "@/config/models";
import { planUserType } from "@/common/enumUtility";

const queryClient = useQueryClient();
const { t } = i18n.global;
interface Props {
  form: any;
  rules: any;
  fields: any;
  width: string;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  rules: {},
  fields: {},
  width: "",
});

const state = reactive({
  textSearchRoute: "",
  plan_user_dto: [],
  plan_user_option: [],
  fetching: false,
});

const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
});

const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});
const Models = ref<any>(Model);
const modelsConfig = ref<any>(Models.value["planRoute"]);
const ruleForm = ref<any>();
const form = ref<any>({});
const dataTable = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataRouteItems = ref<any[]>([]);
const isActive = ref<boolean>(false);
const custom = ref<any>({});
const plan_id = ref<any>(props.form.id);
const selectedItems = ref<any[]>([]);
const handleSelectt = (item: any, key: number) => {
  selectedItems.value[key] = !selectedItems.value[key];
};

const getUser = async ($event) => {
  let params = {
    "username.contains": $event ? $event : null,
    planId: plan_id.value,
  };
  const result = await PlanUserService.get(params);
  state.plan_user_option =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.user_name,
            value: item.id,
            ...item,
          };
        })
      : [];
};

const renderType = (type) => {
  if (type == planUserType.staff) {
    return "Nhân viên";
  } else {
    return "Đối tác";
  }
};

const onSearchRoute = async () => {
  const res = await dataRouteItems.value.filter((item) => {
    return (
      (item.from_department.name + " " + item.to_department.name)
        .toLowerCase()
        .search(state.textSearchRoute.toLowerCase()) !== -1
    );
  });
  dataRouteRecord.value = res;
};

const officialColumn = [
  {
    title: "STT",
    dataIndex: "STT",
    width: "80px",
    slots: { customRender: "STT" },
  },
  {
    title: "Loại",
    dataIndex: "type",
    width: "100px",
    slots: { customRender: "type" },
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "250px",
  },
  {
    title: "Chức danh",
    dataIndex: "position",
    key: "title",
    width: "180px",
  },
  {
    title: "Liên hệ",
    dataIndex: "phone_number",
    key: "phone_number",
    width: "150px",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "200px",
  },
  {
    title: "Ngày công tác",
    dataIndex: "date_work",
    width: "220px",
    slots: { customRender: "date_work" },
  },
];

const { isLoading: PlanRouteLoading } = userGetListPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    dataRouteRecord.value = val.data.content
      .filter((item) => item.plan.id == planParams.value.planId)
      .map((route) => {
        return Object.assign(generateData(modelsConfig, route), {
          plan_route_user_dto_list: route.plan_route_user_dto_list.map((i) => {
            return { label: i.name, value: i.plan_user.id };
          }),
          dataTable: route.plan_route_user_dto_list,
        });
      });
    dataRouteItems.value = dataRouteRecord.value;
  },
});

const handleSelect = async (item: any, idx: number) => {
  custom.value = {};
  custom.value[idx] = true; // change color layout
  form.value = { ...item };
  if (form.value.dataTable) {
    dataTable.value = form.value.dataTable.map((i) => {
      let planUser = i.plan_user;
      return {
        name: planUser.name,
        position:
          planUser.type == planUserType.staff
            ? planUser.position
            : planUser.position_group
            ? planUser.position_group.name
            : null,
        type: planUser.type,
        email: planUser.email,
        plan_user: planUser,
        phone_number: planUser.phone_number,
        plan_id: i.plan_id,
        plan_route_id: item.id,
        is_active: 1,
      };
      // }
    });
  }
};

watch(
  () => dataRouteRecord.value,
  (val: any) => {
    if (val.length > 0) {
      handleSelect(val[0], 0);
    }
  },
  { immediate: true }
);

defineExpose({
  dataRouteRecord,
});

onMounted(async () => {
  getUser("");
});
</script>
<style scoped lang="scss">
.ant-form {
  :deep(label) {
    font-weight: bold !important;
    color: black !important;
  }
}

.item_chose:focus {
  background-color: red;
  cursor: pointer;
}

.item_chose {
  // margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
}
.item_chose:hover {
  background-color: #ed1b2f;
  color: #fff;
  transition: 0.5s;
}

.border_bottom {
  border-bottom: 1px solid rgb(223, 212, 212);
}

.tab_pane {
  height: 58vh;
  overflow: auto;
}

.title_box {
  display: flex;
  font-weight: bold;
}
.box_left__view {
  padding: 20px;
  border: 1px solid #44818e;
  margin-top: 5px;
  border-radius: 5px;
  cursor: pointer;
}
.title_form__end {
  padding-top: 32px;
  font-size: 16px;
  color: #ed1b2f;
}

.btn_box {
  cursor: pointer;
}

.btn_box.selected {
  background-color: red !important;
}

.route_item{
  display: flex;
  justify-content: space-between;
}
</style>
