import BaseModule from "@/store/base-module";
import PositionTypeService from "@/services/PositionTypeService";

var base = new BaseModule(PositionTypeService);

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
