import BaseModule from '@/store/base-module';
import VehicleService from "@/services/VehicleService";

var base = new BaseModule(VehicleService);


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