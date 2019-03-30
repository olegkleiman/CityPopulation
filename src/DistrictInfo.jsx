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

  const data = [
        // {x: '2009', y: 750.5},
        {x: '2010', y: 734.3},
        {x: '2011', y: 505.2},
        {x: '2012', y: 75.3},
        {x: '2013', y: 754.2},
        {x: '2014', y: 603.7},
        {x: '2015', y: 804.3},
        {x: '2016', y: 905.9}
      ];

  const districtId = info.districtInfo.id;
  for(const year in SheetData ){
    console.log(year);
    const value = SheetData[year].map.get(districtId);
    data.push( {
      x: year.toString(),
      y: value.total
    })
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
    <div>{info.districtInfo.name}</div>
    <br />
    <div>{textLine} inhabitants</div>
    <br />
    <XYPlot height={300} width= {380} xType="ordinal">
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
