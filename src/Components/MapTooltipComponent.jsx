import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CloseOutlined } from '@ant-design/icons';

@inject('ProviderStore')
@observer
export default class MapTooltipComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  DeleteTooltip = () => {
    this.props.ProviderStore.CurrentTab.Options.MapObject.removeOverlay(
      this.props.ProviderStore.CurrentTab.Options.MapObject.getOverlayById(
        this.props.TooltipID
      )
    );
    this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
      .array_[1].getSource()
      .removeFeature(
        this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
          .array_[1].getSource()
          .getFeatureById(this.props.TooltipID)
      );
  };
  render() {
    return (
      <div className="MatteGlass">
        {this.props.Distance}
        <CloseOutlined
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            this.DeleteTooltip();
          }}
        />
      </div>
    );
  }
}
