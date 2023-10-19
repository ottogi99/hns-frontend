import React from 'react';
import { useLocation } from 'react-router-dom';


function MainTable(props) {
    console.group("MainTable");
    console.log("[Start] MainTable ------------------------------");
    console.log("MainTable [props] : ", props);

    const location = useLocation();
    console.log("MainTable [location] : ", location);

    const data = props.props;

    console.log("------------------------------MainTable [End]");
    console.groupEnd("MainTable");


    return (
        <table>
            <tbody>
                <tr>
                    <td className='td_nm'>관측일자          </td><td className='td_val'>{data.obsdh}</td>
                    <td className='td_nm'>강수량            </td><td className='td_val'>{data.value}</td>
                </tr><tr>
                    <td className='td_nm'>전기전도도        </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>염분              </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>수온              </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>클로로필A         </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>수온이온농도      </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>화학적 산소요구량 </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>용존산소량        </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>총 질소           </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>탁도              </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>총 인             </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>일사량            </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>암모니아성질소     </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>기온              </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>질산성질소        </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>상대습도          </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>인산성인          </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>풍속              </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>규산규소          </td><td className='td_val'>{"0"}</td>
                </tr><tr>
                    <td className='td_nm'>풍향              </td><td className='td_val'>{"0"}</td>
                    <td className='td_nm'>남조류            </td><td className='td_val'>{"0"}</td>
                </tr>
            </tbody>
        </table>

    );
}

export default MainTable;