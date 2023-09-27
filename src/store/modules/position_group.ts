import BaseModule from '@/store/base-module';
import PositionGroupService from "@/services/PositionGroupService";

var base = new BaseModule(PositionGroupService);

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