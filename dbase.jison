// ------------------------------------------------------
// dBase4Web 1.0
// (c) 2019 Jens Kallup
// all rights reserved.
//
// ------------------------------------------------------
%{
var exec_str;

var line_col = 1;
var line_row = 1;

var yytext   = '';
var tmp_id   =  0;
%}

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start program

%%

program
    : /* empty */
    | lstmt program
    | ENDOFFILE
    ;

lstmt
    : local_stmt
    ;

local_stmt
    : LOCAL
	{
	    var a = 2;
	} local_list
    ;

local_list
    : id
    | local_list COMMA  local_list
    ;

id: ID        { $0 = yytext; } ;


%%
