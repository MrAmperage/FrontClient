import { makeObservable, observable, action, autorun } from 'mobx';
import { GenerateTabKey } from '../Helpers/Helpers';
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
    NewTab.key = GenerateTabKey(Tab.id, this.OpenTabs);
    if ('items' in NewTab) {
      NewTab.CurrentMenuItem = NewTab.items[0].id;
    }
    switch (NewTab.id) {
      case 'reports':
        break;
      case 'equipment':
        break;
      case 'exports':
        break;
      case 'actions':
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
