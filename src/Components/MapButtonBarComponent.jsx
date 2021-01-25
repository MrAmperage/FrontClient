import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';
import { getLength } from 'ol/sphere';
import * as ReactDOM from 'react-dom';
import MapTooltipComponent from '../Components/MapTooltipComponent';
import OverlayPositioning from 'ol/OverlayPositioning';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Overlay from 'ol/Overlay';
import LineString from 'ol/geom/LineString';

@inject('ProviderStore')
@observer
export default class MapButtonBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  FormatLength = (Line) => {
    if (getLength(Line) > 100) {
      return `${Math.round((getLength(Line) / 1000) * 100) / 100} km`;
    } else {
      return `${Math.round(getLength(Line) * 100) / 100} m `;
    }
  };

  CreateMapTooltip = (OverlayID) => {
    let RulerTooltipElement = document.createElement('div');
    RulerTooltipElement.id = `Ruler${
      this.props.ProviderStore.CurrentTab.Options.MapVectorSourceLink.getFeatures()
        .length
    }`;

    let OverlayTooltip = new Overlay({
      id: OverlayID,
      element: RulerTooltipElement,
      offset: [15, 0],
      positioning: OverlayPositioning.CENTER_LEFT,
    });
    this.props.ProviderStore.CurrentTab.Options.MapObject.addOverlay(
      OverlayTooltip
    );
    return OverlayTooltip;
  };

  Ruler = () => {
    if (
      this.props.ProviderStore.CurrentTab.Options.MapObject.getInteractions().getLength() ==
      8
    ) {
      let DrawObject = new Draw({
        source: this.props.ProviderStore.CurrentTab.Options.MapVectorSourceLink,
        type: GeometryType.LINE_STRING,
        style: new Style({
          stroke: new Stroke({
            color: 'rgb(24, 144, 255)',
            lineDash: [10, 10],
          }),
        }),
      });
      let OverlayTooltip = null;

      OverlayTooltip = this.CreateMapTooltip(
        `Ruler${
          this.props.ProviderStore.CurrentTab.Options.MapVectorSourceLink.getFeatures()
            .length
        }`
      );

      this.props.ProviderStore.CurrentTab.Options.MapObject.addInteraction(
        DrawObject
      );
      DrawObject.on('drawstart', (DrawEvent) => {
        DrawEvent.feature.getGeometry().on('change', (MoveEvent) => {
          if (MoveEvent.target instanceof LineString) {
            ReactDOM.render(
              <MapTooltipComponent
                ProviderStore={this.props.ProviderStore}
                Distance={this.FormatLength(MoveEvent.target)}
                TooltipID={`Ruler${
                  this.props.ProviderStore.CurrentTab.Options.MapVectorSourceLink.getFeatures()
                    .length
                }`}
              />,
              OverlayTooltip.getElement()
            );

            OverlayTooltip.setPosition(MoveEvent.target.getLastCoordinate());
          }
        });
      });
      DrawObject.on('drawend', (DrawEvent) => {
        DrawEvent.feature.setId(
          `Ruler${
            this.props.ProviderStore.CurrentTab.Options.MapVectorSourceLink.getFeatures()
              .length
          }`
        );
        this.props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
          DrawObject
        );
      });
    }
  };

  render() {
    return (
      <div style={{ padding: '5px' }}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            this.Ruler();
          }}
        >
          Линейка
        </Button>
        <Button size="small" type="primary" style={{ marginLeft: '10px' }}>
          Плеер треков
        </Button>
      </div>
    );
  }
}
