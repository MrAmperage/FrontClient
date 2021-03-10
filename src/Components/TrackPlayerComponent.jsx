import * as React from 'react';
import { Slider, Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { observer, inject } from 'mobx-react';

@inject('ProviderStore')
@observer
export default class TrackPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PlayerInterval: null,
    };
  }
  InitPlayerData() {
    let PlayerDataMap = new Map();

    this.props.ProviderStore.CurrentTab.GetTrackFeaturies().forEach(
      (TrackFeature) => {
        TrackFeature.getGeometry()
          .getCoordinates()
          .forEach((Coordinates) => {
            PlayerDataMap.set(Coordinates[2], {
              Mark: this.props.ProviderStore.CurrentTab.GetVectorLayerSource().getFeatureById(
                `Mark${TrackFeature.getId()}`
              ),
              Coordinates: Coordinates,
            });
          });
      }
    );
    return PlayerDataMap;
  }
  PlayerHandler(Action) {
    switch (Action) {
      case 'Play':
        const PlayerData = this.InitPlayerData();
        if (this.state.PlayerInterval == null) {
          this.setState({
            PlayerInterval: setInterval(() => {
              if (
                this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.unix() !=
                this.props.ProviderStore.CurrentTab.Options.EndDate.unix()
              ) {
                this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(
                  this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.unix() +
                    1
                );
              }
              if (
                PlayerData.has(
                  this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.unix()
                )
              ) {
                let Data = PlayerData.get(
                  this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.unix()
                );
                Data.Mark.getGeometry().setCoordinates(Data.Coordinates);
              }
            }, 10),
          });
        }

        break;
      case 'Pause':
        clearInterval(this.state.PlayerInterval);
        this.setState({ PlayerInterval: null });
        break;
    }
  }
  RemoveTrackPlayer = () => {
    this.props.ProviderStore.CurrentTab.Options.MapObject.removeControl(
      this.props.ProviderStore.CurrentTab.Options.MapObject.getControls()
        .array_[1]
    );
    clearInterval(this.state.PlayerInterval);
    this.setState({ PlayerInterval: null });
    this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(
      this.props.ProviderStore.CurrentTab.Options.StartDate.unix()
    );
    this.props.ProviderStore.CurrentTab.GetVectorLayerSource().forEachFeature(
      (Feature) => {
        if (/MarkTrack/.test(Feature.getId())) {
          this.props.ProviderStore.CurrentTab.GetVectorLayerSource().removeFeature(
            Feature
          );
        }
      }
    );
  };
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
        <Button
          size="small"
          type="primary"
          onClick={() => {
            this.PlayerHandler('Play');
          }}
        >
          Пуск
        </Button>
        <Button
          size="small"
          onClick={() => {
            this.PlayerHandler('Pause');
          }}
        >
          Стоп
        </Button>
        <Slider
          tooltipVisible={false}
          onChange={(NewTime) => {
            this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(NewTime);
          }}
          min={this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}
          max={this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}
          value={this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.unix()}
          style={{
            width: '350px',
          }}
        />
        <Input
          size="small"
          style={{ width: '70px' }}
          value={this.props.ProviderStore.CurrentTab.Options.CurrentTrackPlayerTime.format(
            'HH:mm:ss'
          )}
        />
        <CloseOutlined
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            this.RemoveTrackPlayer();
          }}
        />
      </div>
    );
  }
}
