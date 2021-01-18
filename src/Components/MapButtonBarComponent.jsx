import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';

@inject('ProviderStore')
@observer
export default class MapButtonBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ padding: '5px' }}>
        <Button size="small" type="primary">
          Линейка
        </Button>
        <Button size="small" type="primary" style={{ marginLeft: '10px' }}>
          Плеер треков
        </Button>
      </div>
    );
  }
}
