import React, {Component} from 'react';
import MapGL, {Marker, NavigationControl} from 'react-map-gl';

import {json as requestJson} from 'd3-request';
// import d3 from 'd3-fetch';
import {fromJS} from 'immutable';

import ControlPanel from './ControlPanel';
import Legend from './Legend';
import {defaultMapStyle, dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';

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

let sheetData = {}

class App extends Component {

  state = {
    mapStyle: defaultMapStyle,
    year: 2009,
    ageGroup: 'total',
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 32.066667,
      longitude:  34.783333,
      zoom: 11,
      bearing: 0,
      pitch: 0
    }
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

    const districtsData = ( !sheetData.hasOwnProperty(sheetName) ) ?
      await this.getSheetData(sheetName) :
      sheetData[sheetName].rawData;

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

    sheetData[sheetName] = {
      map: districtsMap,
      rawData: districtsData
    }
  }

  _loadData = async(data) => {

    await this.updateSheetData(this.state.year, this.state.ageGroup);

    updatePercentiles(data,
                      f => f.properties.Id,
                      sheetData,
                      (f, districtId) => {
                        const row = f[this.state.year].map.get(districtId);
                        return row ? row.total : NaN;
                      });

    const layers = defaultMapStyle.get('layers');
    // console.log(layers);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'population'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({data, mapStyle});
  };

  _onViewportChange = viewport => this.setState({viewport});

  _performUpdate = async() => {

    const {data, mapStyle} = this.state;
    if (data) {

      await this.updateSheetData(this.state.year, this.state.ageGroup);

      updatePercentiles(data,
                        f => f.properties.Id,
                        sheetData,
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
            mapboxApiAccessToken={MAPBOX_TOKEN}>

          </MapGL>
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
