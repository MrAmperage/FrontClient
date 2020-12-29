import * as React from 'react';
import { observer, inject } from 'mobx-react';

@inject('ProviderStore')
@observer
export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return <div>Компонент карты</div>;
  }
}
