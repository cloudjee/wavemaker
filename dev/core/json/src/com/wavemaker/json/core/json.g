/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * JSON grammar.  Language spec from <http://www.ietf.org/rfc/rfc4627.txt>.
 *
 * @author small
 * @version $Rev$ - $Date$
 */
grammar json;

tokens {
	BEGIN_ARRAY	=	'[';
	END_ARRAY	=	']';
	
	BEGIN_OBJ	=	'{';
	END_OBJ		=	'}';
	
	NAME_SEP	=	':';
	VALUE_SEP	=	',';
}

@lexer::header {
package com.wavemaker.json.core;

import org.apache.commons.lang.StringEscapeUtils;
}

@parser::header {
package com.wavemaker.json.core;

import java.text.NumberFormat;
import java.text.ParseException;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONArray;
}


// fix import warnings
@parser::members {
	// these only exist to remove unused import warnings
	Class<?> IGNORE_listClass = List.class;
	Class<?> IGNORE_arrayListClass = ArrayList.class;
	Class<?> IGNORE_stackClass = Stack.class;
}

@lexer::members {
	// these only exist to remove unused import warnings
	Class<?> IGNORE_listClass = List.class;
	Class<?> IGNORE_arrayListClass = ArrayList.class;
	Class<?> IGNORE_stackClass = Stack.class;
}

/* for debugging; returns errors instead of warnings
@rulecatch {
	catch (RecognitionException e) {
		throw e;
	}
}
*/

/* ----------------------------------------------------------------------------
 * Parser rules
 */

json returns [JSON value]	:
	object { $value = $object.value; }
	| array { $value = $array.array; };


/* 2.1
 * value = false / null / true / object / array / number / string
 */
value returns [Object value]	:
	FALSE { $value = Boolean.FALSE; }
	| NULL { $value = null; }
	| TRUE { $value = Boolean.TRUE; }
	| object { $value = $object.value; }
	| array { $value = $array.array; }
	| NUMBER
		{
			NumberFormat nf = NumberFormat.getInstance();
			try {
				$value = nf.parse($NUMBER.text);
			} catch (ParseException e) {
				throw new RuntimeException(e);
			}
		}
	| STRING { $value = $STRING.text; };

/* 2.2
 * object = begin-object [ member *( value-separator member ) ] end-object
 *member = string name-separator value
 */
object returns [JSONObject value]	:
	{
		$value = new JSONObject();
	}
	BEGIN_OBJ (member[value] (VALUE_SEP member[value])*)? VALUE_SEP? END_OBJ;

/**
 * Parse a member of an object.
 *
 * @param object
 *		The object being de-serialized.
 */
member[JSONObject object]	:
	STRING NAME_SEP value
	{
		$object.put($STRING.text, $value.value);
	} |
	JS_IDENT NAME_SEP value
	{
		$object.put($JS_IDENT.text, $value.value);
	};

/**
 * Parse an array.
 *
 * From spec, section 2.3:
 * <pre>
 * 	array = begin-array [ value *( value-separator value ) ] end-array
 * </pre>
 */
array returns [JSONArray array]	:
	{
		$array = new JSONArray();
	}
	BEGIN_ARRAY 
		(
			va=value { $array.add($va.value); }
			(VALUE_SEP vap=value { $array.add($vap.value); })*
            VALUE_SEP?
		)?
	END_ARRAY;


/* ----------------------------------------------------------------------------
 * Lexer rules
 */

// 2.1 - null  = %x6e.75.6c.6c      ; null
NULL	:	'null';

// 2.1 - true  = %x74.72.75.65      ; true
TRUE	:	'true';

// 2.1 - false = %x66.61.6c.73.65   ; false
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

fragment DECIMAL_POINT
	:	'.';
fragment DIGIT
	:	'0'..'9';
fragment DIGIT19
	:	'1'..'9';
fragment E
	:	'e' | 'E';
fragment EXP
	:	E (MINUS | PLUS)? DIGIT+;
fragment FRAC
	:	DECIMAL_POINT DIGIT+;
fragment INT
	:	ZERO | (DIGIT19 DIGIT*);
fragment MINUS
	:	'-';
fragment PLUS
	:	'+';
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
STRING	:	QUOTATION_MARK CHAR* QUOTATION_MARK
	{
		setText(StringEscapeUtils.unescapeJava(
				getText().substring(1, getText().length()-1)));
	};

fragment CHAR
	:	UNESCAPED | ESCAPE ( '"' | '\\' | '/' | 'b' | 'f' | 'n' | 'r' | 't' | 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT );
fragment ESCAPE
	:	'\\';
fragment QUOTATION_MARK
	:	'"';
fragment UNESCAPED
	:	'\u0020'..'\u0021' | '\u0023'..'\u005B' | '\u005D'..'\uFFFF';
fragment HEXDIGIT
	:	'0'..'9' | 'a'..'f' | 'A'..'F';

// dump whitespace
WHITESPACE	:	( ' ' | '\t' | '\r' | '\n')+ { $channel = HIDDEN; };

// these are javascript identifiers; they're not technically legal JSON, but
// it makes parsing some legal JS much easier when we allow these in
// map keys.  This isn't the full set, I'm ignoring unicode.  At least for
// now, if you want unicode, just quote the string into correct JSON.
fragment JS_IDENT_FIRST
    :   'A'..'Z' | 'a'..'z' | '$' | '_';
JS_IDENT    :   JS_IDENT_FIRST (JS_IDENT_FIRST | DIGIT)*
    {
        setText(StringEscapeUtils.unescapeJava(getText()));
    };
