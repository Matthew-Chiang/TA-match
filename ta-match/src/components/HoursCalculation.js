import React, { useState } from "react";
import axios from 'axios';
import * as XLSX from "xlsx";

const apiURL = 'http://localhost:5000/api';

export default function HoursCalculation() {
  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };


  return (
    <div>
      <h1>Calculate TA Hours</h1>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
    {items.length > 0 ? (
      items.filter(e => {
        if (e["Course"] == undefined) {
          return false;
        }
        return true;
      }).map((e) => {
        let hoursCalc = Math.ceil((e["Hrs 2020"]/e["Enrol 2020"])*e["Enrol 2021"]);
        return <div>
          {"Course: "+e["Course"]}
          {" / Estimated Hours: "+ (isNaN(hoursCalc) ? "N/A" : hoursCalc)}
          </div>
      })
    ) : null}
    </div>
  )
}
  