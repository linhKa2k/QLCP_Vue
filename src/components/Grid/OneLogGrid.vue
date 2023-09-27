<template>
  <div class="container-spin" v-if="tableLoading">
    <a-spin :spinning="tableLoading" />
  </div>
  <a-config-provider>
    <template #renderEmpty>
      <a-empty>
        <template #description>
          <span>
            {{ $t("common.empty") }}
          </span>
        </template>
        <a-button type="primary" v-if="isAdd">
          <template #icon> <PlusOutlined /> </template
          >{{
            $t("common.add", {
              entity: title,
            })
          }}</a-button
        >
      </a-empty>
    </template>

    <a-table
      :scroll="{ x: '100vh', y: 'calc(100vh - 300px)' }"
      :columns="colsPreventive"
      :locale="{
        filterConfirm: $t('common.filter'),
        filterReset: $t('common.cancel'),
      }"
      :row-key="(record) => record.id"
      :row-selection="{
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
        getCheckboxProps: disabledRows,
      }"
      :data-source="dataTable?.content"
      :pagination="false"
      :indentSize="8"
      @change="handleTableChange"
      bordered
    >
      <template #link="{ text, record }">
        <a
          @click="() => openRecord(record)"
          @contextmenu="handleRightClick($event, record)"
          >{{ text }}</a
        >
      </template>
      <template #currency="{ text, column }">
        <span>{{ column.integer ? text : formatCurrency(text) }}</span>
      </template>
      <template #date="{ text }">{{
        text == null ? "--" : formatDate(text)
      }}</template>
      <template #datetime="{ text }">{{
        text == null ? "--" : formatDateTimeVN(text)
      }}</template>
      <template #time="{ text }">{{ formatTime(text, "HH:mm") }}</template>
      <template #number="{ text, column }"
        ><span>{{ column.integer ? text : formatNumber(text) }}</span></template
      >
      <template #colEdit="{ text, column }"
        ><span>{{ column.integer ? text : formatNumber(text) }}</span></template
      >
      <template #icon="{}">
        <!-- format fileid to icon  -->
        <a-button v-if="isDownload" @click="handleDownload"
          ><DownloadOutlined />
        </a-button>
      </template>
      <template #email="{ text }">
        <a :href="'mailto:' + text">
          <a-tooltip :title="text" placement="topLeft">
            {{ text }}
          </a-tooltip>
        </a>
      </template>
      <template #image="{ text }">
        <img
          width="48"
          height="48"
          v-bind:src="getImage(text)"
          alt="image"
          v-if="text"
        />
      </template>
      <template #phone="{ text }">
        <a :href="'tel:' + text">{{ text }}</a>
      </template>
      <template #list="{ text, column }">
        <a-tooltip :title="renderList(text, column)" placement="topLeft">
          <a-tag :color="renderTagColor(text, column)">
            {{ renderList(text, column) }}
          </a-tag>
        </a-tooltip>
      </template>
      <template #bool="{ text, column }">
        {{ renderBool(text, column) }}
      </template>
      <template #multiple-list="{ text, column, record }">
        <a-tag v-for="item in renderMultipleList(text, column)" :key="item">
          <a-tooltip :title="item" placement="topLeft">
            {{ item.name || "--" }}
          </a-tooltip>
        </a-tag>
      </template>
      <template #text="{ text }">
        <a-tooltip :title="text" placement="topLeft">
          {{ text }}
        </a-tooltip>
      </template>
      <template #file="{ text }">
        <img v-if="text" :src="text" alt="file" width="36" height="36"
      /></template>
      <template
        #filterDate="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-date-picker
            :locale="locale"
            :value="selectedKeys[0]"
            @change="
              (e) => {
                setSelectedKeys(e ? [e] : []);
              }
            "
            type="date"
            format="DD/MM/YYYY"
            style="width: 100%"
          />
        </div>
        <div style="padding: 0 8px 8px">
          <a-button
            type="primary"
            size="small"
            style="width: 120px; margin-right: 8px"
            @click="
              () => handleSearchDate(selectedKeys, confirm, column.dataIndex)
            "
          >
            <template #icon><SearchOutlined /></template>
            {{ $t("common.search") }}
          </a-button>
          <a-button
            size="small"
            style="width: 120px"
            @click="
              () => handleReset(selectedKeys, clearFilters, column.dataIndex)
            "
          >
            {{ $t("common.cancel") }}
          </a-button>
        </div>
      </template>
      <template
        #filterTime="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-time-picker
            format="HH:mm"
            :value="selectedKeys[0]"
            :locale="locale"
            @change="
              (e) => {
                setSelectedKeys(e ? [e] : []);
              }
            "
            style="width: 100%"
          />
        </div>
        <div style="padding: 0 8px 8px">
          <a-button
            type="primary"
            size="small"
            style="width: 120px; margin-right: 8px"
            @click="
              () => handleSearchTime(selectedKeys, confirm, column.dataIndex)
            "
          >
            <template #icon><SearchOutlined /></template>
            {{ $t("common.search") }}
          </a-button>
          <a-button
            size="small"
            style="width: 120px"
            @click="
              () => handleReset(selectedKeys, clearFilters, column.dataIndex)
            "
          >
            {{ $t("common.cancel") }}
          </a-button>
        </div>
      </template>
      <template
        #filterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Tìm kiếm`"
            :value="selectedKeys[0]"
            style="width: 250px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="() => handleSearch(selectedKeys, confirm, column)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 120px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column)"
          >
            <template #icon><SearchOutlined /></template>
            {{ $t("common.filter") }}
          </a-button>
          <a-button
            size="small"
            style="width: 120px"
            @click="
              () => handleReset(selectedKeys, clearFilters, column.dataIndex)
            "
          >
            {{ $t("common.cancel") }}
          </a-button>
        </div>
      </template>
      <template #filterIcon="filtered">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #action="{ record }">
        <slot name="btnCustom" :record="record"> </slot>
        <span>
          <EditOutlined
            :style="{ color: '#3f51b5', marginRight: '8px' }"
            @click="() => showEdit(record)"
            v-permission:edit="entity"
            v-if="isShowDeleteAction"
          />
        </span>
        <span>
          <DeleteOutlined
            :style="{ color: '#ee6e73', marginRight: '8px' }"
            @click="() => showConfirm(record)"
            v-permission:delete="entity"
            v-if="isShowEditAction"
          />
        </span>
      </template>
      <template #renderAction="{ record }">
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.edit") }} </span>
          </template>
          <EditOutlined
            :style="{ color: '#3f51b5', marginRight: '8px' }"
            @click="() => showEdit(record)"
            v-permission:edit="entity"
          />
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.copy") }}</span>
          </template>
          <CopyOutlined
            :style="{ color: '#66bb6a', marginRight: '8px' }"
            @click="() => showCopy(record)"
          />
        </a-tooltip>

        <a-tooltip placement="top">
          <template #title>
            <span>{{ $t("common.delete") }}</span>
          </template>
          <DeleteOutlined
            :style="{ color: '#ee6e73', marginRight: '8px' }"
            @click="() => showConfirm(record)"
            v-permission:delete="entity"
          />
        </a-tooltip>
        <!-- <a-tooltip placement="top">
            <template #title>
              <span>{{ $t("common.cancel") }}</span>
            </template>
<StopOutlined
              :style="{ color: '#ee6e73', marginRight: '8px' }"
              @click="() => showCancel(record)"
            />
          </a-tooltip> -->
      </template>
      <template #customRender="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              ?.toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </a-config-provider>
  <div class="pagination" v-if="dataTable?.content?.length > 0">
    <a-pagination
      show-size-changer
      v-model="pagination.current"
      :showLessItems="pagination.showLessItems"
      :showTitle="pagination.showTitle"
      :size="pagination.size"
      :hideOnSinglePage="pagination.hideOnSinglePage"
      :page-size-options="pagination.pageSizeOptions"
      :total="dataTable?.totalElements"
      :showTotal="
        (total, range) => `${range[0]}-${range[1]} / ${total} bản ghi`
      "
      :page-size="pagination.pageSize"
      @showSizeChange="onShowSizeChange"
      @change="onShowSizeChange"
    >
      <template #buildOptionText="props">
        <span>{{ props.value }} / {{ $t("common.page") }}</span>
      </template>
    </a-pagination>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import mixins from "@/mixins";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import camelCase from "lodash/camelCase";
import FileSaver from "file-saver";
import {
  formatDate,
  getImage,
  formatNumber,
  formatTime,
  formatCurrency,
} from "@/utility";
import { formatDateTimeVN } from "@/mixins.js";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  StopOutlined,
  FileImageOutlined,
  SwapOutlined,
  UserSwitchOutlined,
  EnterOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { useMutation, useQueryClient } from "vue-query";
import ImportHistoryService from "@/services/ImportHistoryService";
import i18n from "@/lang";
import generateSelector from "ant-design-vue/lib/vc-select/generate";
const { t } = i18n.global;
const store = useStore();
interface Paper {
  showLessItems: boolean;
  size: string;
  showTitle: boolean;
  hideOnSinglePage: boolean;
  showSizeChanger: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  current?: number;
  showTotal: (total: any, range: any) => string;
}
const pager: Paper = {
  showLessItems: true,
  size: "small",
  showTitle: false,
  hideOnSinglePage: false,
  showSizeChanger: true,
  pageSize: 50,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTotal: (total, range) =>
    `Hiển thị kết quả từ ${range[0]}-${range[1]} trên tổng ${total}`,
};

interface Props {
  defaultColumns: any;
  isShowDeleteAction: boolean;
  title: string;
  entity: string;
  columns: any;
  isAction: boolean;
  isPopup: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isDownload: boolean;
  dataTable: any;
  tableLoading: boolean;
  isShowEditAction: boolean;
  disabledRows: Function;
}
const props = withDefaults(defineProps<Props>(), {
  defaultColumns: [],
  isShowDeleteAction: true,
  title: "",
  entity: "",
  columns: [],
  isAction: true,
  isPopup: true,
  isAutoLoad: true,
  isAdd: true,
  isDownload: true,
  dataTable: {},
  tableLoading: false,
  isShowEditAction: true,
  disabledRows: () => null,
});
const emit = defineEmits<{
  (e: "emitRecord", record: any): void;
  (e: "openRecord", record: any): any;
  (e: "cancelRecord", record: any): void;
  (e: "editRecord", record: any): void;
  (e: "showAdvance", record: any): void;
  (e: "emitDataRecord", record: any): void;
  (e: "duplicateRecord", record: any): void;
  (e: "rightClick"): any;
  (e: "emitData", params: any): any;
  (e: "showConfirm", record: any): any;
}>();
const data = computed(() => {
  return props.dataTable?.content;
});
const cols = ref<any>([]);
const selectedColumns = ref<any>([]);
const searchedColumn = ref<any>([]);
const pagination = ref<Paper>(pager);
// const selectedRows = ref<any>([]);
const filterGrids = ref<any>([]);
const searchText = ref<string>("");
// const isFiltering = ref<boolean>(false);
const recordContext = ref<any>({});
const searchInput: any = ref();
watch(
  () => props.defaultColumns,
  (val: any) => {
    if (val) {
      let columns: any = [];
      if (props.isAction) {
        columns.unshift({
          title: t("common.action"),
          key: "operation",
          fixed: "right",
          width: 110,
          slots: { customRender: "action" },
        });
      } else {
        columns.unshift({
          title: t("common.action"),
          key: "operation",
          fixed: "right",
          width: 110,
          slots: { customRender: "renderAction" },
        });
      }
      if (val.columns !== undefined) {
        var tmp = val.columns.map((p: any) => {
          switch (p.dataType) {
            case "number":
              p.className = "column-number";
              break;
            case "currency":
              p.className = "column-number";
              break;
            case "date":
            case "time":
            case "datetime":
              p.className = "column-date";
              break;
            default:
              p.className = "column-string";
              break;
          }
          if (p.isBold) {
            p.class += " text-bold";
          }
          if (!p.slots) {
            p.slots = {
              filterIcon: "filterIcon",
              customRender: "customRender",
            };
            if (p.dataSource) {
              p.filters = p.dataSource;
            } else {
              if (p.dataType == "date" || p.dataType == "datetime") {
                p.slots.filterDropdown = "filterDate";
                if (p.disableSearch) {
                  p.slots.filterDropdown = "";
                }
              } else if (p.dataType == "time") {
                p.slots.filterDropdown = "filterDate";
              } else if (p.dataType == "file") {
                p.slots.filterDropdown = "";
              } else {
                p.slots.filterDropdown = "filterDropdown";
              }
            }
            if (p.isCodeIndex) {
              p.slots.customRender = "link";
            } else {
              if (p.dataType) {
                p.slots.customRender = p.dataType;
              }
            }
          }

          if (p.dataSource) {
          } else {
            p.onFilter = (value: any, record: any) => {
              return true;
            };

            p.onFilterDropdownVisibleChange = (visible: any) => {
              if (visible) {
                setTimeout(() => {
                  if (searchInput.value) {
                    searchInput.value.focus();
                  }
                }, 0);
              }
            };
          }
          return p;
        });
      }

      columns = [].concat.apply(columns, tmp);
      cols.value = columns;
      selectedColumns.value = val.selectedColumns;
    }
  }
);
// dung cho nhung cot chua viet seeder
const colsPreventive = ref<any>([]);

if (props.isAction) {
  colsPreventive.value.push({
    title: t("common.action"),
    key: "operation",
    fixed: "right",
    width: 120,
    slots: { customRender: "action" },
  });
} else {
  colsPreventive.value.push({
    title: t("common.action"),
    key: "operation",
    fixed: "right",
    width: 120,
    slots: { customRender: "renderAction" },
  });
}
let tmp = props.columns.map((p: any) => {
  switch (p.dataType) {
    case "number":
      p.className = "column-number";
      break;
    case "currency":
      p.className = "column-number";
      break;
    case "date":
    case "time":
    case "datetime":
      p.className = "column-date";
      break;
    default:
      p.className = "column-string";
      break;
  }
  if (p.isBold) {
    p.class += " text-bold";
  }
  if (!p.slots) {
    p.slots = {
      filterIcon: "filterIcon",
      customRender: "customRender",
    };
    if (p.dataSource) {
      p.filters = p.dataSource;
    } else {
      if (p.dataType == "date" || p.dataType == "datetime") {
        p.slots.filterDropdown = "filterDate";
        if (p.disableSearch) {
          p.slots.filterDropdown = "";
        }
      } else if (p.dataType == "time") {
        p.slots.filterDropdown = "filterTime";
      } else if (p.dataType == "file") {
        p.slots.filterDropdown = "";
      } else {
        p.slots.filterDropdown = "filterDropdown";
      }
    }
    if (p.isCodeIndex) {
      p.slots.customRender = "link";
    } else {
      if (p.dataType) {
        p.slots.customRender = p.dataType;
      }
    }
  }

  if (p.dataSource) {
  } else {
    p.onFilter = (value: any, record: any) => {
      return true;
    };
    p.onFilterDropdownVisibleChange = (visible: any) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.value) {
            searchInput.value.focus();
          }
        }, 0);
      }
    };
  }

  return p;
});
colsPreventive.value = [].concat.apply(colsPreventive.value, tmp);
let selectedColumnPreventive: any = [];
for (let p of colsPreventive.value) {
  if (p.dataIndex && typeof p.isAddSelect == "undefined") {
    selectedColumnPreventive.push(p.dataIndex);
  }
}

const isFiltering = computed(
  () => store.state[camelCase(props.entity)].isFiltering
);
const maxHeight = computed(
  () => store.state[camelCase(props.entity)].maxHeight
);
const selectedRows = computed(
  () => store.state[camelCase(props.entity)].selectedRows
);
const setSelectedRows = async (data: any) => {
  await store.commit(`${camelCase(props.entity)}/SET_SELECTED_ROW`, data);
};

onMounted(() => {
  pagination.value.current = 1;
  if (props.isAutoLoad) {
    fetch({
      subFilters: [],
      filters: [],
    });
  }
});
const handleDate = (data: any) => {
  pagination.value.current = 1;
  fetch({
    subFilters: [],
    filters: [],
  });
};
const onShowSizeChange = (current: number, pageSize: number) => {
  pagination.value.pageSize = pageSize;
  pagination.value.current = current;
  handleTableChange({ current, pageSize }, [], []);
};
const actionRecord = (record: any, action: any) => {
  if (action.type == "edit") {
    showEdit(record);
  } else if (action.type == "delete") {
    showConfirm(record);
  } else {
    emit("emitRecord", {
      action: action.type,
      record: record,
    });
  }
};
const renderList = (text: any, column: any, key = "text") => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item != undefined ? item[key] : "--";
};
const renderTagColor = (text: any, column: any) => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item && item.color ? item.color : null;
};
const renderBool = (text: any, column: any, key = "text") => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item ? item[key] : text;
};
const renderMultipleList = (data: any, column) => {
  if (column.field && data.length > 0) {
    if (column.dataSource) {
      return data.map((item) => {
        return {
          name: column.dataSource.find((p) => p.value == item[column.field])
            .text,
        };
      });
    }
    return data.map((item) => item[column.field]);
  } else {
    return [];
  }

  // return text ? text.split(",") : "";
};
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  if (isFiltering.value) return;
  let fieldArray: Array<string> = [];
  if (filterGrids.value.length > 0) {
    filterGrids.value.map((p) => {
      fieldArray.push(p.field);
    });
  }
  // let filterArray:any = [];
  for (let prop in filters) {
    if (!fieldArray.includes(prop)) {
      if (Array.isArray(filters[prop])) {
        if (filters[prop].length > 0) {
          filterGrids.value.push({
            field: prop,
            operator: "in",
            isFilterDefault: true,
            value: filters[prop],
          });
        }
      } else {
        filterGrids.value = filterGrids.value.filter((a) => a.field !== prop);
      }
    } else {
      filterGrids.value.map((p) => {
        if (p.operator == "in") {
          if (filters[p.field]) {
            if (Array.isArray(filters[p.field])) {
              if (filters[p.field].length > 0) {
                // filterGrids.value = filterGrids.value.filter(
                //   (a) => a.field !== prop
                // );
                filterGrids.value.push({
                  field: p.field,
                  operator: "in",
                  isFilterDefault: true,
                  value: filters[p.field],
                });
              } else {
                filterGrids.value = filterGrids.value.filter(
                  (a) => a.field !== p.field
                );
              }
            }
          }
        }
      });
    }
  }
  const pager = Object.assign({}, pagination.value);
  pager.current =
    typeof pagination.current !== "undefined"
      ? pagination.current
      : pagination.value?.current;
  pager.pageSize =
    typeof pagination.pageSize !== "undefined"
      ? pagination.pageSize
      : pagination.value?.pageSize;

  pagination.value = pager;

  fetch({
    sortField: sorter.field,
    sortOrder: sorter.order,
    // subFilters: subFilters,
    filters: filterGrids.value,
  });
};
const fetch = (params: any) => {
  const pa = JSON.parse(JSON.stringify(params));
  pa.pageSize = pagination.value.pageSize;
  pa.pageIndex = Number(pagination.value.current) - 1;
  // pa.columns =
  //   props.defaultColumns.selectedColumns?.length > 0
  //     ? selectedColumns.value
  //     : selectedColumnPreventive;
  if (pa.filters) {
    pa.filters = pa.filters.map((p: any) => {
      let field = props.columns.find((x: any) => x.dataIndex === p.field);
      if (field) {
        p.field = field.originalIndex || field.dataIndex;
      }
      return p;
    });
  }

  if (pa.subFilters) {
    pa.subFilters = pa.subFilters.map((p: any) => {
      let field = props.columns.find((x: any) => x.dataIndex === p.field);
      if (field) {
        p.field = field.originalIndex || field.dataIndex;
      }
      return p;
    });
  }
  emit("emitData", pa);
};
const reload = (filters?: any) => {
  if (filters) {
    if (Array.isArray(filters)) {
      filters.map((filter) => {
        let tmp_filter = filterGrids.value.find(
          (p: any) => p.field == filter.field
        );
        if (!tmp_filter) {
          filterGrids.value.push(filter);
        } else {
          tmp_filter.operator = filter.operator;
          tmp_filter.value = filter.value;
          tmp_filter.value1 = filter.value1;
        }
      });
    } else {
      let tmp_filter = filterGrids.value.find(
        (p: any) => p.field == filters.field
      );
      if (!tmp_filter) {
        filterGrids.value.push(filters);
      } else {
        tmp_filter.operator = filters.operator;
        tmp_filter.value = filters.value;
        tmp_filter.value1 = filters.value1;
      }
    }
  }
  pagination.value.current = 1;
  searchedColumn;
  fetch({
    filters: filterGrids.value,
    // subFilters: subFilters,
  });

  setTimeout(() => {
    setSelectedRows([]);
    emit("showAdvance", selectedRows.value);
  }, 0);
};
const handleSearch = (selectedKeys: any, confirm: any, column: any) => {
  let operator = "";
  switch (column.dataType) {
    case "number":
      operator = "equals";
      break;
    case "currency":
      operator = "equals";
      break;
    default:
      operator = "contains";
  }
  confirm();
  searchText.value = selectedKeys[0];
  searchedColumn.value = column.dataIndex;
  // isFiltering.value = true;
  store.dispatch(camelCase(props.entity) + "/setIsFiltering", true);
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != column.dataIndex
  );
  filterGrids.value.push({
    field: column.dataIndex,
    operator: operator,
    isFilterDefault: column.dataSource ? true : false,
    value: selectedKeys[0],
  });
  console.log("search", filterGrids.value);
  reload();
};
const handleSearchTime = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  searchText.value = selectedKeys[0].format("HH:mm");
  searchedColumn.value = dataIndex;
  // isFiltering.value = true;
  store.dispatch(camelCase(props.entity) + "/setIsFiltering", true);
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );

  filterGrids.value.push({
    field: dataIndex,
    operator: "equals",
    isFilterDefault: false,
    value: selectedKeys[0].set({ second: 0 }).format("HH:mm:ss"),
    // value1: selectedKeys[0].format("YYYY-MM-DD 23:59:59"),
  });
  reload();
};
const handleSearchDate = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  searchText.value = selectedKeys[0].format("DD-MM-YYYY");
  searchedColumn.value = dataIndex;
  // isFiltering.value = true;
  store.dispatch(camelCase(props.entity) + "/setIsFiltering", true);
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );

  filterGrids.value.push({
    field: dataIndex,
    operator: "equals",
    isFilterDefault: false,
    value: selectedKeys[0].format("YYYY-MM-DD"),
    // value1: selectedKeys[0].format("YYYY-MM-DD 23:59:59"),
  });
  reload();
};
const handleReset = (selectedKeys: any, clearFilters: any, dataIndex: any) => {
  clearFilters();
  searchText.value = "";
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );
  reload();
};
const onSelectChange = (selectedRowKeys: any) => {
  let dataRecord: any = [];
  props.dataTable.content.map((p: any) => {
    selectedRowKeys.map((q) => {
      if (p.id == q) {
        dataRecord.push(p);
      }
    });
  });
  setSelectedRows(selectedRowKeys);
  emit("showAdvance", selectedRows.value);
  emit("emitDataRecord", dataRecord);
};

const openRecord = (record: any) => {
  emit("openRecord", record);
};
const handleRightClick = (e: any, record: any) => {
  e.preventDefault();
  // this.$refs.menu.open(e);
  recordContext.value = record;
};

const showEdit = (record: any) => {
  emit("editRecord", record);
};
const showCopy = (record: any) => {
  emit("duplicateRecord", record);
};
const showCancel = (record: any) => {
  emit("cancelRecord", record);
};
const showConfirm = (record: any) => {
  emit("showConfirm", record);
};
watch(
  () => selectedRows.value,
  (val) => {
    if (val) {
      emit("showAdvance", selectedRows.value);
    }
  }
);
// const handleDownload = () => {
//   ImportHistoryService.downloadFile(id).then((response) => {
//     let fileName = "cau" + `_` + "cau" + `.xlsx`;
//     FileSaver.saveAs(new Blob(["cau"]), fileName);
//   });

//   // console.log(downloadFile);
// };
defineExpose({ reload, data, isFiltering, fetch });
</script>
<style lang="scss" scoped>
.container-spin {
  position: absolute;
  z-index: 999;
  background: #c9b8b824;
  height: calc(100% - 160px);
  width: calc(100% - 200px);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep() .ant-spin {
    top: 36%;
    position: absolute;
  }
}
:deep() {
  th.column-string,
  td.column-string {
    text-align: left !important;
  }
  th.column-date,
  td.column-date {
    text-align: center !important;
  }

  th.column-number,
  td.column-number {
    text-align: right !important;
  }
}

.text-bold {
  font-weight: 700 !important;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  bottom: 24px;
  right: 24px;
}
:deep() .ant-table-thead > tr > th,
:deep() .ant-table-tbody > tr > td {
  padding: 10px !important;
}
// :deep() thead.ant-table-thead > tr {
//   height: unset !important;
// }
.ant-table-wrapper {
  height: 76vh;
  :deep(.ant-table-scroll) {
    position: relative;
    right: 120px;
  }
  :deep(.ant-table-placeholder) {
    left: 120px;
  }
}
// :deep() .ant-table-body {
//   height: calc(100vh) !important;
// }
:deep() .ant-table-body .ant-table-placeholder {
  display: none;
}
.list-option {
  margin: 0;
  list-style: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  border-radius: 4px;
  width: 200px;
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    .sub-option {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
    &:hover {
      background: #fafafa;
    }
  }
}
li.option-item.border-bottom {
  border-bottom: 1px solid #b3b3b3;
}
</style>
