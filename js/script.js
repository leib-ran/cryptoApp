import { DataTable } from "../node_modules/simple-datatables/dist/module";
import axios from "../node_modules/@bundled-es-modules/axios/axios";

let tableEl = document.querySelector("table");
axios
  .get("https://api.coincap.io/v2/assets")
  .then((res) => {
    return res["data"]["data"];
  })
  .then((res) => {
    let colmuns = [
      "Rank",
      "Name",
      "Price",
      "Market Cap",
      "volume(24Hr)",
      "Change(24Hr)",
    ];
    fillHeaders(colmuns);
    return res;
  })
  .then((res) => {
    filltable(res, []);
    let myTable = new DataTable(tableEl);

    setInterval(() => {
      axios
        .get("https://api.coincap.io/v2/assets")
        .then((curRes) => {
          return curRes["data"]["data"];
        })
        .then((curRes) => {
          myTable.destroy();
          fillHeaders();
          filltable(curRes, res);
          myTable = new DataTable(tableEl);
          res = curRes;
        });
    }, 5000);
    return res;
  });

function fillHeaders() {
  let sTd = "";
  let headerRow = "";
  tableEl.innerHTML = "";
  let colmuns = [
    "Rank",
    "Name",
    "Price",
    "Market Cap",
    "volume(24Hr)",
    "Change(24Hr)",
  ];

  colmuns.forEach((element) => {
    sTd += `<th>${element}</th>`;
  });
  headerRow = `<thead><tr>${sTd}</tr></thead>`;
  tableEl.innerHTML += headerRow;
}

function filltable(arrCur, arrPast) {
  let tableEl = document.querySelector("table");
  let classn = "";
  let rows = "";
  let counter = 0;

  arrCur.forEach((obj) => {
    let image = `https://assets.coincap.io/assets/icons/${obj[
      "symbol"
    ].toLowerCase()}@2x.png`;
    let tdata = `<td>${obj["rank"] || ""}</td>
                <td><img src=${image} alt=${obj["symbol"]} /> ${
      obj["name"]
    } <br />${obj["symbol"]}</td>
        <td>$${Number(obj["priceUsd"]).toLocaleString() || ""}</td>   
        <td>${Number(obj["marketCapUsd"]).toLocaleString() || ""}</td>
        <td>${Number(obj["volumeUsd24Hr"]).toLocaleString() || ""}</td>
        <td>${Number(obj["changePercent24Hr"]).toLocaleString() || ""}</td>`;

    classn = pickClassColor(obj, arrPast[counter]);
    rows += `<tr class=${classn}>${tdata}</tr>`;
    counter++;
  });
  tableEl.innerHTML += `<tbody>${rows}</tbody>`;
  let ran = document.querySelector(`#ADA`);
}
function pickClassColor(obj, pastObj) {
  if (pastObj == undefined) {
    return "";
  }
  if (
    Number(obj["changePercent24Hr"]) - Number(pastObj["changePercent24Hr"]) <
    0.3
  ) {
    return "red";
  } else if (
    Number(obj["changePercent24Hr"]) -
    Number(pastObj["changePercent24Hr"] > 0.3)
  ) {
    return "green";
  } else {
    return "";
  }
}
