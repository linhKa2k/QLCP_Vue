<template>
  <a-spin :spinning="loadModal">
    <a-col :span="24">
      <a-row type="flex" :gutter="[16, 0]">
        <a-col :span="6" class="list_box">
          <a-row :gutter="16">
            <a-col :span="18">
              <a-input-search
                v-model:value="state.textSearchRoute"
                placeholder="Tìm kiếm"
                @search="onSearchRoute"
                @input="onSearchRoute"
              />
            </a-col>
            <a-col :span="4">
              <a-button
                style="background-color: #ed1b2f; color: #fff"
                @click="AddForm"
              >
                {{ t("common.add") }}
              </a-button>
            </a-col>
            <a-col :span="24" class="tab_pane">
              <a-spin :spinning="PlanRouteLoading">
                <a-row>
                  <a-col :span="24">
                    <a-row :gutter="[0, 24]">
                      <a-col
                        class="item_chose"
                        :span="24"
                        v-for="(item, key) in dataRouteRecord"
                        :key="key"
                        :style="
                          activeSelect[key]
                            ? {
                                backgroundColor: ' #ed1b2f',
                                color: 'white',
                              }
                            : {}
                        "
                      >
                        <!-- // generateDataRecord()" -->
                        <a-row type="flex" justify="end">
                          <a-popconfirm
                            title="Chắc chắn xóa lộ trình ?"
                            ok-text="Xóa"
                            cancel-text="Hủy"
                            @confirm="handleClearRouteItem(item, key)"
                            >X
                          </a-popconfirm>
                        </a-row>
                        <a-row @click="handleSelect(item, key)">
                          <a-col :span="24">
                            <a-row>
                              <a-col :span="7"
                                ><strong>{{ "Đơn vị đi" }}</strong></a-col
                              >
                              <a-col :span="1">:</a-col>
                              <a-col :span="16" align="end"
                                ><span>{{
                                  item.from_department
                                    ? item.from_department.label
                                    : "--"
                                }}</span></a-col
                              >
                            </a-row>
                            <a-row>
                              <a-col :span="7"
                                ><strong>{{ "Đơn vị đến" }}</strong></a-col
                              >
                              <a-col :span="1">:</a-col>
                              <a-col :span="16" align="end"
                                ><span>{{
                                  item.is_to_internal
                                    ? item.to_department
                                      ? item.to_department.label
                                      : "--"
                                    : item.to_department_name
                                }}</span></a-col
                              >
                            </a-row>
                            <a-row>
                              <a-col :span="7"
                                ><strong>{{ "Ngày bắt đầu" }}</strong></a-col
                              >
                              <a-col :span="1">:</a-col>
                              <a-col :span="16" align="end"
                                ><span>{{
                                  item.start_time
                                    ? formatDate(item.start_time)
                                    : "--"
                                }}</span></a-col
                              >
                            </a-row>
                            <a-row>
                              <a-col :span="7"
                                ><strong>{{ "Ngày kết thúc" }}</strong></a-col
                              >
                              <a-col :span="1">:</a-col>
                              <a-col :span="16" align="end"
                                ><span>{{
                                  item.end_time
                                    ? formatDate(item.end_time)
                                    : "--"
                                }}</span></a-col
                              >
                            </a-row>
                          </a-col>
                        </a-row>
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
            ref="ruleFormPlanRoute"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            labelAlign="left"
            :rules="rules"
            :model="form"
          >
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
            </a-row>
            <a-row :gutter="[24, 0]">
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
            </a-row>
            <a-row :gutter="[24, 0]">
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
                <template v-if="!form.is_to_internal">
                  <a-form-item
                    :label="'Tên cơ quan đơn vị'"
                    name="to_department_name"
                  >
                    <a-input
                      v-model:value="form.to_department_name"
                      placeholder="Tên cơ quan đơn vị"
                      :maxlength="100"
                    />
                  </a-form-item>
                </template>
                <template v-else>
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
                </template>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 0]">
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
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 0]">
              <a-col :span="12">
                <a-form-item
                  :label="'Thành phố đi'"
                  :name="
                    form?.from_country?.key ==
                    DefaultData.categoryDefault.vietNamCountry.id
                      ? 'from_province'
                      : 'from_province_nr'
                  "
                >
                  <o-select
                    :disabled="form.from_country?.id ? false : true"
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
                        value: form?.from_country?.key
                          ? form?.from_country?.key
                          : null,
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
                <a-form-item
                  :label="'Thành phố đến'"
                  :name="
                    form?.to_country?.key
                      ? form?.to_country?.key ==
                        DefaultData.categoryDefault.vietNamCountry.id
                        ? 'to_province'
                        : 'to_province_nr'
                      : true
                  "
                >
                  <o-select
                    :disabled="form.to_country?.id ? false : true"
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
                    :filters="[
                      {
                        field: 'country_id',
                        operator: 'equal',
                        value: form?.to_country?.key
                          ? form?.to_country?.key
                          : null,
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
            </a-row>
            <a-row :gutter="[24, 0]">
              <a-col :span="12">
                <a-form-item
                  :label="'Quận/Huyện'"
                  name="from_district"
                  :rules="
                    form.from_country?.key ==
                    DefaultData.categoryDefault.vietNamCountry.id
                      ? [
                          {
                            required: true,
                            message: 'Vui lòng nhập Quận/ Huyện đi',
                            trigger: 'change',
                            type: 'object',
                          },
                        ]
                      : null
                  "
                >
                  <o-select
                    :disabled="form.from_province?.id ? false : true"
                    ref="from_district"
                    :value="form.from_district"
                    @input="onChangeDistrict"
                    :placeholder="'Vui lòng chọn quận/huyện'"
                    entity="districts"
                    :title="'Quận/Huyện'"
                    :icon="'environment'"
                    :isDisplay="'none'"
                    :isDisplayAdd="'none'"
                    textField="name"
                    valueField="id"
                    :filters="[
                      {
                        field: 'province_id',
                        operator: 'equal',
                        value: form?.from_province?.key
                          ? form?.from_province?.key
                          : null,
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
                <a-form-item
                  :label="'Quận/Huyện'"
                  name="to_district"
                  :rules="
                    form.to_country?.key ==
                    DefaultData.categoryDefault.vietNamCountry.id
                      ? [
                          {
                            required: true,
                            message: 'Vui lòng nhập Quận/ Huyện đến',
                            trigger: 'change',
                            type: 'object',
                          },
                        ]
                      : null
                  "
                >
                  <o-select
                    :disabled="form.to_province?.id ? false : true"
                    ref="to_district"
                    :value="form.to_district"
                    @input="onChangeToDistrict"
                    :placeholder="'Vui lòng chọn quận/huyện'"
                    entity="districts"
                    :title="'Quận/Huyện'"
                    :icon="'environment'"
                    :isDisplay="'none'"
                    :isDisplayAdd="'none'"
                    textField="name"
                    valueField="id"
                    :filters="[
                      {
                        field: 'province_id',
                        operator: 'equal',
                        value: form?.to_province?.key
                          ? form?.to_province?.key
                          : null,
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
            </a-row>
            <a-row :gutter="[24, 0]">
              <a-col :span="12">
                <a-form-item label="Phố" name="from_address">
                  <a-input
                    v-model:value="form.from_address"
                    placeholder="Vui lòng nhập thông tin phố"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Phố" name="to_address">
                  <a-input
                    v-model:value="form.to_address"
                    placeholder="Vui lòng nhập thông tin phố"
                  />
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
                    @change="onChangeStartTime"
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
                    @change="onChangeEndTime"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 0]">
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
                <a-form-item
                  label="Khoảng cách"
                  name="distance"
                  v-if="distanceShow"
                >
                  <a-input-number
                    v-model:value="form.distance"
                    placeholder="Khoảng cách"
                    style="width: 100%"
                    :disabled="true"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 0]">
              <a-col :span="12">
                <a-form-item>
                  <a-checkbox v-model:checked="form.is_over_night"
                    >Qua đêm</a-checkbox
                  >
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 0]">
              <a-col :span="8">
                <a-form-item>
                  <a-checkbox
                    v-model:checked="form.is_moving_route"
                    :onchange="onChangeIsMovingRoute()"
                  >
                    {{ "Là lộ trình di chuyển" }}
                  </a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-checkbox
                    v-model:checked="form.is_sea"
                    :onchange="onChangeIsSea()"
                  >
                    {{ "Tính chi phí công tác biển" }}
                  </a-checkbox>
                </a-form-item></a-col
              >
              <a-col :span="8">
                <a-form-item>
                  <a-checkbox
                    v-model:checked="form.is_island"
                    :onchange="onChangeIsIsLand()"
                  >
                    {{ "Tính chi phí công tác đảo/ nhà giàn" }}
                  </a-checkbox>
                </a-form-item></a-col
              >
            </a-row>
            <a-row :gutter="[24, 0]">
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
              <a-row :gutter="[24, 24]">
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
                    <template #position="{ text, record }">
                      <span v-if="record.type == planUserType.staff">{{
                        text ? text : ""
                      }}</span>
                    </template>
                    <template #email="{ text, record }">
                      <span v-if="record.type == planUserType.staff">{{
                        text ? text : ""
                      }}</span>
                    </template>
                    <template #phone_number="{ text, record }">
                      <span v-if="record.type == planUserType.staff">{{
                        text ? text : ""
                      }}</span>
                    </template>
                    <template #rangePicker="{ record }">
                      <a-range-picker
                        v-model:value="record.rangePicker"
                        :format="'DD/MM/YYYY'"
                        @change="onChangeUserTimeReality($event, record)"
                        :placeholder="['Bắt đầu', 'Kết thúc']"
                      />
                    </template>
                  </a-table>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-col>
  </a-spin>
  <a-row type="flex" justify="end" class="footer">
    <a-button type="text" @click="cancelForm" :loading="saveLoading">{{
      "Thoát"
    }}</a-button>

    <a-button class="prev" @click="prev" :loading="saveLoading">
      <DoubleLeftOutlined />{{ t("common.prev") }}
    </a-button>
    <a-button
      style="background-color: #ed1b2f; color: #fff"
      @click="saveForm(false)"
      :loading="saveLoading"
    >
      <SaveOutlined />{{ t("common.save") }}
    </a-button>

    <a-button
      v-if="true"
      style="background-color: #ed1b2f; color: #fff"
      @click="nextStep"
      :loading="saveLoading"
    >
      <SaveOutlined />{{ t("common.continue") }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import i18n from "@/lang";
import { formatDate } from "@/utility";
import Model from "@/config/models";
import PlanUserService from "@/services/PlanUserService";
import { useGetList as userGetListPlanRoute } from "@/hooks/plan_route";
import { useGetList as userGetListPlanRouteUser } from "@/hooks/plan_route_user";
import { useQueryClient } from "vue-query";
import { generateData } from "@/common/generateData";
import { generateFields, generateRules, generateFormData } from "@/formUtility";
import { message } from "ant-design-vue";
import {
  useSaveMutation as useSavesMutationPlanRoute,
  useDeleteMutation as useDeleteMutationPlanRoute,
} from "@/hooks/plan_route";
import { planRouteUserStatus, planUserType } from "@/common/enumUtility";

import { useGetDistance } from "@/hooks/distance_quota";
import moment from "moment";
import DefaultData from "@/common/DefaultData";

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
const Models = ref<any>(Model);
const modelsConfig = ref<any>(Models.value["planRoute"]);
const fields = ref<any>(generateFields("planRoute") || {});
const rules = ref<any>(generateRules("planRoute") || {});

console.log(props.form, "//check props.form");
const state = reactive({
  textSearchRoute: "",
  plan_user_dto: [],
  plan_user_option: [],
  fetching: false,
});

const activeSelect = ref<any>({});
const dataTable = ref<any[]>([]);
const dataRouteRecord = ref<any[]>([]);
const dataRouteItems = ref<any[]>([]);
const dataPlanRouteUser = ref<any[]>([]);
const dataPlanRouteUserItems = ref<any[]>([]);
const form = ref<any>(
  Object.assign(generateFormData(modelsConfig.value), {
    from_department: props.form.department_process
      ? props.form.department_process
      : null,
    from_country: DefaultData.categoryDefault.vietNamCountry,
    to_country: DefaultData.categoryDefault.vietNamCountry,
  }) || {}
);
const index = ref<any>(null);
const plan_id = ref<any>(props.form.id);
const ruleFormPlanRoute = ref();
const saveLoading = ref<boolean>(false);
const loadModal = ref<boolean>(false);
const distanceShow = ref<boolean>(true);
const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const distanceQuota = ref<any>(null);

const mode = ref<any>("add");
const useSavePlanRoute = useSavesMutationPlanRoute();
const useDeletePlanRoute = useDeleteMutationPlanRoute();

const distanceParams = computed(() => {
  return {
    fromProvinceId: form.value.from_province
      ? form.value.from_province.id
      : null,
    toProvinceId: form.value.to_province ? form.value.to_province.id : null,
    fromDistrictId: form.value.from_district
      ? form.value.from_district.id
      : null,
    toDistrictId: form.value.to_district ? form.value.to_district.id : null,
  };
});

const enabledGetDistance = computed(
  () =>
    distanceParams.value.fromProvinceId != null &&
    distanceParams.value.toProvinceId != null
);

const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});

const emit = defineEmits<{
  (e: "prev"): void;
  (e: "cancelForm"): void;
  (e: "nextStep"): void;
}>();

const AddForm = () => {
  ruleFormPlanRoute.value.resetFields();
  form.value = {
    from_country: DefaultData.categoryDefault.vietNamCountry,
    to_country: DefaultData.categoryDefault.vietNamCountry,
    from_department: props.form.department_process
      ? {
          id: props.form.department_process.id,
          key: props.form.department_process.id,
          label: props.form.department_process.label,
        }
      : null,
    is_from_internal: true,
    is_to_internal: true,
  };
  dataTable.value = [];
  mode.value = "add";
};

const prev = () => {
  emit("prev");
};
const cancelForm = () => {
  emit("cancelForm");
};
const nextStep = () => {
  if (
    Array.isArray(dataRouteRecord.value) &&
    dataRouteRecord.value.length == 0
  ) {
    saveForm(true);
    return;
  } else {
    emit("nextStep");
  }
};

const handleClearRouteItem = (item: any, idx: any) => {
  loadModal.value = true;
  useDeletePlanRoute
    .mutateAsync(item.id)
    .then((response) => {
      loadModal.value = false;
    })
    .catch((error) => {
      console.log(error);
      loadModal.value = false;
      message.error(error);
    });
};
const onChangeIsMovingRoute = () => {
  if (form.value.is_moving_route) {
    form.value.is_moving_route = true;
    form.value.is_sea = false;
    form.value.is_island = false;
  }
};
const onChangeIsSea = () => {
  if (form.value.is_sea) {
    form.value.is_moving_route = false;
    form.value.is_sea = true;
    form.value.is_island = false;
  }
};
const onChangeIsIsLand = () => {
  if (form.value.is_island) {
    form.value.is_moving_route = false;
    form.value.is_island = true;
    form.value.is_sea = false;
  }
};
const onChangeCheckBox = (key: any) => {
  if (form.value[key]) {
    form.value.is_moving_route = false;
    form.value.is_sea = false;
    form.value.is_island = false;
    form.value[key] = true;
  }
};

const onChangeUserTimeReality = (event: any, record: any) => {
  if (event.length == 2) {
    record.start_time = event[0];
    record.end_time = event[1];
  } else {
    record.start_time = null;
    record.end_time = null;
  }
};

const onChangeRequestFromDepartment = ($event) => {
  if ($event.value) {
    form.value.from_department = {
      key: $event.value.key,
      id: $event.value.key,
      name: $event.value.label.children,
      label: $event.value.label.children,
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
  if ($event.value) {
    form.value.to_department = {
      key: $event.value.key,
      id: $event.value.key,
      name: $event.value.label.children,
      label: $event.value.label.children,
    };
  } else {
    form.value.to_department = {
      key: null,
      id: null,
    };
  }
};

const onChangeVehicle = ($event) => {
  if ($event.value) {
    form.value.vehicle = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
    };
    var item = $event.value.options.find((p) => p.id == $event.value.key);
    if (item) {
      if (item?.is_air) {
        distanceShow.value = false;
        form.value.distance = null;
      } else {
        distanceShow.value = true;
        form.value.distance = distanceQuota.value;
      }
    }
  } else {
    form.value.vehicle = {
      key: null,
      id: null,
    };
    distanceShow.value = true;
    form.value.distance = distanceQuota.value;
  }
};

const onChangeFromCountry = ($event) => {
  if ($event.value) {
    form.value.from_country = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
      name: $event.value.label.children,
    };
    delete form.value["from_province"];
    delete form.value["from_district"];
  } else {
    form.value.from_country = {
      key: null,
      id: null,
    };
  }
};

const onChangeDistrict = ($event) => {
  if ($event.value) {
    form.value.from_district = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
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
      label: $event.value.label.children,
    };
    delete form.value["from_district"];
  } else {
    form.value.from_province = {
      key: null,
      id: null,
    };
  }
};

const onChangeToCountry = ($event) => {
  if ($event.value) {
    form.value.to_country = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
    };
    delete form.value["to_province"];
    delete form.value["to_district"];
  } else {
    form.value.to_country = {
      key: null,
      id: null,
    };
  }
};

const onChangeToProvince = ($event) => {
  if ($event.value) {
    form.value.to_province = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
    };
    delete form.value["to_district"];
  } else {
    form.value.to_province = {
      key: null,
      id: null,
    };
  }
};

const onChangeToDistrict = ($event) => {
  if ($event.value) {
    form.value.to_district = {
      key: $event.value.key,
      id: $event.value.key,
      label: $event.value.label.children,
    };
  } else {
    form.value.to_district = {
      key: null,
      id: null,
    };
  }
};

const onChangeStartTime = () => {
  if (form.value.end_time) {
    let compare = moment(form.value.start_time).isSameOrBefore(
      moment(form.value.end_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      form.value.start_time = null;
    }
    if (
      moment(form.value.start_time).isBefore(moment(form.value.end_time), "day")
    ) {
      form.value.is_over_night = true;
    } else {
      form.value.is_over_night = false;
    }
  }
};

const onChangeEndTime = () => {
  if (form.value.start_time) {
    let compare = moment(form.value.end_time).isSameOrAfter(
      moment(form.value.start_time),
      "day"
    );
    if (!compare) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      form.value.end_time = null;
    }
    if (
      moment(form.value.end_time).isAfter(moment(form.value.start_time), "day")
    ) {
      form.value.is_over_night = true;
    } else {
      form.value.is_over_night = false;
    }
  }
};

const getUser = async ($event) => {
  let params = {
    "name.contains": $event ? $event : null,
    planId: plan_id.value,
  };
  const result = await PlanUserService.get(params);
  state.plan_user_option =
    result.data.content.length > 0
      ? result.data.content.map((item: any) => {
          return {
            label: item.type ? renderLabelUser(item.type, item) : "null",
            value: item.id,
            position_group: item.position_group,
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

const renderLabelUser = (type, item) => {
  if (type == planUserType.staff) {
    return `Nhân viên - ${item.user_name} - ${item.name} - ${item.position}`;
  } else {
    return `Đối tác - ${item.name}`;
  }
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
    });

    dataTable.value = $event.map((item: any) => {
      const planUser: any = state.plan_user_option.find(
        (i: any) => i.id == item.value
      );
      if (planUser) {
        return {
          ...planUser,
          name: planUser.name,
          position:
            planUser.type == planUserType.staff
              ? planUser.position
              : planUser.position_group
              ? planUser.position_group.name
              : null,
          plan_user: { id: planUser.id },
          user_id: planUser?.user?.id,
          plan_id: planUser?.plan?.id,
          phone_number: planUser.phone_number,
          is_active: 1,
          rangePicker: [form.value.start_time, form.value.end_time],
          start_time: form.value.start_time ? form.value.start_time : null,
          end_time: form.value.end_time ? form.value.end_time : null,
          status: planRouteUserStatus.KHOI_TAO, // Chưa checkin
        };
        // }
      }
    });
  } else {
    form.value.plan_route_user_dto_list = [];
  }
};

const onSearchRoute = async () => {
  const res = await dataRouteItems.value.filter((item) => {
    return (
      item.name.toLowerCase().search(state.textSearchRoute.toLowerCase()) !== -1
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
    slots: { customRender: "position" },
  },
  {
    title: "Liên hệ",
    dataIndex: "phone_number",
    key: "phone_number",
    width: "150px",
    slots: { customRender: "phone_number" },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "180px",
    slots: { customRender: "email" },
  },
  {
    title: "Ngày công tác",
    dataIndex: "date_work",
    width: "250px",
    slots: { customRender: "rangePicker" },
  },
];
const { isLoading: planUserLoading } = userGetListPlanRouteUser(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val: any) => {
    dataPlanRouteUser.value = val.data.content;
    dataPlanRouteUserItems.value = val.data.content;
  },
});

const {} = useGetDistance(distanceParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetDistance,
  retry: false,
  onSuccess: async (val: any) => {
    if (val.data != null) {
      form.value.distance = val.data;
      distanceQuota.value = val.data;
    } else {
      form.value.distance = null;
    }
  },
});

const { isLoading: PlanRouteLoading } = userGetListPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: async (val) => {
    // dataRouteRecord.value = val.data.content;
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
  index.value = idx;
  mode.value = "edit";
  activeSelect.value = await {};
  activeSelect.value[idx] = true;
  form.value = { ...item };
  if (form.value.dataTable) {
    dataTable.value = form.value.dataTable.map((i) => {
      let planUser = i.plan_user;
      return {
        type: planUser.type,
        name: planUser.name,
        user_name: planUser.user_name,
        position:
          planUser.type == planUserType.staff
            ? planUser.position
            : planUser.position_group
            ? planUser.position_group.name
            : null,
        plan_user: planUser,
        phone_number: planUser.phone_number,
        plan_id: i.plan_id,
        plan_route_id: item.id,
        is_active: 1,
        rangePicker:
          i.start_time != null && i.start_time != null
            ? [i.start_time, i.end_time]
            : [],
        start_time: i.start_time ? i.start_time : null,
        end_time: i.end_time ? i.end_time : null,
        status: i?.status, // Chưa checkin
        user_id: i?.user_id,
      };
      // }
    });
  }
};

const saveForm = (nextStep: any) => {
  if (dataTable.value.length == 0) {
    message.error("Vui lòng chọn nhân viên đi công tác");
    return;
  }
  saveLoading.value = true;
  ruleFormPlanRoute.value
    .validate()
    .then(() => {
      const data = {
        ...form.value,
        name: `${form.value.from_province.label} - ${form.value.to_province.label}`,
        plan: { id: plan_id.value },
        // info user
        plan_route_user_dto_list: dataTable.value,
      };
      useSavePlanRoute
        .mutateAsync({
          form: data,
          mode: mode.value,
        })
        .then((response) => {
          if (mode.value == "edit") {
            message.success("Cập nhật lộ trình thành công");
          } else {
            mode.value = "edit";
            form.value.id = response.data.id;
            message.success("Thêm mới lộ trình thành công");
          }
          saveLoading.value = false;
          if (nextStep) {
            emit("nextStep");
          }
        })
        .catch((error) => {
          console.log(error);
          saveLoading.value = false;
        });
    })
    .catch((error) => {
      saveLoading.value = false;
      console.log(error);
    });
};

defineExpose({
  dataRouteRecord,
});

onMounted(() => {
  getUser("");
});
</script>
<style scoped lang="scss">
.item_chose:hover {
  background-color: #ed1b2f;
  color: #fff;
}

.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
  border-bottom: 1px solid rgb(223, 212, 212);
}

.tab_pane {
  height: 96vh;
  overflow: auto;
}
.title_box {
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
}

.title_table {
  font-weight: bold;
  font-size: 15px;
}
.box_left__view {
  padding: 20px;
  margin-top: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
  border-radius: 5px;
  cursor: pointer;
}

.width_item {
  width: 100%;
}

.ant-spin-nested-loading {
  width: 100%;
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
    width: 120px;
    margin-right: 15px;
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
    background: var(--mainColor);
  }
}

.border_bottom {
  border-bottom: 1px solid rgb(223, 212, 212);
}

.list_box {
  border: 1px solid rgb(223, 212, 212);
  border-radius: 1%;
  padding: 20px;
}
</style>
