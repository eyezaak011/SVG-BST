var NODESIZE = 10;
var NODE_MARGIN_X = 5;
var NODE_MARGIN_Y = 10;
var total =0;

function draw_Nodes2(root) {
    if (!root) {
        return 0;
    }
    var total = draw_Nodes2(root.left);
    
    //var degree = 0;
    
    var node = document.createElementNS(svgNS, "circle");
    //node1.setAttributeNS(null,"id","mycircle");
    var r = NODESIZE / 2;
    var x = NODE_MARGIN_X + (root.x * (NODESIZE + NODE_MARGIN_X
                                   ));//-2*total_depth;
    total = total + 1;
    var y = NODE_MARGIN_Y + (root.depth * (NODESIZE + NODE_MARGIN_Y));//-2*total_depth;
    
    //TO-DO: add class and ids
    node.setAttributeNS(null, "cx", x);
    node.setAttributeNS(null, "cy", y);
    node.setAttributeNS(null, "r", r);
    node.setAttributeNS(null, "fill", "white");
    node.setAttributeNS(null, "stroke", "black");
    
    var text = document.createElementNS(svgNS, "text");
    text.setAttributeNS(null, "x", x);
    text.setAttributeNS(null, "y", y + r / 3);
    text.setAttributeNS(null, "font-size", r);
    text.setAttributeNS(null, "fill", "black");
    text.setAttributeNS(null, "text-anchor", "middle");
    var word = document.createTextNode(root.x + " " + root.value);
    text.appendChild(word);
    
    document.getElementById("nodes").appendChild(node);
    document.getElementById("text").appendChild(text);
    
    total = total + draw_Nodes2(root.right);
    return total;
}
function getMaxAtAnyDepth(root) {
    var depth = getDepth(root);
    var max = 0;
    var i = 1;
    for(i = 1; i < depth+1; i++) {
        var num = getNumAtDepth(root, i);
        if(num > max) {
            max = num;
        }
    }
}

//=============================================================

var nodeSize = 1;
var siblingDistance = 0.0;
var treeDistance = 0.0;

function arrangeNodes(root) {
    debugger;
    initialX(root, 1);
    
    checkChildren(root);
    
    finalPos(root, 0);
}

function initialX(root, leftmost){
    if (!root){
        return 1;
    }
    //Post-order traversal
    var isleft = initialX(root.left, 1);
    initialX(root.right, isleft);
    
    if(!root.left && !root.right){ // if leaf
        if(leftmost) { //if left most sibbling
            root.x = 0;
        } else{ //if right sibbling
            root.x = root.parent.left.x + nodeSize + siblingDistance;
        }
    } else if((!root.left && root.right) || (root.left && !root.right)){ //if only one child
        if(leftmost){ //if root is left most node
            if(root.left){ //if the only child is left
                root.x = root.left.x + nodeSize / 2 + siblingDistance;
            } else { // if the only child is right
                root.x = root.right.x - (nodeSize / 2 + siblingDistance);
            }
        } else {
            root.x = root.parent.left.x + nodeSize + siblingDistance;
            if(root.left){
                root.mod = root.x - root.left.x + nodeSize + siblingDistance;
            } else {
                root.mod = root.x - root.right.x - (nodeSize + siblingDistance);
            }
        }
    } else {
        var middle = (root.left.x + root.right.x)/2;
        if(leftmost){
            root.x = middle;
        } else{
            root.x = root.parent.left.x + nodeSize + siblingDistance;
            root.mod = root.x - middle;
        }
    }
    
    if((root.left || root.right) && (!leftmost)) {
        checkConflict(root);
    }
    
    //console.log(root.x);
    return 0;
}

function checkConflict(root) {
    var minDis = treeDistance + nodeSize;
    var shift = 0.0;
    
    var rootContour = new Object();
    leftContour(root, 0, rootContour);
    
    var sibbling = root.parent.left;
    //while(sibbling != null && sibbling != root) {
        var sibblingContour = new Object();
        rightContour(sibbling, 0, sibblingContour);
        
        var maxRootKey = 0;
        for (var key in rootContour) {
            if (key > maxRootKey){
                maxRootKey = key;
            }
        }
        var maxSibKey = 0;
        for (var key1 in sibblingContour) {
            if (key1 > maxSibKey){
                maxSibKey = key1;
            }
        }
        
        var minDepth = min(maxSibKey, maxRootKey);
        for(var level = root.depth; level <= minDepth; level++){
            var distance = rootContour[level] - sibblingContour[level];
            if((distance + shift) < minDis){
                shift = minDis - distance;
            }
        }
        
        if (shift > 0){
            root.x = root.x + shift;
            root.mod = root.mod + shift;
            //centerNode(root, sibbling);
            shift = 0;
        }
        //sibbling = null;
    //}
}

function centerNode(leftNode, rightNode){
    
}

function leftContour(root, modSum, values){
    if (!root){
        return;
    }
    
    if (!(root.depth in values)){
        values[root.depth] = root.x + modSum;
    } else {
        values[root.depth] = max(values[root.depth], root.x + modSum);
    }
    
    modSum = modSum + root.mod;
    leftContour(root.left, modSum, values);
    leftContour(root.right, modSum, values);
}

function rightContour(root, modSum, values){
    if (!root){
        return;
    }
    
    if (!(root.depth in values)){
        values[root.depth] = root.x + modSum;
    } else {
        values[root.depth] = min(values[root.depth], root.x + modSum);
    }
    
    modSum = modSum + root.mod;
    leftContour(root.left, modSum, values);
    leftContour(root.right, modSum, values);
}

function checkChildren(root){
    var rootContour = new Object();
    leftContour(root, 0, rootContour);
    
    var shiftAmount = 0;
    for (var key in rootContour) {
        if ((rootContour[key] + shiftAmount) < 0){
            shiftAmount = (rootContour[key] * -1);
        }
    }
    if (shiftAmount > 0){
        root.x = root.x + shiftAmount;
        root.mod = root.mod + shiftAmount;
    }
}

function finalPos(root, modSum) {
    if (!root){
        return;
    }
    root.x = root.x + root.mod;
    modSum = modSum + root.mod;
    
    finalPos(root.left, modSum);
    finalPos(root.right, modSum);
    
    if ((!root.left) && (!root.right)) { //0 children
        root.width = root.x;
        root.height = root.depth;
    } else {
        var Width = 0;
        var Height = 0;
        if (root.left &&root.right){ //both children
            Width = min(root.left.width, root.right.width);
            Height = min(root.left.height, root.right.height);
        } else if (!root.right){//only left child
            Width = root.left.width;
            Height = root.left.height;
        } else { //only right child
            Width = root.right.width;
            Height = root.right.height;
        }
        root.width = Width;
        root.height = Height;
    }
    
}