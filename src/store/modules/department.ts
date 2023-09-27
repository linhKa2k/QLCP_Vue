import BaseModule from '@/store/base-module';
import DepartmentService from "@/services/DepartmentService";

var base = new BaseModule(DepartmentService);


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