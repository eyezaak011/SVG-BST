var right_answer = "leaf"; // (Default "leaf") - the class which represents the right answer

//Build the Questions dictionary. "Keys" are the right answer, and the values are the question strings.
var Questions = new Object();
Questions["root"] = ["Click on the Root node of the tree above.", "Find Tree Root"];
Questions["leaf"] = ["Click on a Leaf node in the tree above.", "Find Tree Leaf"];
Questions["internal"] = ["Click on an Internal node in the tree above.", "Find an Internal node"];
Questions["left_sibbling"] = ["Click on any Left Sibbling in the tree above.", "Find a left sibbling"];
Questions["right_sibbling"] = ["Click on any Right Sibbling in the tree above.", "Find a right sibbling"];

function buildQuestions(){
    var qSel = document.getElementById("question_select");
    for (var a in Questions) {
        var option = document.createElement("option");
        option.value = a;
        option.text = Questions[a][1];
        qSel.add(option);
    }
    setQuestion(right_answer);
}

//Set the question and right answer to the question
function setQuestion(answer) {
    clear_Results();
    document.getElementById("question").innerHTML = Questions[answer][0];
    right_answer = answer;
}

//This function is called upon clicking on a node in the tree
function nodeClick(){
    debugger;
    var nodes = document.getElementsByTagNameNS(svgNS, "circle"); // Make a list of all nodes
    
    for (var node = 0; node < nodes.length; node++) {
        if(nodes[node].classList.contains(right_answer)){ //If the node is part of the right answers
            nodes[node].style.stroke = "green"; // make green
        }
    }
    if (this.classList.contains(right_answer)) { // If the selected node is part of the right answers
        
    } else { // If not...
        this.style.stroke = "red"; // make selected node red
    }
}

// Clear the results formatting if question has changed, instead of rebuilding another tree
function clear_Results() {
    var nodes = document.getElementsByTagNameNS(svgNS, "circle"); // Make a list of all nodes
    for (var node = 0; node < nodes.length; node++) {
        nodes[node].removeAttribute("style"); // clear formatting, reapply style sheet
    }
}