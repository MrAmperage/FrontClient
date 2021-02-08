import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';

class Store {
  TransportTree = [];
  TopMenu = [];
  OpenTabs = [];
  CurrentTab = null;
  constructor() {
    makeAutoObservable(this);
  }
  SetNewCurrentMenuItem(NewMenuItemKey) {
    this.CurrentTab.Options.CurrentMenuItem = this.CurrentTab.Items.find(
      (Item) => {
        if (Item.id == NewMenuItemKey) {
          return true;
        }
      }
    );
  }
  SetNewCheckedTransportKeys(NewTransportKeys) {
    this.CurrentTab.CheckedTransportKeys = NewTransportKeys;
  }
  SetNewDateTimeInterval(NewStartDate, NewEndDate) {
    this.CurrentTab.Options.StartDate = NewStartDate;
    this.CurrentTab.Options.EndDate = NewEndDate;
  }
  SetNewTransportTree(GroupsData, TransportData) {
    this.TransportTree = GroupsData.map((Group) => {
      return {
        title: Group.name,
        key: Group.id,
        children: Group.vehs.map((TransportID) => {
          const Transport = TransportData.find((Transport) => {
            if (Transport.id == TransportID) {
              return true;
            }
          });
          return { title: Transport.caption, key: Transport.id };
        }),
      };
    });
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
