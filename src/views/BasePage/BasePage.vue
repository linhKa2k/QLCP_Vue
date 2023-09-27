<template>
  <div>
    <div class="indicator" v-if="pageLoading">
      <a-spin :spinning="pageLoading" size="large"> </a-spin>
    </div>
    <a-page-header :title="headerTitle">
      <template v-slot:backIcon>
        <ArrowLeftOutlined v-if="isShowBack" @click="() => $router.go(-1)" />
        <template v-else />
      </template>
      <template v-slot:subTitle>
        <UndoOutlined type="undo" @click="reloadGrid" />
      </template>
      <template v-slot:extra>
        <template v-if="advanceMenu.length == 0">
          <slot name="header"></slot>
          <a-button
            @click="handleAdd"
            v-if="
              isAddButton &&
              !(dataTable?.numberOfElements == 0 && isVisibleEmptySlot)
            "
            :style="{
              color: 'white',
              background: '#ed1b2f',
            }"
            v-permission:add="entity.replaceAll('-', '_')"
          >
            <template #icon><PlusOutlined /></template
            >{{
              $t("common.add", { entity: headerTitle.toLowerCase() })
            }}</a-button
          >
        </template>
        <template v-else>
          <span>{{ `Đã chọn: ${advanceMenu.length}` }}</span>

          <base-export
            v-if="isExport"
            :selected="advanceMenu"
            :entity="entity"
            :useExportMutation="useExportMutation"
          ></base-export>
          <template v-if="advanceMenu.length !== 0 && isApproved">
            <Approved
              :title="isApprovedTitle"
              :selected="advanceMenu"
              :data="dataTable?.content"
              :columns="columns"
              :entity="entity"
              :useSaveMutation="useSaveMutation"
              v-permission:approve="entity"
              :validApprove="props.validApprove"
            />
          </template>
          <slot name="buttonCustom"></slot>

          <a-button
            class="mass-del-btn"
            type="danger"
            @click="handleMassDelete"
            v-if="isMultipleDelete"
          >
            {{ $t("common.remove") }}
          </a-button>
        </template>
      </template>

      <a-row type="flex" align="middle" :gutter="[16, 0]">
        <a-col>
          <base-import
            :entity="entity"
            typeButton="text"
            v-if="isImport"
            @uploadCompleted="uploadCompleted"
            v-permission:import="entity"
          ></base-import>
        </a-col>
        <!-- <a-col v-if="isCustomColumn">
          <a-popover
            v-model:visible="isCustomOption"
            trigger="click"
            placement="bottomLeft"
            :overlayStyle="{ paddingTop: '0px' }"
          >
            <template #content>
              <a-row
                v-for="column in customColumnConfigs"
                :key="column.id"
                :gutter="[0, 16]"
              >
                <a-col :span="24">
                  <a-checkbox
                    :checked="column.is_checked == 1 ? true : false"
                    @change="handleChangeVisible(column)"
                    :disabled="column.data_field == 'code' ? true : false"
                  >
                    {{ column.name }}</a-checkbox
                  >
                </a-col>
              </a-row>
              <a-row :gutter="[0, 16]" class="button-custom">
                <a-col :span="24">
                  <a-button @click="apply" type="primary">{{
                    $t("common.apply")
                  }}</a-button>
                </a-col>
                <a-col :span="24">
                  <a-button @click="reset">{{ $t("common.reset") }}</a-button>
                </a-col>
              </a-row>
            </template>
            <a
              ><SettingOutlined style="font-size: 20px" />
              {{ $t("common.custom_columns") }}
            </a>
          </a-popover>
        </a-col>
        <a-col>
          <a-dropdown :trigger="['click']" v-if="isViewType">
            <a
              ><EyeOutlined style="font-size: 20px" />
              {{ $t("common.view_type") }}
            </a>
            <template #overlay>
              <a-menu>
                <a-radio-group :value="viewType">
                  <template v-for="(type, index) in viewTypeList" :key="index">
                    <a-menu-item>
                      <a-radio
                        :value="type.name"
                        @click="changeViewType(type.name)"
                      >
                        {{ type.text }}
                      </a-radio></a-menu-item
                    >
                  </template>
                </a-radio-group>
              </a-menu>
            </template>
          </a-dropdown>
        </a-col> -->
      </a-row>
    </a-page-header>
    <slot name="tabs"></slot>
    <slot
      name="empty"
      v-if="
        dataTable?.numberOfElements == 0 &&
        isVisibleEmptySlot &&
        viewType == 'table'
      "
    ></slot>

    <keep-alive>
      <o-list
        v-if="viewType == 'list'"
        ref="list"
        :dataList="dataList"
        :entity="entity"
        :columns="columns"
        :isAutoLoad="isAutoLoad"
        :isDateList="isDateList"
        :disabledFitterForm="disabledFitterForm"
        @editRecord="editRecord($event)"
        @getDateList="getDateList"
        @duplicateRecord="duplicateRecord($event)"
        @deleteConfirm="deleteItem($event)"
        @emitData="getFilterList($event)"
        @showAdvance="showAdvance"
        @recordDetail="recordDetail($event)"
        :listLoading="listLoading"
      >
        <template #detail>
          <slot name="detailList"></slot>
        </template>
        <template #dynamicButton>
          <slot name="dynamicButton"></slot>
        </template>
      </o-list>
    </keep-alive>
    <keep-alive>
      <o-grid
        v-if="viewType == 'table'"
        ref="grid"
        :key="gridKey"
        :entity="entity"
        :columns="columns.filter((p) => !p.isApproved)"
        :title="title"
        :isPopup="false"
        :isAutoLoad="isAutoLoad"
        @editRecord="editRecord($event)"
        @duplicateRecord="duplicateRecord($event)"
        @cancelRecord="cancelRecord($event)"
        @openRecord="setItemId($event)"
        @emitRecord="emitRecord($event)"
        @showAdvance="showAdvance"
        @emitData="getFilterTable($event)"
        @showConfirm="deleteItem($event)"
        @emitDataRecord="emitDataRecord($event)"
        :dataTable="dataTable"
        :tableLoading="detailLoading || tableLoading"
        :isAction="props.isAction"
        :isShowAction="props.isShowAction"
        :isShowDeleteAction="isShowDeleteAction"
        :isShowEditAction="isShowEditAction"
        :disabledRows="disabledRows"
        v-show="dataTable?.numberOfElements > 0"
      >
        <slot name="customRenderList"> </slot>
        <template #btnCustom="{ record }">
          <slot name="btnCustom" :record="record"></slot>
        </template>
      </o-grid>
    </keep-alive>
    <a-modal
      :title="title"
      v-model:visible="visible"
      centered
      :width="widthModal"
      :bodyStyle="bodyStyleModal"
      :destroyOnClose="true"
      :wrapClassName="wrapClassName"
    >
      <template #footer>
        <a-button class="btn-cancel" @click="handleCancel">
          {{ $t("common.back") }}
        </a-button>
        <a-button
          @click="handleOk"
          class="btn-submit"
          :loading="confirmLoading"
        >
          <template #icon>
            <SaveOutlined />
          </template>
          {{ $t("common.save") }}
        </a-button>
      </template>
      <keep-alive>
        <component
          :is="formComponent"
          ref="detail"
          :entity="entity"
          :formData="formData"
          :show="visible"
          :fields="fields"
          :rules="rules"
          :relationModel="Models[camelCaseEntity]"
          v-if="visible"
          :handle-callback="handleCallback"
          :spin-loading="pageLoading"
          @cancelForm="handleCancel"
          @saveForm="handleOk"
          @confirmSave="confirmSave()"
          @reload="confirmReload"
          @cancelLoading="cancelLoading"
          @update-form="updateForm($event)"
        ></component>
      </keep-alive>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  useSlots,
} from "vue";

import axios from "axios";
import {
  generateFormData,
  generateFields,
  generateRules,
  convertFilter,
} from "@/formUtility";
import moment from "moment/moment";
import UserServices from "@/services/UserService";
import ColumnConfig from "@/config/columns";
import PrintConfig from "@/config/prints";

import Model from "@/config/models";
import * as _ from "lodash";
import constant from "@/constant";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import BaseImport from "@/components/Excel/BaseImport.vue";
import BaseExport from "@/components/Excel/BaseExport.vue";
import Approved from "@/components/Approved/Table.vue";
import { useStore } from "vuex";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import camelCase from "lodash/camelCase";
import { message, Modal } from "ant-design-vue";
import { useMutation, useQueryClient } from "vue-query";
import i18n from "@/lang";
import { formatDate, getImage, formatNumber, formatTime } from "@/utility";
import { formatDateTimeVN } from "@/mixins";
import html2pdf from "html2pdf.js";

const queryClient = useQueryClient();
const { t } = i18n.global;
interface Props {
  isCustomColumn: boolean;
  isShowDeleteAction: boolean;
  isViewType: boolean;
  entity: string;
  isAdd: boolean;
  isShowBack: boolean;
  isImport: boolean;
  isExport: boolean;
  isAction: boolean;
  isShowAction: boolean;
  isAutoLoad: boolean;
  isReloadGrid: boolean;
  widthModal: string;
  wrapClassName: string;
  bodyStyleModal: any;
  supportRole: any;
  resetForm: any;
  listLoading: boolean;
  dataList: any;
  isDateList: boolean;
  disabledFitterForm: any;
  baseUrl: string;
  getList: Function;
  getDetail: Function;
  useSaveMutation: Function;
  useExportMutation: Function;
  disabledRows: Function;
  isApproved: boolean;
  isApprovedTitle: string;
  validApprove: any;
  isShowEditAction: boolean;
  isMultipleDelete: boolean;
}
interface Filter {
  field?: string;
  operator?: string;
  value?: string;
  value1?: string;
}
const props = withDefaults(defineProps<Props>(), {
  isCustomColumn: false,
  isShowDeleteAction: true,
  isViewType: false,
  entity: "",
  isAdd: true,
  isShowBack: false,
  isImport: false,
  isExport: false,
  isAction: true,
  isShowAction: true,
  isAutoLoad: true,
  isReloadGrid: true,
  widthModal: "800px",
  wrapClassName: "",
  bodyStyleModal: {},
  supportRole: [],
  resetForm: null,
  dataList: {},
  listLoading: false,
  isDateList: false,
  disabledFitterForm: [],
  baseUrl: "",
  getList: () => null,
  getDetail: () => null,
  useSaveMutation: () => null,
  useExportMutation: () => null,
  disabledRows: () => null,
  isApproved: false,
  isApprovedTitle: "",
  validApprove: [],
  isShowEditAction: true,
  isMultipleDelete: true,
});
const viewTypeList = [
  {
    id: 1,
    name: "table",
    text: t("common.table_type"),
  },
  {
    id: 2,
    name: "list",
    text: t("common.list_type"),
  },
];
const gridKey = ref<number>(0);
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const viewType = ref<string>(viewTypeList[0].name);
const pageLoading = ref<boolean>(false);
const store = useStore();
const slots = useSlots();
const detail: any = ref();
const grid: any = ref();
const list: any = ref();
let camelCaseEntity: string = _.camelCase(props.entity);
let headerTitle: string = t(camelCaseEntity + ".name") || "";
const Models = ref<any>(Model);
let form: any = generateFormData(Models.value[camelCaseEntity]) || {};
const fields = generateFields(camelCaseEntity);
const rules = generateRules(camelCaseEntity);
const isCustomOption = ref<boolean>(false);
const isViewOption = ref<boolean>(false);
const dateFormat = ref<string>("DD/MM/YYYY");
const visible = ref<boolean>(false);
const handleCallback = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const formData = ref<any>(form);
const id = ref<any>(null);
const isAddButton = props.isAdd;
const title = ref<string>("");
const dateChange = ref<object>({});
const config = ref<any>(Models.value[camelCaseEntity]);
const advanceMenu = ref<any>([]);
const isShowModal = ref<boolean>(false);
const isShowDetail = ref<boolean>(false);
const spinning = ref<boolean>(false);
const dataTable = ref<any>();
const data = ref<any>([]);
const dataList = ref<any>();
const mode = ref<string>("add");
const emit = defineEmits<{
  (e: "emitRecord", record: any): void;
  (e: "openRecord", record: any): any;
  (e: "emitDataRecord", record: any): void;
  (e: "cancelRecord", record: any): void;
  (e: "handleExport"): any;
  (e: "handleReloadGrid"): any;
  (e: "recordDetail", record: any): void;
  (e: "beforeEditRecord", record: any): void;
  (e: "getDateList"): any;
}>();
const useSaveFormData = props.useSaveMutation();
//delete item
const useDeleteItemMutation = () => {
  return useMutation((id: number) => axios.delete(`${props.baseUrl}/${id}`), {
    onSuccess: async () => {
      await queryClient.removeQueries(props.entity);
    },
  });
};
const useDeleteItem = useDeleteItemMutation();
// delete mutiple items
const useDeleteItemsMutation = () => {
  return useMutation(
    (recordId: number[]) =>
      axios.delete(`${props.baseUrl}/${recordId.join(",")}`),
    {
      onSuccess: async () => {
        await queryClient.removeQueries(props.entity);
      },
    }
  );
};
const useDeleteItems = useDeleteItemsMutation();
const enabledTable = computed(() => typeof filterTable.value !== "undefined");
const enabledList = computed(() => typeof filterList.value !== "undefined");
const enabledDetail = computed(() => typeof itemId.value !== "undefined");
const { isFetching: tableLoading } = props.getList(filterTable, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledTable,
  stateTime: 10000,
  onSuccess: (val) => {
    const items = generateData(val, config.value);
    dataTable.value = items;
    data.value = items.content;
    store.dispatch(camelCase(props.entity) + "/setIsFiltering", false);
  },
  onError: (error) => {
    store.dispatch(camelCase(props.entity) + "/setIsFiltering", false);
  },
});
const { isLoading: listLoading } = props.getList(filterList, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledList,
  onSuccess: (data) => {
    dataList.value = generateData(data, config.value);
  },
});
const { data: detailData, isLoading: detailLoading } = props.getDetail(itemId, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  enabled: enabledDetail,
  onSuccess: (data) => {
    if (isShowDetail.value) {
      emit("openRecord", data.data);
    }
    isShowDetail.value = false;
  },
});
const formComponent = computed(() => {
  let instance = _.replace(
    _.startCase(_.camelCase(props.entity)),
    new RegExp(" ", "g"),
    ""
  );
  return defineAsyncComponent(
    () => import("@/views/" + instance + "/Form.vue")
  );
});
const service = computed(() => store.state[camelCase(props.entity)].service);
const isVisibleEmptySlot = computed(
  () => slots.empty && slots.empty().length > 0
);
// const columnConfigs = computed(
//   () => store.state[camelCase(props.entity)].columnConfigs
// );
// const defaultColumns = computed(
//   () => store.getters[`${camelCase(props.entity)}/defaultColumns`]
// );
// const customColumnConfigs = computed(
//   () => store.getters[`${camelCase(props.entity)}/customColumnConfigs`]
// );
// const getColumnConfig = (payload: string) => {
//   return store.dispatch(camelCase(props.entity) + "/getColumnConfig", payload);
// };
// const saveColumnConfig = (payload: Array<object>) => {
//   return store.dispatch(camelCase(props.entity) + "/saveColumnConfig", payload);
// };
// const resetColumnConfig = (payload: Array<object>) => {
//   return store.dispatch(
//     camelCase(props.entity) + "/resetColumnConfig",
//     payload
//   );
// };
const Column = ref<any>(ColumnConfig);
let columns = Column.value[camelCaseEntity] || [];

columns = columns.map((p: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
// watch(defaultColumns, (val) => {
//   if (val) {
//     val?.columns?.forEach((p: any) => {
//       columns.forEach((e: any) => {
//         if (
//           p.dataIndex == e.dataIndex &&
//           (p.dataType == "list" || p.dataType == "bool")
//         ) {
//           p.dataSource = e.dataSource;
//         }
//       });
//     });
//   }
// });
onMounted(() => {
  // getColumnConfig(props.entity);
  let view = localStorage.getItem(`${props.entity}-view`);
  if (view != null) {
    viewType.value = view;
  }
});
const handleChangeVisible = (column: any) => {
  if (column.is_checked == 1) {
    column.is_checked = 0;
  } else {
    column.is_checked = 1;
  }
};

const generateData = (data: any, configs: any) => {
  let newData = JSON.parse(JSON.stringify(data.data));
  for (let prop in configs) {
    let element = configs[prop];
    if (element.relation) {
      if (element.deep === 1) {
        newData.content.forEach((item) => {
          item[`name_of_${prop}`] = item[element.relationDeep1][
            element.relation
          ]
            ? item[element.relationDeep1][element.relation][
                element.fieldRelation
              ]
            : "--";
        });
      } else if (element.deep === 2) {
        newData.content.forEach((item) => {
          item[`name_of_${prop}`] = item[element.relationDeep1][
            element.relationDeep2
          ][element.relation]
            ? item[element.relationDeep1][element.relationDeep2][
                element.relation
              ][element.fieldRelation]
            : "--";
        });
      } else {
        newData.content.forEach((item) => {
          item[`name_of_${prop}`] = item[element.relation]
            ? item[element.relation][element.fieldRelation]
            : "--";
        });
      }
    }
  }
  return newData;
};

const getFilterTable = (params: any) => {
  if (params.filters) {
    filterTable.value = convertFilter(params);
  } else {
    filterTable.value = params;
  }
};

const getFilterList = (params: any) => {
  filterList.value = convertFilter(params);
};

const reloadGrid = () => {
  if (!props.isReloadGrid) {
    emit("handleReloadGrid");
    return;
  }
  queryClient.removeQueries(props.entity);
  reload();
  gridKey.value++
};

const reload = (filter?: Filter) => {
  if (grid.value) {
    grid.value.fetch({});
  }
  if (list.value) {
    list.value.fetch({});
  }
};
const confirmReload = () => {
  visible.value = false;
  handleCallback.value = false;
  confirmLoading.value = false;
  pageLoading.value = false;
  // reload();
};
const showModal = () => {
  visible.value = true;
};
const handleAdd = async () => {
  // handleExport();

  id.value = null;
  if (detail.value) {
    detail.value.ruleForm.resetFields();
  }
  formData.value = generateFormData(config.value);
  formData.value["mode"] = "add";
  title.value = t("common.add") + " " + t(camelCaseEntity + ".name") || "";
  if (detail.value) {
    detail.value.form = formData.value;
  }
  if (detail.value && detail.value.relationForm) {
    for (let prop in detail.value.relationForm) {
      detail.value.relationForm[prop] = [];
    }
  }
  visible.value = true;
};
const handleOk = (e?: any) => {
  e?.preventDefault();
  handleCallback.value = false;
  detail.value?.ruleForm.validate().then(() => {
    pageLoading.value = true;
    confirmLoading.value = true;
    let forms = convertFormData();
    try {
      if (detail.value?.isCallBack) {
        isShowModal.value = true;
        confirmLoading.value = true;
        handleCallback.value = true;
        formData.value = forms;
      } else {
        saveFormData(forms);
      }
    } catch (err: any) {
      message.error(err);
    }
  });
};
const convertFormData = (callback?: any) => {
  let form = JSON.parse(JSON.stringify(detail.value.form));
  if (id.value) {
    form.id = id.value;
  }
  for (let prop in form) {
    for (let propConfig in config.value) {
      if (config.value[propConfig].relation == prop) {
        form[prop]["id"] = form[prop]["key"];
        delete form[prop]["key"];
      }
      if (config.value[propConfig].relationDefault == prop) {
        form[prop + "_id"] = form[prop]["key"];
        delete form[prop];
      }
      if (config.value[propConfig].relationMultiple == prop) {
        form[prop + "s"] = form[prop].map((item: any) => ({
          [prop]: {
            [prop + "_id"]: item.key ? item.key : item.value,
            id: item.key ? item.key : item.value,
          },
        }));
        delete form[prop];
      }
    }
    if (config.value[prop] && config.value[prop].dataType) {
      if (config.value[prop].dataType == "time") {
        form[prop] = moment(form[prop]).format("H:mm:ss");
      }
      if (config.value[prop].dataType == "dateTime") {
        form[prop] = moment(form[prop]).format();
      }
      if (config.value[prop].dataType == "array") {
        form[prop].forEach((p) => {
          p.id = p.key;
        });
      }
    }
  }
  if (detail.value?.relationForm) {
    for (let prop in detail.value?.relationForm) {
      form[prop] = JSON.parse(JSON.stringify(detail.value?.relationForm[prop]));
    }
  }
  if (callback) {
    form = callback(form);
  }
  return form;
};

const updateForm = ($event: any) => {
  if (!detail?.value.form) return;
  try {
    let form = convertFormData($event.value);
    saveFormData(form);
  } catch (err: any) {
    message.error(err);
  }
};

const deleteItem = (record: any) => {
  Modal.confirm({
    title:
      "Bạn chắc chắn muốn xoá bản ghi " + (record.code || record.name) + "?",
    content: "",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk() {
      useDeleteItem
        .mutateAsync(record.id)
        .then((response) => {
          if (response.status == 204) {
            message.success(`Xoá ${record.code || record.name} thành công`);
            if (list.value) {
              list.value.reload();
            }
            if (grid.value) {
              grid.value.reload();
            }
          } else {
            message.error(response.statusText);
          }
        })
        .catch((error) => {
          var data = error.response.data;
          var errorMessage = data.title || data.message;
          message.error(errorMessage);
        });
    },
    onCancel() {},
  });
};

const saveFormData = (form: any) => {
  useSaveFormData
    .mutateAsync(form)
    .then((response) => {
      confirmLoading.value = false;
      isShowModal.value = false;

      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
        pageLoading.value = false;
        return false;
      }
      visible.value = false;
      pageLoading.value = false;

      message.success(
        t("common.save_success", {
          entity: t(`${camelCaseEntity}.name`),
        })
      );

      if (grid.value) {
        grid.value.reload();
      }
      if (list.value) {
        list.value.reload();
      }
    })
    .catch((error) => {
      debugger;
      var response = error.response.data;
      if (Array.isArray(response.fieldErrors)) {
        message.error(
          response.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(response.title || response.message);
      }
      confirmLoading.value = false;
      pageLoading.value = false;
    });
};
const handleExport = async () => {
  const prints = ref<any>(PrintConfig);
  let template = prints.value[camelCaseEntity] || {};
  const response = await fetch(template.content);
  const text = await response.text();
  let content = text;
  const data = {
    description: "aabc",
    name: "Hoàng",
    created_at: moment(),
  };
  template.fields.map((p) => {
    switch (p.dataType) {
      case "number":
        content = content.replaceAll(
          `##${p.dataIndex}##`,
          formatNumber(data[p.dataIndex])
        );

        break;
      case "datetime":
        content = content.replaceAll(
          `##${p.dataIndex}##`,
          formatDateTimeVN(data[p.dataIndex])
        );

        break;
      case "date":
        content = content.replaceAll(
          `##${p.dataIndex}##`,
          formatDate(data[p.dataIndex])
        );

        break;
      case "time":
        content = content.replaceAll(
          `##${p.dataIndex}##`,
          formatTime(data[p.dataIndex])
        );

        break;
      default:
        content = content.replaceAll(`##${p.dataIndex}##`, data[p.dataIndex]);
        break;
    }
  });
  var worker = html2pdf().from(content).save();
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, "text/html");
  // return doc;
  emit("handleExport");
};

const handleCancel = (e: any) => {
  visible.value = false;
  isShowModal.value = false;
  pageLoading.value = false;
  if (e == "gridLoad") {
    if (grid.value) {
      grid.value.reload();
    }
    if (list.value) {
      list.value.reload();
    }
  }
};
const cancelLoading = () => {
  confirmLoading.value = false;
};
const setItemId = (record: any) => {
  if (itemId.value == record.id) {
    emit("openRecord", detailData.value.data);
  } else {
    itemId.value = record.id;
  }
  isShowDetail.value = true;
};
const recordDetail = (record: number) => {
  emit("recordDetail", record);
};
const emitRecord = (record: any) => {
  emit("emitRecord", record);
};
const emitDataRecord = (record: any) => {
  emit("emitDataRecord", record);
};
const showAdvance = (record: any) => {
  emitRecord(record);
  advanceMenu.value = record;
};
const getDateList = () => {
  emit("getDateList");
};
const editRecord = (record: any, callback?: any) => {
  emit("beforeEditRecord", record);

  id.value = record.id;
  pageLoading.value = true;
  handleCallback.value = false;
  title.value = t("common.edit") + " " + t(camelCaseEntity + ".name") || "";
  if (detail.value) {
    detail.value?.ruleForm.resetFields();
  }
  service.value
    .detail(record.id)
    .then((response: any) => {
      if (response.status !== 200) {
        message.warning(response.statusText);
        return;
      }
      let data = response.data;
      formData.value = generateFormData(config.value);
      for (let prop in config.value) {
        formData.value[prop] = data[prop];
        let configs = config.value[prop];
        if (configs.relation) {
          if (data[configs.relation]) {
            if (configs.fieldRelation1) {
              formData.value[configs.relation] = {
                id: data[configs.relation] ? data[configs.relation]["id"] : "",
                key: data[configs.relation] ? data[configs.relation]["id"] : "",
                value: data[configs.relation]
                  ? data[configs.relation]["id"]
                  : "",
                label: data[configs.relation]
                  ? `${data[configs.relation][configs.fieldRelation]} - ${
                      data[configs.relation][configs.fieldRelation1]
                    }`
                  : "",
              };
            } else {
              formData.value[configs.relation] = {
                ...data[configs.relation],
                id: data[configs.relation] ? data[configs.relation]["id"] : "",
                key: data[configs.relation] ? data[configs.relation]["id"] : "",
                value: data[configs.relation]
                  ? data[configs.relation]["id"]
                  : "",
                label: data[configs.relation]
                  ? data[configs.relation][configs.fieldRelation]
                  : "",
              };
            }
          }
        }
        if (configs.relationDefault) {
          formData.value[configs.relationDefault] = {
            key: data[configs.relationDefault + "_id"] || "",
            value: data["name_of_" + configs.relationDefault + "_id"] || "",
          };
        }
        if (configs.relationMultiple) {
          if (data[prop] && data[prop].length > 0) {
            formData.value[configs.relationMultiple] = data[prop].map(
              (item: any) => ({
                // key: item[config.relationMultiple + "_id"] || "",
                value: item[configs.relationMultiple]["id"] || "",
                label: item[configs.relationMultiple]["name"] || "",
              })
            );
          }
        }

        if (configs.dataType) {
          if (configs.dataType == "date") {
            formData.value[prop] = moment.utc(data[prop], "YYYY-MM-DD");
          }
          if (configs.dataType == "time") {
            formData.value[prop] = moment.utc(data[prop], "H:mm:ss");
          }

          if (configs.dataType == "array") {
            if (configs.dataRelation) {
              configs.dataRelation.map((p: any) => {
                data[prop] &&
                  data[prop].map((t: any) => {
                    let item = t;
                    item[p] = {
                      id: item[p]?.id,
                      key: item[p]?.id,
                      value: item[p]?.id,
                      label: item[p]?.name,
                    };
                  });
              });
            }
            if (configs.fields) {
              Object.keys(configs.fields).map((i) => {
                for (let j = 0; j < data[prop].length; j++) {
                  let item = data[prop][j];
                  if (configs.fields[i].dataType == "bool") {
                    if (item[i] == 1) {
                      item[i] = true;
                    } else {
                      item[i] = false;
                    }
                  }
                  if (configs.fields[i].dataType == "time") {
                    item[i] = moment.utc(data[prop][j][i], "H:mm:ss");
                  }
                  //   if (configs.fields[i].dataType == "datetime") {
                  //   item[i] = moment.utc(data[prop][j][i], "DD/MM/YYYY HH:mm:ss");
                  // }
                }
              });
            }
          }
          if (configs.dataType == "object") {
            // console.log(prop, " check default obejct");
            formData.value[prop] = data[configs.objectRelation]
              ? {
                  id: data[configs.objectRelation]["id"],
                  label:
                    data[configs.objectRelation][configs.fieldLabel || "name"],
                  key: data[configs.objectRelation]["id"],
                  value: data[configs.objectRelation]["id"],
                }
              : configs.objectDefault;
            // Object.values(configs.objectRelation).map((p: any) => {
            //   formData.value[prop][p] = {
            //     value: data[prop][p + "_id"] || "",
            //     label: data[prop]["name_of_" + p + "_id"] || "",
            //   };
            // });
          }
        }
      }
      formData.value["mode"] = "edit";

      if (detail.value) {
        detail.value.form = formData.value;
      }
      if (detail.value && detail.value?.relationForm) {
        for (let prop in detail.value.relationForm) {
          detail.value.relationForm[prop] = JSON.parse(
            JSON.stringify(formData.value[prop])
          );
        }
      }
      if (callback) {
        callback();
      }
      visible.value = true;
      pageLoading.value = false;

      // this.$emit("editRecord", this.formData);
    })
    .catch((error: any) => {
      pageLoading.value = false;

      message.error(error.message);
    });
};
const duplicateRecord = ($event: any) => {
  editRecord($event, function () {
    formData.value["id"] = null;
    formData.value["code"] = "";
    // if (props.resetForm) {
    // resetForm($event);
    // }
    id.value = null;
    formData.value["mode"] = "duplicate";
  });
};
const handleMassDelete = () => {
  let recordId: number[] = advanceMenu.value;
  let data = [];
  if (viewType.value == "table") {
    data = grid?.value.data;
  } else if (viewType.value == "list") {
    data = list?.value.data;
  }
  let recordCode = ref<Array<any>>([]);
  let code: string = "code";
  let entity: string = props.entity;
  let count: number = 0;

  // if (Object.keys(constant.entityFieldCode).includes(entity)) {
  //   code = constant.entityFieldCode[entity];
  // }

  data?.forEach((record?: any) => {
    if (recordId.includes(record.id)) {
      recordCode.value.length < 3
        ? recordCode.value.push(record[code])
        : count++;
    }
  });

  var title = t(camelCaseEntity + ".name").toLowerCase();
  if (recordCode.value.length >= 2 && count > 0) {
    recordCode.value.push(`và ${count} ${title} còn lại`);
  }
  Modal.confirm({
    title: `Bạn chắc chắn muốn xoá ${title} ${recordCode.value.join(", ")} ?`,
    content: "",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk() {
      recordId.map((item, index) => {
        useDeleteItem
          .mutateAsync(item)
          .then((response) => {
            if (response.status == 204) {
              message.success(
                `Xoá ${title} ${recordCode.value[index]} thành công`
              );
            } else {
              message.error(response.statusText);
            }
            advanceMenu.value = [];
            if (grid.value) {
              grid.value.reload();
            }
            if (list.value) {
              list.value.reload();
            }
          })
          .catch((error) => {
            var data = error.response.data;
            var errorMessage = data.title || data.message;
            message.error(errorMessage);
          });
      });
    },
    onCancel() {},
  });
};
const confirmSave = () => {
  handleCallback.value = false;
  pageLoading.value = false;
};
const cancelRecord = (record: any) => {
  emit("cancelRecord", record);
};
const uploadCompleted = () => {
  reloadGrid();
};
defineExpose({
  reload,
});
</script>
<style lang="scss" scoped>
.indicator {
  position: absolute;
  z-index: 999;
  background: #c9b8b824;
  height: 100vh;
  width: 100vw;
  text-align: center;
  :deep() .ant-spin {
    top: 35%;
    position: absolute;
  }
}
.btn-submit {
  background: #ed1b2f;
  border-color: #ed1b2f;
  width: 120px;
  color: #fff;
}
.btn-cancel {
  border: unset;
}
.ant-checkbox-wrapper {
  width: 100%;
  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: #ed1b2f;
    border-color: #ed1b2f;
  }
  :deep(.ant-checkbox-inner) {
    border-color: #ed1b2f;
  }
}
.button-custom {
  .ant-btn,
  .ant-btn-primary {
    width: 100%;
  }
  .ant-btn-primary {
    background: #ed1b2f;
    border-color: #ed1b2f;
  }
}
:deep() {
  .no-permission {
    display: none;
  }
}
</style>
<style lang="scss">
.full-form {
  overflow: hidden;
}
</style>
