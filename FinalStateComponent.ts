import { Component, OnInit } from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import { environment } from "../../environments/environment";
import IndiaJson from "../IndiaCountry.json";
import CategoryData from "../mapCategory.json";


@Component({
  selector: 'app-state-geo',
  templateUrl: './state-geo.component.html',
  styleUrls: ['./state-geo.component.css']
})
export class StateGeoComponent implements OnInit {
  map: any;
  //style = "mapbox://styles/mapbox/streets-v11";
  style = "mapbox://styles/mapbox/light-v10";
  lat = 40.584978;
  lng = -121.35363;
  hoveredStateId = null;
  animation = { duration: 5000 };
  zoom = 2;
  movingMethod = "easeTo";
  constructor() { 
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    this.displayMap();
  }
  random_rgba(val) {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return "rgba(" + 66 + "," + 133 + "," + 244 + "," + val + ")";
  }
  displayMap() {
   let hoveredStateId = null;
   var target = [77.4126, 23.2599]

    var map = new mapboxgl.Map({
      container: "geo",
      style : "mapbox://styles/mapbox/light-v10",
     zoom: 2,
      center: [77.4126, 23.2599],
      animation: this.animation,
      movingMethod: this.movingMethod,
      animate: true,
      pitch: 60,
      bearing: -60,
    });

    let stateArr = [];
    let viewsArr = [];
    IndiaJson["features"].map((data, i) => {
      stateArr.push(data["properties"].name.toLowerCase());
      let total = 0;
      CategoryData.filter((data, indx) => {
        if (stateArr[i] == data.state) {
          total = total + data.views;
        }
      });
      data["properties"]["views"] = total;
      data["properties"]["fid"] = i;
      viewsArr.push(total);
    });

    var colorArr = ["interpolate", ["linear"], ["get", "fid"]];
    var length = IndiaJson["features"].length;
    IndiaJson["features"].map((data, i) => {
      console.log(data["properties"].views, "views");
      let viewOpacity =
        data["properties"].views < 100000
          ? 0.3
          : data["properties"].views < 500000
          ? 0.6
          : 0.8;
      colorArr.push(data["properties"]["fid"], this.random_rgba(viewOpacity));
    });

    // adding source and layer after mapbox style is loaded
    map.on("styledata", function () {
      //Adding initial source for India
      map.addSource("india_source_1", {
        type: "geojson",
        data: IndiaJson,
      });

      //Adding layer for initial source for
      map.addLayer({
        id: "india_fill_layer_1",
        type: "fill",
        source: "india_source_1",
        layout: {},
        
        paint: {
          "fill-color": colorArr,
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.7,
          ],
        },

        filter: ["==", "$type", "Polygon"],
      });
      map.addLayer({
        'id': 'india_line_layer_1',
        'type': 'line',
        'source': 'india_source_1',

        'paint': {
            'line-color': '#4285f4',
            'line-width': 1
        },

        //   'filter': ['==', '$type', 'Point']
    });
    map.flyTo({
      center: target,
      zoom: 2,
      bearing: 0,
      pitch: 0,
      speed: 0.5, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      easing: function (t) {
          return t;
      },
      essential: true
  });
   
    });
   
    map.on('mousemove', 'india_fill_layer_1', function (e) {
      if (e.features.length > 0) {
          if (hoveredStateId) {
              map.setFeatureState(
                  { source: 'india_source_1', id: hoveredStateId },
                  { hover: false }
              );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
              { source: 'india_source_1', id: hoveredStateId },
              { hover: true }
          );
      }
  });

    map.on("mouseleave", "india_fill_layer_1", function () {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: "india_source_1", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
    });

    map.on('click', 'india_fill_layer_1', function (e) {



      if (e.features.length > 0) {
          map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
             zoom: 4,
              bearing: 0,
              speed: 0.8, // make the flying slow
              curve: 1, // change the speed at which it zooms out
              easing: function (t) {
                  return t;
              },
              essential: true
          });
      }

  });

  map.on('click', 'india_fill_layer_1', function (e) {
    map.removeLayer('category')
    map.removeLayer('district_data')
    map.removeLayer('india_dist_layer_1')
    map.removeLayer('dist_line_layer_1')
    map.removeLayer('india_fill_layer_2')
    map.removeLayer('india_line_layer_2')
    map.removeLayer('india_fill_layer_1')
    map.removeLayer('india_line_layer_1')
    map.addLayer({
      id: "india_fill_layer_1",
      type: "fill",
      source: "india_source_1",
      layout: {},
      zoom: 2,
      paint: {
        "fill-color": "white",
        "fill-opacity": 0
      },

      filter: ["==", "$type", "Polygon"],
    });
  //   map.addLayer({
  //     'id': 'india_line_layer_1',
  //     'type': 'line',
  //     'source': 'india_source_1',

  //     'paint': {
  //         'line-color': 'black',
  //         'line-width': 1
  //     },

  //     //   'filter': ['==', '$type', 'Point']
  // });
    var GeoJson = IndiaJson


    GeoJson['features'].splice(length, GeoJson['features'].length)



    var clickPoint = map.queryRenderedFeatures(e.point)
    let geoState = clickPoint[0].properties.name.toLowerCase()


    let stateName = IndiaJson['features'].filter(obj => obj.properties.name.toLowerCase() == geoState)
    stateName[0].type = "Point"



     
//   

    map.getSource('india_source_1').setData(GeoJson)
    map.addLayer({
        'id': 'india_fill_layer_2',
        'type': 'fill',
        'source': 'india_source_1',
        'layout': {},
        'zoom': 2,
        'paint': {
            'fill-color': '#3481F3',
            'fill-opacity': 0.5
        },

        'filter': ['==', ['get', 'name'], clickPoint[0].properties.name]
    });


    map.addLayer({
        'id': 'india_line_layer_2',
        'type': 'line',
        'source': 'india_source_1',
        'paint': {
            'line-color': '#3481F3',
            'line-width': 2
        },

        'filter': ['==', ['get', 'name'], clickPoint[0].properties.name]
    });

   



});
  }
}
