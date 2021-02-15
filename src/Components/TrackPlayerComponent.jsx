import * as React from 'react';
import { Slider, Button } from 'antd';
export default class TrackPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          marginTop: '39%',
          marginLeft: '30%',
          width: '600px',
          height: '30px',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
        className="MatteGlass"
      >
        <Button size="small" type="primary">
          Пуск
        </Button>
        <Button size="small">Стоп</Button>
        <Slider
          style={{
            width: '450px',
          }}
        />
      </div>
    );
  }
}
