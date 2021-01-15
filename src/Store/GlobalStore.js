import { makeObservable, observable, action } from 'mobx';
import { Tab } from '../Classes/TabClass';

class Store {
  TopMenu = [];
  OpenTabs = [];
  CurrentTab = null;
  constructor() {
    makeObservable(this, {
      SetNewCurrentMenuItemKey: action,
      TopMenu: observable,
      OpenTabs: observable,
      CurrentTab: observable,
      SetNewCurrentTab: action,
      SetNewTopMenu: action,
      AddTab: action,
      DeleteTab: action,
    });
  }
  SetNewCurrentMenuItemKey(NewMenuItemKey) {
    this.CurrentTab.CurrentMenuItem = NewMenuItemKey;
  }

  SetNewCurrentTab(NewCurrentTabKey) {
    this.CurrentTab = this.OpenTabs.find((Tab) => {
      if (Tab.Key == NewCurrentTabKey) {
        return true;
      }
    });
  }
  DeleteTab(TabKey) {
    const DeleteIndex = this.OpenTabs.findIndex((Tab) => {
      if (Tab.Key == TabKey) {
        return true;
      }
    });
    this.OpenTabs.splice(DeleteIndex, 1);

    if (this.CurrentTab.Key == TabKey) {
      if (this.OpenTabs.length > DeleteIndex) {
        this.SetNewCurrentTab(this.OpenTabs[DeleteIndex].key);
      } else {
        if (this.OpenTabs.length > 0) {
          this.SetNewCurrentTab(this.OpenTabs[DeleteIndex - 1].Key);
        } else {
          this.CurrentTab = null;
        }
      }
    }
  }
  SetNewTopMenu(NewTopMenu) {
    this.TopMenu = NewTopMenu;
  }
  AddTab(TabObject) {
    this.OpenTabs.push(new Tab(TabObject, this.OpenTabs));
    if (this.OpenTabs.length == 1) {
      this.CurrentTab = this.OpenTabs[0];
    }
  }
}

const GlobalStore = new Store();
export default GlobalStore;
