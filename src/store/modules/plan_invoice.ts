import BaseModule from "@/store/base-module";
import InvoiceService from "@/services/InvoiceService";

var base = new BaseModule(InvoiceService);

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
