// ------------------------------------------------------
// dBase4Web 1.0
// (c) 2019 Jens Kallup
// all rights reserved.
//
// global scope - loaded at end of index html page file.
// ------------------------------------------------------
var dbase_ast = [ ];
var dbase_cmd ;

var exec_str ;

var line_col = 1;
var line_row = 1;

var yytext   = '';

function errmsgBox(text,title) {
    $.messager.alert(title,text,"error");
}

function emsgBox(text) { errmsgBox(text,"Error - dBase4Web 1.0"); }

function include_js(jsFilePath) {
    var js  = document.createElement("script");
    js.type = "text/javascript";
    js.src  = jsFilePath;
    document.head.appendChild(js);
}
function include_css(cssFilePath) {
    var css  = document.createElement("link");
    css.type = "text/css";
    css.src  = cssFilePath;
    document.head.appendChild(css);
}

function dBaseMain()
{
    // initial actions ...
    let start_action = { type: "<start-program>", cexec: "true" };
    dbase_ast.length = 0;
    dbase_ast.push(start_action);

    exec_str = new String("// (c) 2019 Jens Kallup\n"));
}

function dBaseRunner(idx)
{
    alert("runner");

    alert(exec_str);
    eval (exec_str);
    return;
}

