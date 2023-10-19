import React, {useState, useEffect, useCallback }from 'react';
import ReactDatePicker from 'pages/common/DataPickers';
//import * as EgovNet from 'api/egovFetch';
import { utils, writeFile } from "xlsx";

function Report() {
    console.group("ReportPage");
    console.log("[Start] ReportPage ------------------------------");
    console.log("jsx name : Report");
    const selectList = [["발광박테리아", "LREF"], ["수온", "IREF"], ["탁도", "LS10"], ["전기전도도", "T0XI"]];
    const [selected, setSelected] = useState("발광박테리아");

    const [selectCD, setSelectCD] = useState("LREF");
    const [radioValue, setradioValue] = useState("month");
    let startDate = "";
    let endDate = "";

    const [datepickerTag, setDatepickerTag] = useState([<ReactDatePicker contents = {radioValue} />]);
    const [dateLabel, setDateLabel] = useState("월간");
    const [tbodyTag, setTbodyTag] = useState([]);
    const [theadTag, setTheadTag] = useState([]);

    const dateHendeler = () => {
        startDate = document.getElementById('stDt').value;
        endDate = document.getElementById('edDt').value;
    };

/*    const reportList = () => {
        dateHendeler();
        console.groupCollapsed("ReportPage.reportList()");
        console.log("startDate: ", startDate, "endDate: ", endDate, "obCode : ", selectCD, "dateType:", radioValue);
        const reportListURL = '/kriso/selectReportList.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body :  JSON.stringify({startDate:startDate, endDate:endDate, cdCode : selectCD, dateType:radioValue})
            
        }
        EgovNet.requestFetch(reportListURL, requestOptions,
            (resp) => {
                 let headList = [];
                 let dataList = [];
                 // 리스트 항목 구성
                 resp.result.ReportData.forEach(function (item, index) {
                     if(index === 0 ){ 
                        headList = [];
                        dataList = [];
                        headList.push(<th>구분</th>);
                        dataList.push(<td>{item.obNm}</td>);
                     }
                     headList.push(<th>{item.obsdh}</th>);
                     dataList.push(<td>{item.value}</td>);
                });
                setTheadTag(headList);
                setTbodyTag(dataList);
             },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
        console.groupEnd("ReportPage.reportList()");
    };
*/
    const handleSelect = (e) => {
        setSelectCD(e.target.options[e.target.selectedIndex].id);
        setSelected(e.target.value);
    };

    const handleRadio = (e) => {
        setradioValue(e.target.value);
        let content = e.target.value;
        setDatepickerTag(<ReactDatePicker contents = {content}/>);
        if(content === "month") setDateLabel("월간");
        else if(content === "day") setDateLabel("일간");
        else setDateLabel("시간");
    };

    function ExportHandler() {
		// excel 문서 만들기
        const wb = utils.book_new();
	    // table데이터 sheet화 
        const ws = utils.table_to_sheet(document.getElementById('tb1'));
	    // ws에 excelTableHead를 추가
        utils.book_append_sheet(wb, ws, "Report");
	    // 두 번째 arg에는 export 될 파일의 이름을 넣어주면 된다.
        writeFile(wb, "Report.xlsx");
        // Export될 데이터를 담았던 Array 초기화 해주기
    }
  
  console.log("------------------------------ReportPage [End]");
  console.groupEnd("ReportPage");

    return (
        <div className="container">
            <div className="c_wrap">
                <div className="layout">
                    <div className="contents R_BOARD" id="contents">
                        {/* <!-- 본문 --> */}

                        <h1 className="tit_3">보고서 </h1>
                        <h2 className="tit_4"></h2>
                        <table className="search_header">
                            <tbody>
                                <tr>
                                    <td className='td_nm'>관측기간</td>
                                    <td className='td_serch'>
                                        <div className='radio'>
                                            <label><input value="month" name="datetype" type="radio" onChange={handleRadio} checked={radioValue === "month"}/> 월</label>
                                            <label><input value="day" name="datetype" type="radio" onChange={handleRadio} checked={radioValue === "day"}/> 일</label>
                                            <label><input value="hour" name="datetype" type="radio" onChange={handleRadio} checked={radioValue === "hour"} /> 시</label>
                                        </div>
                                        {datepickerTag}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td_nm'>항목</td>
                                    <td className='td_serch'>
                                        <select onChange={handleSelect} value={selected}>                             
                                            {selectList.map((item) => (<option value={item[0]} id={item[1]}>{item[0]}</option>))}
                                        </select>
                                        <button onClick={ExportHandler}><img src="/assets/images/ico_search.png" alt="excell"/>엑셀</button>
{/*                                         <button onClick=/*reportList ><img src="/assets/images/ico_download.png" alt="search"/>검색</button>*/}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 className="tit_5"><img src="/assets/images/ico_report.png" alt="head"/>{selected} {dateLabel} 보고서</h3>
                        <table id= "tb1">
                            <thead>
                                <tr>
                                    {theadTag}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {tbodyTag}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;