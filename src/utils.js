
export function updateDataValue(featureCollection, geoDataAccessor,
                                data, dataAccessor) {
  const {features} = featureCollection;
  features.forEach(f => {
    const districtId = geoDataAccessor(f);
    const value = dataAccessor(data, districtId);
    const _val = Math.ceil(value / 10000);
    f.properties.value = value;
    f.properties.previous_value = isNaN(_val)? 0: _val;
    f.properties.actual_value = isNaN(_val)? 0: _val;
  });
}
