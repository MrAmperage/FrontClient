import * as React from 'react';
import { observer, inject } from 'mobx-react';
import 'ol/ol.css';
@inject('ProviderStore')
@observer
export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.MapRef = React.createRef();
  }
  InitMap = () => {
    this.props.ProviderStore.CurrentTab.Options.MapObject.setTarget(
      this.MapRef.current
    );
  };
  componentDidMount() {
    this.InitMap();
  }

  render() {
    return <div ref={this.MapRef} className="FullExtend" />;
  }
}
