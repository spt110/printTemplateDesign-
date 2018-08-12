var saveData = {};//保存数据
var currentNode = null;//当前选择的节点(绑定字段)
function allowDrop(ev) {
    ev.preventDefault();
}
//开始拖动(复制)
function drag(ev) {
    console.log("drag");
    console.log(ev);
    var data = {};
    data.nodeId = ev.target.id;
    data.nodeIsCopy = true;
    var dataStr = JSON.stringify(data);
    ev.dataTransfer.setData("text", dataStr);
    console.log(ev.target);
}
//开始拖动(移动不复制)
function dragOwner() {
    var ev = window.event
    var data = {};
    data.nodeId = ev.target.id;
    data.screenX = ev.screenX;
    data.screenY = ev.screenY;
    var dataStr = JSON.stringify(data);
    ev.dataTransfer.setData("text", dataStr);
}
function drop(ev) {
    console.log("drop");
    console.log(ev);
    ev.preventDefault();
    var text = ev.dataTransfer.getData("text");
    var data = JSON.parse(text);
    var element = document.getElementById(data.nodeId);
    if (data.nodeIsCopy) {
        // 复制
        var distElement = element.cloneNode(true);
        distElement.id = distElement.id + Date.parse(new Date());
        distElement.style.position = "absolute";
        distElement.ondragstart = dragOwner;
        distElement.onmousedown = node_onmousedown;
        ev.target.appendChild(distElement);
        var x = ev.offsetX + "px";
        var y = ev.offsetY + "px";
        distElement.style.top = y;
        distElement.style.left = x;
        //setNodeData(distElement.id, { x: x, y: y, columnName: distElement.innerHTML });
        setNodeData(distElement);
        }
    else {
        //移动
        var srcScreenX = data.screenX;
        var srcScreenY = data.screenY;
        var x = ev.screenX - srcScreenX;
        var y = ev.screenY - srcScreenY;
        var top = Number(element.offsetTop) + y + "px";
        var left = Number(element.offsetLeft) + x + "px";
        element.style.top = top;
        element.style.left = left;
        setNodeData(element);
    }
}

function setNodeData(element) {
    var data={ x: element.style.top, y: element.style.left, columnName: element.innerHTML };
    data.width=element.offsetWidth;
    data.height=element.offsetHeight;
    saveData[element.id] = data;
    setDisplayData(data);
}
function setDisplayData(id) {
    data = saveData[id];
    if (data) {
        document.getElementById("txtTop").value = data.y.replace("px", "");
        document.getElementById("txtLeft").value = data.x.replace("px", "");
    }
}
function showSaveData() {
    alert(JSON.stringify(saveData));
}
function node_onmousedown() {
    var ev = window.event;
    if (ev.target.tagName == "SPAN") { return false; }
    if (currentNode) {
        currentNode.style.background = null;
    }
    currentNode = ev.target;
    currentNode.style.background = "yellow";
    setDisplayData(currentNode.id);
}

function txtLeft_onkeyup() {
    var ev = window.event;
    if (currentNode) {
        currentNode.style.left = ev.target.value + "px";
    }
}

function txtTop_onkeyup() {
    var ev = window.event;
    if (currentNode) {
        currentNode.style.top = ev.target.value + "px";
    }
}

// function getResizeBRDiv() {
//     var span = document.createElement("span");
//     span.setAttribute("class", "resizeBR");
//     return span;
// }