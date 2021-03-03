import React, { useState } from "react";
import axios from 'axios';
import * as XLSX from "xlsx";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const apiURL = 'http://localhost:5000/api';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
  },
  table: {
    minWidth: 650,
  },
});

export default function HoursCalculation() {
  const classes = useStyles();
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
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
    {items.length > 0 ? (
      <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Calculated Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.filter(e => {
              if (e["Course"] == undefined) {
                return false;
              }
              return true;
            }).map((row) => {
              let hoursCalc = Math.ceil((row["Hrs 2020"]/row["Enrol 2020"])*row["Enrol 2021"]);
              return (
                <TableRow key={row["#"]}>
                  <TableCell component="th" scope="row">{row["Course"]}</TableCell>
                  <TableCell>{(isNaN(hoursCalc) ? "N/A" : hoursCalc)}</TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    ) : null}
    </div>
  )
}
  