import BaseModule from '@/store/base-module';
import TransferRequestItemService from "@/services/TransferRequestItemService";

var base = new BaseModule(TransferRequestItemService);


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