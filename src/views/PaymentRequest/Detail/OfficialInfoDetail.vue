<template>
  <a-row :gutter="[0, 16]">
    <a-col :span="24">
      <a-row :gutter="[24, 8]">
        <a-col :span="24">
          <a-col>
            <p
              style="
                font-size: 20px;
                color: #44818e;
                font-weight: bold;
                padding-top: 2%;
              "
            >
              Danh sách cán bộ đi công tác
            </p>
          </a-col>
          <a-col>
            <a-table
              :columns="officialColumn"
              :data-source="OfficleDetail"
              :pagination="false"
            >
              <template #gender="{ text }">
                <span>
                  {{ text ? renderGender(text) : null }}
                </span>
              </template>
            </a-table>
          </a-col>
        </a-col>
        <a-col :span="24">
          <a-col>
            <p
              style="
                font-size: 20px;
                color: #44818e;
                font-weight: bold;
                padding-top: 5%;
              "
            >
              Danh sách đối tác
            </p>
          </a-col>
          <a-col
            ><a-table
              :columns="partner"
              :dataSource="OfficlePartnerDetail"
              :pagination="false"
            >
            </a-table
          ></a-col>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import i18n from "@/lang";
import PlanUserService from "@/services/PlanUserService";
import { planUserType } from "@/common/enumUtility";
const OfficleDetail = ref<any[]>([]);
const OfficlePartnerDetail = ref<any[]>([]);

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

const form = ref<any>(props.form);

const handleDetail = (id: any) => {
  PlanUserService.get({ planId: id })
    .then((response) => {
      response.data.content.forEach((item: any) => {
        if (item.type) {
          if (item.type == planUserType.staff) {
            OfficleDetail.value.push(item);
          } else {
            OfficlePartnerDetail.value.push(item);
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const genderConstants = [
  { value: "O", label: "Chưa rõ" },
  { value: "M", label: "Nam" },
  { value: "G", label: "Nữ" },
];
const renderGender = (type) => {
  const item = genderConstants.find((i) => i.value == type);
  return item?.label;
};

handleDetail(props.form.id);

const officialColumn = [
  // {
  //   title: "STT",
  //   dataIndex: "index",
  //   width: "5%",
  //   render: (text, record, index) => index,
  // },
  {
    title: "Đơn vị ",
    dataIndex: "department.name",
    width: "10%",
  },
  {
    title: "Mã nhân viên",
    dataIndex: "user.position.code",
    width: "10%",
  },
  {
    title: "Họ tên",
    dataIndex: "user_name",
    width: "10%",
  },
  {
    title: "Chức danh",
    dataIndex: "user.position.name",
    width: "10%",
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: "10%",
    slots: { customRender: "gender" },
  },
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    width: "10%",
  },
  {
    title: "Tài khoản",
    dataIndex: "user.bank_account_number",
    width: "10%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "10%",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "10%",
  },
];

const partner = [
  // {
  //   title: "STT",
  //   dataIndex: "",
  //   width: "5%",
  //   render: (text, record, index) => index,
  // },
  {
    title: "Họ tên",
    dataIndex: "user_name",
    width: "15%",
  },
  {
    title: "Cơ quan đơn vị",
    dataIndex: "department.name",
    width: "15%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    width: "15%",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "15%",
  },
  {
    title: "Nhóm chức vụ",
    dataIndex: "position_group.name",
    width: "15%",
  },
];
</script>
