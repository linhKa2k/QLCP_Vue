<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="6">
        <a-row>
          <a-col :span="24">
            <a-input-search
              v-model:value="state.textSearchRoute"
              placeholder="Tìm kiếm"
              @search="onSearchRoute"
              @input="onSearchRoute"
            />
          </a-col>
          <a-col :span="24" class="tab_pane">
            <a-row>
              <a-col :span="24">
                <a-row :gutter="[0, 24]">
                  <a-col
                    class="item_chose"
                    :span="24"
                    v-for="(item, key) in generateDataRecord()"
                    :key="key"
                  >
                    <a-row type="flex" justify="end">
                      <a-col>
                        <a @click="handleClearRouteItem(item, key)">X</a>
                      </a-col>
                    </a-row>
                    <a-row @click="handleSelect(item, key)">
                      <a-col :span="24">
                        <a-row>
                          <a-col :span="24"
                            ><h3>
                              {{ item.name ? item.name : "--" }}
                            </h3></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Đơn vị đi" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.from_department
                                ? item.from_department.name
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Đơn vị đến" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.to_department
                                ? item.to_department.name
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Ngày bắt đầu" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.start_time
                                ? formatDate(item.start_time)
                                : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                        <a-row>
                          <a-col :span="7"
                            ><span>{{ "Ngày kết thúc" }}</span></a-col
                          >
                          <a-col :span="1">:</a-col>
                          <a-col :span="16"
                            ><strong>{{
                              item.end_time ? formatDate(item.end_time) : "--"
                            }}</strong></a-col
                          >
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="18">
        <a-form
          ref="ruleFormPlanRoute"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
          :rules="rules"
          :model="form"
        >
          <a-row type="flex" justify="end" :gutter="24">
            <a-col v-if="saveHidden">
              <a-button type="primary" @click="saveFormClient">
                {{ t("common.save") }}
              </a-button>
            </a-col>
            <a-col>
              <a-button type="primary" @click="AddForm">
                {{ t("common.add") }}
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 0]">
            <a-col :span="12">
              <span class="title_box">
                {{ t("plan.attribute.location_destination") }}
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title_box">
                {{ t("plan.attribute.location_arrival") }}
              </span>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-checkbox v-model:checked="form.is_from_internal">
                  Nội bộ
                </a-checkbox>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-checkbox v-model:checked="form.is_to_internal">
                  Nội bộ
                </a-checkbox>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Đơn vị đi'" name="from_department">
                <o-select
                  ref="from_department"
                  :value="form.from_department"
                  @input="onChangeRequestFromDepartment($event)"
                  :placeholder="'Đơn vị đi'"
                  entity="departments"
                  :title="'Đơn vị đi'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Đơn vị đến'" name="to_department">
                <o-select
                  ref="to_department"
                  :value="form.to_department"
                  @input="onChangeRequestToDepartment"
                  :placeholder="'Đơn vị đến'"
                  entity="departments"
                  :title="'Đơn vị đến'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Quốc gia đi'" name="from_country">
                <o-select
                  ref="from_country"
                  :value="form.from_country"
                  @input="onChangeFromCountry"
                  :placeholder="'Quốc gia'"
                  entity="countries"
                  :title="'Quốc gia'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Quốc gia đến'" name="to_country">
                <o-select
                  ref="to_country"
                  :value="form.to_country"
                  @input="onChangeToCountry"
                  :placeholder="'Quốc gia'"
                  entity="countries"
                  :title="'Quốc gia'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                  :filters="[
                    {
                      field: 'country_id',
                      operator: 'equal',
                      value: form?.country?.key ? form?.country?.key : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: form?.mode == 'add' ? 1 : null,
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Thành phố đi'" name="from_province">
                <o-select
                  :disabled="provinceDisabled"
                  ref="from_province"
                  :value="form.from_province"
                  @input="onChangeFromProvince"
                  :placeholder="'Thành phố đi'"
                  entity="provinces"
                  :title="'Thành phố đi'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                  :filters="[
                    {
                      field: 'country_id',
                      operator: 'equal',
                      value: form?.country?.key ? form?.country?.key : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: form?.mode == 'add' ? 1 : null,
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Thành phố đến'" name="to_province">
                <o-select
                  :disabled="provinceDisabled"
                  ref="to_province"
                  :value="form.to_province"
                  @input="onChangeToProvince"
                  :placeholder="'Thành phố đến'"
                  entity="provinces"
                  :title="'Thành phố đến'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Quận'" name="from_district">
                <o-select
                  :disabled="districtDisabled"
                  ref="from_district"
                  :value="form.from_district"
                  @input="onChangeDistrict"
                  :placeholder="'Quận'"
                  entity="districts"
                  :title="'Quận'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                  :filters="[
                    {
                      field: 'from_province_id',
                      operator: 'equal',
                      value: form?.province?.key ? form?.province?.key : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: form?.mode == 'add' ? 1 : null,
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Quận'" name="to_district">
                <o-select
                  :disabled="districtDisabled"
                  ref="to_district"
                  :value="form.to_district"
                  @input="onChangeToDistrict"
                  :placeholder="'Quận'"
                  entity="districts"
                  :title="'Quận'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                  :filters="[
                    {
                      field: 'to_province',
                      operator: 'equal',
                      value: form?.province?.key ? form?.province?.key : null,
                    },
                    {
                      field: 'is_active',
                      operator: 'in',
                      value: form?.mode == 'add' ? 1 : null,
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Phố" name="from_address">
                <a-input v-model:value="form.from_address" placeholder="Phố" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Phố" name="to_address">
                <a-input v-model:value="form.to_address" placeholder="Phố" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Ngày bắt đầu'" name="start_time">
                <a-date-picker
                  v-model:value="form.start_time"
                  format="DD/MM/YYYY"
                  :placeholder="'Ngày bắt đầu'"
                  class="width_item"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Ngày kết thúc'" name="end_time">
                <a-date-picker
                  v-model:value="form.end_time"
                  format="DD/MM/YYYY"
                  :placeholder="'Ngày kết thúc'"
                  class="width_item"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="'Phương tiện'" name="vehicle">
                <o-select
                  ref="vehicle"
                  :value="form.vehicle"
                  @input="onChangeVehicle"
                  :placeholder="'Phương tiện'"
                  entity="vehicles"
                  :title="'Phương tiện'"
                  :icon="'environment'"
                  :isDisplay="'none'"
                  :isDisplayAdd="'none'"
                  textField="name"
                  valueField="id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Khoảng cách" name="distance">
                <a-input
                  v-model:value="form.distance"
                  placeholder="Khoảng cách"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-checkbox v-model:checked="form.is_over_night"
                  >Qua đêm</a-checkbox
                >
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :label="'Nhân viên công tác'"
                name="plan_route_user_dto_list"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
              >
                <a-select
                  v-model:value="form.plan_route_user_dto_list"
                  mode="multiple"
                  label-in-value
                  placeholder="Chọn nhân viên"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="state.fetching ? undefined : null"
                  :options="state.plan_user_option"
                  @search="getUser"
                  @focus="getUser(null)"
                  @change="onChangeUser($event)"
                >
                  <template v-if="state.fetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-row>
          <a-col :span="24">
            <a-row>
              <span>{{
                t("plan.attribute.plan_official_with_road_list")
              }}</span>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-table :columns="officialColumn" :dataSource="dataTable">
                  <template #start_time="{ text }">
                    {{ text ? formatDate(text) : "" }}
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
import { ref, reactive, computed, onMounted } from "vue";
import i18n from "@/lang";
import { fromType } from "vue-types";
import { formatDate } from "@/utility";
import { defineComponent } from "vue";
import { useGetAll } from "@/hooks/user";
import Model from "@/config/models";
import PlanUserService from "@/services/PlanUserService";
import { useGetList as userGetListPlanRoute } from "@/hooks/plan_route";
import { useGetList as userGetListPlanRouteUser } from "@/hooks/plan_route_user";
import { useGetList as userGetListPlanUser } from "@/hooks/plan_user";
import { useQueryClient } from "vue-query";
import { generateData } from "@/common/generateData";
import { generateFields, generateRules, generateFormData } from "@/formUtility";

const queryClient = useQueryClient();
const { t } = i18n.global;
interface Props {
  form: any;
  // rules: any;
  fields: any;
  width: string;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  // rules: {},
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

const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
// const fields = ref<any>(props.fields);
const Models = ref<any>(Model);
const modelsConfig = ref<any>(Models.value["planRoute"]);
const fields = ref<any>(generateFields("planRoute") || {});
const rules = ref<any>(generateRules("planRoute") || {});

const dataTable = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataRouteItems = ref<any[]>([]);
const dataPlanRouteUser = ref<any[]>([]);
const dataPlanRouteUserItems = ref<any[]>([]);
const form = ref<any>(generateFormData(modelsConfig.value) || {});
const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const districtDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const index = ref<any>(null);
const saveHidden = ref<boolean>(false);
const plan_id = ref<any>(props.form.id);
const ruleFormPlanRoute = ref();
// queryClient.invalidateQueries("plan-route");
// queryClient.invalidateQueries("plan-route-user");

const AddForm = () => {
  ruleFormPlanRoute.value
    .validate()
    .then(() => {
      dataRouteRecord.value.push({
        name: `${form.value.from_department.name} - ${form.value.to_department.name}`,
        from_department: form.value.from_department,
        to_department: form.value.to_department,
        start_time: form.value.start_time,
        end_time: form.value.end_time,
        from_country: form.value.from_country,
        from_province: form.value.from_province,
        from_district: form.value.from_district,
        from_address: form.value.from_address,
        to_country: form.value.to_country,
        to_province: form.value.to_province,
        to_district: form.value.to_district,
        to_address: form.value.to_address,
        vehicle: form.value.vehicle,
        distance: form.value.distance,
        plan: { id: plan_id.value },
        // info user
        plan_route_user_dto_list: dataTable.value,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
const saveFormClient = () => {
  if (index.value != null) {
    dataRouteRecord.value[index.value] = Object.assign(form.value, {
      from_department: {
        name: form.value.from_department.label,
        ...form.value.from_department,
      },
      to_department: {
        name: form.value.to_department.label,
        ...form.value.to_department,
      },
    });
  }
  index.value = null;
  saveHidden.value = false;
};

const handleClearRouteItem = (item: any, idx: any) => {
  index.value = null;
  saveHidden.value = false;
  dataRouteRecord.value.splice(idx, 1);
};

const onChangeRequestFromDepartment = ($event) => {
  if ($event) {
    form.value.from_department = {
      key: $event.value.key,
      id: $event.value.key,
      name: $event.value.label.children,
    };
  } else {
    form.value.from_department = {
      key: null,
      id: null,
      name: null,
    };
  }
};

const onChangeRequestToDepartment = ($event) => {
  if ($event) {
    form.value.to_department = {
      key: $event.value.key,
      id: $event.value.key,
      name: $event.value.label.children,
    };
  } else {
    form.value.to_department = {
      key: null,
      id: null,
      name: null,
    };
  }
};

const onChangeVehicle = ($event) => {
  if ($event) {
    form.value.vehicle = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.vehicle = {
      key: null,
      id: null,
    };
  }
};

const onChangeFromCountry = ($event) => {
  if ($event) {
    form.value.from_country = {
      key: $event.value.key,
      id: $event.value.key,
    };
    provinceDisabled.value = false;
  } else {
    provinceDisabled.value = true;
    form.value.from_country = {
      key: null,
      id: null,
    };
  }
};

const onChangeDistrict = ($event) => {
  if ($event) {
    form.value.from_district = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.from_district = {
      key: null,
      id: null,
    };
  }
};

const onChangeFromProvince = ($event) => {
  if ($event.value) {
    form.value.from_province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    districtDisabled.value = false;
  } else {
    form.value.from_province = {
      key: null,
      id: null,
    };
    districtDisabled.value = true;
  }
};

const onChangeToCountry = ($event) => {
  if ($event) {
    form.value.to_country = {
      key: $event.value.key,
      id: $event.value.key,
    };
    provinceDisabled.value = false;
  } else {
    form.value.to_country = {
      key: null,
      id: null,
    };
    provinceDisabled.value = true;
  }
};

const onChangeToProvince = ($event) => {
  if ($event) {
    form.value.to_province = {
      key: $event.value.key,
      id: $event.value.key,
    };
    districtDisabled.value = false;
  } else {
    form.value.to_province = {
      key: null,
      id: null,
    };
    districtDisabled.value = true;
  }
};

const onChangeToDistrict = ($event) => {
  if ($event.value) {
    form.value.to_district = {
      key: $event.value.key,
      id: $event.value.key,
    };
  } else {
    form.value.to_district = {
      key: null,
      id: null,
    };
  }
};

const getUser = async ($event) => {
  let params = {
    "username.contains": $event ? $event : null,
    planId: plan_id.value,
  };
  const result = await PlanUserService.get(params);
  console.log("resultresultresultresult", result.data.content);
  state.plan_user_option =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.user_name,
            value: item.id,
            position_group: item.position_group,
            ...item,
          };
        })
      : [];
  console.log(state.plan_user_option, " check data state.plan_user_option");
};

const onChangeUser = async ($event: any) => {
  if ($event) {
    form.value.plan_route_user_dto_list = await $event.map((item: any) => {
      return {
        id: item.value,
        name: item.label,
        plan_user_id: item.value,
        ...item,
      };
      // return {
      //   ...(state.plan_user_option.find((i) => i.id == item.value) || {}),
      //   name: item.label,
      // };
    });
  } else {
    form.value.plan_route_user_dto_list = [];
  }
  dataTable.value = form.value.plan_route_user_dto_list;
  console.log(dataTable.value, " check data sau khi select");
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
  // {
  //   title: "Loại",
  //   dataIndex: "id",
  //   width: "15%",
  // },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "15%",
  },
  {
    title: "Chức danh",
    dataIndex: "position_group.name",
    key: "title",
    width: "15%",
  },
  {
    title: "Liên hệ",
    dataIndex: "",
    key: "contact",
    width: "15%",
  },
  {
    title: "Ngày công tác",
    dataIndex: "start_time",
    width: "15%",
    slots: { customRender: "start_time" },
  },
];
const { isLoading: planUserLoading } = userGetListPlanRouteUser(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val: any) => {
    dataPlanRouteUser.value = val.data.content;
    dataPlanRouteUserItems.value = val.data.content;
  },
});

const { isLoading: PlanRouteLoading } = userGetListPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 10000,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    dataRouteRecord.value = val.data.content;
    dataRouteItems.value = val.data.content;
  },
});

const handleSelect = async (item: any, idx: number) => {
  index.value = idx;
  saveHidden.value = true;
  // await routeItemSetForm(item);
  form.value = generateData(modelsConfig, item);
  dataTable.value = form.value.plan_route_user_dto_list
    ? form.value.plan_route_user_dto_list
    : [];
};

const routeItemSetForm = async (data: any) => {
  data.plan_route_user_dto_list =
    (await data.plan_route_user_dto_list) ||
    (await dataPlanRouteUser.value
      .filter((u: any) => u.plan_route_id == data.id)
      .map((u: any) => {
        return {
          key: u.id,
          value: u.id,
          label: u.name,
          ...u,
        };
      }));
  const keyWord = [
    "from_department",
    "to_department",
    "from_country",
    "to_country",
    "from_province",
    "to_province",
    "from_district",
    "to_district",
    "vehicle",
    "plan",
  ];
  const ruleKey = {
    // from_department: { value: "id", label: "name" },
  };
  let result: any = {};
  for (const key in data) {
    if (keyWord.indexOf(key) >= 0) {
      if (data[key] != null) {
        if (ruleKey[key]) {
          result[key] = {
            key: data[key][ruleKey[key].value],
            id: data[key][ruleKey[key].value],
            label: data[key][ruleKey[key].label],
            value: data[key][ruleKey[key].value],
          };
        } else {
          result[key] = {
            key: data[key].id,
            id: data[key].id,
            label: data[key].name,
            value: data[key].id,
            name: data[key].name,
          };
        }
      }
    } else {
      result[key] = data[key];
    }
  }

  form.value = await result;
  dataTable.value = result["plan_route_user_dto_list"];
};

const generateDataRecord = () => {
  // let data = generateData(modelsConfig,dataRouteRecord.value);
  dataRouteRecord.value = dataRouteRecord.value.map((item: any) => {
    // let data = generateData(modelsConfig, item)
    return {
      ...item,
      plan_route_user_dto_list:
        item.plan_route_user_dto_list ||
        dataPlanRouteUser.value
          .filter((u: any) => u.plan_route_id == item.id)
          .map((u: any) => {
            return {
              key: u.id,
              value: u.id,
              label: u.name,
              ...u,
            };
          }),
    };
  });
  // dataRouteRecord.value =
  return dataRouteRecord.value; //.map((item) =>generateData(modelsConfig, item)) ;
};

defineExpose({
  dataRouteRecord,
});
</script>
<style scoped lang="scss">
.item_chose:hover {
  background-color: rgb(137, 221, 243);
}
.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
}

.tab_pane {
  height: 125vh;
  overflow: auto;
}
.title_box {
  display: flex;
  justify-content: center;
  font-weight: bold;
  color: #44818e;
  font-size: 15px;
}
.box_left__view {
  padding: 20px;
  border: 1px solid #44818e;
  margin-top: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
  // border: 1px solid #44818e;
  border-radius: 5px;
  cursor: pointer;
}

.width_item {
  width: 100%;
}
</style>
