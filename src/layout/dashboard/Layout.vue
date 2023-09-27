<template>
  <a-layout style="height: 100vh; position: relative" prefixCls="ant-layout">
    <a-layout-sider
      width="220"
      v-model:collapsed="collapsed"
      collapsible
      :trigger="true"
      :style="{
        left: 0,
        position: fixed,
        overflow: auto,
      }"
      :collapsedWidth="80"
    >
      <div class="menu-content">
        <div class="logo">{{ $t("dashboard.logo_name") }}</div>
        <a-menu
          theme="light"
          mode="inline"
          v-model:selectedKeys="selectedKeys"
          :openKeys="openKeys"
          @openChange="onOpenChange"
        >
          <template v-for="menu in menus" :key="menu.key">
            <a-menu-item
              :key="menu.key"
              v-if="menu.children.length == 0"
              @click="() => router(menu)"
            >
              <a-icon type="menu.icon" />
              <!-- <template #icon>
                <component :is="menu.icon" />
              </template> -->
              <component :is="menu.icon" />
              <span>{{ menu.title }}</span>
            </a-menu-item>
            <a-sub-menu
              :key="menu.key"
              v-if="menu.children.length > 0"
              class="submenu"
            >
              <template #title>
                <span>
                  <component :is="menu.icon" />
                  <!-- <a-icon type="menu.icon" /> -->
                  <span>{{ menu.title }}</span>
                </span>
              </template>
              <a-menu-item
                :key="child.key"
                v-for="child in menu.children"
                @click="() => router(child)"
              >
                <template v-if="child.is_permission">
                  <a class="dashboard-link" v-permission:view="child.key"
                    ><span>{{ child.title }}</span></a
                  >
                </template>
                <template v-else>
                  <a class="dashboard-link"
                    ><span>{{ child.title }}</span></a
                  >
                </template>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </div>
    </a-layout-sider>
    <Layout
      prefixCls="ant-layout"
      :hasSider="true"
      :style="{ flexDirection: 'column', overflow: 'scroll' }"
    >
      <Header
        prefixCls="ant-layout-header"
        class="header"
        :style="{
          zIndex: 2,
          height: '60px',
          background: 'white',
          padding: 0,
        }"
      >
        <top-navbar
          ref="topNavbar"
          @receiveMessage="receiveMessage"
        ></top-navbar>
      </Header>
      <Layout
        prefixCls="ant-layout"
        :style="{ flexDirection: 'column', width: '100%' }"
        class="layout__content"
      >
        <Content
          prefixCls="ant-layout-content"
          :style="{ background: '#fff' }"
          class="content_layout"
        >
          <dashboard-content :routeLink="routeLink"></dashboard-content>
        </Content>
        <Footer
          prefixCls="ant-layout-footer"
          style="text-align: center; padding: 0px; position: relative"
        >
        </Footer>
      </Layout>
    </Layout>
  </a-layout>
</template>
<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Layout, Menu } from "ant-design-vue";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  SettingOutlined,
  MessageOutlined,
  UserOutlined,
  ProjectOutlined,
  AreaChartOutlined,
  ContactsOutlined,
  UserSwitchOutlined,
  IdcardOutlined,
  ControlOutlined,
  CodepenOutlined,
  BarcodeOutlined,
  CalendarOutlined,
  CalculatorOutlined,
  BorderRightOutlined,
} from "@ant-design/icons-vue";
import { mapState, mapActions } from "vuex";
import Dexie from "dexie";
import { db } from "@/database/db";
import constant from "@/constant";

const { Sider, Content, Footer, Header } = Layout;
const { SubMenu, Item } = Menu;

export default defineComponent({
  components: {
    TopNavbar,
    DashboardContent,
    Layout,
    Sider,
    Content,
    Footer,
    Header,
    Menu,
    SubMenu,
    Item,
    MessageOutlined,
    UserOutlined,
    ProjectOutlined,
    AreaChartOutlined,
    ContactsOutlined,
    UserSwitchOutlined,
    IdcardOutlined,
    ControlOutlined,
    CodepenOutlined,
    BarcodeOutlined,
    InboxOutlined,
  },
  setup() {
    const state = reactive({
      rootSubmenuKeys: [
        "overview",
        "calendar",
        "company",
        "management",
        "setting",
      ],
      openKeys: [],
      selectedKeys: [],
    });
    const onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(
        (key) => state.openKeys.indexOf(key) === -1
      );

      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys.slice(-1);
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };
    return { ...toRefs(state), onOpenChange };
  },
  data() {
    return {
      collapsed: false,
      visible: false,
      countMes: null,
      routeLink: "",
      changeCount: false,
      title: false,
      typeWorker: constant.typeWorker,
      menus: [
        // {
        //   key: "overview",
        //   icon: DashboardOutlined,
        //   title: "Tổng quan",
        //   path: "/dashboard",
        //   children: [],
        // },
        // {
        //   key: "calendar",
        //   icon: CalendarOutlined,
        //   title: "Lịch làm việc",
        //   path: "/calendar",
        //   children: [],
        // },
        {
          key: "plan",
          icon: DashboardOutlined,
          title: "Công tác",
          children: [
            {
              key: "plan",
              title: "Kế hoạch",
              path: "/plan",
            },
            {
              key: "plan-confirm",
              title: "Xác nhận",
              path: "/plan-confirm",
            },
          ],
        },
        {
          key: "transfer-request",
          icon: DashboardOutlined,
          title: "Chi tiền chuyển khoản",
          children: [
            {
              key: "summary-request",
              title: "Danh sách yêu cầu",
              path: "/summary-request",
            },
            {
              key: "transfer-request",
              title: "Bảng đề nghị",
              path: "/transfer-request",
            },
            // {
            //   key: "payment-request",
            //   title: "Đề nghị chi",
            //   path: "/payment-request",
            // },
          ],
        },
        // {
        //   key: "report",
        //   icon: AreaChartOutlined,
        //   title: "Báo cáo",
        //   children: [
        //     {
        //       key: "inventories",
        //       title: this.$t("inventories.name"),
        //       path: "/reports/inventories",
        //       is_permission: false,
        //     },
        //     {
        //       key: "analytic-customers",
        //       title: this.$t("analyticCustomers.name"),
        //       path: "/reports/analytic-customers",
        //       is_permission: false,
        //       is_develop: true,
        //     },
        //     {
        //       key: "finance",
        //       title: this.$t("finance.name"),
        //       path: "/reports/finance",
        //       is_permission: false,
        //       is_develop: true,
        //     },
        //     {
        //       key: "analytic-purchase-order",
        //       title: this.$t("analyticPurchaseOrder.name"),
        //       path: "/reports/analytic-purchase-order",
        //       is_permission: false,
        //       is_develop: true,
        //     },
        //   ],
        // },

        //sampleContent
        {
          key: "quota",
          icon: CalculatorOutlined,
          title: this.$t("quota.name"),
          path: "/quota",
          children: [],
        },
        {
          key: "setting",
          icon: SettingOutlined,
          title: this.$t("setting.name"),
          path: "/setting",
          children: [],
        },
      ],
      newMessage: {},
      warning: true,
    };
  },
  computed: mapState({
    item: (state) => {},
  }),
  watch: {
    showWarning: {
      handler(val) {
        if (window.location.pathname == "/main/dashboard") {
          this.warning = true;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    Object.entries(localStorage)
      .map((x) => x[0])
      .filter((x) => x.substring(0, 7) == "column-")
      .map((x) => localStorage.removeItem(x));
    Object.entries(localStorage)
      .map((x) => x[0])
      .filter((x) => x.substring(0, 15) == "default-column-")
      .map((x) => localStorage.removeItem(x));
  },
  methods: {
    router(route) {
      if (route.is_develop) {
        this.$message.warning(this.$t("common.is_develop"));
        return;
      }
      this.$router.push({ path: route.path });
    },
    hideDrawer() {
      this.visible = false;
    },
  },
});
</script>
<style lang="scss">
$primary-bg-color: #ed1b2f;
$primary-color: #e1e1e1;
$primary-select-color: rgba(200, 0, 0, 0.8);
.menu-content {
  height: 100%;
  position: fixed;
  border: 1px solid #f0f0f0;
  z-index: 99;
  .ant-menu-light {
    height: 100%;
    background: #ffff;
    color: #000;
    margin-top: 48px;
    // border-right: 1px solid black !important;
  }
}
.dashboard-link {
  text-decoration: none;
  color: #000;
}
.ant-layout-sider {
  background: #ffff !important;
}
.ant-layout-header.header {
  background: $primary-bg-color;
  height: 42px;
  padding: 0 18px;
}
.logo {
  // margin-top: 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: $primary-bg-color;
  background-color: #ffff;
  // color: #fffbf4;
  color: #ed1b2f;
  font-size: 24px;
  font-weight: bold;
  // padding: 0 8px;
}
ul.ant-menu.ant-menu-horizontal.ant-menu-root.ant-menu-light {
  display: flex;
  justify-content: flex-end;
}
.trigger {
  position: fixed;
  bottom: 0;
  z-index: 1;
  height: 48px;
  color: #fff;
  line-height: 48px !important;
  text-align: center !important;
  background: #002140;
  cursor: pointer;
  transition: all 0.2s;
}

.ant-menu-dark .ant-menu-submenu-selected {
  background-color: #fff !important;
}
.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  background: #fff !important;
  width: 100% !important;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background: #ffff !important;
}
.ant-menu-item > a {
  color: #000 !important;
}
.ant-menu-item-selected > a,
.ant-menu-item-selected > a:hover {
  color: $primary-bg-color !important;
}
</style>
<style lang="scss">
.dialog-class {
  .ant-modal,
  .ant-modal-content {
    height: 100vh;
    width: 100vw;
    margin: 0;
    top: 0;
  }
  .ant-modal-body {
    height: calc(100vh - 110px);
    padding: 16px 12px 0;
    background: #f4f6f8;
  }
  .ant-modal-header {
    border-bottom: 0;
    background-color: #ed1b2f !important;
    .ant-modal-title {
      font-weight: bold !important;
      color: #fff !important;
    }
  }
}
</style>
<style scoped lang="scss">
//sửa menu left
$white: #ffffff;
$background-submenu: #ed1b2f;
$background-menu: #ed1b2f;
$submenu-active: #faad14;

:deep(.ant-menu-item:hover),
:deep(.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected),
:deep(.ant-menu-submenu-title:hover),
:deep(.ant-menu-submenu > .ant-menu) {
  background-color: #ffff;
  color: #ed1b2f;
}
:deep(.ant-menu-item > a) {
  color: #cad6e2;
}

// css tạm thời hiển thị bảng
// .ant-layout.ant-layout-has-sider > .ant-layout {
//   width: 100%;
// }
// :deep(.ant-layout) {
//   width: 100%;
// }
// :deep(.ant-layout-has-sider > .ant-layout) {
//   width: 100%;
// }
// end tạm thời
.ant-menu-inline {
  :deep(.ant-menu-item-selected) {
    width: 100% !important;
  }
  :deep(.ant-menu-item-selected:hover) {
    width: 100% !important;
  }
}
:deep(.ant-menu-item-selected > a),
:deep(.ant-menu-item-selected > a:hover),
:deep(a.dashboard-link:hover) {
  color: #ed1b2f !important;
}
:deep(.ant-menu-submenu-selected) {
  color: $white;
  background-color: $background-submenu;
}
:deep(.ant-menu-inline),
:deep(.ant-menu-inline .ant-menu-item::after) {
  border-right: none;
  transform: none;
  width: 100%;
}
:deep(.ant-menu-inline .ant-menu-submenu-title) {
  margin: 0;
  width: 100%;
}
:deep(
    .ant-menu-submenu-inline
      > .ant-menu-submenu-title
      .ant-menu-submenu-arrow::after
  ),
:deep(
    .ant-menu-submenu-inline
      > .ant-menu-submenu-title
      .ant-menu-submenu-arrow::before
  ) {
  background-image: linear-gradient(to right, $white, $white);
}
:deep(.ant-menu-submenu-arrow:hover),
:deep(.ant-menu-vertical),
:deep(.ant-menu-submenu-selected) {
  color: $white !important;
}

:deep(.ant-menu-vertical) {
  border-right: none;
}

:deep(.ant-layout-sider-trigger) {
  background: $white;
  left: 0;
  position: absolute !important;
  height: 0px;
}
.submenu {
  .ant-menu-inline {
    .ant-menu-item {
      width: 100%;
    }
  }
}
.ant-menu-submenu-placement-rightTop {
  //hover submenu
  .dashboard-link:hover {
    color: #ed1b2f;
    .ant-menu-item {
      color: $white !important;
    }
  }
}
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active {
  //hover submenu change color parent submenu
  color: $white;
}
</style>
