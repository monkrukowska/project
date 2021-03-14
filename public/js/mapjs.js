$(document).ready(function () {
  $("#btnCreatePoly").on("click", function () {
    var n = selectedGeoJSON.length;
    var coords = [];
    for (i = 0; i < n; i++) {
      var tempFeature = selectedGeoJSON[i];
      if (tempFeature.geometry.coordinates.length > 3) {
        tempArray = tempFeature.geometry.coordinates.map((point) => {
          return [point[1], point[0]];
        });
        coords = coords.concat(tempArray);
      }
    }

    var f1 = tempFeature.properties.f1;
    var f2 = document.getElementById("f2").value;

    var workingOnGeoJson = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords
        },
        properties: {
          f1: f1,
          f2: f2
        },
      }, ],
    };

    var newTurfPolygon = turf.lineToPolygon(workingOnGeoJson, {
      autoComplete: true,
    });

    L.polygon(newTurfPolygon.geometry.coordinates, {
        weight: 1,
        fillOpacity: 0.5,
        color: "red",
        dashArray: "3",
      })
      .on("click", function whenClicked(e) {
        var textarea = $("#currentpolygon");
        textarea.val(JSON.stringify(e.target.toGeoJSON()));
      })
      .addTo(map)
      .enableEdit();

    var textarea = $("#currentpolygon");
    textarea.text(JSON.stringify(workingOnGeoJson));
    selectedGeoJSON = [];
  });

  $("#btnCreateHull").on("click", function () {
    var n = selectedGeoJSON.length;
    var turfPointsArray = [];
    for (i = 0; i < n; i++) {
      var tempFeature = selectedGeoJSON[i];
      if (tempFeature.geometry.coordinates.length > 3) {
        tempTurf = tempFeature.geometry.coordinates.map((point) => {
          return turf.point([point[0], point[1]]);
        });
        turfPointsArray = turfPointsArray.concat(tempTurf);
      }
    }

    var f1 = tempFeature.properties.f1;
    var f2 = document.getElementById("f2").value;

    var points = turf.featureCollection(turfPointsArray);
    var hull = turf.convex(points);
    hull.properties = {
      f1: f1,
      f2: f2
    };
    var geoJsonLayer = L.geoJson(hull, {
      style: {
        weight: 1,
        fillOpacity: 0.5,
        color: "green",
        dashArray: "3",
      },
      onEachFeature: function onEachFeature(feature, layer) {
        layer.on({
          click: function whenClicked(e) {
            var textarea = $("#currentpolygon");
            textarea.val(JSON.stringify(e.target.toGeoJSON()));
          },
        });
      },
    }).addTo(map);

    var textarea = $("#currentpolygon");
    textarea.text(JSON.stringify(points));
    selectedGeoJSON = [];
  });

  $("button[name='zapisz']").on("click", function () {
    var textarea = $("#currentpolygon");

    var file = "test.geojson";
    saveAs(
      new File([textarea.val()], file, {
        type: "text/plain;charset=utf-8",
      }),
      file
    );
  });

  $("button[name='clear']").on("click", function () {
    localStorage.clear();
    window.location.reload();
  });


});