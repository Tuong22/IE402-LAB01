require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/geometry/Polygon",
  "esri/geometry/Polyline",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "dojo/domReady!",
], function (
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  Point,
  Polygon,
  Polyline,
  SimpleMarkerSymbol,
  SimpleFillSymbol,
  SimpleLineSymbol
) {
  var map = new Map({
    basemap: "satellite",
  });

  var view = new MapView({
    container: "viewDiv",
    map: map, 
    center: [105.7132827, 21.0084108],
    zoom: 10,
    highlightOptions: {
      color: "blue",
    },
  });

  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  fetch("data.json")
    .then((response) => response.json())
    .then((jsondata) => {
      jsondata.polygons.forEach(function (data) {
        var polygonGraphic = new Graphic({
          geometry: new Polygon({
            rings: data.rings,
            spatialReference: { wkid: 4326 },
          }),
          symbol: new SimpleFillSymbol({
            color: data.symbol.color,
            outline: data.symbol.outline,
          }),
          attributes: data,
          popupTemplate: data.popupTemplate,
        });
        polygonGraphic.visible = true;
        graphicsLayer.add(polygonGraphic);
      });

      jsondata.points.forEach(function (data) {
        var pointGraphic = new Graphic({
          geometry: new Point({
            x: data.longitude,
            y: data.latitude,
            spatialReference: { wkid: 4326 },
          }),
          symbol: data.symbol,
          attributes: data,
          popupTemplate: data.popupTemplate,
        });
        pointGraphic.visible = true;
        graphicsLayer.add(pointGraphic);
      });

      jsondata.lines.forEach(function (data) {
        var lineGraphic = new Graphic({
          geometry: new Polyline({
            paths: data.paths,
            spatialReference: { wkid: 4326 },
          }),
          symbol: data.symbol,
          attributes: data,
          popupTemplate: data.popupTemplate,
        });
        lineGraphic.visible = true;
        graphicsLayer.add(lineGraphic);
      });

      const controlsDiv = document.createElement("div");
      controlsDiv.className = "controls";
      controlsDiv.innerHTML = `
                <label><input type="checkbox" id="togglePolygons" checked> Show Polygons</label><br>
                <label><input type="checkbox" id="togglePoints" checked> Show Points</label><br>
                <label><input type="checkbox" id="toggleLines" checked> Show Lines</label>
            `;
      document.body.appendChild(controlsDiv);

      document
        .getElementById("togglePolygons")
        .addEventListener("change", function () {
          graphicsLayer.graphics.forEach((graphic) => {
            if (graphic.geometry.type === "polygon") {
              graphic.visible = this.checked;
            }
          });
        });

      document
        .getElementById("togglePoints")
        .addEventListener("change", function () {
          graphicsLayer.graphics.forEach((graphic) => {
            if (graphic.geometry.type === "point") {
              graphic.visible = this.checked;
            }
          });
        });

      document
        .getElementById("toggleLines")
        .addEventListener("change", function () {
          graphicsLayer.graphics.forEach((graphic) => {
            if (graphic.geometry.type === "polyline") {
              graphic.visible = this.checked;
            }
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
