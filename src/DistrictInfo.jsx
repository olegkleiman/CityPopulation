import React, {useState} from 'react';
import {XYPlot,
        HorizontalGridLines,
        XAxis,
        YAxis,
        Hint,
        VerticalBarSeries
        } from 'react-vis';
import SheetData from './SheetData';

const DistrictInfo = ({info}) => {

  const [hintValue, setHintValue] = useState({});

  const data = [];

  const districtId = info.districtInfo.id;
  for(const year in SheetData ){ // enum props only

    if( SheetData.hasOwnProperty(year) ) {

      if( !isNaN(parseInt(year, 10)) ) {
        const value = SheetData[year].map.get(districtId);
        data.push( {
          x: year.toString(),
          y: value.total
        })
      }
    }
  };


  const textLine = isNaN(info.districtInfo.value)  ?
    'No' : info.districtInfo.value.toLocaleString();

  const _onNearestX = (value, {index}) => {
    setHintValue(value);
  }

  const _onMouseLeave = () => {
    setHintValue({});
  }

  return (<>
    <div className='centered'>{info.districtInfo.name}</div>
    <br />
    <div className='centered'>{textLine} inhabitants for {info.year}</div>
    <br />
    <XYPlot height={300} width= {440} xType="ordinal">
      <XAxis />
      <YAxis />
      <HorizontalGridLines />
      <VerticalBarSeries data={data}
        onMouseLeave={_onMouseLeave}
        onNearestX={_onNearestX}/>
      <Hint value={hintValue}>
        <div style={{background: 'white', fontSize: 14, top: 'auto', border: 'solid grey 1px', padding: '10px'}}>
          <h3>Population</h3>
          <p>{hintValue.y}</p>
        </div>
      </Hint>

    </XYPlot>

  </>)
}

export default DistrictInfo;