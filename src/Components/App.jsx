import  * as React from "react"
import * as ReactDOM from "react-dom"
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (<div>Работает</div>)
    
  }
}
ReactDOM.render(<App/>,document.getElementById("App"))
