import BaseModule from '@/store/base-module';
import VehicleGroupService from "@/services/VehicleGroupService";

var base = new BaseModule(VehicleGroupService);

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