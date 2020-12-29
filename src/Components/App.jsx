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

const AppComponents = {
  LeftMenuComponent: React.lazy(() => import('./LeftMenuComponent')),
  map: React.lazy(() => import('./MapComponent')),
  reports: React.lazy(() => import('./ReportComponent')),
  equipment: React.lazy(() => import('./EquipmentComponent')),
  exports: React.lazy(() => import('./ExportsComponent')),
  actions: React.lazy(() => import('./ActionsComponent')),
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
          <Layout style={{ height: '100vh', width: '100vw' }}>
            <Header></Header>
            <Layout>
              <Sider theme="light">
                <React.Suspense
                  fallback={<Spin tip="Загрузка компонента" size="large" />}
                >
                  {GlobalStore.CurrentTab != null &&
                  'items' in GlobalStore.CurrentTab
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
                      <TabPane tab={Tab.caption} key={Tab.key}>
                        <React.Suspense
                          fallback={
                            <Spin tip="Загрузка компонента" size="large" />
                          }
                        >
                          {React.createElement(
                            AppComponents[GlobalStore.CurrentTab.id]
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
