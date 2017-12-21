# SVG-BST
Binary Search Tree using SVG elements

This website generates at BST of a specified number of elements and displays it to the webpage using SVG elements. These elements are classed according to their node, i.e. the root node is a part of the class “root”.

There is a list of questions which can be asked about the tree. These questions are related to the classes of each node in the tree. Upon changing the question, the tree is not rebuilt, but the previous results are reset.

To rebuild a new tree, click the button at the bottom of the page titled “New Tree”.

The number of elements per tree is hard coded in the HTML page, due to the nature of the drawing algorithm, trees with large Depths may be displayed very small (or “zoomed out”). It is advised to keep this number relatively small.

New questions can be added to the Question.js file and new properties can be added to the nodes.
