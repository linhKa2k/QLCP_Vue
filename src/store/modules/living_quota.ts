import BaseModule from "@/store/base-module";
import LivingQuotaService from "@/services/LivingQuotaService";

var base = new BaseModule(LivingQuotaService);

const state = {
  ...base.state,
};
const getters = {
  ...base.getters,
};
const actions = {
  ...base.actions,
};
const mutations = {
  ...base.mutations,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
