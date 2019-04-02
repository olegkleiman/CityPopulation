import React, {useState} from 'react';
import {XYPlot,
        HorizontalGridLines,
        XAxis,
        YAxis,
        Hint,
        VerticalBarSeries
        } from 'react-vis';
import empty from 'is-empty';
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
          y: value.calculated
        })
      }
    }
  };

  const textLine = isNaN(info.districtInfo.value)  ?
    'No' : info.districtInfo.value.toLocaleString();

  const _onNearestX = (value, {index}) => {
    setHintValue(value);
  }

  const _onMouseOut = (event) => {
    setHintValue(null);
  }

  const renderHint = () => {
    return empty(hintValue) ?
            null :
            <Hint value={hintValue} align={{horizontal: 'auto', vertical: 'top'}}>
              <div className='hint'>
                <div>Population for {hintValue.x}:</div>
                <div>{hintValue.y.toLocaleString()} inhabitants</div>
              </div>
            </Hint>
  }

  const renderPlot = (value) => {
    return isNaN(info.districtInfo.value) ?
      null :
      (<XYPlot height={300} width= {440} xType="ordinal">
            <XAxis />
            <YAxis />
            <HorizontalGridLines />
            <VerticalBarSeries data={data}
              onSeriesMouseOut={_onMouseOut}
              onNearestX={_onNearestX} />
            { renderHint() }

          </XYPlot>
      )
  }

  return (<>
    <div className='centered'>{info.districtInfo.name}</div>
    <br />
    <div className='centered'>{textLine} inhabitants for {info.year}</div>
    <br />
    {renderPlot(info.districtInfo.value)}

  </>)
}

export default DistrictInfo;
