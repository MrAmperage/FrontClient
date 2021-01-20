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
      <Menu
        selectedKeys={
          this.props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id
        }
      >
        {this.props.ProviderStore.CurrentTab.Items.map((MenuItem) => {
          return (
            <Menu.Item
              key={MenuItem.id}
              onClick={(MenuItemInfo) => {
                this.props.ProviderStore.SetNewCurrentMenuItem(
                  MenuItemInfo.key
                );
              }}
            >
              {MenuItem.caption}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}
