import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Calendar, TimePicker } from 'antd';
import FooterIntervalModalWindow from './FooterIntervalModalWindow';

@inject('ProviderStore')
@observer
export default class IntervalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OpenModal: false,
      StartDate: this.props.ProviderStore.CurrentTab.Options.StartDate.clone(),
      EndDate: this.props.ProviderStore.CurrentTab.Options.EndDate.clone(),
    };
  }
  ButtonHandler = (Button) => {
    switch (Button) {
      case 'FirstShift':
        this.setState({
          StartDate: this.state.SelectStartDate.clone()
            .hours(8)
            .minutes(0)
            .seconds(0),
          EndDate: this.state.SelectStartDate.clone()
            .hours(20)
            .minutes(0)
            .seconds(0),
        });

        break;
      case 'SecondShift':
        break;
      case 'FullDay':
        break;
      case 'Apply':
        break;
      case 'Cancel':
        break;
    }
  };
  ModalHandler = (Boolean) => {
    this.setState({ OpenModal: Boolean });
  };
  render() {
    return (
      <div>
        <Modal
          width="700px"
          zIndex={9998}
          visible={this.state.OpenModal}
          footer={<FooterIntervalModalWindow />}
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ width: '300px' }}>
                <strong>Начало периода</strong>
                <Calendar
                  onSelect={(NewStartDate) => {
                    this.setState({ StartDate: NewStartDate });
                  }}
                  defaultValue={
                    this.props.ProviderStore.CurrentTab.Options.StartDate
                  }
                  fullscreen={false}
                  value={this.state.SelectStartDate}
                />
                <TimePicker
                  onOk={(NewStartTime) => {
                    this.setState({ StartDate: NewStartTime });
                  }}
                  value={this.state.StartDate}
                  showNow={false}
                  popupStyle={{ zIndex: 9999 }}
                  format="HH:mm:ss"
                />
              </div>
              <div style={{ width: '300px' }}>
                <strong>Конец периода</strong>
                <Calendar
                  onSelect={(NewEndDate) => {
                    this.setState({ EndDate: NewEndDate });
                  }}
                  fullscreen={false}
                  defaultValue={
                    this.props.ProviderStore.CurrentTab.Options.EndDate
                  }
                />
                <TimePicker
                  onOk={(NewEndTime) => {
                    this.setState({ EndDate: NewEndTime });
                  }}
                  value={this.state.EndDate}
                  showNow={false}
                  popupStyle={{ zIndex: 9999 }}
                  format="HH:mm:ss"
                />
              </div>
            </div>
          </div>
        </Modal>

        <div
          onClick={() => {
            this.ModalHandler(true);
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            backgroundColor: '#1890ff',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              {this.props.ProviderStore.CurrentTab.Options.StartDate.format(
                'DD.MM.YYYY'
              )}
            </span>

            <span>
              {this.props.ProviderStore.CurrentTab.Options.StartDate.format(
                'HH:mm:ss'
              )}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              {this.props.ProviderStore.CurrentTab.Options.EndDate.format(
                'DD.MM.YYYY'
              )}
            </span>
            <span>
              {this.props.ProviderStore.CurrentTab.Options.EndDate.format(
                'HH:mm:ss'
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
