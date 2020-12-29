import { makeObservable, observable, action } from 'mobx';
import { GenerateTabKey } from '../Helpers/Helpers';
class Store {
  TopMenu = [];
  OpenTabs = [];
  CurrentTab = null;
  constructor() {
    makeObservable(this, {
      TopMenu: observable,
      OpenTabs: observable,
      CurrentTab: observable,
      SetNewCurrentTab: action,
      SetNewTopMenu: action,
      AddTab: action,
      DeleteTab: action,
    });
  }
  SetNewCurrentTab(NewCurrentTabKey) {
    this.CurrentTab = this.OpenTabs.find((Tab) => {
      if (Tab.key == NewCurrentTabKey) {
        return true;
      }
    });
  }
  DeleteTab(TabKey) {
    const DeleteIndex = this.OpenTabs.findIndex((Tab) => {
      if (Tab.key == TabKey) {
        return true;
      }
    });
    this.OpenTabs.splice(DeleteIndex, 1);

    if (this.CurrentTab.key == TabKey) {
      if (this.OpenTabs.length > DeleteIndex) {
        this.SetNewCurrentTab(this.OpenTabs[DeleteIndex].key);
      } else {
        if (this.OpenTabs.length > 0) {
          this.SetNewCurrentTab(this.OpenTabs[DeleteIndex - 1].key);
        } else {
          this.CurrentTab = null;
        }
      }
    }
  }
  SetNewTopMenu(NewTopMenu) {
    this.TopMenu = NewTopMenu;
  }
  AddTab(Tab) {
    let NewTab = { ...Tab };
    switch (NewTab.id) {
      default:
        NewTab.key = GenerateTabKey(NewTab.id, this.OpenTabs);
        break;
    }

    this.OpenTabs.push(NewTab);
    if (this.OpenTabs.length == 1) {
      this.SetNewCurrentTab(this.OpenTabs[0].key);
    }
  }
}

const GlobalStore = new Store();
export default GlobalStore;
