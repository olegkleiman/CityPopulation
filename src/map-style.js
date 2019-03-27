import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'data',
  source: 'population',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'actual_value',
      stops: [
        [0, '#ffffd9'],
        [1, '#caeab4'],
        [2, '#8fd3ba'],
        [3, '#2b9cc1'],
        [4, '#1a468a']
      ]
    },
    'fill-opacity': 0.8
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);
