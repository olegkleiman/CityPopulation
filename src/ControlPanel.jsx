import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {

  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const {settings} = this.props;

    return (
      <Container>
        <h3>Tel-Aviv Population</h3>
        <p>The map shows the population of the City districts for the selected year.</p>
        <p>
          <b>{settings.year}</b>
        </p>
        <div className="input">
          <label>Year</label>
          <input type="range" value={settings.year}
            min={2009} max={2016} step={1}
            onChange={evt => this.props.onChange('year', evt.target.value)} />
        </div>
        <div>
          <label>Age Group</label>
          <select onChange={evt => this.props.onChange('ageGroup', evt.target.value)}>
            <option value='total'>total</option>
            <option value='0-14'>0-14</option>
            <option value='15-24'>15-24</option>
            <option value='25-34'>25-34</option>
            <option value='35-44'>35-44</option>
            <option value='45-64'>45-64</option>
            <option value='over65'>over 65</option>
          </select>
        </div>
      </Container>
    );
  }
}
