//Fetch
getData();

function getData() {
  if (window.location.pathname == "/senate-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var senateData = data.results[0].members;
      states(senateData);
      tableFilter(senateData);
      listeners(senateData);
      document.getElementById("spin").style.display = "none";
    })
  } else if (window.location.pathname == "/senate-attendance-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var senateData = data.results[0].members;
      calculations(senateData);
      tableGlance(senateData);
      tableLeast(senateData);
      tableMost(senateData);
    })
  } else if (window.location.pathname == "/senate-party-loyalty-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var senateData = data.results[0].members;
      calculations(senateData);
      tableGlance(senateData);
      tableLeastLoyal(senateData);
      tableMostLoyal(senateData);
    })
  } else if (window.location.pathname == "/house-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var houseData = data.results[0].members;
      states(houseData);
      tableFilter(houseData);
      listeners(houseData);
      document.getElementById("spin").style.display = "none";
    })
  } else if (window.location.pathname == "/house-attendance-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var houseData = data.results[0].members;
      calculations(houseData);
      tableGlance(houseData);
      tableLeast(houseData);
      tableMost(houseData);
    })
  } else if (window.location.pathname == "/house-party-loyalty-starter-page.html") {
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
      method: "GET",
      headers: {
        "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
      }
    }).then(function (result) {
      return result.json()
    }).then(function (data) {
      var houseData = data.results[0].members;
      calculations(houseData);
      tableGlance(houseData);
      tableLeastLoyal(houseData);
      tableMostLoyal(houseData);
    })
  }
}

//Listeners
function listeners(array) {
  document.getElementById("mySelect").addEventListener("change", function () {
    filterAll(array)
  });
  document.getElementById("R").addEventListener("click", function () {
    filterAll(array)
  });
  document.getElementById("D").addEventListener("click", function () {
    filterAll(array)
  });
  document.getElementById("I").addEventListener("click", function () {
    filterAll(array)
  });
}

//States Options
function states(array) {
  var statesArray = [];
  var select = document.getElementById("mySelect");
  for (var a = 0; a < array.length; a++) {
    var state = array[a].state;
    statesArray.sort().push(state);
    var norepeatedValues = [];
    for (var i = 0; i < statesArray.length; i++) {
      for (var j = i + 1; j < statesArray.length; j++) {
        if (statesArray[i] == statesArray[j]) {
          if (!norepeatedValues.includes(statesArray[i])) {
            norepeatedValues.push(statesArray[i]);
          }
        }
      }
    }
  }
  for (var b = 0; b < norepeatedValues.length; b++) {
    var option = document.createElement("option");
    option.append(norepeatedValues[b]);
    mySelect.append(option);
  }
}

//Select + Checkboxes
function filterAll(array) {
  var members = array;
  let checkValue = [...document.querySelectorAll("input[name=party]:checked")];
  var parties = checkValue.map(checked => checked.value);
  var idVal = document.getElementById("mySelect");
  var statesF = idVal.value;
  var filteredMembers = [];
  for (var i = 0; i < members.length; i++) {
    if ((statesF == "All") && (parties.length == 0)) {
      filteredMembers.push(members[i]);
    } else if ((members[i].state == statesF) && (parties.length == 0)) {
      filteredMembers.push(members[i]);
    } else if ((statesF == "All") && (parties.length > 0)) {
      for (var i = 0; i < members.length; i++) {
        for (var a = 0; a < parties.length; a++) {
          if (members[i].party === parties[a]) {
            filteredMembers.push(members[i]);
          }
        }
      }
    } else if ((statesF == members[i].state) && (parties.length > 0)) {
      for (var i = 0; i < members.length; i++) {
        for (var a = 0; a < parties.length; a++) {
          if ((members[i].party == parties[a]) && (members[i].state == statesF)) {
            filteredMembers.push(members[i]);
          }
        }
      }
    }
  }
  tableFilter(filteredMembers);
}

//Filter Table
function tableFilter(array) {
  var body = document.getElementById("body");
  body.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var row = document.createElement("tr");
    var fullName = array[i].first_name + " " + (array[i].middle_name || " ") + " " + array[i].last_name;
    var a = document.createElement("a");
    var link = array[i].url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    row.insertCell().append(a);
    row.insertCell().innerHTML = array[i].party;
    row.insertCell().innerHTML = array[i].state;
    row.insertCell().innerHTML = array[i].seniority;
    row.insertCell().innerHTML = array[i].votes_with_party_pct + "%";
    body.append(row);
  }
  if (body.rows.length == 0) {
    const row = document.createElement("tr");
    row.append("Sorry, there is no information that matches your search!");
    body.append(row);
  }
}

//Statistics object
var statistics = {
  number: {
    "NumberOfRepublicans": 0,
    "NumberOfDemocrats": 0,
    "NumberOfIndependents": 0,
    "PercentageVotedWithPartyRep": 0,
    "PercentageVotedWithPartyDem": 0,
    "PercentageVotedWithPartyInd": 0,
    "TotalPercentage": 0
  },
  "LeastEngaged": 0,
  "MostEngaged": 0,
  "LeastLoyal": 0,
  "MostLoyal": 0,
}

//Calculations
function calculations(array) {
  var members = array;
  var republicans = [];
  var democrats = [];
  var independents = [];
  var republicansVotes = [];
  var democratsVotes = [];
  var independentsVotes = [];
  var mostEngaged = [];
  var leastEngaged = [];
  var mostL = [];
  var leastL = [];

  //Total number of members by party
  function numberOfmembers() {

    for (var i = 0; i < members.length; i++) {
      if (members[i].party == "R") {
        republicans.push(members[i].party);
      }
      if (members[i].party == "D") {
        democrats.push(members[i].party);
      }
      if (members[i].party == "I") {
        independents.push(members[i].party);
      }
    }
  }
  numberOfmembers();

  statistics.number.NumberOfRepublicans = republicans.length;
  statistics.number.NumberOfDemocrats = democrats.length;
  statistics.number.NumberOfIndependents = independents.length;

  //Percentage voted with party
  function votesWithParty() {
    for (var i = 0; i < members.length; i++) {
      if (members[i].party == "R") {
        republicansVotes.push(members[i].votes_with_party_pct);
      }
      if (members[i].party == "D") {
        democratsVotes.push(members[i].votes_with_party_pct);
      }
      if (members[i].party == "I") {
        independentsVotes.push(members[i].votes_with_party_pct);
      }
    }
  }
  votesWithParty();

  function totals() {
    var sum = republicansVotes.reduce((a, b) => a + b, 0);
    console.log(sum)
    var percentageRep = sum / republicans.length;
    var sum1 = democratsVotes.reduce((a, b) => a + b, 0);
    var percentageDem = sum1 / democrats.length;
    var sum2 = independentsVotes.reduce((a, b) => a + b, 0);
    console.log(independentsVotes)
    var percentageInd = sum2 / independents.length;

    var percent = sum + sum1 + sum2;
    console.log(percent)
    var totalPercent = percent / members.length;

    statistics.number.TotalPercentage = totalPercent;
    statistics.number.PercentageVotedWithPartyRep = percentageRep;
    statistics.number.PercentageVotedWithPartyDem = percentageDem;
    statistics.number.PercentageVotedWithPartyInd = percentageInd;
    if (statistics.number.NumberOfIndependents == 0) {
      statistics.number.PercentageVotedWithPartyInd = 0;
    }
  }
  totals();

  //Most engaged - attendance
  function most() {
    members.sort(function (obj1, obj2) {
      return obj1.missed_votes_pct - obj2.missed_votes_pct;
    });
    var x = Math.round(members.length * 0.1);
    for (var i = 0; i <= members.length; i++) {
      if (mostEngaged.length < x) {
        mostEngaged.push(members[i]);
      }
      if (mostEngaged.length >= x) {
        if (members[i].missed_votes_pct == members[i + 1].missed_votes_pct) {
          mostEngaged.push(members[i + 1]);
        } else {
          break
        }
      }
    }
  }
  most();

  //Least engaged - attendance
  function least() {
    members.sort(function (obj1, obj2) {
      return obj1.missed_votes_pct - obj2.missed_votes_pct;
    });
    var reverse = members.reverse();
    var x = reverse.length * 0.1;
    for (var i = 0; i <= x; i++) {
      leastEngaged.push(members[i]);
    }
  }
  least();

  statistics.number.MostEngaged = mostEngaged;
  statistics.number.LeastEngaged = leastEngaged;

  //Most loyal - party loyalty
  function mostLoyal() {
    members.sort(function (obj1, obj2) {
      return obj1.votes_with_party_pct - obj2.votes_with_party_pct;
    });
    var reverse = members.reverse();
    var x = reverse.length * 0.1;
    for (var i = 0; i <= x; i++) {
      mostL.push(members[i]);
    }
  }
  mostLoyal();

  //Least loyal - party loyalty
  function leastLoyal() {
    members.sort(function (obj1, obj2) {
      return obj1.votes_with_party_pct - obj2.votes_with_party_pct;
    });
    var x = members.length * 0.1;
    for (var i = 0; i <= x; i++) {
      leastL.push(members[i]);
    }
  }
  leastLoyal();

  statistics.number.MostLoyal = mostL;
  statistics.number.LeastLoyal = leastL;
}


//Table at a glance for attendance and party loyalty
function tableGlance(array) {
  var body = document.getElementById("glancebody");
  var trRep = document.getElementById("repRow");
  var trDem = document.getElementById("demRow");
  var trInd = document.getElementById("indRow");
  var trTotal = document.getElementById("totalRow");
  var td = document.createElement("td");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  var td8 = document.createElement("td");
  var tr = document.createElement("tr");
  td.append(statistics.number.NumberOfRepublicans);
  td1.append(statistics.number.PercentageVotedWithPartyRep.toFixed(2) + "%");
  td2.append(statistics.number.NumberOfDemocrats);
  td3.append(statistics.number.PercentageVotedWithPartyDem.toFixed(2) + "%");
  td4.append(statistics.number.NumberOfIndependents);
  td5.append(statistics.number.PercentageVotedWithPartyInd.toFixed(2) + "%");
  td6.append("Total");
  td7.append(statistics.number.NumberOfRepublicans + statistics.number.NumberOfDemocrats + statistics.number.NumberOfIndependents);
  td8.append(statistics.number.TotalPercentage.toFixed(2) + "%");
  trRep.append(td, td1);
  trDem.append(td2, td3);
  trInd.append(td4, td5);
  trTotal.append(td7, td8)
  body.append(tr);
}


//Tables for the attendance pages
function tableLeast() {
  const leastbody = document.getElementById("leastbody");
  const members = statistics.number.LeastEngaged;
  for (var i = 0; i < members.length; i++) {
    const row = document.createElement("tr");
    var fullName = members[i].first_name + " " + members[i].last_name;
    var a = document.createElement("a");
    var link = members[i].url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    row.insertCell().append(a);
    row.insertCell().innerHTML = members[i].missed_votes;
    row.insertCell().innerHTML = members[i].missed_votes_pct;
    leastbody.append(row);
  }
}

function tableMost() {
  const mostbody = document.getElementById("mostbody");
  const members = statistics.number.MostEngaged;
  for (var i = 0; i < members.length; i++) {
    const row = document.createElement("tr");

    var fullName = members[i].first_name + " " + members[i].last_name;
    var a = document.createElement("a");
    var link = members[i].url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    row.insertCell().append(a);

    row.insertCell().innerHTML = members[i].missed_votes;
    row.insertCell().innerHTML = members[i].missed_votes_pct;
    mostbody.append(row);
  }
}

//Tables for the party loyalty pages
function tableLeastLoyal() {
  const leastbody = document.getElementById("leastbody");
  const members = statistics.number.LeastLoyal;
  for (var i = 0; i < members.length; i++) {
    const row = document.createElement("tr");
    var fullName = members[i].first_name + " " + members[i].last_name;
    var a = document.createElement("a");
    var link = members[i].url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    row.insertCell().append(a);
    row.insertCell().innerHTML = members[i].total_votes;
    row.insertCell().innerHTML = members[i].votes_with_party_pct;
    leastbody.append(row);
  }
}

function tableMostLoyal() {
  const mostbody = document.getElementById("mostbody");
  const members = statistics.number.MostLoyal;
  for (var i = 0; i < members.length; i++) {
    const row = document.createElement("tr");
    var fullName = members[i].first_name + " " + members[i].last_name;
    var a = document.createElement("a");
    var link = members[i].url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    row.insertCell().append(a);
    row.insertCell().innerHTML = members[i].total_votes;
    row.insertCell().innerHTML = members[i].votes_with_party_pct;
    mostbody.append(row);
  }
}


//Read more/read less button
function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }
}
