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
import TrackPlayerComponent from './TrackPlayerComponent';
import Control from 'ol/control/Control';

@inject('ProviderStore')
@observer
export default class MapButtonBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  TrackPlayer = () => {
    if (
      this.props.ProviderStore.CurrentTab.Options.MapObject.getControls().array_
        .length == 1
    ) {
      const TrackPlayerElement = document.createElement('div');
      const TrackPlayerControl = new Control({
        element: TrackPlayerElement,
      });
      this.props.ProviderStore.CurrentTab.Options.MapObject.addControl(
        TrackPlayerControl
      );
      ReactDOM.render(
        <TrackPlayerComponent ProviderStore={this.props.ProviderStore} />,
        TrackPlayerElement
      );
    }
  };
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
      this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
        .array_[1].getSource()
        .getFeatures().length
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
        source: this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers().array_[1].getSource(),
        type: GeometryType.LINE_STRING,
        style: new Style({
          stroke: new Stroke({
            color: 'rgb(24, 144, 255)',
            lineDash: [10, 10],
            width: 2,
          }),
        }),
      });
      let OverlayTooltip = null;

      OverlayTooltip = this.CreateMapTooltip(
        `Ruler${
          this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
            .array_[1].getSource()
            .getFeatures().length
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
                  this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
                    .array_[1].getSource()
                    .getFeatures().length
                }`}
              />,
              OverlayTooltip.getElement()
            );

            OverlayTooltip.setPosition(MoveEvent.target.getLastCoordinate());
          }
        });
      });
      DrawObject.on('drawend', (DrawEvent) => {
        DrawEvent.feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: 'rgb(24, 144, 255)',
              lineDash: [10, 10],
              width: 2,
            }),
          })
        );
        DrawEvent.feature.setId(
          `Ruler${
            this.props.ProviderStore.CurrentTab.Options.MapObject.getLayers()
              .array_[1].getSource()
              .getFeatures().length
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
        <Button
          size="small"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => {
            this.TrackPlayer();
          }}
        >
          Плеер треков
        </Button>
      </div>
    );
  }
}
