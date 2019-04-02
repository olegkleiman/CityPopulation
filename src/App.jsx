import React, {Component} from 'react';
import MapGL, { Marker, Popup, FullscreenControl} from 'react-map-gl';
const { point, polygon } = require('@turf/helpers');
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;

import {json as requestJson} from 'd3-request';
import {fromJS} from 'immutable';

import ControlPanel from './ControlPanel';
import Legend from './Legend';
import DistrictInfo from './DistrictInfo';
import {defaultMapStyle, dataLayer, bordersLayer} from './map-style.js';
import {updateDataValue} from './utils';
import SheetData from './SheetData';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const myMapStyle = fromJS({
  "version": 8,
  "name": "TLV ODS",
  "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  "center": [ 32.066667, 34.783333 ],
  "light": {
    "anchor": "viewport",
    "color": "white",
    "intensity": 0.4
  }
});

const fullscreenControlStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '10px'
};

class App extends Component {

  state = {
    mapStyle: defaultMapStyle,
    year: 2009,
    ageGroup: 'total',
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 32.066667,
      longitude: 34.783333,
      zoom: 12,
      bearing: 0,
      pitch: 0
    },
    popupInfo: null,
    hover: false
  };

  constructor(props) {
    super(props);
    this._updateSettings = this._updateSettings.bind(this);
  }

  getSheetData = async (SheetName) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1GJWgz04VTdJIPT5y4N8qkY-fkNc3lvbxATv8TeC-deA/values/${SheetName}?key=AIzaSyABrJkY9bVKLn3YB8f4kmiiGBDWhv4goYA&majorDimension=ROWS`;
    const resp = await fetch(url);
    const respJson = await resp.json();
    return respJson.values;
  }

  componentDidMount() {

    requestJson('./data/merged.json', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    });

  }

  updateSheetData = async (sheetName, ageGroup) => {

    const districtsData = ( !SheetData.hasOwnProperty(sheetName) ) ?
      await this.getSheetData(sheetName) :
      SheetData[sheetName].rawData;

    let columns = [];
    const districtsMap = new Map();
    districtsData.forEach( (item, index) => {
      if( index === 0 ) {
        columns = item;
      } else {
        const columnIndex = columns.findIndex( item => item === ageGroup );
        districtsMap.set(item[0], {
          "total": parseFloat(item[columnIndex].replace(/,/g, '')),
        });
      }
    });

    SheetData[sheetName] = {
      map: districtsMap,
      rawData: districtsData
    }
  }

  _loadData = async(data) => {

    await this.updateSheetData(this.state.year, this.state.ageGroup);

    updateDataValue(data,
                      f => f.properties.Id,
                      SheetData,
                      (f, districtId) => {
                        const row = f[this.state.year].map.get(districtId);
                        return row ? row.total : NaN;
                      });


    const layers = defaultMapStyle.get('layers');

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'google spreadsheet'], fromJS({type: 'geojson', data}))
      .setIn(['sources', 'google_spreadsheet_borders'], fromJS({type: 'geojson', data}))
      // Add polygon (fill) andd line (borders) layers layer to map
      .set('layers', layers.push(dataLayer, bordersLayer))

    this.setState({data, mapStyle});
  };

  _onViewportChange = viewport => this.setState({viewport});

  _performUpdate = async() => {

    const {data, mapStyle} = this.state;
    if (data) {

      await this.updateSheetData(this.state.year, this.state.ageGroup);

      updateDataValue(data,
                        f => f.properties.Id,
                        SheetData,
                        (f, districtId) => {
                          const row = f[this.state.year].map.get(districtId);
                          return row ? row.total : NaN;
                        }
                      );

      const newMapStyle = mapStyle.setIn(['sources', 'population', 'data'], fromJS(data));
      this.setState({mapStyle: newMapStyle});

    }
  }

  _updateSettings = (name, value) => {

    if( name == 'ageGroup') {
      this.setState({ageGroup: value},
      this._performUpdate);
    }

    if (name === 'year') {
      this.setState({year: value},
      this._performUpdate);
    }

    this.setState({popupInfo: null});
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        closeOnClick={false}

        onClose={() => this.setState({popupInfo: null})} >
        <DistrictInfo info={popupInfo} />
      </Popup>
    );
  }

  onClick = (evt) => {

    // const pt = turf.point([evt.lngLat[0], evt.lngLat[1]]);
    const pt = point([evt.lngLat[0], evt.lngLat[1]]);

    let disctrictInfo = {};
    let isFound = this.state.data.features.reduce( (accumulator, feature) => {
      const _isFound = booleanPointInPolygon(pt, feature);
      if( _isFound ) {
        disctrictInfo.name = feature.properties.Name;
        disctrictInfo.id = feature.properties.Id;
        const value = feature.properties.value <= 0 ? NaN : feature.properties.value;
        disctrictInfo.value = value;
      }
      return accumulator || _isFound;
    }, false);

    if( isFound ) {
      this.setState({ popupInfo: {
        year: this.state.year,
        longitude: evt.lngLat[0],
        latitude: evt.lngLat[1],
        districtInfo: disctrictInfo
      }});
    } else {
      this.setState({ popupInfo: null });
    }

  }

  _onHover = (event) => {

    const {popupInfo} = this.state;
    if( popupInfo )
      return;

    const district =  event.features && event.features.find(f => f.layer.id === 'districts');
    if( !district ) {
      return;
    }

    const data = this.state.data;
    const {features} = data;
    const _features = features.map( feature => {
      if( feature.properties.Id === district.properties.Id ) {
        // hovered: actual = -1
        if( feature.properties.actual_value != -1) {
          feature.properties.previous_value = feature.properties.actual_value;
          feature.properties.actual_value = -1;
        }
      } else {
        // not hovered: prev => actual
        feature.properties.actual_value = feature.properties.previous_value;
      }
      return feature;
    })

    const _mapStyle = this.state.mapStyle
      .setIn(['sources', 'google_spreadsheet_borders'], fromJS({type: 'geojson', data}))
    this.setState({
                    data: data,
                    mapStyle: _mapStyle}
                 );

  }

  render() {

    const {viewport, mapStyle} = this.state;

    return (<div style={{height: '100%'}}>
          <MapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle={mapStyle}
            onViewportChange={this._onViewportChange}
            onClick={this.onClick}
            onHover={this._onHover}
            mapboxApiAccessToken={MAPBOX_TOKEN}>

            {this._renderPopup()}

          </MapGL>
          <div className="fullscreen" style={fullscreenControlStyle}>
             <FullscreenControl container={document.querySelector('body')}/>
          </div>
          <ControlPanel containerComponent={this.props.containerComponent}
                        settings={this.state}
                        onChange={this._updateSettings} />
          <Legend containerComponent={this.props.containerComponent}
                        settings={this.state} />
        </div>
    )
  }

}

export default App;
