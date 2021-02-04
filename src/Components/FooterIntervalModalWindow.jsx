import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';

@inject('ProviderStore')
@observer
export default class FooterIntervalModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button size="small" onClick={() => {}}>
            Первая смена
          </Button>
          <Button size="small" onClick={() => {}}>
            Вторая смена
          </Button>
          <Button size="small" onClick={() => {}}>
            Сутки
          </Button>
        </div>
        <div>
          <Button size="small" type="primary" onClick={() => {}}>
            Применить
          </Button>
          <Button size="small" onClick={() => {}}>
            Отмена
          </Button>
        </div>
      </div>
    );
  }
}
