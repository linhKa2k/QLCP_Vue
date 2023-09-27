import BaseModule from '@/store/base-module';
import PlanConfirmService from "@/services/PlanConfirmService";

var base = new BaseModule(PlanConfirmService);


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