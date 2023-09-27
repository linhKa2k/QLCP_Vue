import BaseModule from '@/store/base-module';
import ServiceSerrvice from "@/services/ServiceService";

var base = new BaseModule(ServiceSerrvice);


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