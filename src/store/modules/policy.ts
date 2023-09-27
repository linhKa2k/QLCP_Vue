import BaseModule from "@/store/base-module";
import PolicyService from "@/services/PolicyService";

var base = new BaseModule(PolicyService);

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
