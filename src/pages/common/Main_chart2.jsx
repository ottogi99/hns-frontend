import React from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const Main_chart2 = () => {

/*  let now = new Date();
  let today = now.toISOString().slice(0, 10);
  let startDt = new Date(now.setDate(now.getDate() -6));
  let start_date = startDt.toISOString().slice(0, 10);

  function getDatesStartToLast(startDate, lastDate) {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if(!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
    var result = [];
    var curDate = new Date(startDate);
    while(curDate <= new Date(lastDate)) {
      result.push(curDate.toISOString().split("T")[0]);
      curDate.setDate(curDate.getDate() + 1);
    }
    return result;
  }
    let days = getDatesStartToLast(start_date, today);
      function random_data(){
      let rand_dt = Math.random()*10;
      while(true){
          rand_dt = Math.random()*10;
          if (rand_dt >= 8){
              if(rand_dt<= 10) return rand_dt
          }
      }
  }
  let moreData = [[random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()],
                  [random_data(), random_data(), random_data(), random_data(), random_data(), random_data(), random_data()]
                ];

*/

    const CHART_COLORS = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      };
    let moreData = [[Math.random()*3],
                    [Math.random()*3],
                    [Math.random()*3],
                    [Math.random()*3]];

    let days = [""];
    let data =  {
      labels: days,
      datasets: [
        {
          type: 'bar',
          label: '전국평균',
          backgroundColor: CHART_COLORS.red,
          data: moreData[0],
        },
        {
          type: 'bar',
          label: '서해안',
          backgroundColor: CHART_COLORS.orange,
          data: moreData[1],
        },
        {
            type: 'bar',
            label: '동해안',
            backgroundColor: CHART_COLORS.yellow,
            data: moreData[2],
          },
          {
            type: 'bar',
            label: '남해안',
            backgroundColor: CHART_COLORS.green,
            data: moreData[3],
          }
      ]
    };

    
	return (
    	<div>
        	<Line type="bar" data={data} />
        </div>
    );
    
}

export default Main_chart2;