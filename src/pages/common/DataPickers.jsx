import React, {useState}from 'react';
import DatePicker from "react-datepicker";
import'react-datepicker/dist/react-datepicker.css';

const ReactDatePicker = ({contents, stDt, edDt}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  if(contents === "hour"){
        return(
            <div className='pickers'>
                <DatePicker className='dataPicker'
                  id = 'stDt'
                  selected={startDate}
                  onChange={(date) => {stDt(date); setStartDate(date);}}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="시간"
                  dateFormat="yyyy-MM-dd HH:mm"        
                  />
                ~
                <DatePicker className='dataPicker'
                  id = 'edDt'
                  selected={endDate}
                  onChange={(date) => {edDt(date); setEndDate(date);}}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="시간"
                  dateFormat="yyyy-MM-dd HH:mm"        
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
        </div>
        );
    }else if(contents === "day") {
        return(
            <div className='pickers'>
                <DatePicker className='dataPicker'
                  id = 'stDt'
                  selected={startDate}
                  onChange={(date) => {stDt(date); setStartDate(date);}}
                  selectsStart
                  startDate={startDate}
                  dateFormat={"yyyy-MM-dd"}
                  endDate={endDate}
                />
                ~
                <DatePicker className='dataPicker'
                  id = 'edDt'
                  selected={endDate}
                  onChange={(date) => {edDt(date); setEndDate(date);}}
                  selectsEnd
                  startDate={startDate}
                  dateFormat={"yyyy-MM-dd"}
                  endDate={endDate}
                  minDate={startDate}
                />
            </div>
        )
    }else {
      return(
          <div className='pickers'>
              <DatePicker className='dataPicker'
                id = 'stDt'
                selected={startDate}
                onChange={(date) => {stDt(date); setStartDate(date);}}
                selectsStart
                startDate={startDate}
                dateFormat={"yyyy-MM"}
                endDate={endDate}
                showMonthYearPicker
              />
              ~
              <DatePicker className='dataPicker'
                id = 'edDt'
                selected={endDate}
                onChange={(date) => {edDt(date); setEndDate(date);}}
                selectsEnd
                startDate={startDate}
                dateFormat={"yyyy-MM"}
                endDate={endDate}
                minDate={startDate}
                showMonthYearPicker
              />
          </div>
      )
  };
  }
  export default ReactDatePicker;