import MapObject from 'ol/Map';
import OSM from 'ol/source/OSM';
import { Tile as TileLayer } from 'ol/layer';
import Control from 'ol/control/Control';
import { defaults } from 'ol/interaction';
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
        let ButtonBar = document.createElement('div');
        ButtonBar.id = `ButtonBar${this.Key}`;
        ButtonBar.className = 'MatteGlass';

        this.Options = {
          MapObject: new MapObject({
            interactions: defaults({ doubleClickZoom: false }),
            controls: [new Control({ element: ButtonBar })],

            layers: [
              new TileLayer({
                source: new OSM(),
              }),
            ],
            view: new View({
              center: [9699920.994474, 7124384.881034],
              zoom: 13,
            }),
          }),
        };
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
