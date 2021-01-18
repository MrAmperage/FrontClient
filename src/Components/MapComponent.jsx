import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import '../CSS/MapComponent.css';
import MapButtonBarComponent from './MapButtonBarComponent';
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
    ReactDOM.render(
      <MapButtonBarComponent ProviderStore={this.props.ProviderStore} />,

      document.getElementById(
        `ButtonBar${this.props.ProviderStore.CurrentTab.Key}`
      )
    );
  };
  componentDidMount() {
    this.InitMap();
  }

  render() {
    return <div ref={this.MapRef} className="FullExtend" />;
  }
}
