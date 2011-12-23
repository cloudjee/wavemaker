lexer grammar json;

@members {
	// these only exist to remove unused import warnings
	Class<?> IGNORE_listClass = List.class;
	Class<?> IGNORE_arrayListClass = ArrayList.class;
	Class<?> IGNORE_stackClass = Stack.class;
}
@header {
package com.wavemaker.json.core;

import org.apache.commons.lang.StringEscapeUtils;
}

BEGIN_ARRAY : '[' ;
END_ARRAY : ']' ;
BEGIN_OBJ : '{' ;
END_OBJ : '}' ;
NAME_SEP : ':' ;
VALUE_SEP : ',' ;

// $ANTLR src "src/com/wavemaker/json/core/json.g" 160
NULL	:	'null';

// 2.1 - true  = %x74.72.75.65      ; true
// $ANTLR src "src/com/wavemaker/json/core/json.g" 163
TRUE	:	'true';

// 2.1 - false = %x66.61.6c.73.65   ; false
// $ANTLR src "src/com/wavemaker/json/core/json.g" 166
FALSE	:	'false';

/* 2.4
 * number = [ minus ] int [ frac ] [ exp ]
 * decimal-point = %x2E       ; .
 * digit1-9 = %x31-39         ; 1-9
 * e = %x65 / %x45            ; e E
 * exp = e [ minus / plus ] 1*DIGIT
 * frac = decimal-point 1*DIGIT
 * int = zero / ( digit1-9 *DIGIT )
 * minus = %x2D               ; -
 * plus = %x2B                ; +
 * zero = %x30                ; 0
 */
// $ANTLR src "src/com/wavemaker/json/core/json.g" 180
NUMBER	:	MINUS? INT FRAC? EXP?
	{
		String retStr = ((null!=$MINUS)?$MINUS.text:"") + $INT.text;
		if (null!=$FRAC) {
			retStr = retStr + $FRAC.text;
		}
		if (null!=$EXP) {
			retStr = retStr + $EXP.text;
		}
		setText(retStr);
	};

// $ANTLR src "src/com/wavemaker/json/core/json.g" 192
fragment DECIMAL_POINT
	:	'.';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 194
fragment DIGIT
	:	'0'..'9';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 196
fragment DIGIT19
	:	'1'..'9';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 198
fragment E
	:	'e' | 'E';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 200
fragment EXP
	:	E (MINUS | PLUS)? DIGIT+;
// $ANTLR src "src/com/wavemaker/json/core/json.g" 202
fragment FRAC
	:	DECIMAL_POINT DIGIT+;
// $ANTLR src "src/com/wavemaker/json/core/json.g" 204
fragment INT
	:	ZERO | (DIGIT19 DIGIT*);
// $ANTLR src "src/com/wavemaker/json/core/json.g" 206
fragment MINUS
	:	'-';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 208
fragment PLUS
	:	'+';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 210
fragment ZERO
	:	'0';

/* 2.5
 * string = quotation-mark *char quotation-mark
 * char = unescaped /
 *	escape (
 *	%x22 /          ; "    quotation mark  U+0022
 *	%x5C /          ; \    reverse solidus U+005C
 *	%x2F /          ; /    solidus         U+002F
 *	%x62 /          ; b    backspace       U+0008
 *	%x66 /          ; f    form feed       U+000C
 *	%x6E /          ; n    line feed       U+000A
 *	%x72 /          ; r    carriage return U+000D
 *	%x74 /          ; t    tab             U+0009
 *	%x75 4HEXDIG )  ; uXXXX                U+XXXX
 * escape = %x5C              ; \
 * quotation-mark = %x22      ; "
 * unescaped = %x20-21 / %x23-5B / %x5D-10FFFF
 */
// $ANTLR src "src/com/wavemaker/json/core/json.g" 230
STRING	:	QUOTATION_MARK CHAR* QUOTATION_MARK
	{
		setText(StringEscapeUtils.unescapeJava(
				getText().substring(1, getText().length()-1)));
	};

// $ANTLR src "src/com/wavemaker/json/core/json.g" 236
fragment CHAR
	:	UNESCAPED | ESCAPE ( '"' | '\\' | '/' | 'b' | 'f' | 'n' | 'r' | 't' | 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT );
// $ANTLR src "src/com/wavemaker/json/core/json.g" 238
fragment ESCAPE
	:	'\\';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 240
fragment QUOTATION_MARK
	:	'"';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 242
fragment UNESCAPED
	:	'\u0020'..'\u0021' | '\u0023'..'\u005B' | '\u005D'..'\uFFFF';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 244
fragment HEXDIGIT
	:	'0'..'9' | 'a'..'f' | 'A'..'F';

// dump whitespace
// $ANTLR src "src/com/wavemaker/json/core/json.g" 248
WHITESPACE	:	( ' ' | '\t' | '\r' | '\n')+ { $channel = HIDDEN; };

// these are javascript identifiers; they're not technically legal JSON, but
// it makes parsing some legal JS much easier when we allow these in
// map keys.  This isn't the full set, I'm ignoring unicode.  At least for
// now, if you want unicode, just quote the string into correct JSON.
// $ANTLR src "src/com/wavemaker/json/core/json.g" 254
fragment JS_IDENT_FIRST
    :   'A'..'Z' | 'a'..'z' | '$' | '_';
// $ANTLR src "src/com/wavemaker/json/core/json.g" 256
JS_IDENT    :   JS_IDENT_FIRST (JS_IDENT_FIRST | DIGIT)*
    {
        setText(StringEscapeUtils.unescapeJava(getText()));
    };
