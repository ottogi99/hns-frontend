/* global kakao */
import React, { useEffect, useState, useRef } from 'react';

const { kakao } = window;

const MainMap = () => {
    // 카카오 지도 변수 생성
    const [map,setMap] = useState(null);

    // 네이버 지도 변수 생성
    const mapElement = useRef(null);
    const { naver } = window;

    //카카오 지도 그리기
    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(36, 128), level: 13 };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[])

    //네이버 지도 그리기
    useEffect(() => {
        if (!mapElement.current || !naver) return;
    
        // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
        const location = new naver.maps.LatLng(36, 128);
        const mapOptions = {
          center: location,
          zoom: 7,
//          zoomControl: true,
          mapTypeId: naver.maps.MapTypeId.HYBRID   
        };
    
        const map = new naver.maps.Map(mapElement.current, mapOptions);
//        new naver.maps.Marker({ position: location, map });
      }, []);

      
    return (
        <div
            style={{ width: '95%', display: 'inline-block', marginLeft: '20px', marginRight: '20px'}}>
            {/* 카카오 지도*/}
            <div id="map" style={{ width: '47%', height: '700px', float: 'left' }} />
            {/* 네이버 지도*/}
            <div ref={mapElement} style={{ width: '47%', height: '700px', minHeight: '400px', float: 'right' }} />
        </div>
    );
};

export default MainMap;