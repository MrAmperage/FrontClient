import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Tree } from 'antd';
@inject('ProviderStore')
@observer
export default class TransportTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Columns: [],
      Table: [],
    };
  }

  render() {
    return (
      <Tree
        height={700}
        treeData={this.props.ProviderStore.TransportTree}
        checkable={true}
        selectable={false}
      />
    );
  }
}
