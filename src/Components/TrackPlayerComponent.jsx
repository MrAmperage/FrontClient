import * as React from 'react';
import { Slider, Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import * as Moment from 'moment';
export default class TrackPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentTime: this.props.ProviderStore.CurrentTab.Options.StartDate.clone().unix(),
    };
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
            this.setState({
              CurrentTime: NewTime,
            });
          }}
          min={this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}
          max={this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}
          style={{
            width: '350px',
          }}
        />
        <Input
          size="small"
          style={{ width: '70px' }}
          value={Moment.unix(this.state.CurrentTime).format('HH:mm:ss')}
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
