import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Menu } from 'antd';

@inject('ProviderStore')
@observer
export default class LeftMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu>
        {this.props.ProviderStore.CurrentTab.items.map((MenuItem) => {
          return <Menu.Item key={MenuItem.id}>{MenuItem.caption}</Menu.Item>;
        })}
      </Menu>
    );
  }
}
