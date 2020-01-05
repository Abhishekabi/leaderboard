var cap1 = $("#cap1");
var cap2 = $("#cap2");
var globalStatus = "win";
$.ajax({
  url: "/standings",
  type: "GET",
  dataType: "json",
  success: function(res) {
    showTable(res);
  }
});

$(".dropdown-item").on("click", event => {
  var ele = $(event.currentTarget);
  var captain = ele.attr("name");
  var teamToUpdate = $(ele.parent()).attr("name");
  updateUI(captain, teamToUpdate);
});

var updateUI = function(capName, teamToUpdate) {
  var ele = teamToUpdate == "team1" ? cap1 : cap2;
  ele.text(capName);
};

$("#match-status").on("change", event => {
  globalStatus = $(event.target).attr("value");
});

$("#submit-btn").on("click", event => {
  // update DB and get table
  var capA = cap1.text().trim();
  var capB = cap2.text().trim();
  $.ajax({
    url: "/standings",
    type: "POST",
    dataType: "json",
    data: { cap1: capA, cap2: capB, status: globalStatus },
    success: function(res) {
      showTable(res);
    }
  });
});

var showTable = function(res) {
  var entries = Object.entries(res);
  var c = 1;
  $("#placeholder").empty();
  for (const [key, val] of entries) {
    var x = `<tr><td>${c++}</td><td>${key}</td><td>${val.played}</td><td>${
      val.win
    }</td><td>${val.draw}</td><td>${val.loss}</td><td>${val.pts}</td></tr>`;
    $("#placeholder").append(x);
  }
};
