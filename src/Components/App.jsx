import * as React from 'react';
import * as ReactDOM from 'react-dom';
import{ApiFetch} from "../Helpers/Helpers"
import { Layout, Button, Tabs, ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
import GlobalStore from '../Store/GlobalStore';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import "antd/dist/antd.css";


@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    ApiFetch("/api","post",{func:"getUserData"},(Response)=>{
  GlobalStore.SetNewMenu(Response.menu)
    })

  }
  render() {
    return (
      <Provider ProviderStore={GlobalStore}>
        <ConfigProvider locale={ru_RU}>
          <Layout style={{ height: '100vh', width: '100vw' }}>
            <Header></Header>
            <Layout>
              <Sider theme="light"></Sider>
              <Content>
              { GlobalStore.Menu.map((TopButton)=>{
                  return <Button key={TopButton.id}>{TopButton.caption}</Button>
                })}
                <Tabs></Tabs>
              </Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </Provider>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('App'));
