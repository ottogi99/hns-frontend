/* global kakao */
import React, { useEffect, useState, useRef } from 'react';

const MainMap = () => {
    // 네이버 지도 변수 생성
    const mapElement = useRef(null);
    const { naver } = window;
    const [dataSheet, setdataSheet] = useState([]);
    const jToken = localStorage.getItem('jToken');

    //네이버 지도 그리기 

    useEffect(() => {
        if (!mapElement.current || !naver) return;
    
        // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
        const location = new naver.maps.LatLng(36, 128);
        const mapOptions = {
          center: location,
          zoom: 7,
          mapTypeId: naver.maps.MapTypeId.HYBRID   
        };
    
        console.log(dataSheet);
        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
            position: location, 
            map: map,
            title: 'Green',
            icon: {
                content: `<div style="width:100px; height:100px; float:left; background-color:`+ `red` +`; border-radius:50px"/>`,
                size: new naver.maps.Size(38, 58),
                anchor: new naver.maps.Point(19, 58)
            },
            draggable: true
        })

        let test = '';
        if(dataSheet.length> 0){
            for(var i = 0; i < dataSheet.length; i++){
                if(dataSheet[i].VALUE < 100) test = '<div><span class="marker mk-s"></span></div>';
                else if(dataSheet[i].VALUE >= 100) test = '<div><span class="marker mk-b"></span></div>';
                console.log(test);
                
            }
    }
      }, [dataSheet]);
/*
      useEffect(() => {
        fetch('http://192.168.30.90:3000/d-data/search?startDt=202307131645&endDt=202307131647', 
            { headers: {
               'Authorization': jToken
            }})
                .then(response => response.json())
                .then(data => {
                    if(data.length > 0) setdataSheet(data);
                    else setdataSheet([]);}) 
                .catch(err => console.error(err));
        }, []);
    */
    return (
        <div
            style={{ width: '95%', display: 'block', marginLeft: '20px', marginRight: '20px'}}>
            {/* 네이버 지도*/}
            <div ref={mapElement} style={{ width: '47%', height: '700px', minHeight: '400px', float: 'left' }} />
        </div>
    );
};

export default MainMap;