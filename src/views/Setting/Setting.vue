<template>
  <div class="container">
    <div class="ant-page-header ant-page-header-ghost">
      <div class="ant-page-header-heading">
        <span style="font-size: 20px; font-weight: 600">{{
          $t("setting.attribute.configuration")
        }}</span>

        <!-- <a-button :size="size"
          ><QuestionCircleOutlined />{{
            $t("setting.attribute.support")
          }}</a-button
        > -->
      </div>
    </div>
    <br />
    <!-- <div class="search-tab">
      <a-input-search
        v-model:value="value"
        :placeholder="$t(`setting.event.search`)"
        style="width: 64%"
        @search="onSearch"
      />
    </div> -->
    <div
      class="category-wrap"
      v-for="(category, index) in categories"
      :key="index"
    >
      <p class="list-row_header">
        <strong>{{
          $t(`setting.categories.${category.title_type}.title`)
        }}</strong>
      </p>
      <a-row>
        <a-col
          :span="6"
          v-for="(item, index) in category.items"
          :key="index"
          class="list-row__col"
        >
          <a-row>
            <a-col :span="6" class="list-row__col-icon">
              <component :is="item.icon"></component>
            </a-col>
            <a-col :span="18">
              <router-link
                :to="item.path"
                v-permission:view="item.path.replaceAll('-', '_')"
                ><div class="list-row__coll-title">
                  {{
                    $t(
                      `setting.categories.${category.title_type}.${item.type}.title`
                    )
                  }}
                </div>
              </router-link>
              <div class="list-row__coll-subtitle">
                {{
                  $t(
                    `setting.categories.${category.title_type}.${item.type}.subTitle`
                  )
                }}
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  QuestionCircleOutlined,
  BranchesOutlined,
  AreaChartOutlined,
  AimOutlined,
  TeamOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  PrinterOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  HomeOutlined,
  InsertRowBelowOutlined,
  LayoutOutlined,
  LoginOutlined,
  DingdingOutlined,
  CarOutlined,
  ApartmentOutlined,
  GroupOutlined,
  UserOutlined,
  ContainerOutlined,
  SolutionOutlined,
  ExpandOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
interface Item {
  icon?: any;
  type: string;
  path: string;
}
interface Category {
  title_type: string;
  items: Item[];
}
const categories = ref<Category[]>([
  {
    title_type: "company_info_title",
    items: [
      {
        icon: ClusterOutlined,
        type: "role",
        path: "role",
      },
      {
        icon: TeamOutlined,
        type: "staff_manager",
        path: "user",
      },
      {
        icon: InsertRowBelowOutlined,
        type: "department",
        path: "department",
      },
    ],
  },
  {
    title_type: "location_info_title",
    items: [
      {
        icon: InsertRowBelowOutlined,
        type: "country",
        path: "country",
      },
      {
        icon: AimOutlined,
        type: "province",
        path: "province",
      },
      {
        icon: FileDoneOutlined,
        type: "district",
        path: "district",
      },
      {
        icon: PrinterOutlined,
        type: "ward",
        path: "ward",
      },
      {
        icon: AreaChartOutlined,
        type: "area",
        path: "area",
      },
      {
        icon: DingdingOutlined,
        type: "airport",
        path: "airport",
      },
      {
        icon: LayoutOutlined,
        type: "hotel",
        path: "hotel",
      },
    ],
  },
  {
    title_type: "menu",
    items: [
      {
        icon: CarOutlined,
        type: "vehicle",
        path: "vehicle",
      },
      {
        icon: GroupOutlined,
        type: "vehicle_group",
        path: "vehicle-group",
      },
      {
        icon: UserOutlined,
        type: "service",
        path: "service",
      },
      {
        icon: TeamOutlined,
        type: "service_group",
        path: "service-group",
      },

      {
        icon: ContainerOutlined,
        type: "position",
        path: "position",
      },
      {
        icon: SolutionOutlined,
        type: "position_group",
        path: "position-group",
      },
      {
        icon: PrinterOutlined,
        type: "policy",
        path: "policy",
      },
      {
        icon: InsertRowBelowOutlined,
        type: "policy_limit",
        path: "policy-limit",
      },
      {
        icon: ExpandOutlined,
        type: "purpose",
        path: "purpose",
      },
      {
        icon: ApartmentOutlined,
        type: "distance_quota",
        path: "distance-quota",
      },
    ],
  },
]);
</script>
<style scoped>
.container {
  background: rgb(224, 224, 224);
  height: 100% !important;
}
.ant-input-search:hover {
  border-color: green;
}
.ant-input-affix-wrapper-focused {
  border-color: green;
  box-shadow: 0 0 0 2px #3cb371;
}
.ant-page-header-heading .ant-btn {
  background: green;
  border-color: green;
  color: #fff;
}
.ant-page-header-heading {
  display: flex;
  justify-content: space-between;
}
/* .search-tab {
  text-align: center;
  margin-bottom: 24px;
} */
.img-info_content {
  display: flex;
  flex-wrap: wrap;
}
.color {
  color: rgb(0, 136, 90);
}
.category-wrap {
  background: rgb(255, 255, 255);
  padding: 16px;
  margin: 24px;
  border: 1px solid #f0f0f0;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.list-row_header {
  font-size: 16px;
}
.list-row__col {
  /* display: flex; */
  padding-bottom: 24px;
}
.list-row__col-icon {
  padding: 8px 8px;
  text-align: center;
  color: #ed1b2f;
}
.list-row__col-icon span {
  font-size: 32px;
}
.list-row__coll-title {
  font-size: 16px;
  font-weight: 700;
  color: black;
}
.list-row__coll-subtitle {
  font-weight: 500;
}
</style>
