import MapObject from 'ol/Map';
import OSM from 'ol/source/OSM';
import * as React from 'react';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { Tile as TileLayer } from 'ol/layer';
import Control from 'ol/control/Control';
import { defaults } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';

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
        this.Component = React.lazy(() => import('../Components/MapComponent'));
        let ButtonBar = document.createElement('div');
        ButtonBar.id = `ButtonBar${this.Key}`;
        ButtonBar.className = 'MatteGlass';

        this.Options = {
          MapObject: new MapObject({
            interactions: defaults({ doubleClickZoom: false }),
            controls: [new Control({ element: ButtonBar })],

            layers: [
              new TileLayer({
                preload: Infinity,
                source: new OSM(),
              }),
              new VectorLayer({
                style: new Style({
                  stroke: new Stroke({
                    color: 'rgb(24, 144, 255)',
                    lineDash: [10, 10],
                    width: 3,
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
