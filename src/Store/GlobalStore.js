import { makeObservable, observable, action } from 'mobx';

class Store {
  Menu = [];
  OpenTabs = [];
  constructor() {
    makeObservable(this, {
      Menu: observable,
      OpenTabs: observable,
      SetNewMenu: action,
    });
  }

  SetNewMenu(NewMenu) {
    this.Menu = NewMenu;
  }
}

const GlobalStore = new Store();
export default GlobalStore;
