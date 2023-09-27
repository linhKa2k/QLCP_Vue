import generateSelector from "ant-design-vue/lib/vc-select/generate";
import moment from "moment/moment";
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from "vue";
import {
  generateFormData,
  generateFields,
  generateRules,
  convertFilter,
} from "@/formUtility";
interface ruleKey {
  value: any;
  label: any;
}
export const generateDataObject = (keyWord: any, ruleKey: any, data: any) => {
  let result: any = {};
  for (const key in data) {
    if (keyWord.indexOf(key) >= 0) {
      if (data[key] != null) {
        if (ruleKey[key]) {
          if (Array.isArray(ruleKey[key].label)) {
            result[key] = {
              label: ruleKey[key].label
                .map((i) => data[key][i])
                .toString()
                .replace(",", " - "),
              key: data[key][ruleKey[key].value],
              id: data[key][ruleKey[key].value],
              value: data[key][ruleKey[key].value],
            };
          } else {
            result[key] = {
              key: data[key][ruleKey[key].value],
              id: data[key][ruleKey[key].value],
              label: data[key][ruleKey[key].label],
              value: data[key][ruleKey[key].value],
            };
          }
        } else {
          result[key] = {
            key: data[key].id,
            id: data[key].id,
            label: data[key].name,
            value: data[key].id,
            name: data[key].name,
          };
        }
      }
    } else {
      result[key] = data[key];
    }
  }
  return result;
};

export const generateData = (config: any, data: any) => {
  let formData = ref<any>({});
  formData.value = generateFormData(config.value);
  for (let prop in config.value) {
    formData.value[prop] = data[prop];
    let configs = config.value[prop];
    if (configs.relation) {
      if (data[configs.relation]) {
        if (configs.fieldRelation1) {
          formData.value[configs.relation] = {
            id: data[configs.relation] ? data[configs.relation]["id"] : "",
            key: data[configs.relation] ? data[configs.relation]["id"] : "",
            value: data[configs.relation] ? data[configs.relation]["id"] : "",
            label: data[configs.relation]
              ? `${data[configs.relation][configs.fieldRelation]} - ${
                  data[configs.relation][configs.fieldRelation1]
                }`
              : "",
          };
        } else {
          formData.value[configs.relation] = {
            id: data[configs.relation] ? data[configs.relation]["id"] : "",
            key: data[configs.relation] ? data[configs.relation]["id"] : "",
            value: data[configs.relation] ? data[configs.relation]["id"] : "",
            label: data[configs.relation]
              ? data[configs.relation][configs.fieldRelation]
              : "",
          };
        }
      }
    }
    if (configs.relationDefault) {
      formData.value[configs.relationDefault] = {
        key: data[configs.relationDefault + "_id"] || "",
        value: data["name_of_" + configs.relationDefault + "_id"] || "",
      };
    }
    if (configs.relationMultiple) {
      if (data[prop] && data[prop].length > 0) {
        formData.value[configs.relationMultiple] = data[prop].map(
          (item: any) => ({
            // key: item[config.relationMultiple + "_id"] || "",
            value: item[configs.relationMultiple]["id"] || "",
            label: item[configs.relationMultiple]["name"] || "",
          })
        );
      }
    }

    if (configs.dataType) {
      if (configs.dataType == "date") {
        formData.value[prop] = data[prop]
          ? moment.utc(data[prop], "YYYY-MM-DD")
          : null;
      }
      if (configs.dataType == "time") {
        formData.value[prop] = moment.utc(data[prop], "H:mm:ss");
      }

      if (configs.dataType == "array") {
        if (configs.dataRelation) {
          configs.dataRelation.map((p: any) => {
            data[prop].map((t: any) => {
              let item = t;
              item[p] = {
                id: item[p]?.id,
                key: item[p]?.id,
                value: item[p]?.id,
                label: item[p]?.name,
              };
            });
          });
        }
        if (configs.fields) {
          Object.keys(configs.fields).map((i) => {
            for (let j = 0; j < data[prop].length; j++) {
              let item = data[prop][j];
              if (configs.fields[i].dataType == "bool") {
                if (item[i] == 1) {
                  item[i] = true;
                } else {
                  item[i] = false;
                }
              }
              if (configs.fields[i].dataType == "time") {
                item[i] = moment.utc(data[prop][j][i], "H:mm:ss");
              }
              //   if (configs.fields[i].dataType == "datetime") {
              //   item[i] = moment.utc(data[prop][j][i], "DD/MM/YYYY HH:mm:ss");
              // }
            }
          });
        }
      }
      if (configs.dataType == "object") {
        Object.values(configs.objectRelation).map((p: any) => {
          formData.value[prop][p] = {
            value: data[prop][p + "_id"] || "",
            label: data[prop]["name_of_" + p + "_id"] || "",
          };
        });
      }
    }
  }
  // formData.value["mode"] = "edit";
  return formData.value;
};
