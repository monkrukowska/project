let dropdown = document.getElementById("ldropdown");
dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "DD_994AUL";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;
const url = "http://localhost:3000/dbselect/layers/" + mapId;

fetch(url)
  .then(function (response) {
    if (response.status !== 200) {
      console.warn(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      let option;

      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i].layer;
        option.value = data[i].value;
        dropdown.add(option);
      }
    });
  })
  .catch(function (err) {
    console.error("Fetch Error -", err);
  });

console.log(myData);
var n = myData.features.length;
var centerCords = [];
switch (mapId) {
  case "czarnowiejska":
    centerCords = [50.067407, 19.918879];
    break;
  case "grzegorzecka":
    centerCords = [50.05656, 19.962796];
    break;
  case "powstancow":
    centerCords = [50.03647, 19.950019];
    break;
  default:
    centerCords = [50.067407, 19.918879];
}
var map = L.map("map", {
  editable: true,
  center: centerCords,
  zoom: 18
});
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a \
            href="http://www.openstreetmap.org/copyright" > OpenStreetMap</a> ',
}).addTo(map);

function encodeHTML(text) {
  var txt = document.createElement("textarea");
  txt.value = text;
  console.log(text);
  return txt.innerHTML;
}

L.geoJson(myData1, {
  onEachFeature: function (feature, layer) {
    temp = JSON.stringify(feature);
    var temp3 = temp.replace(/"/g, "&quot;");
    layer.bindPopup(
      '<div class="popup"><h5>' + feature.properties.f2 +
      '</h5><button class="btn btn-primary" \
            onclick = \'selectObject(' +
      temp3 +
      ")' > Zaznacz</button > " +
      ' <br /> <br /> <input class="form-control center" \
            type ="text" id="f2" value="czarnowiejska" />  <button class="btn btn-primary" \
            type ="button" onclick="addToGeoJSON(' +
      temp3 +
      ')">Dodaj nazwę</button></div>'
    );
  },
}).addTo(map);

var selectedGeoJSON = [];

function selectObject(data) {
  selectedGeoJSON.push(data);
  L.geoJson(selectedGeoJSON, {
    style: function (feature) {
      return {
        color: "yellow",
      };
    },
  }).addTo(map);
}

function addToGeoJSON(data) {
  data.properties.f2 = document.getElementById("f2").value;
}

L.NewPolygonControl = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
      link = L.DomUtil.create("a", "", container);

    link.href = "#";
    link.title = "Create a new polygon";
    link.innerHTML = "▱";
    L.DomEvent.on(link, "click", L.DomEvent.stop).on(
      link,
      "click",
      function () {
        map.editTools.startPolygon();
      }
    );
    container.style.display = "block";
    map.editTools.on("editable:enabled", function (element) {
      container.style.display = "none";
    });
    map.editTools.on("editable:disable", function (element) {
      container.style.display = "block";
    });
    return container;
  },
});

L.AddPolygonShapeControl = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
      link = L.DomUtil.create("a", "", container);
    link.href = "#";
    link.title = "Create a new polygon";
    link.innerHTML = "▱▱";
    L.DomEvent.on(link, "click", L.DomEvent.stop).on(
      link,
      "click",
      function () {
        if (!map.editTools.currentPolygon) return;
        map.editTools.currentPolygon.editor.newShape();
      }
    );
    container.style.display = "none";
    map.editTools.on("editable:enabled", function (element) {
      container.style.display = "block";
    });
    map.editTools.on("editable:disable", function (element) {
      container.style.display = "none";
    });

    return container;
  },
});

map.addControl(new L.NewPolygonControl());
map.addControl(new L.AddPolygonShapeControl());
map.on("layeradd", function (element) {
  if (element.layer instanceof L.Polygon)
    element.layer
    .on("dblclick", L.DomEvent.stop)
    .on("dblclick", element.layer.toggleEdit);
});
map.on("layerremove", function (element) {
  if (element.layer instanceof L.Polygon)
    element.layer
    .off("dblclick", L.DomEvent.stop)
    .off("dblclick", element.layer.toggleEdit);
});
map.editTools.on("editable:enable", function (element) {
  if (this.currentPolygon) this.currentPolygon.disableEdit();
  this.currentPolygon = element.layer;
  this.fire("editable:enabled");
});
map.editTools.on("editable:disable", function (element) {
  delete this.currentPolygon;
});

var deleteShape = function (element) {
  if (
    (element.originalEvent.ctrlKey || element.originalEvent.metaKey) &&
    this.editEnabled()
  )
    this.editor.deleteShapeAt(element.latlng);
};
map.on("layeradd", function (element) {
  if (element.layer instanceof L.Path)
    element.layer
    .on("click", L.DomEvent.stop)
    .on("click", deleteShape, element.layer);
  if (element.layer instanceof L.Path)
    element.layer
    .on("dblclick", L.DomEvent.stop)
    .on("dblclick", element.layer.toggleEdit);
});

function createCheckbox(obj) {
  if (obj.value !== "") {
    var check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.setAttribute("value", obj.value);
    check.setAttribute("name", "layer");
    check.setAttribute("class", "checkbox");

    var label = document.createElement("label");
    label.textContent = input1.value;
    label.setAttribute("name", "layerLabel");

    var br = document.createElement("br");

    label.insertBefore(check, label.firstChild);
    container.appendChild(label);
    container.appendChild(br);

    obj.value = "";
  }
}

var selectall = document.getElementById("selectall");
var checkboxes = document.getElementsByClassName("checkbox");

selectall.addEventListener("change", function (e) {
  for (i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = selectall.checked;
  }
});
for (var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("change", function (e) {
    if (this.checked == false) {
      selectall.checked = false;
    }
    if (
      document.querySelectorAll(".checkbox:checked").length == checkboxes.length
    ) {
      selectall.checked = true;
    }
  });
}