<template>
  <a-button
    @click="showModal"
    class="export"
    v-permission:approve="entity.replaceAll('-', '_')"
  >
    <check-outlined />
    {{ title }}
  </a-button>
  <a-modal
    v-model:visible="visible"
    closable
    centered
    width="80%"
    :title="$t('common.approved')"
    @ok="handleOk"
    :ok-text="$t('common.approved')"
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        width: '120px',
      },
    }"
    :confirm-loading="confirmLoading"
    :cancel-text="$t('common.back')"
  >
    <a-table
      :scroll="{ x: 1500, y: 700 }"
      :columns="cols"
      :row-key="(record) => record.id"
      :data-source="dataTable"
    >
      <template #date="{ text }">{{
        text == null ? "--" : formatDate(text)
      }}</template>
      <template #datetime="{ text }">{{
        text == null ? "--" : formatDateTimeVN(text)
      }}</template>
      <template #time="{ text }">{{ formatTime(text) }}</template>
      <template #number="{ text, record, column, dataIndex }">
        <template v-if="column.isEdit == true">
          <a-input-number
            :value="text"
            style="width: 120px"
            @change="handleChangeQuantity($event, record, column, dataIndex)"
            :placeholder="t(`${props.entity}.attribute.${column.dataIndex}`)"
            :min="0"
          />
        </template>
        <template v-else>
          <span>{{ column.integer ? text : formatNumber(text) }}</span>
        </template>
      </template>
      <template #text="{ text, record, column, dataIndex }">
        <template v-if="column.isEdit == true">
          <a-input
            :value="text"
            @input="handleChangeInput($event, record, column, dataIndex)"
            :placeholder="t(`${props.entity}.attribute.${column.dataIndex}`)"
          />
        </template>
        <template v-else>
          <span>{{ text }}</span>
        </template>
      </template>
      <template #list="{ text, column, record }">
        <template v-if="column.isEdit == true">
          <a-select
            :value="text"
            style="width: 120px"
            @change="handleChange($event, text, column, record)"
          >
            <template v-for="(item, index) in column?.dataSource" :key="index">
              <a-select-option :value="item.value">{{
                item.text
              }}</a-select-option>
            </template>
          </a-select>
        </template>
        <template v-else>
          <a-tooltip :title="renderList(text, column)" placement="topLeft">
            <a-tag :color="renderList(text, column, 'color')">
              {{ renderList(text, column) }}
            </a-tag>
          </a-tooltip>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>
<script setup lang="ts">
import { CheckOutlined } from "@ant-design/icons-vue";
import { mapState, mapActions } from "vuex";
import camelCase from "lodash/camelCase";
import FileSaver from "file-saver";
import { ref, computed, watch, reactive } from "vue";
import { useStore } from "vuex";
import i18n from "@/lang";
import { message } from "ant-design-vue";
import { useQueryClient } from "vue-query";
import { formatDate, getImage, formatNumber, formatTime } from "@/utility";
import { formatDateTimeVN } from "@/mixins.js";
const { t } = i18n.global;
const store = useStore();
const visible = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

interface Props {
  entity: string;
  selected: any;
  useSaveMutation: Function;
  title: string;
  data: any;
  columns: any;
  validApprove: any;
}

const props = withDefaults(defineProps<Props>(), {
  entity: "",
  selected: [],
  useSaveMutation: () => null,
  title: "",
  data: [],
  columns: [],
  validApprove: [],
});

const cols = computed(() => {
  let result = JSON.parse(JSON.stringify(props.columns));
  result = result.map((p) => {
    return {
      ...p,
      slots: p.slots || {
        filterDropdown: "filterDropdown",
        customRender: "text",
      },
    };
  });
  return result;
});

const useSaveFormData = props.useSaveMutation();
const value = ref({});

const renderList = (text: any, column: any, key = "text") => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item ? item[key] : (key = "color" ? "blue" : "");
};

const editableData = reactive({});
const dataTable = ref<any>([]);

const handleChange = ($event, text, column, record) => {
  record[column.dataIndex] = $event;
  if (column.setColumnDif == true && column.columnSet != undefined) {
    let recordName = "";
    column.dataSource.forEach((d: any) => {
      if (d.value == $event) {
        recordName = d.data;
      }
    });
    record[column.columnSet] = record[recordName];
  }
};
const handleChangeInput = ($event, record, column, dataIndex) => {
  record[column.dataIndex] = $event.target.value;
};

const handleChangeQuantity = ($event, record, column, dataIndex) => {
  record[column.dataIndex] = $event;
};

const columnConfigs = computed(
  () => store.state[camelCase(props.entity)].columnConfigs
);

const setSelectedRows = async (data: any) => {
  await store.commit(`${camelCase(props.entity)}/SET_SELECTED_ROW`, data);
};
const showModal = () => {
  let items: any = [];
  props.data.forEach((element) => {
    props.selected.forEach((item) => {
      if (item == element.id) {
        element.mode = "edit";
        items.push(element);
      }
    });
  });
  if (props.validApprove.length !== 0) {
    props.validApprove.forEach((a: any) => {
      dataTable.value = items.filter((p: any) => p[a.key] === a.value);
    });
  } else {
    dataTable.value = items;
  }
  visible.value = true;
};
const handleOk = async () => {
  confirmLoading.value = true;
  await dataTable.value.forEach((element) => {
    updateApproved(element);
  });
};
const service = computed(() => store.state[camelCase(props.entity)].service);
const queryClient = useQueryClient();

const updateApproved = (item) => {
  service.value
    .approve(item)
    .then((response) => {
      confirmLoading.value = false;
      if (response.status !== 201 && response.status !== 200) {
        message.error(response.statusText);
        return false;
      } else {
        visible.value = false;

        message.success(
          t("common.save_success", {
            entity: t(`${camelCase(props.entity)}.name`),
          })
        );
        queryClient.invalidateQueries(props.entity);
        setSelectedRows([]);
      }
    })
    .catch((error) => {
      if (Array.isArray(error.response.data.fieldErrors)) {
        message.error(
          error.response.data.fieldErrors.map((p: any) => p.message).join("\n")
        );
      } else {
        message.error(error.response.data.message);
      }
      confirmLoading.value = false;
    });
};
</script>
<style lang="scss" scoped>
.export {
  color: white;
  background: rgb(237, 27, 47);
}
</style>
