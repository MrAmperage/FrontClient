import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApiFetch } from '../Helpers/Helpers';
import { Layout, Button, Tabs, ConfigProvider, Spin } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
import GlobalStore from '../Store/GlobalStore';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import '../CSS/AppComponent.css';
const LeftMenuComponent = React.lazy(() => import('./LeftMenuComponent'));

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { CurrentData: null };
  }
  componentDidMount() {
    ApiFetch('/api', 'post', { func: 'getUserData' }, (Response) => {
      GlobalStore.SetNewTopMenu(Response.menu);
    });
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
  RequestAdministrationTable() {
    ApiFetch(
      '/api',
      'post',
      {
        category: GlobalStore.CurrentTab.Options.CurrentMenuItem.id,
        opts: {},
        func: 'getObjectsList',
      },
      (TableIDResponse) => {
        ApiFetch(
          '/api',
          'post',
          { tid: TableIDResponse.tid, opts: {}, func: 'getTablePage' },
          (Response) => {
            this.setState({
              CurrentData: {
                Columns: this.FormatColumns(Response.cols),
                Table: Response.rows,
              },
            });
          }
        );
      }
    );
  }

  render() {
    return (
      <Provider ProviderStore={GlobalStore}>
        <ConfigProvider locale={ru_RU}>
          <Layout className="FullExtend">
            <Header></Header>
            <Layout>
              <Sider theme="light">
                <React.Suspense
                  fallback={<Spin tip="Загрузка компонента" size="large" />}
                >
                  {GlobalStore.CurrentTab != null &&
                  'Items' in GlobalStore.CurrentTab ? (
                    <LeftMenuComponent
                      MenuItemHandler={() => {
                        this.RequestAdministrationTable();
                      }}
                    />
                  ) : null}
                </React.Suspense>
              </Sider>
              <Content>
                {GlobalStore.TopMenu.map((TopButton) => {
                  return (
                    <Button
                      onClick={() => {
                        GlobalStore.AddTab(TopButton);
                      }}
                      key={TopButton.id}
                    >
                      {TopButton.caption}
                    </Button>
                  );
                })}
                <Tabs
                  style={{ height: 'calc(100% - 4%)', with: '100%' }}
                  hideAdd={true}
                  type="editable-card"
                  onChange={(TabKey) => {
                    GlobalStore.SetNewCurrentTab(TabKey);
                  }}
                  onEdit={(TabKey, Action) => {
                    if (Action == 'remove') {
                      GlobalStore.DeleteTab(TabKey);
                      if (GlobalStore.OpenTabs.length == 0) {
                        this.setState({ CurrentData: null });
                      }
                    }
                  }}
                >
                  {GlobalStore.OpenTabs.map((Tab) => {
                    return (
                      <TabPane
                        tab={Tab.Caption}
                        key={Tab.Key}
                        className="FullExtend"
                      >
                        <React.Suspense
                          fallback={
                            <Spin tip="Загрузка компонента" size="large" />
                          }
                        >
                          {
                            <Tab.Component
                              CurrentData={this.state.CurrentData}
                            />
                          }
                        </React.Suspense>
                      </TabPane>
                    );
                  })}
                </Tabs>
              </Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </Provider>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('App'));
