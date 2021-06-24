import React, { useEffect }  from "react";
import { GeoJSON, useMap } from "react-leaflet";
import * as topojson from "topojson-client";

const TopoJSON = (topoJsonData) => {
    const map = useMap()
  const { data, ...defProps } = topoJsonData;
    // const layerRef = useRef(null)

    const addData = (layer, jsonData) => {
        if (jsonData.type === "Topology") {
          for (let key in jsonData.objects) {
            let geojson = topojson.feature(jsonData, jsonData.objects[key]);
            layer.addData(geojson);
          }
        } else {
          layer.addData(jsonData);
        }
      }
    
      useEffect(() => {
        // const layer = map.current.leafletElement;
        addData(map, topoJsonData.data);
      }, [map, topoJsonData.data]);

    return (<div>
         <GeoJSON {...defProps} />;
    </div>)
}
export default TopoJSON