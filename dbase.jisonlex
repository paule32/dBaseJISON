// ------------------------------------------------------
// dBase4Web 1.0
// (c) 2019 Jens Kallup
// all rights reserved.
//
// ------------------------------------------------------
%option caseless

digit    [0-9]*
id       [a-zA-Z]+[a-zA-Z0-9_]*
number   [0-9]+("."[0-9]+)?\b

%x COMMENTS
%%

[ \t\r\n]+       /* skip whitespace */

\?               return ccount("PRINT");

"//".*\n           /* ignore comment */
"&&".*\n           /* ignore comment */
"**".*\n           /* ignore comment */

\/\\*           { ccount("COMMENT"); this.begin('COMMENTS'); }
<COMMENTS>\\*\/ %{ this.begin('INITIAL');  %}
<COMMENTS>\n    { ++line_row; line_col = 1; }
<COMMENTS>.     { ++line_col; }


\/\\*.*\\*\/         /* ignore comment */
\/\\*.*\\*\/\n       /* ignore comment */

"=="             return ccount("EQUAL"    );
"!="             return ccount("NOTEQUAL" );
"<="             return ccount("LESSEQUAL");
"=>"             return ccount("EQUALMORE");

"<"              return ccount("SMALLER");
">"              return ccount("GREATER");

"="              return ccount("ASSIGN");

"+"              return ccount("ADD");
"-"              return ccoubt("SUB");
"*"              return ccount("MUL");
"/"              return ccount("DIV");

"("              return ccount("LBRACE");
")"              return ccount("RBRACE");

","              return ccount("COMMA");
"."              return ccount("DOT");  


[cC][lL][aA][sS][sS]                     return ccount("CLASS");    
[eE][lL][sS][eE]                         return ccount("ELSE");     
[eE][nN][dD][cC][lL][aA][sS][sS]         return ccount("ENDCLASS"); 
[eE][nN][dD][iI][fF]                     return ccount("ENDIF");    
[fF][aA][lL][sS][eE]                     return ccount("FALSE");    
[iI][fF]                                 return ccount("IF");       
[lL][oO][cC][aA][lL]                     return ccount("LOCAL");    
[nN][eE][wW]                             return ccount("NEW");      
[oO][fF]                                 return ccount("OF");       
[pP][aA][rR][aA][mM][eE][tT][eE][rR]     return ccount("PARAMETER");
[tT][rR][uU][eE]                         return ccount("TRUE");

{number}  return ccount("NUMBER");
{id}      return ccount("<ID>",yytext);  

<<EOF>>   return ccount("ENDOFFILE");

%%

function ccount(str,yy="")
{
    if (str == "<COMMENT>") {
alert("commenter");
        return 0;
    }    
    else if (str == "<ID>") {
        console.log("yytext: " + yy);
        line_col += yy.length;
        return "ID";
    }
    else {
        line_col += str.length;
        return str;
    }
}

