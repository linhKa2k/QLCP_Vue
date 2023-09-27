<template>
  <a-button :type="typeButton" @click="showModal" v-permission:import="entity">
    <CloudUploadOutlined />
    {{ $t("common.excel.import") }}
  </a-button>
  <a-modal
    v-model:visible="visible"
    width="1000px"
    :title="$t('common.import.input_excel')"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button
        v-if="current !== 2 && current !== 1"
        type="default"
        key="back"
        @click="handleCancel"
        >{{ $t("common.close") }}</a-button
      >
      <a-button
        type="default"
        v-if="current == 1"
        key="prev"
        @click="handlePrev"
        >{{ $t("common.back") }}</a-button
      >
      <a-button
        v-if="current == 2"
        key="complete"
        type="primary"
        @click="handleComplete"
        >{{ $t("common.complete") }}</a-button
      >
      <a-button
        v-if="current == 0"
        type="primary"
        :disabled="fileList.length === 0"
        :loading="importLoading"
        style="margin-top: 16px"
        @click="handleUpload"
      >
        {{ $t("common.next") }}<ArrowRightOutlined />
      </a-button>
      <a-button
        type="primary"
        v-if="current == 1"
        :loading="confirmLoading"
        :disabled="validImportTotal === 0"
        @click="handleImport"
      >
        {{ $t("common.excel.import") }}<ArrowRightOutlined />
      </a-button>
    </template>
    <a-row>
      <a-col :span="24">
        <a-steps v-model:current="current">
          <a-step v-for="step in steps" :key="step.index">
            <template #icon>
              <div class="icon">
                <component :is="step.icon" />
              </div>
              <p>{{ step.description }}</p>
            </template>
          </a-step>
        </a-steps>
      </a-col>
    </a-row>
    <div v-if="current == 0">
      <h3></h3>
      <a-radio-group v-model:value="uploadType">
        <a-radio :value="1">{{ $t("common.import.create_file") }}</a-radio>
        <a-radio :value="2">{{ $t("common.import.update_file") }}</a-radio>
      </a-radio-group>
      <a-row>
        <a-col :span="24">
          <div class="upload-content">
            <a-upload-dragger
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <p class="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p class="ant-upload-text">
                <a href="#">{{ $t("common.import.select_file") }}</a>
                {{ $t("common.import.or_dragger") }}
              </p>
            </a-upload-dragger>
          </div>
        </a-col>
      </a-row>
      <p>
        {{ $t("common.import.download_excel") }}
        <span
          ><a href="#" @click="handleExportTemplateFile">{{
            $t("common.import.here")
          }}</a></span
        >
      </p>
    </div>
    <div v-if="current == 1">
      <p class="overview">
        <a-space :size="16">
          <span
            >{{ $t("common.import.total_rows") }}:
            <strong> {{ importTotal }}</strong></span
          >
          <span
            >{{ $t("common.import.valid_total_rows") }}:
            <strong style="color: #ed1b2f">
              {{ validImportTotal }}</strong
            ></span
          >
          <span
            >{{ $t("common.import.invalid_total_rows") }}:
            <strong style="color: red">{{ invalidImportTotal }}</strong></span
          >
        </a-space>
      </p>
      <div class="excel_table">
        <a-row>
          <div class="table_title">
            <p class="error_title">{{ $t("common.import.row_index") }}</p>
            <p v-for="column in importObject.header" :key="column.index">
              {{ column }}
            </p>
          </div>
          <div
            class="table_content"
            v-for="(item, index) in importObject.data"
            :key="index"
          >
            <div class="column_detail error_column">
              <div :class="[!item.is_valid ? 'row_error' : '']">
                {{ item.row }}<br />
                {{ item.error_message }}
              </div>
            </div>
            <template
              v-for="(column, key) in importObject.header"
              :key="column.index"
            >
              <div :class="wrapClass(column.data_type) + ' column_detail'">
                {{ item[key] }}
              </div>
            </template>
          </div>
        </a-row>
      </div>
    </div>
    <div v-if="current == 2">
      <div class="complete">
        <CheckCircleFilled />
        <p>{{ $t("common.import.upload_done") }}</p>
        <p>
          {{ $t("common.import.import_done") }} {{ validImportTotal }}/{{
            importTotal
          }}
          {{ $t("common.record") }}
        </p>
      </div>
    </div>
  </a-modal>
</template>
<script>
import {
  CloudUploadOutlined,
  CloudSyncOutlined,
  InboxOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined,
  EditOutlined,
  CheckOutlined,
  CheckCircleFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import camelCase from "lodash/camelCase";
import { mapState, mapGetters, mapActions } from "vuex";
import i18n from "@/lang";
import FileSaver from "file-saver";

const { t } = i18n.global;

export default defineComponent({
  setup(props, context) {
    const fileList = ref([]);
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = (file) => {
      fileList.value = [...fileList.value, file].slice(-1);
      return false;
    };
    const confirmLoading = ref(false);

    const uploadType = ref(1);
    const visible = ref(false);
    const current = ref(0);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e) => {
      console.log(e);
      visible.value = false;
    };
    const handlePrev = () => {
      current.value--;
    };
    const handleComplete = () => {
      visible.value = false;
      current.value = 0;
      context.emit("uploadCompleted");
      fileList.value = [];
    };
    const handleCancel = () => {
      visible.value = false;
      current.value = 0;
      fileList.value = [];
    };
    const steps = [
      {
        icon: "CloudUploadOutlined",
        description: t("common.import.upload_file"),
      },
      {
        icon: "EditOutlined",
        description: t("common.import.check_data"),
      },
      {
        icon: "CheckOutlined",
        description: t("common.import.done"),
      },
    ];
    return {
      steps,
      confirmLoading,
      current,
      visible,
      showModal,
      handleOk,
      handlePrev,
      handleCancel,
      handleComplete,
      handleRemove,
      beforeUpload,
      uploadType,
      fileList,
      ignored_columns: ["row_index", "failures", "importable"],
    };
  },
  components: {
    // CloudUploadOutlined,
    InboxOutlined,
    QuestionCircleOutlined,
    ArrowRightOutlined,
    EditOutlined,
    CheckOutlined,
    CheckCircleFilled,
    CloudUploadOutlined,
    CloudSyncOutlined,
  },
  props: {
    entity: String,
    typeButton: {
      type: String,
      default: "default",
    },
  },
  emits: ["uploadCompleted"],
  computed: {
    ...mapState({
      importLoading(state, getters) {
        return state[camelCase(this.entity)].importLoading;
      },
      importObject(state, getters) {
        return state[camelCase(this.entity)].importObject;
      },
    }),
    importTotal() {
      return this.$store.getters[`${camelCase(this.entity)}/importTotal`];
    },
    validImportTotal() {
      return this.$store.getters[`${camelCase(this.entity)}/validImportTotal`];
    },
    invalidImportTotal() {
      return this.$store.getters[
        `${camelCase(this.entity)}/invalidImportTotal`
      ];
    },
    wrapClass() {
      return (data_type) => {
        let wrapClass = "text-left";
        switch (data_type) {
          case "number":
            wrapClass = "text-right";
            break;
          case "date":
          case "datetime":
          case "time":
            wrapClass = "text-center";
            break;
          default:
            wrapClass = "text-left";
            break;
        }
        return wrapClass;
      };
    },
  },
  methods: {
    ...mapActions({
      validateImport(dispatch, payload) {
        return dispatch(camelCase(this.entity) + "/validateImport", payload);
      },
      import(dispatch, payload) {
        return dispatch(camelCase(this.entity) + "/import", payload);
      },
      export(dispatch, payload) {
        dispatch(camelCase(this.entity) + "/export", payload).then(
          (response) => {
            let fileName = `Danh_sach_${payload.title}.xlsx`;
            FileSaver.saveAs(new Blob([response.data]), fileName);
          }
        );
      },
      exportSample(dispatch, payload) {
        dispatch(camelCase(this.entity) + "/exportSample", payload).then(
          (response) => {
            let title = this.$t(
              `${_.camelCase(this.entity)}.name`
            ).toLocaleLowerCase();
            let fileName = `Danh_sach_mau_${title}.xlsx`;
            FileSaver.saveAs(new Blob([response.data]), fileName);
          }
        );
      },
    }),
    handleUpload() {
      const payload = {
        file: this.fileList[0],
        type: this.uploadType,
      };
      this.validateImport(payload)
        .then((response) => {
          this.current++;
          // this.fileList = [];
        })
        .catch(() => {
          message.error(this.$t("common.import.upload_error"));
        });
    },
    handleImport() {
      this.confirmLoading = true;
      const data = this.importObject.data.filter((p) => p.is_valid);
      const payload = {
        file_id: this.importObject.file_id,
        header: this.importObject.header,
        type: this.uploadType,
        is_success: true,
        total: this.validImportTotal,
        data,
      };
      console.log(payload);
      this.import(payload)
        .then((response) => {
          if (response.status == 200) {
            this.current++;
            this.confirmLoading = false;
          } else {
            this.confirmLoading = false;
            message.error(response.statusText);
          }
        })
        .catch(() => {
          this.confirmLoading = false;
          message.error(this.$t("common.import.import_error"));
        });
    },
    /**
     * Tải về file mẫu
     */
    handleExportTemplateFile() {
      // let payload = {
      //   type: 1,
      //   title: this.$t(camelCase(this.entity) + ".name"),
      //   responseType: "blob",
      // };
      this.exportSample();
    },
  },
});
</script>
<style lang="scss" scoped>
$green: #ed1b2f;
.ant-steps {
  .ant-steps-item {
    margin: 0;
    padding: 8px;

    :deep(.ant-steps-item-icon) {
      position: relative;
      bottom: 8px;
      p {
        font-size: small;
      }
      .icon {
        border: 1px solid;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin: auto;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
.ant-steps-navigation .ant-steps-item::before {
  background: #ed1b2f !important;
}
.ant-steps-item-process {
  :deep(.ant-steps-item-icon) {
    p {
      color: #ed1b2f !important;
    }
  }
  .icon {
    background: #ed1b2f;
    color: white;
  }
  ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color: #ed1b2f !important;
  }
}

// .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
//     color: #ed1b2f !important;
// }
.ant-steps-item-finish {
  :deep(.ant-steps-item-icon) {
    p {
      color: #ed1b2f !important;
    }
  }
  .icon {
    background: $green;
    color: white;
  }
}

.ant-steps-item-finish {
  :deep(.ant-steps-item-title::after) {
    background-color: #ed1b2f !important;
    color: $green;
  }
}
.ant-radio-wrapper {
  :deep(.ant-radio-inner:hover) {
    border-color: #ed1b2f;
  }
}
.ant-radio-wrapper-checked {
  :deep(.ant-radio-inner) {
    border-color: #ed1b2f;
  }
  :deep(.ant-radio-inner::after) {
    background-color: #ed1b2f;
  }
}
.upload-content {
  margin: 24px 0px;
  :deep(.ant-upload-drag:hover) {
    border-color: #ed1b2f;
  }
  .anticon {
    color: #ed1b2f !important;
  }
}
.excel_table {
  overflow: auto;
  height: 40vh;
  border: 1px solid #f0f0f0;
  .table_title {
    display: flex;
    position: sticky;
    top: 0px;
    background: #fafafa;
    z-index: 1;
    p {
      width: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0px;
      padding: 24px 0px;
      font-size: 16px;
      font-weight: 600;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  .table_content {
    display: flex;
    .column_detail {
      width: 240px;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
      padding: 8px;
      .row_error {
        color: red;
      }
    }
  }
  .table_content:hover {
    background: #b0e0e6;
  }
  .error_column {
    position: sticky;
    left: 0px;
    background: white;
  }
  .error_title {
    position: sticky;
    left: 0px;
    background: #fafafa;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
}
a {
  color: #ed1b2f;
}
.ant-btn-primary {
  color: #fff;
  background-color: $green;
  border-color: $green;
}
.ant-btn-primary[disabled] {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  text-shadow: none;
  box-shadow: none;
}
.ant-btn-default:hover {
  border-color: $green;
  color: $green;
}
// .ant-btn-default {
//   color: rgb(0, 136, 90);
//   border-color: rgb(0, 136, 90);
// }

.ant-btn-default {
  color: #ed1b2f;
  border-color: #ed1b2f;
}
.ant-btn-default:hover {
  border-color: $green;
  color: $green;
}
.complete {
  margin: 24px 0px;
  color: $green;
  text-align: center;
  .anticon {
    font-size: 40px;
  }
}
.ant-btn-text {
  color: #ed1b2f;
  border-color: white;
  padding: 0;
  .anticon {
    font-size: 20px;
  }
}
</style>
