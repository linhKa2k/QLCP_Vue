import i18n from "@/lang";
const { t } = i18n.global;
const User = [
  {
    width: 150,
    dataIndex: "code",
    isCodeIndex: true,
    fixed: "left",
  },

  {
    width: 150,
    dataIndex: "username",
  },
  // {
  //   width: 150,
  //   dataIndex: "avatar_id",
  //   dataType: "image",
  //   disableSearch: true,
  // },
  {
    width: 300,
    dataIndex: "full_name",
  },
  {
    width: 380,
    dataIndex: "departments",
    field: "department",
    ellipsis: true,
    dataType: "multiple-list",
  },
  {
    width: 300,
    dataIndex: "phone_number",
    dataType: "phone",
  },
  {
    width: 300,
    dataIndex: "email",
    dataType: "email",
    ellipsis: true,
  },
  {
    width: 300,
    dataIndex: "position",
    ellipsis: true,
    dataType: "object",
  },
  // {
  //   width: 200,
  //   dataIndex: "activated",
  //   dataType: "bool",
  //   dataSource: [
  //     {
  //       value: 1,
  //       text: t("common.active"),
  //     },
  //     {
  //       value: 0,
  //       text: t("common.inactive"),
  //     },
  //   ],
  // },
];
export default User;
