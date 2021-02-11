import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';
import { ApiFetch } from '../Helpers/Helpers';
import GeoJSON from 'ol/format/GeoJSON';
import { RandomColor } from '../Helpers/Helpers';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

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
  AddTrack = (TransportId) => {
    ApiFetch(
      `/trackGeoJSON?oid=${TransportId}&sts=${
        this.CurrentTab.Options.StartDate.unix() - 1230768000
      }&fts=${this.CurrentTab.Options.EndDate.unix() - 1230768000}`,
      'get',
      null,
      (Response) => {
        if (Response.geometry.coordinates.length > 0) {
          let NewFeature = new GeoJSON().readFeature(Response, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });
          NewFeature.setId(`Track${TransportId}`);
          NewFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: RandomColor(),
                width: 3,
              }),
            })
          );
          this.CurrentTab.Options.MapObject.getLayers()
            .array_[1].getSource()
            .addFeature(NewFeature);
          this.CurrentTab.Options.MapObject.getView().fit(
            this.CurrentTab.Options.MapObject.getLayers()
              .array_[1].getSource()
              .getExtent()
          );
        }
      }
    );
  };
  DeleteTrack(TransportID) {
    if (
      this.CurrentTab.Options.MapObject.getLayers()
        .array_[1].getSource()
        .getFeatureById(`Track${TransportID}`) != null
    ) {
      this.CurrentTab.Options.MapObject.getLayers()
        .array_[1].getSource()
        .removeFeature(
          this.CurrentTab.Options.MapObject.getLayers()
            .array_[1].getSource()
            .getFeatureById(`Track${TransportID}`)
        );
    }
  }
  UpdateTracks() {
    this.CurrentTab.Options.CheckedTransportKeys.forEach((Key) => {
      this.DeleteTrack(Key);
      this.AddTrack(Key);
    });
  }
  SetNewCheckedTransportKeys(NewTransportKeys) {
    if (
      NewTransportKeys.length > this.CurrentTab.Options.CheckedTransportKeys
    ) {
      NewTransportKeys.forEach((Key) => {
        if (!this.CurrentTab.Options.CheckedTransportKeys.includes(Key)) {
          this.AddTrack(Key);
        }
      });
    } else {
      this.CurrentTab.Options.CheckedTransportKeys.forEach((Key) => {
        if (!NewTransportKeys.includes(Key)) {
          this.DeleteTrack(Key);
        }
      });
    }

    this.CurrentTab.Options.CheckedTransportKeys = NewTransportKeys;
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
