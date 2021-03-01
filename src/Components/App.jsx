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
const ComponentList = [
  {
    Component: React.lazy(() => import('../Components/MapComponent')),
    Key: 'map',
  },
  {
    Component: React.lazy(() => import('../Components/TransportTreeComponent')),
    Key: 'TransportTree',
  },
  {
    Component: React.lazy(() => import('../Components/IntervalComponent')),
    Key: 'Interval',
  },
];
@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    ApiFetch('/api', 'post', { func: 'getUserData' }, (Response) => {
      GlobalStore.SetNewTopMenu(Response.menu);
      GlobalStore.SetNewTransportTree(Response.vgps.grps, Response.vgps.vehs);
    });
  }
  GetComponent(ComponentID) {
    const CurrentItem = ComponentList.find((Item) => {
      if (Item.Key == ComponentID) {
        return true;
      }
    });
    return <CurrentItem.Component key={ComponentID} />;
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
                  {GlobalStore.CurrentTab != null
                    ? GlobalStore.CurrentTab.Options.LeftMenu.map((Key) => {
                        return this.GetComponent(Key);
                      })
                    : null}
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
                          {this.GetComponent(Tab.Id)}
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
