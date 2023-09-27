<template>
  <a-modal
    v-model:visible="showModalVofficeLogin"
    title="Thông tin đăng nhập"
    @ok="vofficeLogin"
    @cancel="cancelForm"
    :okText="'Đăng nhập'"
    :cancelText="'Đóng'"
    :ok-button-props="{
      style: {
        background: '#ed1b2f',
        borderColor: '#ed1b2f',
        marginRight: '8px',
        color: '#fff',
      },
      loading: okLoading,
    }"
    :cancel-button-props="{}"
  >
    <template #footer>
      <a-button key="back" @click="cancelForm">{{ "Đóng" }}</a-button>
      <a-button
        key="submit"
        :style="{
          background: '#ed1b2f',
          borderColor: '#ed1b2f',
          color: '#fff',
        }"
        :loading="okLoading"
        @click="vofficeLogin"
        >{{ "Đăng nhập" }}</a-button
      >
    </template>
    <div>
      <a-form
        ref="vofficeLoginRef"
        :model="state"
        :rules="rulesVofficeLogin"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="Tên đăng nhập Voffice" name="username">
          <a-input v-model:value="state.username" size="large" />
        </a-form-item>
        <a-form-item label="Mật khẩu Voffice" name="password">
          <a-input-password v-model:value="state.password" size="large" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <!-- <a-button
              @click="vofficeLogin"
              style="background-color: #137adb; color: white"
              >Đăng nhập</a-button
            > -->
          <!-- <a-button
              @click="vofficeLogin"
              style="background-color: #137adb; color: white"
              >Đăng nhập</a-button
            > -->
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { vOfficeLogin } from "@/hooks/voffice";
import { message, Modal } from "ant-design-vue";

interface Props {
  form: any;
  width: string;
  rules: any;
  fields: any;
  show: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  form: {},
  width: "",
  rules: {},
  fields: {},
  show: false,
});

const showModalVofficeLogin = computed(() => props.show);
const labelCol = ref<{ span: number }>({ span: 24 });
const wrapperCol = ref<{ span: number }>({ span: 24 });
const userMutationVOfficeLogin = vOfficeLogin();
const okLoading = ref<boolean>(false);

const emit = defineEmits<{
  (e: "loginSucces", data?: any): void;
  (e: "hideModal"): void;
}>();

const state = reactive({
  valueSearch: "",
  username: "",
  password: "",
});
const vofficeLoginRef = ref();

const rulesVofficeLogin = ref<any>({
  username: {
    required: true,
    message: "Vui lòng nhập tên đăng nhập",
  },
  password: [
    {
      required: true,
      message: "Vui lòng nhập mật khẩu",
    },
  ],
});

const cancelForm = () => {
  emit("hideModal");
};
const vofficeLogin = () => {
  okLoading.value = true;
  vofficeLoginRef.value
    .validate()
    .then(async () => {
      userMutationVOfficeLogin
        .mutateAsync(state)
        .then(async (response) => {
          if (response.data.errorCode) {
            message.error(response.data.message || "Lỗi hệ thống");
            okLoading.value = false;
          } else {
            okLoading.value = false;
            message.success("Đăng nhập thành công");
            // showModalVofficeLogin.value = false;
            emit("loginSucces", {
              username: state.username,
              password: state.password,
            });
          }
        })
        .catch((error) => {
          message.error(error || "Lỗi hệ thống");
          okLoading.value = false;
        });
    })
    .catch((error) => {
      console.log("error", error);
      okLoading.value = false;
    });
};
</script>
