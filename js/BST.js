//Reference:
//https://stackoverflow.com/questions/14184655/set-position-for-drawing-binary-tree
//https://khan4019.github.io/front-end-Interview-Questions/bst.html

//This function builds a random BST and initializes certain values in each node.
function random_BST(num){
    this.depth = 0; // keep track of tree depth
    var max = 100; //Max node value
    var min = 0; //Min node value
    if(num > 0) { //Make sure tree contains at least one node
        var root = this.root;
        this.root = new Node(getRandomInt(min, max)); // genereate root value
        this.depth = 1;
        this.root.depth = 1;
        this.root.index = 1;

        for (var i = 1; i < num; i++) { // Fill tree from root, inserting nodes as per BST rules
            var currentNode = this.root;
            var currentDepth = 1;
            var nextNode = new Node(getRandomInt(min, max));
            while(true) { //Search for new node location
                currentDepth = currentDepth + 1; //Depth increased at every iteration
                if(nextNode.value < currentNode.value) {
                    if(!currentNode.left) {
                        nextNode.depth = currentDepth; // Let the node know what depth it is located at
                        if(currentDepth > this.depth) { 
                            this.depth = currentDepth; // Update tree depth if need be
                        }
                        nextNode.index = currentNode.index*2-1; // store node index in node. Index is used for X location when printing the tree
                        nextNode.parent = currentNode; // Tell the node what is its parent
                        currentNode.left = nextNode; // Node is added to tree
                        break; // exit loop, node has been placed
                    }
                    else{
                        currentNode = currentNode.left; //Node location not found, go deeper
                    }
                }
                else{
                    if(!currentNode.right){
                        nextNode.depth = currentDepth;// Let the node know what depth it is located at
                        if(currentDepth > this.depth) {
                            this.depth = currentDepth;// Update tree depth if need be
                        }
                        nextNode.index = currentNode.index*2+1;// store node index in node. Index is used for X location when printing the tree
                        nextNode.parent = currentNode;// Tell the node what is its parent
                        currentNode.right = nextNode;// Node is added to tree
                        break;// exit loop, node has been placed
                    }
                    else{
                        currentNode = currentNode.right; //Node location not found, go deeper
                    }
                }
            }
        }
        return this.root; //return the root of the tree
    }
}

//This represent a node and its data
function Node(val){
  this.value = val;
  this.left = null;
  this.right = null;
  this.depth = null;
  this.index = null;
  this.x = null;
    this.y = null;
  this.parent = null;
}

//This function generates a bounded random number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max+1 - min)) + min;
}

//Get max depth of tree (or subtree) with pre-order
function getDepth(node) {
    var depth = 0;
    if(!node) {
        return depth;
    }
    depth++;
    depth = depth + max(getDepth(node.right), getDepth(node.left));
    return depth;
}

//compare two values, return the larger of the two
function max(val1, val2) {
    if(val1 > val2) {
        return val1;
    }
    return val2;
}

//compare two values, return the smaller of the two
function min(val1, val2) {
    if(val1 < val2) {
        return val1;
    }
    return val2;
}

//Traverse tree and count how many nodes are at a specified depth from given root with pre-order
function getNumAtDepth(root, depth) {
    if(!root) {
        return 0;
    }
    if(root.depth == depth) {
        return 1;
    }
    var count = 0;
    count = getNumAtDepth(root.left, depth);
    count = count + getNumAtDepth(root.right,depth);
    return count;
}

//Find max x value of all nodes in tree with post-order
function getMaxX(root){
    if(!root){
        return 0;
    }
    var maxX = max(getMaxX(root.left), getMaxX(root.right));
    return max(root.x, maxX);
}

//find min x value of all nodes in tree with post-order
function getMinX(root){
    if(!root){
        return 999999;
    }
    var minX = min(getMinX(root.left), getMinX(root.right));
    return min(root.x, minX);
}