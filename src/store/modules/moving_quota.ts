import BaseModule from "@/store/base-module";
import MovingQuotaService from "@/services/MovingQuotaService";

var base = new BaseModule(MovingQuotaService);

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
