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
        <div key={name} className="input">
          <label>Year</label>
          <input type="range" value={settings.year}
            min={2009} max={2016} step={1}
            onChange={evt => this.props.onChange('year', evt.target.value)} />
        </div>
      </Container>
    );
  }
}
