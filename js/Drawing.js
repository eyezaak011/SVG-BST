var svgNS = "http://www.w3.org/2000/svg";//String for SVG namespace used

var ids = 0; //Node IDs, reset at every draw_Random_Tree
var hc = 7; //level spacing
var d = 7; //node diameter
//Function builds a random tree and displays it to the webpage using SVG elements
function draw_Random_Tree(num) {
    do {
        debugger; //If debugger is on, sets a breakpoint
        ids = 0; // IDs are reset
        clear_Drawing(); // Drawing area is reset

        var tree = random_BST(num); // Build random tree of "num" nodes
        var total_depth = getDepth(tree); // Get tree depth
        var y_div = total_depth; // Tree depth is height of drawing
        float_Coord(tree);
        draw_Nodes(tree, y_div); // Add nodes to Drawing area
        var r = d/2;//80 / Math.pow(2, total_depth); // Calculate node radius used in draw_nodes()
        var minX = getMinX(tree); // get smallest x value of any node
        var minY = 1; // smallest y value of any node
        var maxX = getMaxX(tree); //largest x value in any node
        var maxY = getDepth(tree)*hc;//y_div; //largest y value of any node
        var offsetX = (minX - 2 * r); //calculate margins for dawing so circles dont get cut
        var offsetY =r;//calculate margins for dawing so circles dont get cut
        var width = (maxX - minX) + 4 * r;//calculate width of drawing area based on X values in the tree
        var height = maxY +offsetY;//calculate height of drawing area based on Y values in the tree
        var att = offsetX + " " + -1*offsetY + " " + width + " " + height;

        var drawing = document.getElementById("tree");
        drawing.setAttribute("viewBox", att); // Add viewBox to drawing area "tree" to zoom in on tree drawing and zoom to appropriate size
    } while (!document.getElementsByClassName(right_answer)); //redraw the tree if there is not right answer
}

//Asigns coordinates to each node based on FLoating Coordinate algorithm
function float_Coord(root){
    if(!root){
        return;
    }
    //Offsets
    var oX=0, oY=(hc-d)/2;
    //Width of tree W, and Root x-location rX
    var w={val: 0}, rX={val: 0};
    //recursive traversal
    solve_Coord(root, oX, oY, rX, w);
}

//Function which traverses tree and solves Floating Coordinates for each node
function solve_Coord(c, oX, oY, rX, w){
    w.val = 0;
    //subtree width
    var stW = {val: 0};
    //X-location of a subtree root
    var stRX = {val: 0};
    if(!c.left && !c.right){
        w.val = d;
        rX.val = oX;
    } else{
        //Left subtree
        if(c.left){
            solve_Coord(c.left, oX, oY+hc, stRX, stW);
            w.val = stW.val;
            rX.val = oX+stW.val-d/2;
        } else{
            w.val=d/2;
            rX.val = oX;
        }
        
        //Right subtree
        if(c.right){
            solve_Coord(c.right, oX+w.val, oY+hc, stRX, stW);
            w.val = w.val + stW.val;
        } else{
            w.val = w.val + d/2;
        }
    }
    c.x = rX.val;
    c.y = oY;
}

//Draws nodes from tree In-order using recursion
//IDs are set in Pre-order
function draw_Nodes(root, total_depth) {
    if (!root) { //base case
        return;
    }
    root.id = ids++; //set node ID and increment
    draw_Nodes(root.left, total_depth);//draw left node
    
    var node = document.createElementNS(svgNS, "circle");// Create circle element for node
    var r = (5/7)*d/2;//80 / Math.pow(2, total_depth); //radius of node circle
    var x = root.x;//((root.index) / Math.pow(2, root.depth)) * 100; //x location of node in drawing space
    var y = root.y;//root.depth * 3 * r; //y loaction of node in drawing space
    //root.x = x; // save x location in node data
    var classes = buildClasses(root); // build list of classes this node belongs to
    node.setAttributeNS(null, "cx", x);
    node.setAttributeNS(null, "cy", y);
    node.setAttributeNS(null, "r", r);
    node.setAttributeNS(null, "id", root.id);
    node.setAttributeNS(null, "class", classes);
    node.onclick = nodeClick; // add callback function to node circle
    
    var text = document.createElementNS(svgNS, "text");
    text.setAttributeNS(null, "x", x);
    text.setAttributeNS(null, "y", y + r / 3);
    text.setAttributeNS(null, "font-size", r);
    text.setAttributeNS(null, "text-anchor", "middle");
    text.setAttributeNS(null, "class", classes);
    text.setAttributeNS(null, "id", root.id+".t");
    var word = document.createTextNode(root.value);
    text.appendChild(word);
    text.onclick = nodeClick;// add callback function to node text
    
    if(root.parent) {//if current node has a parent, draw a line to it
        var line = document.createElementNS(svgNS, "line");
        var px = root.parent.x;//((root.parent.index) / Math.pow(2, root.parent.depth)) * 100;//find parent location
        var py = root.parent.y;//depth * 3 * r;
        line.setAttributeNS(null, "x1", x);
        line.setAttributeNS(null, "y1", y);
        line.setAttributeNS(null, "x2", px);
        line.setAttributeNS(null, "y2", py);
        line.setAttributeNS(null, "id", root.id+".l");
        line.setAttributeNS(null, "visibility", "visible");
        document.getElementById("lines").appendChild(line); //add lines to "lines" group, which is behind all node and text elements
    }
    
    document.getElementById("nodes").appendChild(node); //add circle to "nodes" group, which is between lines and text elements
    document.getElementById("text").appendChild(text);//add text on top layer of drawing
    draw_Nodes(root.right, total_depth); // draw right node
    return;
}

//Clears the drawing area
function clear_Drawing() {
    var node = document.getElementById("nodes");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    var lines = document.getElementById("lines");
    while (lines.hasChildNodes()) {
        lines.removeChild(lines.lastChild);
    }
    var text = document.getElementById("text");
    while (text.hasChildNodes()) {
        text.removeChild(text.lastChild);
    }
    return;
}

//add descriptive classes of which the node belongs to, such as: "root", "internal", "leaf", etc.
function buildClasses(node) {
    var classes = "";
    if(node.left || node.right) {
        classes += "internal";
    } else {
        classes += "leaf";
    }
    if(!node.parent){
        classes += " root";
    } else {
        if(node.parent.left == node) {
            classes += " left_sibbling";
        } else {
            classes += " right_sibbling";
        }
        classes += " child_of_" + node.parent.id;
    }
    return classes;
}