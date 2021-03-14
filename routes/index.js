var express = require("express");
var router = express.Router();

var pg = require("pg");

var conString = "postgres://postgres:MOJEHASLO@localhost:5432/NAZWABAZY_TEST";

var czarnowiejska_rows =
  "SELECT 'Feature' As type, lg.layer, \
  ST_AsGeoJSON(st_transform(lg.wkb_geometry, 4326))::json As geometry, \
  row_to_json((ogc_fid, layer)) As properties \
  FROM entities As lg";

var grzegorzecka_rows =
  "SELECT 'Feature' As type,  lg.layer, \
    ST_AsGeoJSON(st_transform(lg.wkb_geometry, 4326))::json As geometry, \
    row_to_json((ogc_fid, layer)) As properties \
    FROM public.grzegorzecka As lg\
     where lg.layer not in ('K1_111OPX','K1_921DIG')";

var powstancow_rows =
  "SELECT 'Feature' As type,  lg.layer, \
      ST_AsGeoJSON(st_transform(lg.wkb_geometry, 4326))::json As geometry, \
      row_to_json((ogc_fid, layer)) As properties \
      FROM public.powstancow As lg\
       where lg.layer not in ('K1_921DIG','K1_922DLI')";

function getQuery(mapId) {
  var street_query = getMapQuery(mapId);
  if (street_query)
    return (
      " SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features \
  FROM (" +
      getMapQuery(mapId) +
      ") As f where f.geometry->>'type' != 'Point'  ) As fc"
    );
  return null;
}

function getMapQuery(mapId) {
  switch (mapId) {
    case "czarnowiejska":
      return czarnowiejska_rows;
    case "grzegorzecka":
      return grzegorzecka_rows;
    case "powstancow":
      return powstancow_rows;
  }
  return null;
}

router.get("/", function (req, res) {
  res.render("index", {
    title: "Express",
  });
});

router.get("/map", function (req, res) {
  res.redirect("/map/czarnowiejska");
});

router.get("/map/:mapId", function (req, res) {
  var client = new pg.Client(conString);
  var mapa = req.params.mapId;
  client.connect();
  var query = client.query(getQuery(mapa));
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    var data = result.rows[0].row_to_json;
    res.locals.jsonData = JSON.stringify(data);
    res.locals.mapId = JSON.stringify(mapa);
    res.render("map");
  });
});

router.get("/filteredMap", function (req, res) {
  var mapa = JSON.parse(req.query.mapId);
  var name = req.query.layer;

  if (
    name.indexOf("--") > -1 ||
    name.indexOf("'") > -1 ||
    name.indexOf(";") > -1 ||
    name.indexOf("/*") > -1 ||
    name.indexOf("xp_") > -1
  ) {
    console.log("Bad request detected");
    res.redirect("/map");
    return;
  } else {
    console.log("Request passed");

    if (getMapQuery(mapa) == null) {
      console.log("Bad request detected");
      res.redirect("/map");
      return;
    }

    var n = name.length;
    if (name[0] == name[0][0]) name = [name];
    var in_sql1 = "";
    var separator = "";
    for (i = 0; i < name.length; i++) {
      in_sql1 = in_sql1 + separator + "'" + name[i] + "'";
      separator = ",";
    }
    console.log(in_sql1);

    var sql1 =
      "SELECT row_to_json(fc) \
      FROM ( SELECT 'FeatureCollection' As type, \
      array_to_json(array_agg(f)) As features \
      FROM (\
        " +
      getMapQuery(mapa) +
      " ) As f \
        WHERE f.layer in ( " +
      in_sql1 +
      " ) \
        ) As fc";

    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(sql1);
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      var data = result.rows[0].row_to_json;
      res.locals.jsonData = JSON.stringify(data);
      res.locals.mapId = JSON.stringify(mapa);
      res.render("map");
    });
  }
});

router.get("/dbselect/layers/:mapId", function (req, res) {
  var street_query = getMapQuery(req.params.mapId);
  if (!street_query)
    res.send(
      JSON.stringify([
        {
          layer: "empty",
          value: "empty",
        },
      ])
    );
  var client = new pg.Client(conString);
  client.connect();
  var new_query =
    "SELECT distinct f.layer, f.layer as value FROM ( " +
    street_query +
    " ) as f WHERE	f.geometry->>'type' != 'Point'";
  var query = client.query(new_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    var data = result.rows;
    res.send(JSON.stringify(data));
  });
});

router.get("/drawit", function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  res.render("drawit");
});

module.exports = router;
