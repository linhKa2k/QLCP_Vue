<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="6">
        <a-card
          :bordered="false"
          class="card-border"
          :title="'Danh sách lộ trình'"
          size="small"
        >
          <a-row>
            <a-col :span="24" class="tab_pane">
              <a-row>
                <a-col :span="24">
                  <a-row :gutter="[0, 24]">
                    <a-col
                      :span="24"
                      v-for="(item, key) in routeRecordData"
                      :key="key"
                      @click="handleSelectRoute(item, key)"
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
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col :span="24"
                          ><strong style="font-size: 117%">
                            {{ item.name ? item.name : "--" }}
                          </strong></a-col
                        >
                      </a-row>
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col
                          ><strong>{{ "Đơn vị đi" }}</strong></a-col
                        >
                        <!-- <a-col :span="1">:</a-col> -->
                        <a-col
                          ><span>{{
                            item.from_department
                              ? item.from_department.name
                              : "--"
                          }}</span></a-col
                        >
                      </a-row>
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col
                          ><strong>{{ "Đơn vị đến" }}</strong></a-col
                        >
                        <!-- <a-col :span="1">:</a-col> -->
                        <a-col
                          ><span>{{
                            item.to_department ? item.to_department.name : "--"
                          }}</span></a-col
                        >
                      </a-row>
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col
                          ><strong>{{ "Ngày bắt đầu" }}</strong></a-col
                        >
                        <!-- <a-col :span="1">:</a-col> -->
                        <a-col
                          ><span>{{
                            item.start_time ? formatDate(item.start_time) : "--"
                          }}</span></a-col
                        >
                      </a-row>
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col
                          ><strong>{{ "Ngày kết thúc" }}</strong></a-col
                        >
                        <!-- <a-col :span="1">:</a-col> -->
                        <a-col
                          ><span>{{
                            item.end_time ? formatDate(item.end_time) : "--"
                          }}</span></a-col
                        >
                      </a-row>
                      <a-row
                        style="display: flex; justify-content: space-between"
                      >
                        <a-col
                          ><strong>{{ "Tình trạng" }}</strong></a-col
                        >
                        <!-- <a-col :span="1">:</a-col> -->
                        <a-col
                          ><span>{{
                            item.is_confirm == 2
                              ? "Đã xác nhận"
                              : "Chưa xác nhận"
                          }}</span></a-col
                        >
                      </a-row>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-tabs v-model:activeKey="activeKey" @change="null" size="small">
          <a-tab-pane key="1" tab="Danh sách nhân viên">
            <a-row :gutter="8">
              <a-col :span="6">
                <a-input-search
                  v-model:value="textSearch"
                  placeholder="Tìm kiếm"
                  @search="onSearch()"
                  @input="onSearch()"
                />
              </a-col>
            </a-row>
            <a-table
              :pagination="false"
              :columns="staffColumn"
              :data-source="staffData"
              :scroll="{ x: 1500, y: 300 }"
              bordered
              :row-key="(record) => record.id"
              :row-selection="{
                selectedRowKeys: state.selectedRowKeys,
                onChange: onSelectChange,
                getCheckboxProps: (record) => ({
                  disabled: [
                    planConfirmUserStatus.CHO_XAC_NHAN,
                    planConfirmUserStatus.DA_XAC_NHAN,
                  ].includes(record.status), // Column configuration not to be checked
                  name: record.name,
                }),
              }"
              :loading="getPlanRouteUserLoading"
            >
              <template #index="{ index }">
                <span>
                  {{ index + 1 }}
                </span>
              </template>
              <template #from_date="{ text }">
                <span>
                  {{ text ? formatDate(text) : "--" }}
                </span>
              </template>
              <template #to_date="{ text }">
                <span>
                  {{ text ? formatDate(text) : "--" }}
                </span>
              </template>
              <template #status="{ text }">
                <span>
                  {{ text ? renderStatus(text) : "--" }}
                </span>
              </template>

              <template #is_business="{ text }">
                <span>
                  {{ text == true ? "Có" : "Không" }}
                </span>
              </template>

              <template #phone_number="{ text }">
                <a :href="`tel:${text}`">{{ text }}</a>
              </template>
              <template #email="{ text }">
                <a :href="`mailto:${text}`">{{ text }}</a>
              </template>
            </a-table>
            <a-row :gutter="16"> </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Đề nghị xác nhận công tác">
            <a-table
              :columns="workConfirmation"
              :data-source="staffConfirmData"
              :scroll="{ y: 370 }"
              :pagination="false"
              bordered
            >
              <template #index="{ index }">
                <span>
                  {{ index + 1 }}
                </span>
              </template>
              <template #insDate="{ text }">
                <span>
                  {{ text ? formatDate(text) : "" }}
                </span>
              </template>
              <template #updDate="{ text }">
                <span>
                  {{ text ? formatDate(text) : "" }}
                </span>
              </template>
              <template #status="{ text }">
                <span>
                  {{ text ? formatStatuss(text) : "" }}
                </span>
              </template>

              <template #action="{ record }">
                <a-row
                  :gutter="16"
                  style="display: flex; justify-content: center"
                >
                  <!-- <a-col><a>Sửa</a></a-col> -->
                  <a-tooltip placement="top">
                    <template #title>
                      <span> {{ $t("common.detail") }} </span>
                    </template>
                    <EyeOutlined
                      :style="{ color: '#3f51b5', marginRight: '8px' }"
                      @click="handleDetail(record)"
                    />
                  </a-tooltip>
                  <a-tooltip placement="top" v-if="isShowGroupButton(record)">
                    <template #title>
                      <span> {{ $t("common.edit") }} </span>
                    </template>
                    <EditOutlined
                      :style="{ color: '#3f51b5', marginRight: '8px' }"
                      @click="handleEdit(record)"
                    />
                  </a-tooltip>
                  <a-tooltip placement="top" v-if="isShowGroupButton(record)">
                    <template #title>
                      <span>{{ $t("common.delete") }}</span>
                    </template>
                    <DeleteOutlined
                      :style="{ color: '#ee6e73', marginRight: '8px' }"
                      @click="handleDelete(record)"
                    />
                  </a-tooltip>
                </a-row> </template
            ></a-table>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-col>
  <div>
    <a-modal
      v-model:visible="isShowCreateModal"
      title="Tạo mới kế hoạch công tác"
      :destroyOnClose="true"
      :closable="true"
      :cancel-text="$t('common.back')"
      :bodyStyle="bodyStyleModal"
      :width="'100%'"
      centered
      :wrapClassName="wrapClassName"
      target="current_tab"
      ref="modal"
    >
      <AddPlanCofirm
        @hideModal="closeSignModal"
        :form="{
          dataTable: dataSelect,
          dataSelect: itemSelect,
          data: dataSelect,
          mode: mode,
        }"
      >
      </AddPlanCofirm>
    </a-modal>

    <!-- chinh sua -->
    <a-modal
      v-model:visible="isShowEditModal"
      title="Sửa kế hoạch công tác"
      :destroyOnClose="true"
      :closable="true"
      :cancel-text="$t('common.back')"
      :bodyStyle="bodyStyleModal"
      :width="'100%'"
      centered
      :wrapClassName="wrapClassName"
      target="current_tab"
      ref="modal"
    >
      <AddPlanCofirm
        @hideModal="closeSignModal"
        :form="{
          dataSelect: {
            name: itemSelect?.name ? itemSelect?.name : null,
            to_department: itemSelect?.to_department
              ? itemSelect?.to_department
              : null,
          },
          mode: mode,
        }"
        :dataDetail="planConfirmDetail"
        :formLoading="getDetailConfirmLoading"
      >
      </AddPlanCofirm>
    </a-modal>

    <!-- chi tiết -->
    <a-modal
      v-model:visible="isShowDetailModal"
      title="Chi tiết xác nhận công tác"
      :destroyOnClose="true"
      :closable="true"
      :bodyStyle="bodyStyleModal"
      :width="'100%'"
      centered
      :wrapClassName="wrapClassName"
      target="current_tab"
      ref="modal"
    >
      <AddPlanConfirmDetail
        @hideModal="closeSignModal"
        :form="{
          dataSelect: {
            name: itemSelect?.name ? itemSelect?.name : null,
            to_department: itemSelect?.to_department
              ? itemSelect?.to_department
              : null,
          },
          dataDetail: planConfirmDetail,
        }"
        :dataDetail="planConfirmDetail"
        :formLoading="getDetailConfirmLoading"
      >
      </AddPlanConfirmDetail>
    </a-modal>
  </div>

  <a-row type="flex" class="footer" style="justify-content: flex-end">
    <a-button
      @click="handleCreatePlanCofirm()"
      v-if="isShowConfirm"
      style="background-color: #ed1b2f; color: #fff"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      {{ "Xác nhận công tác" }}
    </a-button>
    <a-button v-if="true" class="prev" @click="hidenModal" size="middle">
      <DoubleLeftOutlined />{{ "Hủy" }}
    </a-button>
  </a-row>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import i18n from "@/lang";
import { formatDate, formatStatus, formatStatuss } from "@/utility";
import { useGetList as getPlanRoute } from "@/hooks/plan_route";
import { useGetListUser as getPlanRouteUser } from "@/hooks/plan_route";
import {
  useGetListStaffConfirm as getPlanStaffConfirm,
  useDeleteMutation as deleteConfirmStaff,
  useDetail as useGetDetailConfirm,
  useGetByPlanRoute as useGetAllByPlanRoute,
} from "@/hooks/plan_confirm";
import AddPlanCofirm from "../Modal/AddPlanCofirm.vue";
import AddPlanConfirmDetail from "../Modal/AddPlanConfirmDetail.vue";
import { message, Modal } from "ant-design-vue";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { planConfirmStatus, planConfirmUserStatus } from "@/common/enumUtility";
const { t } = i18n.global;
const wrapClassName = ref<string>("full-form");
const isShowCreateModal = ref<boolean>(false);
const isShowDetailModal = ref<boolean>(false);
const isShowEditModal = ref<boolean>(false);
const dataSelect = ref<any[]>([]);
const mode = ref<any>("add");
const custom = ref<any>({});
const bodyStyleModal = ref<{
  overflowX: string;
  height: string;
  overflowY: string;
  padding: string;
}>({
  overflowX: "hidden",
  height: "calc(100vh - 112px)",
  overflowY: "scroll",
  padding: "0",
});
const isShowGroupButton = (record) => {
  return ![planConfirmStatus.confirm, planConfirmStatus.refuse].includes(
    record?.status
  );
};

const showSignModal = () => {
  mode.value = "add";
  isShowCreateModal.value = true;
};

const closeSignModal = () => {
  isShowCreateModal.value = false;
  isShowEditModal.value = false;
  isShowDetailModal.value = false;
};

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
const dataRouteRecord = ref<any[]>([]);
const planParams = ref<any>({
  planId: props.form.id ? props.form.id : null,
});
const enabledGetPlanRoute = computed(() => {
  return planParams.value.planId !== null;
});
const routeRecordData = ref<any[]>([]);
const dataClick = ref<any[]>([]);
const activeKey = ref<string>("1");
const idPlanRoute = ref();
const staffData = ref<any[]>([]);
const tmpStaffData = ref<any[]>([]);

const staffConfirmData = ref<any[]>([]);
const planConfirmDetail = ref<any>(null);
const textSearch = ref<any>("");

const useDeletePlanCofirm = deleteConfirmStaff();
const handleCreatePlanCofirm = () => {
  showSignModal();
  state.selectedRowKeys = [];
};

const state = reactive<{
  selectedRowKeys: Id[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});
const isShowConfirm = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: any) => {
  dataClick.value.push(selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
  dataSelect.value = selectedRowKeys.map((index) => {
    return staffData.value[index];
  });
};

const { isLoading: routeLoading } = getPlanRoute(planParams, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 100,
  enabled: enabledGetPlanRoute,
  retry: false,
  onSuccess: (val) => {
    idPlanRoute.value = val.data.content[0].id;
    dataRouteRecord.value = val.data?.content;
    routeRecordData.value = dataRouteRecord.value;
    console.log(routeRecordData.value, "routeRecordData.value ");
  },
});

const staffColumn = [
  {
    title: "STT",
    dataIndex: "index",
    width: 60,
    slots: { customRender: "index" },
    key: "index",
  },
  {
    title: "Tên thành viên",
    dataIndex: "name",
    width: 250,
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 250,
    slots: { customRender: "email" },
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: 200,
    slots: { customRender: "phone_number" },
    key: "phone_number",
  },
  {
    title: "Ngày bắt đầu thực tế",
    dataIndex: "from_date",
    width: 150,
    align: "center",
    slots: { customRender: "from_date" },
    key: "email",
  },
  {
    title: "Ngày kết thúc thực tế",
    dataIndex: "to_date",
    width: 150,
    align: "center",
    slots: { customRender: "to_date" },
    key: "to_date",
  },
  {
    title: "Số đêm ở nhà nghỉ ?",
    dataIndex: "total_night",
    align: "right",
    width: 150,
    key: "total_night",
  },
  {
    title: "Có đi công tác ?",
    dataIndex: "is_business",
    width: 150,
    slots: { customRender: "is_business" },
    key: "is_business",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: 150,
    fixed: "right",
    slots: { customRender: "status" },
    key: "status",
  },
];

const workConfirmation = [
  {
    title: "STT",
    dataIndex: "index",
    width: "5%",
    slots: { customRender: "index" },
  },
  {
    title: "Mã xác nhận",
    dataIndex: "code",
    width: "10%",
  },
  {
    title: "Ngày tạo",
    dataIndex: "ins_date",
    width: "10%",
    align: "center",
    slots: { customRender: "insDate" },
  },
  {
    title: "Ngày duyệt",
    dataIndex: "upd_date",
    width: "10%",
    align: "center",
    slots: { customRender: "updDate" },
  },
  {
    title: "Số thành viên",
    dataIndex: "total_user",
    width: "10%",
    align: "right",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: "10%",
    slots: { customRender: "status" },
  },
  {
    title: "Quản trị",
    width: "10%",
    align: "center",
    slots: { customRender: "action" },
  },
];
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
const itemSelect = ref<any>({});
const itemId = ref<any>();
const params = ref<any>({
  planRouteId: null,
});
const enabledGetPlanRouteUser = computed(() => {
  return params.value.planRouteId !== null;
});

const enableGetPlanConfirm = computed(() => {
  return params.value.planRouteId !== null;
});

const enabledGetDetailConfirm = computed(() => itemId.value != null);

const hidenModal = () => {
  emit("hideModal");
};

const renderStatus = (value) => {
  let res;
  switch (value) {
    case 1:
      res = "Chờ xác nhận";
      break;
    case 2:
      res = "Xác nhận";
      break;
    case 3:
      res = "Từ chối";
      break;

    default:
      break;
  }
  return res;
};

const handleSelectRoute = (item: any, idx: number) => {
  custom.value = {};
  custom.value[idx] = true;
  itemSelect.value = item;
  if (item.id) {
    params.value.planRouteId = item.id;
  }
};

const handleDetail = (record: any) => {
  itemId.value = record.id;
  isShowDetailModal.value = true;
};
const handleEdit = (record: any) => {
  itemId.value = record.id;
  mode.value = "edit";
  if (record.status == planConfirmStatus.confirm) {
    message.error("Kế hoạch đã được xử lý, không được sửa");
    isShowEditModal.value = false;
  } else {
    isShowEditModal.value = true;
  }
};

const handleDelete = (record: any) => {
  if (
    record.status == planConfirmStatus.confirm ||
    record.status == planConfirmStatus.refuse
  ) {
    message.error("Kế hoạch đã xác nhận, không thể xóa kế hoạch này");
  } else {
    Modal.confirm({
      title:
        "Bạn chắc chắn muốn xoá bản ghi " +
        (record.code || record.reg_no) +
        "?",
      content: "",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk() {
        useDeletePlanCofirm
          .mutateAsync(record.id)
          .then((response) => {
            message.success(
              "Xóa thành công bản ghi" + (record.code || record.reg_no)
            );
          })
          .catch((error) => {
            var response = error.response.data;
            if (Array.isArray(response.fieldErrors)) {
              message.error(
                response.fieldErrors.map((p: any) => p.message).join("\n")
              );
            } else {
              message.error(response.title || response.message);
            }
          });
      },
      onCancel() {},
    });
  }
};

const { isLoading: getPlanRouteUserLoading } = getPlanRouteUser(params.value, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 0,
  enabled: enabledGetPlanRouteUser,
  retry: false,
  onSuccess: async (val) => {
    if (val.data) {
      const data = val.data.data;
      staffData.value = data;
      tmpStaffData.value = data;
    }
  },
});

// đề nghị xác nhận công tác
const { isLoading: getListPlanConfirmLoading } = useGetAllByPlanRoute(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enableGetPlanConfirm,
  retry: false,
  onSuccess: async (val) => {
    if (val.data) {
      staffConfirmData.value = val.data;
    }
  },
});

const { isLoading: getDetailConfirmLoading } = useGetDetailConfirm(itemId, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledGetDetailConfirm,
  retry: false,
  onSuccess: async (val) => {
    if (val.data) {
      planConfirmDetail.value = val.data;
    }
  },
});

const onSearch = async () => {
  staffData.value = tmpStaffData.value.filter((item) => {
    return (
      item.name.toLowerCase().search(textSearch.value.toLowerCase()) !== -1 ||
      item.email.toLowerCase().search(textSearch.value.toLowerCase()) !== -1 ||
      item.phone_number.toLowerCase().search(textSearch.value.toLowerCase()) !==
        -1
    );
  });
};

watch(
  () => routeRecordData.value,
  (val: any) => {
    if (val.length > 0) {
      handleSelectRoute(val[0], 0);
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.item_chose {
  margin-top: 5%;
  border-radius: 5px;
  padding: 5%;
}

.tab_pane {
  height: 65vh;
  overflow: auto;
}

.editable-row-operations a {
  margin-right: 8px;
}

.ant-table-selection-column {
  width: 10px !important;
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
