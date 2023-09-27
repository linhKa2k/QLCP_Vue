import PrintConfig from "@/config/prints";
import moment from "moment/moment";
import { ref } from "vue";
import {
  formatDate,
  getImage,
  formatNumber,
  formatTime,
  formatCurrency,
} from "@/utility";
import { formatDateTimeVN } from "@/mixins";
import html2pdf from "html2pdf.js";

export const downloadFilePdf = async (
  camelCaseEntity: any,
  form: any,
  mode?: any
) => {
  const prints = ref<any>(PrintConfig);
  let template = prints.value[camelCaseEntity] || {};
  const response = await fetch(template.content);
  const text = await response.text();
  let content = text;
  let data = { ...form };
  if (data != null) {
    template.fields.map((p) => {
      switch (p.dataType) {
        case "number":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            formatNumber(data[p.dataIndex]) || ""
          );

          break;
        case "datetime":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            formatDateTimeVN(data[p.dataIndex]) || ""
          );

          break;
        case "date":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            formatDate(data[p.dataIndex])
          );

          break;
        case "time":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            formatTime(data[p.dataIndex])
          );

          break;
        case "currency":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            formatCurrency(Number(data[p.dataIndex]))
          );

          break;
        case "table":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            p.parent
              ? generateDataParentToTBody(data[p.dataIndex], p.columns)
              : generateDataToTBody(data[p.dataIndex], p.columns)
          );

          break;
        case "list_custom":
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            generateListCustom(data[p.dataIndex], p)
          );

          break;
        default:
          content = content.replaceAll(
            `##${p.dataIndex}##`,
            data[p.dataIndex] ? data[p.dataIndex] : ""
          );
          break;
      }
    });
  }

  var opt = {};
  if (mode) {
    opt = Object.assign(
      {
        filename: template.fileName ? template.fileName : "",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
          pagesplit: true,
        },
      },
      mode
    );
  } else {
    opt = {
      filename: template.fileName ? template.fileName : "",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
    };
  }

  var worker = html2pdf().set(opt).from(content).toPdf().get("pdf"); // .save();

  // const blob = worker.outputPdf("blob");
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, "text/html");
  // console.log(worker.subscribers, "check worker");
  // console.log(typeof blob, "check doc parse ");

  return { opt, content, worker };
};

export const generateDataToTBody = (data: any[], columns: any[]) => {
  // const response = dataFlaten(data);
  if (data != null) {
    let form = data.map((item) => {
      let itemFomart = columns
        .map((col: any) => {
          return renderTd(col, item);
        })
        .join("");
      return `<tr> ${itemFomart}</tr>`;
    });
    return form.join("");
  } else {
    return ``;
  }
};

const renderTd = (col, item) => {
  let data;
  switch (col.dataType) {
    case "number":
      data =
        item[col.dataIndex] != null ? formatNumber(item[col.dataIndex]) : "";
      break;
    case "date":
      data = item[col.dataIndex] ? formatDate(item[col.dataIndex]) : "";
      break;
    case "currency":
      data =
        item[col.dataIndex] != null
          ? formatCurrency(Number(item[col.dataIndex]))
          : "";
      break;
    default:
      data = item[col.dataIndex] ? item[col.dataIndex] : "";
      break;
  }
  return `<td colspan="1">${data}</td>`;
};

export const generateDataParentToTBody = (data: any, columns: any[]) => {
  // const response = dataFlaten(data);
  if (data != null) {
    let res: any[] = [];
    data.forEach((i) => {
      const forMap = (input: any) => {
        if (input.level.colSpan == input.level.totalColSpan) {
          res.push(renderTr(input, input.level.colSpan));
        } else {
          res.push(renderArrTr(columns, input));
        }
        if (Array.isArray(input?.children) && input?.children.length > 0) {
          input.children.forEach((i) => forMap(i));
        }
      };
      forMap(i);
    });

    return res.join("");
  } else {
    return ``;
  }
};

const renderTr = (item: any, colSpanTd) => {
  return `<tr><td colSpan="${colSpanTd}">${
    item[item.level.key || "content"]
  }</td></tr>`;
};

const renderArrTr = (columns: any[], item: any) => {
  // let tr: any[] = [];
  let tr = columns.map((i) => {
    return `<td colSpan="1">${item[i.dataIndex] ? item[i.dataIndex] : ""}</td>`;
  });
  return `<tr>${tr.join("")}</tr>`;
};

const renderParentTd = (col, item) => {
  let data;
  switch (col.dataType) {
    case "number":
      data =
        item[col.dataIndex] != null ? formatNumber(item[col.dataIndex]) : "";
      break;
    case "date":
      data = item[col.dataIndex] ? formatDate(item[col.dataIndex]) : "";
      break;
    case "currency":
      data =
        item[col.dataIndex] != null
          ? formatCurrency(Number(item[col.dataIndex]))
          : "";
      break;
    default:
      data = item[col.dataIndex] ? item[col.dataIndex] : "";
      break;
  }
  return `<td colspan="${1}">${data}</td>`;
};

const renderColSpan = (level: any) => {
  // if (level) {
  //   return level.colSpan;
  // } else {
  //   return 0;
  // }
  let colSpan;
  switch (level) {
    case level:
      colSpan = level;
      break;
    default:
      colSpan = 1;
      break;
  }
  return colSpan;
};

const generateListCustom = (data: any, columnCustom: any) => {
  if (Array.isArray(data) && data.length == 0) {
    return "";
  }
  let result: any[] = [];
  data.forEach((item: any) => {
    for (const key in item) {
      let card = "p";
      if (columnCustom?.dataCustom.style[key]?.card) {
        card = columnCustom?.dataCustom.style[key].card;
      }
      result.push(
        `<${card}>${columnCustom.dataCustom[key]} : ${
          item[key] ? item[key] : ""
        }</${card}>`
      );
    }
  });
  return result.join("");
};

export const downloadFile = (blob: any, fileName: any) => {
  const fileURL = window.URL.createObjectURL(new Blob([blob]));
  const fileLink = document.createElement("a");
  fileLink.href = fileURL;
  fileLink.setAttribute("download", `${fileName}`);
  document.body.appendChild(fileLink);
  fileLink.click();
};

export const downloadByUrl = (url) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.download = url.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
