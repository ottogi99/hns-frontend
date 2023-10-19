import React from 'react';
import { useLocation } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';

import ObsStation from "./ManagerObsStation";
import CdMaster from "./ManagerCdMaster";
import DataTable from "./ManagerAllData";
import Roles from "./ManagerRole";
import Users from "./ManagerUser";

import 'swiper/css';
import 'swiper/css/pagination';

function Manager(props) {
    console.group("EgovDailyDetail");
    console.log("[Start] EgovDailyDetail ------------------------------");
    console.log("EgovDailyDetail [props] : ", props);
    const location = useLocation();
    console.log("EgovDailyDetail [location] : ", location);
    console.log("------------------------------EgovDailyDetail [End]");
    console.groupEnd("EgovDailyDetail");

    return (
        <Swiper
            pagination={{ clickable: true }} // 우측의 점을 클릭했을 때, 클릭한 슬라이드로 이동하게 됩니다.
            keyboard // 키보드 방향키에 의한 동작을 허용합니다.
            modules={[Pagination, Keyboard]} // 페이지네이션, 마우스휠, 키보드 등을 사용하려면 모듈을 import해줘야 합니다.
            allowTouchMove // 터치 동작을 허용합니다.
            className="main_slider"
            threshold={20} // 터치 감도를 조정합니다. 숫자가 클수록 터치에 반응하지 않습니다.
            speed={1000} // 슬라이드가 넘어가는 속도를 조정합니다. 단위는 ms입니다.
            onActiveIndexChange={(swiper) => {/*console.log(swiper.activeIndex);*/}}
        >
            <SwiperSlide><Roles /></SwiperSlide>
            <SwiperSlide><Users /></SwiperSlide>
{/*            <SwiperSlide><ObsStation /></SwiperSlide>
            <SwiperSlide><CdMaster /></SwiperSlide>
            <SwiperSlide><DataTable /></SwiperSlide>*/} 
        </Swiper>
    );
}


export default Manager;