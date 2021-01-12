import { makeObservable, observable, action } from 'mobx';
import { GenerateTabKey } from '../Helpers/Helpers';
import XYZ from 'ol/source/XYZ';
import { defaults } from 'ol/interaction';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import MapObject from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import Control from 'ol/control/Control';

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
      case 'map':
        const VectorSourceLink = new VectorSource();
        NewTab.Options = {
          MapVectorSourceLink: VectorSourceLink,
          MapObject: new MapObject({
            interactions: defaults({ doubleClickZoom: false }),
            layers: [
              new TileLayer({
                preload: Infinity,
                source: new XYZ({
                  url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                }),
              }),
              new VectorLayer({
                source: VectorSourceLink,
              }),
            ],
            view: new View({
              center: [9699920.994474, 7124384.881034],
              zoom: 13,
            }),
          }),
        };
        break;
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
