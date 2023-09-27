import BaseModule from "@/store/base-module";
import PlanUserService from "@/services/PlanUserService";

var base = new BaseModule(PlanUserService);

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
