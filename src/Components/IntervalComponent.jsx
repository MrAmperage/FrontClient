import * as React from 'react';
import { observer, inject } from 'mobx-react';

@inject('ProviderStore')
@observer
export default class IntervalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
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
    );
  }
}
