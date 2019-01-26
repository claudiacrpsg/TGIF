<<<<<<< HEAD
//Fetch - this function gets the information from the propublica servers. There are two fetch - one for senate data and other for senate
getData();

function getData() {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", { //gets senate data
        method: "GET",
        headers: {
            "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP" //the API key acts as a "password" that allows the user to access information from propublica
        }
    }).then(function (result) { //the first .then returns the result as json...
        return result.json()
    }).then(function (data) { //...and the second as data
        var senateData = data.results[0].members;
        if (document.title == "TGIF Senate") { //on each senate page, the senate data is used and the functions required are called
            states(senateData);
            tableFilter(senateData);
            listeners(senateData);
            document.getElementById("spin").style.display = "none";
        } else if (document.title == "TGIF Attendance Senate") {
            calculations(senateData);
            tableGlance(senateData);
            tableTen("leastbody", statistics.number.LeastEngaged, "missed_votes", "missed_votes_pct");
            tableTen("mostbody", statistics.number.MostEngaged, "missed_votes", "missed_votes_pct");
        } else if (document.title == "TGIF Senate Party Loyalty") {
            calculations(senateData);
            tableGlance(senateData);
            tableTen("leastbody", statistics.number.LeastLoyal, "total_votes", "votes_with_party_pct");
            tableTen("mostbody", statistics.number.MostLoyal, "total_votes", "votes_with_party_pct");
        }
    })
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", { //gets house data
        method: "GET",
        headers: {
            "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
        }
    }).then(function (result) { 
        return result.json()
    }).then(function (data) { 
        var houseData = data.results[0].members;
        if (document.title == "TGIF House") { 
            states(houseData);
            tableFilter(houseData);
            listeners(houseData);
            document.getElementById("spin").style.display = "none";
        } else if (document.title == "TGIF House Attendance") {
            calculations(houseData);
            tableGlance(houseData);
            tableTen("leastbody", statistics.number.LeastEngaged, "missed_votes", "missed_votes_pct");
            tableTen("mostbody", statistics.number.MostEngaged, "missed_votes", "missed_votes_pct");

        } else if (document.title == "TGIF House Party Loyalty") {
            calculations(houseData);
            tableGlance(houseData);
            tableTen("leastbody", statistics.number.LeastLoyal, "total_votes", "votes_with_party_pct");
            tableTen("mostbody", statistics.number.MostLoyal, "total_votes", "votes_with_party_pct");
        }
    })
}


//Listeners - this function has 4 event listeners that allow the filters to work as the user clicks/selects diferent options
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


//States Options - this function populates the states options on the filter by state selector
function states(array) {
    var statesArray = [];
    var select = document.getElementById("mySelect");
    for (var a = 0; a < array.length; a++) {
        var state = array[a].state;
        statesArray.sort().push(state); //here the array is sorted by state and pushed into the empty array
        var norepeatedValues = [];
        for (var i = 0; i < statesArray.length; i++) {
            if (!norepeatedValues.includes(statesArray[i])) { //here the states (with no duplicates) are pushed into the second empty array
                norepeatedValues.push(statesArray[i]);
            }
        }
    }
    for (var b = 0; b < norepeatedValues.length; b++) { //here each state is given to an option
        var option = document.createElement("option");
        option.append(norepeatedValues[b]);
        mySelect.append(option); //the options are then appended to the selector
    }
}


//Select + Checkboxes - this function allows the checkbox filter and the state selector to work together
function filterAll(array) {
    var members = array; 
    let checkValue = [...document.querySelectorAll("input[name=party]:checked")]; // gets the values of all checkboxes and stores them in party array
    var parties = checkValue.map(checked => checked.value); //using map we can filter the values and convert them in an array
    var idVal = document.getElementById("mySelect"); //conects with html
    var statesF = idVal.value; // gets the value of the filter by state
    var filteredMembers = [];
    for (var i = 0; i < members.length; i++) { //this loops all the members
        if ((statesF == "All") && (parties.length == 0)) { //1st condition = nothing selected...
            filteredMembers.push(members[i]); //...it shows all the members
        } else if ((members[i].state == statesF) && (parties.length == 0)) { //2nd condition = only states are selected...
            filteredMembers.push(members[i]); //...the members states are pushed in the array
        } else if ((statesF == "All") && (parties.length > 0)) { //3rd condition = only party is selected...
            for (var i = 0; i < members.length; i++) {
                for (var a = 0; a < parties.length; a++) {
                    if (members[i].party === parties[a]) { //...members of the party selected are pushed into the array
                        filteredMembers.push(members[i]);
                    }
                }
            }
        } else if ((statesF == members[i].state) && (parties.length > 0)) { //4th condition = both filters are selected...
            for (var i = 0; i < members.length; i++) {
                for (var a = 0; a < parties.length; a++) {
                    if ((members[i].party == parties[a]) && (members[i].state == statesF)) { //...members with the same party and state as the selection are pushed into the array
                        filteredMembers.push(members[i]);
                    }
                }
            }
        }
    }
    tableFilter(filteredMembers); //here the array is given to the table depending on which condition is executed
}


//Filter Table - this function creates the table for the filters 
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
    if (body.rows.length == 0) { //if there are no matches to the users search...
        const row = document.createElement("tr");
        row.append("Sorry, there is no information that matches your search!"); //...this mesage is displayed
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
        "TotalPercentage": 0,
        "TotalVotes": 0
    },
    "LeastEngaged": 0,
    "MostEngaged": 0,
    "LeastLoyal": 0,
    "MostLoyal": 0,
}


//Calculations - this function holds the functions used to make the calculations needed to store in the statistics object
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
        var percentageRep = sum / republicans.length;
        var sum1 = democratsVotes.reduce((a, b) => a + b, 0);
        var percentageDem = sum1 / democrats.length;
        var sum2 = independentsVotes.reduce((a, b) => a + b, 0);
        var percentageInd = sum2 / independents.length;

        var percent = sum + sum1 + sum2;
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
function tableGlance() {
    var body = document.getElementById("glancebody");
    var row = document.createElement("tr");
    var row1 = document.createElement("tr");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("tr");
    row.insertCell().innerHTML = "Republicans";
    row.insertCell().innerHTML = statistics.number.NumberOfRepublicans;
    row.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyRep.toFixed(2) + "%";
    row1.insertCell().innerHTML = "Democrats";
    row1.insertCell().innerHTML = statistics.number.NumberOfDemocrats;
    row1.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyDem.toFixed(2) + "%";
    row2.insertCell().innerHTML = "Independents";
    row2.insertCell().innerHTML = statistics.number.NumberOfIndependents;
    row2.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyInd.toFixed(2) + "%";
    row3.insertCell().innerHTML = "Total";
    row3.insertCell().innerHTML = statistics.number.NumberOfRepublicans + statistics.number.NumberOfDemocrats + statistics.number.NumberOfIndependents;
    row3.insertCell().innerHTML = statistics.number.TotalPercentage.toFixed(2) + "%";
    body.append(row, row1, row2, row3);
}


//10% Tables - Attendance and Party Loyalty
function tableTen(id, member, prop1, prop2) {
    var body = document.getElementById(id)
    var members = member;
    for (var i = 0; i < members.length; i++) {
        const row = document.createElement("tr");
        var fullName = members[i].first_name + " " + members[i].last_name;
        var a = document.createElement("a");
        var link = members[i].url;
        a.setAttribute("href", link);
        a.setAttribute("target", "_blank");
        a.innerHTML = fullName;
        row.insertCell().append(a);
        row.insertCell().innerHTML = members[i][prop1];
        row.insertCell().innerHTML = members[i][prop2];
        body.append(row);
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
=======
//Fetch - this function gets the information from the propublica servers. There are two fetch - one for senate data and other for senate
getData();

function getData() {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", { //gets senate data
        method: "GET",
        headers: {
            "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP" //the API key acts as a "password" that allows the user to access information from propublica
        }
    }).then(function (result) { //the first .then returns the result as json...
        return result.json()
    }).then(function (data) { //...and the second as data
        var senateData = data.results[0].members;
        if (document.title == "TGIF Senate") { //on each senate page, the senate data is used and the functions required are called
            states(senateData);
            tableFilter(senateData);
            listeners(senateData);
            document.getElementById("spin").style.display = "none";
        } else if (document.title == "TGIF Attendance Senate") {
            calculations(senateData);
            tableGlance(senateData);
            tableTen("leastbody", statistics.number.LeastEngaged, "missed_votes", "missed_votes_pct");
            tableTen("mostbody", statistics.number.MostEngaged, "missed_votes", "missed_votes_pct");
        } else if (document.title == "TGIF Senate Party Loyalty") {
            calculations(senateData);
            tableGlance(senateData);
            tableTen("leastbody", statistics.number.LeastLoyal, "total_votes", "votes_with_party_pct");
            tableTen("mostbody", statistics.number.MostLoyal, "total_votes", "votes_with_party_pct");
        }
    })
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", { //gets house data
        method: "GET",
        headers: {
            "X-API-Key": "OqC12HQC7EK92KD1AmaE1AucbLxPDIn57AQSqlbP"
        }
    }).then(function (result) { 
        return result.json()
    }).then(function (data) { 
        var houseData = data.results[0].members;
        if (document.title == "TGIF House") { 
            states(houseData);
            tableFilter(houseData);
            listeners(houseData);
            document.getElementById("spin").style.display = "none";
        } else if (document.title == "TGIF House Attendance") {
            calculations(houseData);
            tableGlance(houseData);
            tableTen("leastbody", statistics.number.LeastEngaged, "missed_votes", "missed_votes_pct");
            tableTen("mostbody", statistics.number.MostEngaged, "missed_votes", "missed_votes_pct");

        } else if (document.title == "TGIF House Party Loyalty") {
            calculations(houseData);
            tableGlance(houseData);
            tableTen("leastbody", statistics.number.LeastLoyal, "total_votes", "votes_with_party_pct");
            tableTen("mostbody", statistics.number.MostLoyal, "total_votes", "votes_with_party_pct");
        }
    })
}


//Listeners - this function has 4 event listeners that allow the filters to work as the user clicks/selects diferent options
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


//States Options - this function populates the states options on the filter by state selector
function states(array) {
    var statesArray = [];
    var select = document.getElementById("mySelect");
    for (var a = 0; a < array.length; a++) {
        var state = array[a].state;
        statesArray.sort().push(state); //here the array is sorted by state and pushed into the empty array
        var norepeatedValues = [];
        for (var i = 0; i < statesArray.length; i++) {
            if (!norepeatedValues.includes(statesArray[i])) { //here the states (with no duplicates) are pushed into the second empty array
                norepeatedValues.push(statesArray[i]);
            }
        }
    }
    for (var b = 0; b < norepeatedValues.length; b++) { //here each state is given to an option
        var option = document.createElement("option");
        option.append(norepeatedValues[b]);
        mySelect.append(option); //the options are then appended to the selector
    }
}


//Select + Checkboxes - this function allows the checkbox filter and the state selector to work together
function filterAll(array) {
    var members = array; 
    let checkValue = [...document.querySelectorAll("input[name=party]:checked")]; // gets the values of all checkboxes and stores them in party array
    var parties = checkValue.map(checked => checked.value); //using map we can filter the values and convert them in an array
    var idVal = document.getElementById("mySelect"); //conects with html
    var statesF = idVal.value; // gets the value of the filter by state
    var filteredMembers = [];
    for (var i = 0; i < members.length; i++) { //this loops all the members
        if ((statesF == "All") && (parties.length == 0)) { //1st condition = nothing selected...
            filteredMembers.push(members[i]); //...it shows all the members
        } else if ((members[i].state == statesF) && (parties.length == 0)) { //2nd condition = only states are selected...
            filteredMembers.push(members[i]); //...the members states are pushed in the array
        } else if ((statesF == "All") && (parties.length > 0)) { //3rd condition = only party is selected...
            for (var i = 0; i < members.length; i++) {
                for (var a = 0; a < parties.length; a++) {
                    if (members[i].party === parties[a]) { //...members of the party selected are pushed into the array
                        filteredMembers.push(members[i]);
                    }
                }
            }
        } else if ((statesF == members[i].state) && (parties.length > 0)) { //4th condition = both filters are selected...
            for (var i = 0; i < members.length; i++) {
                for (var a = 0; a < parties.length; a++) {
                    if ((members[i].party == parties[a]) && (members[i].state == statesF)) { //...members with the same party and state as the selection are pushed into the array
                        filteredMembers.push(members[i]);
                    }
                }
            }
        }
    }
    tableFilter(filteredMembers); //here the array is given to the table depending on which condition is executed
}


//Filter Table - this function creates the table for the filters 
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
    if (body.rows.length == 0) { //if there are no matches to the users search...
        const row = document.createElement("tr");
        row.append("Sorry, there is no information that matches your search!"); //...this mesage is displayed
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
        "TotalPercentage": 0,
        "TotalVotes": 0
    },
    "LeastEngaged": 0,
    "MostEngaged": 0,
    "LeastLoyal": 0,
    "MostLoyal": 0,
}


//Calculations - this function holds the functions used to make the calculations needed to store in the statistics object
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
        var percentageRep = sum / republicans.length;
        var sum1 = democratsVotes.reduce((a, b) => a + b, 0);
        var percentageDem = sum1 / democrats.length;
        var sum2 = independentsVotes.reduce((a, b) => a + b, 0);
        var percentageInd = sum2 / independents.length;

        var percent = sum + sum1 + sum2;
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
function tableGlance() {
    var body = document.getElementById("glancebody");
    var row = document.createElement("tr");
    var row1 = document.createElement("tr");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("tr");
    row.insertCell().innerHTML = "Republicans";
    row.insertCell().innerHTML = statistics.number.NumberOfRepublicans;
    row.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyRep.toFixed(2) + "%";
    row1.insertCell().innerHTML = "Democrats";
    row1.insertCell().innerHTML = statistics.number.NumberOfDemocrats;
    row1.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyDem.toFixed(2) + "%";
    row2.insertCell().innerHTML = "Independents";
    row2.insertCell().innerHTML = statistics.number.NumberOfIndependents;
    row2.insertCell().innerHTML = statistics.number.PercentageVotedWithPartyInd.toFixed(2) + "%";
    row3.insertCell().innerHTML = "Total";
    row3.insertCell().innerHTML = statistics.number.NumberOfRepublicans + statistics.number.NumberOfDemocrats + statistics.number.NumberOfIndependents;
    row3.insertCell().innerHTML = statistics.number.TotalPercentage.toFixed(2) + "%";
    body.append(row, row1, row2, row3);
}


//10% Tables - Attendance and Party Loyalty
function tableTen(id, member, prop1, prop2) {
    var body = document.getElementById(id)
    var members = member;
    for (var i = 0; i < members.length; i++) {
        const row = document.createElement("tr");
        var fullName = members[i].first_name + " " + members[i].last_name;
        var a = document.createElement("a");
        var link = members[i].url;
        a.setAttribute("href", link);
        a.setAttribute("target", "_blank");
        a.innerHTML = fullName;
        row.insertCell().append(a);
        row.insertCell().innerHTML = members[i][prop1];
        row.insertCell().innerHTML = members[i][prop2];
        body.append(row);
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
>>>>>>> befac6bcdd43e39c3c88869cb53d1ba7260bb8b6
