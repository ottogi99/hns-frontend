import React, {useState, useEffect} from 'react';
import Chart from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';

const Main_chart = ({dataList, dateType, obsList, type}) => {
  console.groupCollapsed("chart()");
  console.log(dataList);
  console.log("dateType : "+ dateType);
  console.log(obsList);
  let obsdh = [];
  let value = [];
  let obCode = [];
  obsList.map((data, index)=>obCode.push([data.OB_CODE,data.OB_NAME,index]))
  let dataset = []

  function dateFormat(date){
    if (date === null || date ==="") return '-'
    else{
      if(dateType === "hour") return date.slice(0,4)+'-'+date.slice(4,6)+'-'+date.slice(6,8)+' '+date.slice(8,10)+':00';
      else if(dateType === "day") return date.slice(0,4)+'-'+date.slice(4,6)+'-'+date.slice(6,8)
    }
  }

  dataList.map((data, index) => {
    let isCD = false;
    if(index === 0 ) obsdh = []; 
      for(var i = 0; i < obsdh.length; i++ ){
          if(dateFormat(data.OBSDH) === obsdh[i]) isCD = true;
      }
      if(isCD === false) obsdh.push(dateFormat(data.OBSDH));
  });

  dataList.map((data, index) => {
    if(index === 0) {
      let lens = [];
      for(var j = 0; j < obCode.length; j++ ){
        lens = [];
        for(var i = 0; i < obsdh.length; i++ ) lens.push(null)
        value.push(lens);
      }
    }
      for(i = 0; i < obsdh.length; i++ ){
        if(dateFormat(data.OBSDH) === obsdh[i]){
          for(j = 0; j < obCode.length; j++ ){
          if(data.OB_CODE === obCode[j][0]) value[j][i] = data.VALUE
          }
        }
    }
  });
  console.log(value);

  const CHART_COLORS = [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ];

let days = obsdh;


for(var j = 0; j < obCode.length; j++ ){
dataset.push({
  label: obCode[j][1],
  backgroundColor: CHART_COLORS[j],
  data: value[j],
  borderColor: CHART_COLORS[j],
  borderWidth: 2,
})}

let data =  {
      labels: days,
      datasets: dataset
    };
    console.groupEnd("chart()");

	return (
    	<div>
        {type === "line" && <Line type="line" data={data}/>}
        {type === "bar" &&<Bar  data={data} />}
        </div>
    );
    
}

export default Main_chart;