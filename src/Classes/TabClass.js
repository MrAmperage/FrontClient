import MapObject from 'ol/Map';
import OSM from 'ol/source/OSM';
import * as React from 'react';
import Stroke from 'ol/style/Stroke';
import * as Moment from 'moment';
import Style from 'ol/style/Style';
import { Tile as TileLayer } from 'ol/layer';
import { defaults } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import { makeAutoObservable } from 'mobx';

export class Tab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.id;
    this.Caption = TabObject.caption;
    this.Key = this.GenerateTabKey(TabObject.id, OpenTabs);
    if ('items' in TabObject) {
      this.Items = TabObject.items;
      this.Options = { CurrentMenuItem: TabObject.items[0] };
    }
    switch (TabObject.id) {
      case 'map':
        this.Options = {
          CheckedTransportKeys: [],
          LeftMenu: ['Interval', 'TransportTree'],
          StartDate:
            Moment().hours() < 20
              ? Moment('08:00:00', 'HH:mm:ss')
              : Moment('20:00:00', 'HH:mm:ss'),

          EndDate:
            Moment().hours() < 20
              ? Moment('20:00:00', 'HH:mm:ss')
              : Moment('08:00:00', 'HH:mm:ss').add(1, 'day'),
          CurrentTrackPlayerTime:
            Moment().hours() < 20
              ? Moment('08:00:00', 'HH:mm:ss')
              : Moment('20:00:00', 'HH:mm:ss'),

          MapObject: new MapObject({
            interactions: defaults({ doubleClickZoom: false }),
            controls: [],

            layers: [
              new TileLayer({
                preload: Infinity,
                source: new OSM(),
              }),
              new VectorLayer({
                style: new Style({
                  stroke: new Stroke({
                    color: 'rgb(24, 144, 255)',
                    width: 2,
                  }),
                }),
                source: new VectorSource(),
              }),
            ],
            view: new View({
              center: [9699920.994474, 7124384.881034],
              zoom: 13,
            }),
          }),
        };
        this.GetVectorLayer = () => {
          return this.Options.MapObject.getLayers().array_[1];
        };
        this.GetTransportMarks = () => {
          return this.Options.MapObject.getLayers()
            .array_[1].getSource()
            .getFeatures()
            .filter((Feature) => {
              if (/MarkTrack/.test(Feature.getId())) {
                return true;
              }
            });
        };
        this.GetTrackFeaturies = () => {
          return this.Options.MapObject.getLayers()
            .array_[1].getSource()
            .getFeatures()
            .filter((Feature) => {
              if (/^Track\d{1,}/.test(Feature.getId())) {
                return true;
              }
            });
        };
        this.GetVectorLayerSource = () => {
          return this.Options.MapObject.getLayers().array_[1].getSource();
        };
        break;
      case 'settings':
        this.Component = React.lazy(() =>
          import('../Components/AdministrationComponent')
        );
        break;
      case 'reports':
        this.Component = React.lazy(() =>
          import('../Components/TripsReportComponent')
        );
        break;
      case 'equipment':
        this.Component = React.lazy(() =>
          import('../Components/TyrespressReportComponent')
        );
        break;
      case 'exports':
        this.Component = React.lazy(() =>
          import('../Components/TripsExtendedComponent')
        );
        break;
      case 'actions':
        this.Component = React.lazy(() =>
          import('../Components/RecalcComponent')
        );
        break;
    }
    makeAutoObservable(this);
  }
  GenerateTabKey(TabID, OpenTabs) {
    let TabCount = 0;
    OpenTabs.forEach((Tab) => {
      if (Tab.Id == TabID) {
        TabCount = TabCount + 1;
      }
    });
    return `${TabID}${TabCount}`;
  }
}
