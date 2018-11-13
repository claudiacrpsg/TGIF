//House JS

//The table - loads the table first
table(data.results[0].members); //table function is called first with all the members so that when the page is loaded, the complete table appears.
document.getElementById("mySelect").addEventListener("change", filterAll);

//States - this function loads the state options on the state filter
function states() {
  var statesArray = []; //empty array to receive the members states
  var select = document.getElementById("mySelect"); //conects to the id in html
  for (var a = 0; a < data.results[0].members.length; a++) { //loop gets the states
    var state = data.results[0].members[a].state;
    statesArray.sort().push(state); //states are pushed into statesArray
    var norepeatedValues = []; //empty array to receive states with no duplicates
    for (var i = 0; i < statesArray.length; i++) {
      for (var j = i + 1; j < statesArray.length; j++) {
        if (statesArray[i] == statesArray[j]) { //condition compares the states
          if (!norepeatedValues.includes(statesArray[i])) { //keep the states with no duplicates
            norepeatedValues.push(statesArray[i]); //states without duplicates are pushed into new array
          }
        }
      }
    }
  }
  for (var b = 0; b < norepeatedValues.length; b++) { //loop creates an option for each state
    var option = document.createElement("option");
    option.append(norepeatedValues[b]);
    mySelect.append(option);
  }
}
states();

//Raul solution for the function that adds states
//function newFunction(){
//return Array.from(new Set(data.results[0].members.map((member) =>{ member.state}).sort()));
//}

//filterAll - function for both filters

function filterAll() {
    var members = data.results[0].members;//All members
    let checkValue = [...document.querySelectorAll("input[name=party]:checked")]; // gets the values of all checkboxes and stores them in party array
    var parties = checkValue.map(checked => checked.value); //using map we can filter the values and convert them in an array
    var idVal = document.getElementById("mySelect"); //conects with html
    var statesF = idVal.value; // the value of the filter by state
    var filteredMembers = [];
    for (var i = 0; i < members.length; i++) { //this loops all the members
        if ((statesF == "All") && (parties.length == 0)) { //1st condition = nothing selected...
            filteredMembers.push(members[i]); //...it shows the members
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
        table(filteredMembers); //here the array is given to the table depending on which condition is executed
    }
}
    filterAll();


//The table - it recieves a generic array that is then changed according to the conditions above

function table(array) {
  var body = document.getElementById("body");
  body.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var everyMember = array[i];
    var firstName = everyMember.first_name;
    var middleName = everyMember.middle_name || " ";
    if (middleName == null) {
      middleName = "";
    }
    var lastName = everyMember.last_name;
    var party = everyMember.party;
    var state = everyMember.state;
    var senior = everyMember.seniority;
    var votes = everyMember.votes_with_party_pct + "%";
    var a = document.createElement("a");
    var fullName = firstName + " " + middleName + " " + lastName;
    var link = everyMember.url;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerHTML = fullName;
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    td1.append(a);
    td2.append(party);
    td3.append(state);
    td4.append(senior);
    td5.append(votes);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    body.append(tr);
  }
}