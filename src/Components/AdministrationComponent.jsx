import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';

@inject('ProviderStore')
@observer
export default class AdministrationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Columns: [],
      Table: [],
    };
  }

  render() {
    return (
      <div>
        <Table
          rowSelection={{ type: 'radio', columnWidth: '30px' }}
          rowKey={(record) => {
            return record[0];
          }}
          columns={
            this.props.CurrentData != null
              ? this.props.CurrentData.Columns
              : null
          }
          dataSource={
            this.props.CurrentData != null ? this.props.CurrentData.Table : null
          }
          size="small"
        />
      </div>
    );
  }
}
