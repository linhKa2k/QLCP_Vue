import BaseModule from '@/store/base-module';
import PurposeService from "@/services/PurposeService";

var base = new BaseModule(PurposeService);


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