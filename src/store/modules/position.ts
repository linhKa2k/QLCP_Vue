import BaseModule from '@/store/base-module';
import PositionService from "@/services/PositionService";

var base = new BaseModule(PositionService);

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