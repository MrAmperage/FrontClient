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

const AppComponents = {
  LeftMenuComponent: React.lazy(() => import('./LeftMenuComponent')),
  map: React.lazy(() => import('./MapComponent')),
  tripsReport: React.lazy(() => import('./TripsReportComponent')),
  tyrespressReport: React.lazy(() => import('./TyrespressReportComponent')),
  tripsExtended: React.lazy(() => import('./TripsExtendedComponent')),
  recalc: React.lazy(() => import('./RecalcComponent')),
  vehicles: React.lazy(() => import('./AdministrationComponent')),
  groups: React.lazy(() => import('./AdministrationComponent')),
  users: React.lazy(() => import('./AdministrationComponent')),
  roles: React.lazy(() => import('./AdministrationComponent')),
};

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    ApiFetch('/api', 'post', { func: 'getUserData' }, (Response) => {
      GlobalStore.SetNewTopMenu(Response.menu);
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
                  {GlobalStore.CurrentTab != null &&
                  'Items' in GlobalStore.CurrentTab
                    ? React.createElement(AppComponents.LeftMenuComponent)
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
                          {React.createElement(
                            'Items' in GlobalStore.CurrentTab
                              ? AppComponents[
                                  GlobalStore.CurrentTab.Options.CurrentMenuItem
                                    .id
                                ]
                              : AppComponents[GlobalStore.CurrentTab.Id]
                          )}
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
