import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Calendar, TimePicker } from 'antd';

@inject('ProviderStore')
@observer
export default class IntervalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OpenModal: false,
    };
  }
  ModalHandler = (Boolean) => {
    this.setState({ OpenModal: Boolean });
  };
  render() {
    return (
      <div>
        <Modal width="700px" zIndex={9998} visible={this.state.OpenModal}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ width: '300px' }}>
                <strong>Начало периода</strong>
                <Calendar
                  fullscreen={false}
                  value={this.state.SelectStartDate}
                />
                <TimePicker
                  showNow={false}
                  popupStyle={{ zIndex: 9999 }}
                  format="HH:mm:ss"
                />
              </div>
              <div style={{ width: '300px' }}>
                <strong>Конец периода</strong>
                <Calendar fullscreen={false} />
                <TimePicker
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
