import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';

export default class MapTooltipComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  DeleteTooltip = () => {
    this.props.MapObject.removeOverlay(
      this.props.MapObject.getOverlayById(this.props.TooltipID)
    );
    this.props.MapObject.getLayers()
      .array_[1].getSource()
      .removeFeature(
        this.props.MapObject.getLayers()
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
