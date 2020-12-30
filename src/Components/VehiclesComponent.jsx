import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';

@inject('ProviderStore')
@observer
export default class VehiclesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Columns: [],
      Table: [],
    };
  }

  FormatColumns(Columns) {
    return Columns.map((Column, Index) => {
      const NewColumn = {
        title: Column.caption,
        dataIndex: Index,
        width: Column.width,
      };
      return NewColumn;
    });
  }

  RequestTransportTable() {
    ApiFetch(
      '/api',
      'post',
      { category: 'vehicles', opts: {}, func: 'getObjectsList' },
      (TableIDResponse) => {
        ApiFetch(
          '/api',
          'post',
          { tid: TableIDResponse.tid, opts: {}, func: 'getTablePage' },
          (Response) => {
            this.setState({
              Columns: this.FormatColumns(Response.cols),
              Table: Response.rows,
            });
          }
        );
      }
    );
  }
  componentDidMount() {
    this.RequestTransportTable();
  }
  render() {
    return (
      <div>
        <Table
          rowSelection={{ type: 'radio', columnWidth: '30px' }}
          rowKey={(record) => {
            return record[0];
          }}
          columns={this.state.Columns}
          dataSource={this.state.Table}
          size="small"
        />
      </div>
    );
  }
}
