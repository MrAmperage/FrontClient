import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Tree } from 'antd';
@inject('ProviderStore')
@observer
export default class TransportTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  TransportChech = (CheckedKey) => {
    let CheckedKeysArray = [];
    CheckedKey.forEach((Key) => {
      this.props.ProviderStore.TransportTree.forEach((TreeItem) => {
        TreeItem.children.forEach((TransportItem) => {
          if (TransportItem.key == Key) {
            CheckedKeysArray.push(TransportItem.key);
          }
        });
      });
    });

    this.props.ProviderStore.SetNewCheckedTransportKeys(CheckedKeysArray);
  };
  render() {
    return (
      <Tree
        onCheck={(CheckedKeys, Info) => {
          this.TransportChech(CheckedKeys);
        }}
        height={700}
        treeData={this.props.ProviderStore.TransportTree}
        checkable={true}
        selectable={false}
      />
    );
  }
}
