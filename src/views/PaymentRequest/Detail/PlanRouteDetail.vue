<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="6">
        <a-row style="margin: 5%">
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
                    :span="24"
                    v-for="(item, key) in dataRouteRecord"
                    :key="key"
                  >
                    <a-row @click="handleSelect(item, key)" class="item_chose">
                      <a-col :span="24">
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
          ref="ruleForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
        >
          <a-row :gutter="[24, 0]">
            <a-col :span="12">
              <a-row class="title_box">
                <span class="title_form__end">
                  {{ t("plan.attribute.location_destination") }}
                </span>
              </a-row>
              <a-form-item>
                <a-checkbox v-model:checked="form.is_from_internal" disabled
                  >Nội bộ</a-checkbox
                >
              </a-form-item>
              <a-form-item :label="'Đơn vị đi'" name="from_department">
                <span>
                  {{ form.from_department ? form.from_department.name : "--" }}
                </span>
              </a-form-item>
              <a-form-item :label="'Quốc gia'" name="from_country">
                <span>
                  {{ form.from_country ? form.from_country.name : "--" }}
                </span>
              </a-form-item>

              <a-form-item :label="'Thành phố đi'" name="from_province">
                <span>
                  {{ form.from_province ? form.from_province.name : "--" }}
                </span>
              </a-form-item>
              <a-form-item :label="'Quận'" name="from_district">
                <span>{{
                  form.from_district ? form.from_district.name : "--"
                }}</span>
              </a-form-item>

              <a-form-item label="Phố" name="from_address">
                <span>{{ form.from_address ? form.from_address : "--" }}</span>
              </a-form-item>

              <a-form-item :label="'Ngày bắt đầu'" name="start_time">
                <span>{{
                  form.start_time ? formatDate(form.start_time) : "--"
                }}</span>
              </a-form-item>

              <a-form-item :label="'Phương tiện'" name="vehicle">
                <span>{{ form.vehicle ? form.vehicle.name : "--" }}</span>
              </a-form-item>

              <a-form-item>
                <a-checkbox v-model:checked="form.is_over_night" disabled
                  >Qua đêm</a-checkbox
                >
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-row class="title_box">
                <span class="title_form__end">
                  {{ t("plan.attribute.location_arrival") }}
                </span>
              </a-row>

              <a-form-item>
                <a-checkbox v-model:checked="form.is_to_internal" disabled
                  >Nội bộ</a-checkbox
                >
              </a-form-item>

              <a-form-item :label="'Đơn vị đến'" name="to_department">
                <span>{{
                  form.to_department ? form.to_department.name : "--"
                }}</span>
              </a-form-item>

              <a-form-item :label="'Quốc gia'" name="to_country">
                <span>{{ form.to_country ? form.to_country.name : "--" }}</span>
              </a-form-item>

              <a-form-item :label="'Thành phố đến'" name="to_province">
                <span>{{
                  form.to_province ? form.to_province.name : "--"
                }}</span>
              </a-form-item>

              <a-form-item :label="'Quận'" name="to_district">
                <span>{{
                  form.to_district ? form.to_district.name : "--"
                }}</span>
              </a-form-item>

              <a-form-item label="Phố" name="to_address">
                <span>{{ form.to_address ? form.to_address : "--" }}</span>
              </a-form-item>

              <a-form-item :label="'Ngày kết thúc'" name="end_time">
                <span>{{
                  form.end_time ? formatDate(form.end_time) : "--"
                }}</span>
              </a-form-item>
              <a-form-item label="Khoảng cách" name="distance">
                <span>{{ form.distance ? form.distance : "--" }}</span>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item :label="'Nhân viên công tác'" name="plan_user_id">
                <span>{{
                  form.plan_route_user_dto_list != (null || [])
                    ? form.plan_route_user_dto_list
                    : "--"
                }}</span>
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
                <a-table
                  :columns="officialColumn"
                  :dataSource="dataTable"
                  :pagination="false"
                >
                  <template #start_time="{ text, record }">
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
import PlanUserService from "@/services/PlanUserService";
import { useGetList as userGetListPlanRoute } from "@/hooks/plan_route";
import { useGetList as userGetListPlanRouteUser } from "@/hooks/plan_route_user";
import { useGetList as userGetListPlanUser } from "@/hooks/plan_user";
import { useQueryClient } from "vue-query";

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

console.log(props.form.id, " run component");
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
const form = ref<any>({});
const fields = ref<any>(props.fields);
const provinceDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const districtDisabled = ref<boolean>(form.value.mode == "edit" ? false : true);
const dataTable = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataRouteItems = ref<any[]>([]);
const dataPlanRouteUser = ref<any[]>([]);

const index = ref<any>(null);
const saveHidden = ref<boolean>(false);
const plan_id = ref<any>(props.form.id);

queryClient.invalidateQueries("plan-route");
queryClient.invalidateQueries("plan-route-user");
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
const AddForm = () => {
  dataRouteRecord.value.push({
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
};
const saveFormClient = () => {
  if (index.value != null) {
    dataRouteRecord.value[index.value] = { ...form.value };
  }
  index.value = null;
  saveHidden.value = false;
};

const handleClearRouteItem = (item: any, idx: any) => {
  index.value = null;
  saveHidden.value = false;
  dataRouteRecord.value.splice(idx, 1);
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

const onChangeUser = async ($event: any) => {
  if ($event) {
    form.value.plan_route_user_dto_list = await $event.map((item: any) => {
      return {
        ...item,
        id: item.value,
        name: item.label,
        plan_user_id: item.value,
      };
    });
  } else {
    form.value.plan_route_user_dto_list = [];
  }
  dataTable.value = form.value.plan_route_user_dto_list;
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
  //   dataIndex: "",
  //   width: "15%",
  // },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "15%",
  },
  {
    title: "Chức danh",
    dataIndex: "position",
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
  enabled: enabledGetPlanRoute.value,
  retry: false,
  onSuccess: async (val: any) => {
    dataPlanRouteUser.value = val.data.content;
  },
});

const { isLoading: costEstimateLoading } = userGetListPlanRoute(planParams, {
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
  await routeItemSetForm(item);
};

const routeItemSetForm = async (data: any) => {
  //convert [] user => string
  data.plan_route_user_dto_list =
    (await data.plan_route_user_dto_list) ||
    (await dataPlanRouteUser.value
      .filter((u: any) => u.plan_route_id == data.id)
      .map((u: any) => {
        return u.name;
      })
      .toString());

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
  dataTable.value = await dataPlanRouteUser.value
    .filter((u: any) => u.plan_route_id == data.id)
    .map((u: any) => {
      return {
        key: u.id,
        value: u.id,
        label: u.name,
        ...u,
      };
    });
};

defineExpose({
  dataRouteRecord,
});

// onMounted(async () => {
//   await queryClient.invalidateQueries("plan-route");
//   await queryClient.invalidateQueries("plan-route-user");
//   // planParams.value.planId = props.form.id;
// });
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
  height: 58vh;
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
.title_form__end {
  margin-top: 4%;
  font-size: 20px;
}
</style>
