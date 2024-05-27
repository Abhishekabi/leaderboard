const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();

var G_obj = {
  Abhishek: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Jaffer: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Karish: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Kumar: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Naveen: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Lokesh: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Muthu: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 },
  Venkat: { played: 0, win: 0, loss: 0, draw: 0, pts: 0 }
};

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/standings", (req, res) => {
  const cap1 = req.body.cap1;
  const cap2 = req.body.cap2;
  const status = req.body.status;
  updateLocalVar(cap1, cap2, status);
  res.json(G_obj);
});

app.get("/standings", (req, res) => {
  res.json(G_obj);
});

var updateLocalVar = function(cap1, cap2, status) {
  G_obj[cap1].played = G_obj[cap1].played + 1;
  G_obj[cap2].played = G_obj[cap2].played + 1;
  switch (status) {
    case "win":
      G_obj[cap1].win = G_obj[cap1].win + 1;
      G_obj[cap2].loss = G_obj[cap2].loss + 1;
      G_obj[cap1].pts = G_obj[cap1].pts + 2;
      break;
    case "loss":
      G_obj[cap2].win = G_obj[cap2].win + 1;
      G_obj[cap1].loss = G_obj[cap1].loss + 1;
      G_obj[cap2].pts = G_obj[cap2].pts + 2;
      break;
    case "draw":
      G_obj[cap1].draw = G_obj[cap1].draw + 1;
      G_obj[cap2].draw = G_obj[cap2].draw + 1;
      G_obj[cap2].pts = G_obj[cap2].pts + 1;
      G_obj[cap1].pts = G_obj[cap1].pts + 1;
      break;
  }
  G_obj = sortObj(G_obj, "pts", true, true);
};

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {string|int} sortedBy 1 - sort object properties by specific value.
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @param {bool} reverse false - reverse sorting.
 * @returns {object} new object
 */
function sortObj(obj, sortedBy, isNumericSort, reverse) {
  sortedBy = sortedBy || 1; // by default first key
  isNumericSort = isNumericSort || false; // by default text sort
  reverse = reverse || false; // by default no reverse

  var reversed = reverse ? -1 : 1;

  var sortable = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  if (isNumericSort)
    sortable.sort(function(a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function(a, b) {
      var x = a[1][sortedBy].toLowerCase(),
        y = b[1][sortedBy].toLowerCase();
      return x < y ? reversed * -1 : x > y ? reversed : 0;
    });
  var newObject = {};
  for (var i = 0; i < sortable.length; i++) {
    var key = sortable[i][0];
    var value = sortable[i][1];
    newObject[key] = value;
  }
  return newObject;
}

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
