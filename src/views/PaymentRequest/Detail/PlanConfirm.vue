<template>
  <a-col :span="24">
    <a-row type="flex" :gutter="[16, 0]">
      <a-col :span="5">
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
                      @click="handleSelectRoute(item)"
                      class="item_chose"
                    >
                      <a-row>
                        <a-col :span="24"
                          ><h3>
                            {{
                              item.from_department && item.to_department
                                ? item.from_department +
                                  " - " +
                                  item.to_department
                                : "--"
                            }}
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
                            item.from_department ? item.from_department : "--"
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
                            item.to_department ? item.to_department : "--"
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
                            item.start_date ? item.start_date : "--"
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
                            item.end_date ? item.end_date : "--"
                          }}</strong></a-col
                        >
                      </a-row>
                      <a-row>
                        <a-col :span="7"
                          ><span>{{ "Tình trạng" }}</span></a-col
                        >
                        <a-col :span="1">:</a-col>
                        <a-col :span="16"
                          ><strong>{{
                            item.status == planRouteIsConfirm.confirm
                              ? "Đã xác nhận"
                              : "Chưa xác nhận"
                          }}</strong></a-col
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
      <a-col :span="19">
        <a-tabs v-model:activeKey="activeKey" @change="null" size="small">
          <a-tab-pane key="1" tab="Danh sách nhân viên">
            <a-table
              :columns="staffColumn"
              :data-source="staffData"
              :scroll="{ y: 370 }"
              bordered
              :row-key="(record) => record.id"
              :row-selection="{
                selectedRowKeys: selectedRows,
                onChange: onSelectChange,
              }"
              class="my-table"
            >
              <template #status="{ text }">
                <span>
                  {{
                    text == paymentRequestStatus.CHUA_XAC_NHAN
                      ? "Chưa xác nhận"
                      : "Đã xác nhận"
                  }}
                </span>
              </template></a-table
            >
          </a-tab-pane>
          <a-tab-pane key="2" tab="Danh sách xác nhận công tác">
            <a-table
              :columns="staffColumn"
              :data-source="staffConfirmData"
              :scroll="{ y: 370 }"
              bordered
            ></a-table>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-col>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import i18n from "@/lang";
import { DownloadOutlined } from "@ant-design/icons-vue";
import {
  paymentRequestStatus,
  planConfirmStatus,
  planRouteIsConfirm,
} from "@/common/enumUtility";
const { t } = i18n.global;
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

const routeRecordData = ref<any[]>([]);
const activeKey = ref<string>("1");

const staffData = ref<any[]>([]);
const staffConfirmData = ref<any[]>([]);

const selectedRows = ref<any[]>([]); // Mảng chứa các khóa của các hàng đã được chọn

const handleSelectRoute = (item: any) => {
  console.log("handleSelectRoute");
};

const onSelectChange = (selectedRowKeys) => {
  console.log(`Selected rows with keys ${selectedRowKeys}`);
  selectedRows.value = selectedRowKeys;
  // Thực hiện các xử lý khác tương ứng với các hàng được chọn
};

const staffColumn = [
  {
    title: "STT",
    dataIndex: "id",
    width: "5%",
  },
  {
    title: "Tên thành viên",
    dataIndex: "name",
    width: "10%",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "10%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "10%",
  },
  {
    title: "Ngày bắt đầu thực tế",
    dataIndex: "start_date",
    width: "10%",
  },
  {
    title: "Ngày kết thúc thực tế",
    dataIndex: "end_date",
    width: "10%",
  },
  {
    title: "Có đi công tác ?",
    dataIndex: "goStatus",
    width: "10%",
  },
  {
    title: "Có kết thúc công tác",
    dataIndex: "doneStatus",
    width: "10%",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: "10%",
    slots: { customRender: "status" },
    // render: (record)=>
  },
];
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.form);
const fields = ref<any>(props.fields);
const OfficlePartnerDetail = ref<any[]>([]);
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

.editable-row-operations a {
  margin-right: 8px;
}
</style>
