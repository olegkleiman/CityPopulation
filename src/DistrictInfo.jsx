import React from 'react';

const DistrictInfo = ({info}) => {

  const textLine = isNaN(info.districtInfo.value)  ?
    'No' : info.districtInfo.value.toLocaleString();

  return <>
    <div>{info.districtInfo.name}</div>
    <br />
    <div>{textLine} inhabitants</div>
  </>
}

export default DistrictInfo;
