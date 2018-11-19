//Party Loyalty Senate

//Statistics object
var statistics = {
  number: {
    "NumberOfRepublicans": 0,
    "NumberOfDemocrats": 0,
    "NumberOfIndependents": 0,
    "PercentageVotedWithPartyRep": 0,
    "PercentageVotedWithPartyDem": 0,
    "PercentageVotedWithPartyInd": 0,
    "TotalPercentage":0
  },
  "LeastLoyal": 0,
  "MostLoyal": 0,
}

//Variables
var members = data.results[0].members;
var republicans = [];
var democrats = [];
var independents = [];
var republicansVotes = [];
var democratsVotes = [];
var independentsVotes = [];
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

var sum = republicansVotes.reduce((a, b) => a + b, 0);
var percentageRep = sum / republicans.length;

var sum = democratsVotes.reduce((a, b) => a + b, 0);
var percentageDem = sum / democrats.length;

var sum = independentsVotes.reduce((a, b) => a + b, 0);
var percentageInd = sum / independents.length;

statistics.number.PercentageVotedWithPartyRep = percentageRep.toFixed(2) + "%";
statistics.number.PercentageVotedWithPartyDem = percentageDem.toFixed(2) + "%";
statistics.number.PercentageVotedWithPartyInd = percentageInd.toFixed(2) + "%";

var percent = percentageRep + percentageDem + percentageInd;
var totalPercent = percent / 3;

statistics.number.TotalPercentage = totalPercent.toFixed(2) + "%";

//Most and least loyal
//Most loyal
function mostLoyal(){
members.sort(function (obj1, obj2) {
  return obj1.votes_with_party_pct - obj2.votes_with_party_pct;
});
  var reverse = members.reverse();
  var x = reverse.length * 0.1;
  for(var i = 0; i <= x; i++){
    mostL.push(members[i]);
  }  
}
mostLoyal();

//Least loyal
function leastLoyal(){
members.sort(function (obj1, obj2) {
  return obj1.votes_with_party_pct - obj2.votes_with_party_pct;
});
  var x = members.length * 0.1;
  for(var i = 0; i <= x; i++){
    leastL.push(members[i]);
  } 
}
leastLoyal();
statistics.number.MostLoyal = mostL;
statistics.number.LeastLoyal = leastL;


//Table at a glance
function tableGlance() {
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
  var td9 = document.createElement("td");

  var tr = document.createElement("tr");

  td.append(statistics.number.NumberOfRepublicans);
  td1.append(statistics.number.PercentageVotedWithPartyRep);
  td2.append(statistics.number.NumberOfDemocrats);
  td3.append(statistics.number.PercentageVotedWithPartyDem);
  td4.append(statistics.number.NumberOfIndependents);
  td5.append(statistics.number.PercentageVotedWithPartyInd);
  td6.append("Total")
  td7.append(statistics.number.NumberOfRepublicans + statistics.number.NumberOfDemocrats + statistics.number.NumberOfIndependents);
  td8.append(statistics.number.TotalPercentage)
  trRep.append(td, td1);
  trDem.append(td2, td3);
  trInd.append(td4, td5);
  trTotal.append(td7, td8)

  body.append(tr);
}
tableGlance();


function tableLeastLoyal() {
  const leastbody = document.getElementById("leastbody");
  const members = statistics.number.LeastLoyal;

  for (var i = 0; i < members.length; i++) {

    const row = document.createElement("tr");
    row.insertCell().innerHTML = members[i].first_name + " " + members[i].last_name;
    row.insertCell().innerHTML = members[i].total_votes;
    row.insertCell().innerHTML = members[i].votes_with_party_pct;
    leastbody.append(row);
  }
}

tableLeastLoyal();

function tableMostLoyal() {
  const mostbody = document.getElementById("mostbody");
  const members = statistics.number.MostLoyal;

  for (var i = 0; i < members.length; i++) {

    const row = document.createElement("tr");
    row.insertCell().innerHTML = members[i].first_name + " " + members[i].last_name;
    row.insertCell().innerHTML = members[i].total_votes;
    row.insertCell().innerHTML = members[i].votes_with_party_pct;
    mostbody.append(row);
  }
}

tableMostLoyal();


