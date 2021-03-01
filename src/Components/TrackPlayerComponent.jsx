import * as React from 'react';
import { Slider, Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import * as Moment from 'moment';
import { observer, inject } from 'mobx-react';

@inject('ProviderStore')
@observer
export default class TrackPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  RemoveTrackPlayer = () => {
    this.props.ProviderStore.CurrentTab.Options.MapObject.removeControl(
      this.props.ProviderStore.CurrentTab.Options.MapObject.getControls()
        .array_[1]
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
        <Button size="small" type="primary">
          Пуск
        </Button>
        <Button size="small">Стоп</Button>
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
