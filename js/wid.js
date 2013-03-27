var bWid = document.querySelectorAll(".wid");
var wid = document.querySelector(".b-wid");
var arrowWid = wid.querySelector(".arrow");
var contentWid = wid.querySelector(".content");
var server = "<h3>Hellow</h3><p>This is word. You click on this word</p>"
var oldWord;

function searchWord(e){
	var word = document.caretRangeFromPoint(e.clientX, e.clientY);
    var wordStart = word.startOffset;
    var wordEnd = word.startOffset;
   	var root = word.startContainer;
    var stop = /[\s,(,),;,.,\,,>,<]/;
    //определяем начало слова
    while(!stop.test(word.toString()[0]) && wordStart >= 0) {
    	wordStart--;
        word.setStart(root, wordStart);
    }
    wordStart++;
    word.setStart(root, wordStart);
    //определяем конец слова
    while(!stop.test(word.toString()[word.toString().length-1])){
    	wordEnd++;
    	word.setEnd(root, wordEnd);
    }
    wordEnd--;
    word.setEnd(root, wordEnd);
    return word;
}

function progres (el) {
	var width = 0;
    var time = 0;
    while(width<100){
        time += Math.random()*50;
        width += 2;
        setTimeout(function(){el.style.width = Number(el.style.width.replace("%","")) + 2 + "%"},time);
    }
    return time;
}

function deleteOldWord () {
    if(oldWord && oldWord.parentNode) oldWord.parentNode.innerHTML = oldWord.parentNode.innerText;
}

function positionEl (el) {
    var el = el.getBoundingClientRect()
    
    var body = document.body;
    var docElem = document.documentElement;
    
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    var top  = el.top +  scrollTop - clientTop;
    var left = el.left + scrollLeft - clientLeft;
    var bottom = window.innerHeight - el.top - el.height;
    var right = window.innerWidth - el.left - el.width;

    return { top: top, left:left, bottom: bottom, right: right, height: el.height, width: el.width};
}

function showWid(el){
    el = positionEl(el);
    contentWid.innerHTML = server;
    wid.style.display = "inline-block";

    if(el.bottom>wid.clientHeight) {
        wid.style.top = el.top + el.height + 9 + "px";
        arrowWid.style.top = "-6px";
    }else{
        arrowWid.style.top = wid.clientHeight - 9 + "px";
        wid.style.top = el.top - wid.clientHeight - 9 + "px";
    }

    if(el.left+el.width/2<(wid.clientWidth+15)/2){
        wid.style.left = "0px";
    }else if (el.right+el.width/2<(wid.clientWidth+15)/2) {
        wid.style.left = window.innerWidth - (wid.clientWidth+15) + "px";
    } else{
        wid.style.left = el.left + el.width/2 - (wid.clientWidth+15)/2 + "px";
    };

    arrowWid.style.left = el.left + el.width/2 - Number(wid.style.left.replace("px","")) - 6 + "px";
}

function hideWid () {
    wid.style.display = "none";
    deleteOldWord();
}

function click (e) {
    deleteOldWord();
    var e = e || window.event;
    var el = e.target;
    var time;
    if(el.className != "word-wid"){
        var word = searchWord(e);
        if(word.toString()!=""){
        	var elWord = document.createElement("span");
            oldWord = elWord; 
            elWord.className = "word-wid";
            word.surroundContents(elWord);
            elWord.appendChild(document.createElement("span"));
            elWord.querySelector("span").className = "progres";
            time = progres(elWord.querySelector(".progres")) + 200;
            setTimeout(function(){showWid(elWord)},time);
        }else hideWid();
    }
}

for (var i = bWid.length - 1; i >= 0; i--) {
	bWid[i].addEventListener("dblclick",click,true);
};

document.addEventListener("click",hideWid,true);