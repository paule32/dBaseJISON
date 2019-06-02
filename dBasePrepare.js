var grippersCSS = {theCssString: function(){/*
#nwgrip_@, #negrip_@, #swgrip_@, #segrip_@, #ngrip_@, #egrip_@, #sgrip_@, #wgrip_@ {
width: 10px;
height: 10px;
background-color: #ffffff;
border: 1px solid #000000;}
#negrip_@ { top:-6px; right:-6px; }
#segrip_@ { bottom:-6px; right:-6px;}
#nwgrip_@ { top:-6px; left:-6px;}
#swgrip_@ { bottom:-6px; left:-6px;}
#ngrip_@  { top:-6px;     left:50%; margin-left:-6px;}
#egrip_@  { right:-6px;   top: 50%; margin-top :-6px;}
#sgrip_@  { bottom:-6px;  left:50%; margin-left:-6px;}
#wgrip_@  { left:-6px;    top: 50%; margin-top :-6px;}*/}.toString().slice(14,-3)};

var click_menu_counter = 10000;

var box1open = false;
var tabnames = [
    "Standard",
    "Additional",
    "Common",
    "Dialogs",
    "Data",
    "DataCtrls",
    "DataAccess",
    "System",
    "Misc",
    "SynEdit"
];

var can,canvas,canvasWidth,canvasHeight,ctx,canvasData;
var over_compo = false;
var isDown = false;
var ṕtr,obj,cy,cx;

// for the designer grid
var gridPointVector = [ {x: 2, y: 0} ];
var gridBoundRect ;
var gridMouseDown ;
var gridObjects = [
    {name:"obser1", 
	left:20, top:20,
	width:50,height:50,
	color:"#ff0000"
    },
    {name:"caffeelate",
	left:40, top:40,
	width:50,height:50,
	color:"#00ff00"
    }
];
var prev = 0;
var previous;

function updateCanvas() { ctx.putImageData(ctxdata, 0, 0); }
function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * $("#painter").width()) * 4;

    ctxdata.data[index + 0] = r;
    ctxdata.data[index + 1] = g;
    ctxdata.data[index + 2] = b;
    ctxdata.data[index + 3] = a;
}

function pixel_ratio(){
    con = document.getElementById('painter');
    ctx = con.getContext("2d");
    dpr = window.devicePixelRatio || 1;
    bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}
function setHiDPICanvas(w, h, ratio) {
    if (!ratio) { ratio = pixel_ratio(); }
    var can    = document.getElementById("painter");
    can.width  = w * ratio;
    can.height = h * ratio;
    can.style.width  = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function init_painter() {
    can = setHiDPICanvas(
	$('#painter').width (),
	$('#painter').height(), 0); ctx = can.getContext("2d");
    ctxdata = ctx.getImageData(0,0,
	$('#painter').width(),
	$('#painter').height());
}

// ------------------------------------------------
// my very fast solution to draw grid:
// first, get the pixels into array,
// then draw it :D paule32 ...
// ------------------------------------------------
function init_designer()
{
    var gridSize = 10;

    var left = gridSize;
    var top  = gridSize;

    var wpos = $('#painter').width ();
    var hpos = $('#painter').height();

    for (var xp = left; xp < wpos; xp += gridSize) {
    for (var yp = top ; yp < hpos; yp += gridSize) {
        gridPointVector.push({x:xp,y:yp}); }
    }
}

function draw_designer_grid()
{
    var len = gridPointVector.length;
    for (let i=1;i<len-1;++i) {
        drawPixel(
	gridPointVector[i].x,
	gridPointVector[i].y, 0, 0, 0, 255);	
    }
    updateCanvas();
}

function draw_designer_objects()
{
    var len = gridObjects.length;
    var ptr;
    for (var i=0;i<len;i++) {
	ptr = gridObjects[i];

	ctx.beginPath();
	ctx.fillStyle = ptr.color;
        ctx.fillRect(
	    ptr.left , ptr.top,
	    ptr.width, ptr.height);
	//
	ctx.fillStyle = "#000000";
	ctx.fillRect(
		ptr.left-2, ptr.top-2,
		6,6);
	ctx.fillRect(
		ptr.left+ptr.width-4, ptr.top-2,
		6,6);
	ctx.fillRect(
		ptr.left+ptr.width-4, ptr.height+ptr.top-2,
		6,6);
	ctx.fillRect(
		ptr.left-2, ptr.height+ptr.top-2,
		6,6);
	ctx.stroke();
    }
}

function draw_designer_objects()
{
    var len = gridObjects.length;
    var ptr;
    for (var i=0;i<len;i++) {
        ptr = gridObjects[i];
    }
}

function replaceAll(str, find, replace) {    return str.replace(new RegExp(find, 'g'), replace); }
function LoadAndSetupCss(cssStyles,idx) {
    let str   = replaceAll(cssStyles,'_@','_'+idx);
    let  link = document.createElement('link');

    link.href = `data:text/css;base64,${btoa(str)}`;
    link.type = 'text/css';
    link.rel  = 'stylesheet';

    document.getElementsByTagName('head')[0].appendChild(link);
}

function makeResizableDiv()
{
    var c_array = ["red","yellow"];
    var r_array = ["nwgrip","negrip","swgrip","segrip","ngrip","egrip","sgrip","wgrip"];
    var s_array = ["nw","ne","sw","se","n","e","s","w"];

    var r_len   = r_array.length;
    var txta    = "";
    var txtb    = "";
    var txtc    = "";

    for (let i = 0; i < 2; ++i){
        $('#mausi').append(
        "<div id='resizable_" + i + "'>" +
        "<div id='resizable_" + i + "content'>ssss</div>");

        txta = "";
        for (let j = 0; j < 8; ++j) {
            txtb = s_array[j] ;
            txtc = r_array[j] + "_" + i;
            txta = txta + "<div class='mdc_" + i + " ui-resizable-handle ui-resizable-"
                 + txtb + "' id='"
                 + txtc + "'></div>";
        }   txta = txta + "</div>";

        $("#resizable_" + i).append(txta);
        $("#resizable_" + i).css({
            'position':'absolute',
            'border': '1px solid #000000',
            'background-color':c_array[i],
            'z-index':2502,
            'width': '100px',
            'height': '100px',
            'top': '150px',
            'left': '170px'
        });
        
        LoadAndSetupCss(grippersCSS.theCssString,i);

        $('#resizable_' + i).resizable({
            handles: 'all',
            grid: [10,10],
            disabled: false
        });

        $(".mdc_"+i).hide();

        $('#resizable_' + i).draggable({ grid: [10,10]});
        $('#resizable_' + i).on("mousedown", function(e){
            console.log(e.target.id);
            for (let k = 0; k < 2; ++k)
            $(".mdc_" + k).hide();
            $(".mdc_" + i).show();

            selected_object = $('#resizable_' + i)
        });
    }
}

function startScript()
{
    try {
        var result = dbase.parse(editor1.getValue());
        alert(result);
    }
    catch (ex) {
        alert(ex.message);
    }
}

function init_commands()
{
    // mouse
    // cancel DOM event - browser context menu
    document.oncontextmenu = function() {return false;};

    $(document).on('dblclick', function(evt) {
        if (evt.button == 2) {
            var relativeX = (evt.pageX),
                relativeY = (evt.pageY - 200);
            $('#dmenu').hide();
            return false;
        }   return true;
    });

    // display menu
    $(document).on('click', function(evt) {
        if (evt.button == 0) {
            document.oncontextmenu = function() {return true;};
            return true;
        }
        else if (evt.button == 2) {
            var relativeX = (evt.pageX),
                relativeY = (evt.pageY - 200);	
            $('#dmenu').css({
                top:  relativeY+'px',
                left: relativeX+'px'
            });
            $('#dmenu').show();
            return false;
        }   return true;
    });

    // click menu item
    $(".menubtn").on('click', function(evt) { $('#dmenu').hide(); });

    // keyboard
    // F2 - run script ...
    $(document).on('keyup', function(evt) {
        if (evt.which == 113) {     // F2
            startScript(editor1);
        }
        else if (evt.which == 27) { // ESC
            for (let i = 0; i < 2; ++i) {
                $('#resizable_' + i).draggable({
                    disabled: true
                });
                $('#resizable_' + i).on('mousedown', function(e){
                    $('#resizable_' + i).draggable({
                        disabled: false
                    });
                });
            }
        }
    });
}

function init_editors() {
    editor1 = ace.edit("editorpane1");
    editor1.setTheme("ace/theme/eclipse");
    editor1.session.setMode("/js/ace/src/javascript");

    $.ajax({
        url: "/res/dBase/template.wfm",
        dataType: 'text',
        success: function(data) {
            editor1.setValue(data,-1);
        }
    });
}

