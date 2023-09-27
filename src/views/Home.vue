<template>
  <div></div>
</template>
<script>
import constant from "@/constant";

export default {
  mounted() {
    this.$router.push({ path: "/plan" });
  },
  data() {
    return {
      customerType: constant.customerType,
    };
  },
  methods: {
    login() {},
  },
};
</script>
<style>
</style>