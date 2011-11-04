// $ANTLR 3.1.1 src/com/wavemaker/json/core/json.g 2011-08-19 11:24:08

package com.wavemaker.json.core;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.antlr.runtime.BitSet;
import org.antlr.runtime.NoViableAltException;
import org.antlr.runtime.Parser;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.RecognizerSharedState;
import org.antlr.runtime.Token;
import org.antlr.runtime.TokenStream;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;

/**
 * JSON grammar. Language spec from <http://www.ietf.org/rfc/rfc4627.txt>.
 * 
 * @author Matt Small
 */
public class jsonParser extends Parser {

    public static final String[] tokenNames = new String[] { "<invalid>", "<EOR>", "<DOWN>", "<UP>", "BEGIN_ARRAY", "END_ARRAY", "BEGIN_OBJ",
        "END_OBJ", "NAME_SEP", "VALUE_SEP", "FALSE", "NULL", "TRUE", "NUMBER", "STRING", "JS_IDENT", "MINUS", "INT", "FRAC", "EXP", "DECIMAL_POINT",
        "DIGIT", "DIGIT19", "E", "PLUS", "ZERO", "QUOTATION_MARK", "CHAR", "UNESCAPED", "ESCAPE", "HEXDIGIT", "WHITESPACE", "JS_IDENT_FIRST" };

    public static final int E = 23;

    public static final int UNESCAPED = 28;

    public static final int NAME_SEP = 8;

    public static final int NULL = 11;

    public static final int NUMBER = 13;

    public static final int CHAR = 27;

    public static final int WHITESPACE = 31;

    public static final int INT = 17;

    public static final int JS_IDENT_FIRST = 32;

    public static final int MINUS = 16;

    public static final int END_ARRAY = 5;

    public static final int EOF = -1;

    public static final int TRUE = 12;

    public static final int FRAC = 18;

    public static final int ZERO = 25;

    public static final int DIGIT19 = 22;

    public static final int QUOTATION_MARK = 26;

    public static final int DECIMAL_POINT = 20;

    public static final int ESCAPE = 29;

    public static final int EXP = 19;

    public static final int BEGIN_OBJ = 6;

    public static final int END_OBJ = 7;

    public static final int VALUE_SEP = 9;

    public static final int PLUS = 24;

    public static final int BEGIN_ARRAY = 4;

    public static final int DIGIT = 21;

    public static final int FALSE = 10;

    public static final int STRING = 14;

    public static final int JS_IDENT = 15;

    public static final int HEXDIGIT = 30;

    // delegates
    // delegators

    public jsonParser(TokenStream input) {
        this(input, new RecognizerSharedState());
    }

    public jsonParser(TokenStream input, RecognizerSharedState state) {
        super(input, state);

    }

    @Override
    public String[] getTokenNames() {
        return jsonParser.tokenNames;
    }

    @Override
    public String getGrammarFileName() {
        return "src/com/wavemaker/json/core/json.g";
    }

    // these only exist to remove unused import warnings
    Class<?> IGNORE_listClass = List.class;

    Class<?> IGNORE_arrayListClass = ArrayList.class;

    Class<?> IGNORE_stackClass = Stack.class;

    // $ANTLR start "json"
    // src/com/wavemaker/json/core/json.g:83:1: json returns [JSON value] : ( object | array );
    public final JSON json() throws RecognitionException {
        JSON value = null;

        JSONObject object1 = null;

        JSONArray array2 = null;

        try {
            // src/com/wavemaker/json/core/json.g:83:27: ( object | array )
            int alt1 = 2;
            int LA1_0 = this.input.LA(1);

            if (LA1_0 == BEGIN_OBJ) {
                alt1 = 1;
            } else if (LA1_0 == BEGIN_ARRAY) {
                alt1 = 2;
            } else {
                NoViableAltException nvae = new NoViableAltException("", 1, 0, this.input);

                throw nvae;
            }
            switch (alt1) {
                case 1:
                // src/com/wavemaker/json/core/json.g:84:2: object
                {
                    pushFollow(FOLLOW_object_in_json124);
                    object1 = object();

                    this.state._fsp--;

                    value = object1;

                }
                    break;
                case 2:
                // src/com/wavemaker/json/core/json.g:85:4: array
                {
                    pushFollow(FOLLOW_array_in_json131);
                    array2 = array();

                    this.state._fsp--;

                    value = array2;

                }
                    break;

            }
        } catch (RecognitionException re) {
            reportError(re);
            recover(this.input, re);
        } finally {
        }
        return value;
    }

    // $ANTLR end "json"

    // $ANTLR start "value"
    // src/com/wavemaker/json/core/json.g:91:1: value returns [Object value] : ( FALSE | NULL | TRUE | object | array |
    // NUMBER | STRING );
    public final Object value() throws RecognitionException {
        Object value = null;

        Token NUMBER5 = null;
        Token STRING6 = null;
        JSONObject object3 = null;

        JSONArray array4 = null;

        try {
            // src/com/wavemaker/json/core/json.g:91:30: ( FALSE | NULL | TRUE | object | array | NUMBER | STRING )
            int alt2 = 7;
            switch (this.input.LA(1)) {
                case FALSE: {
                    alt2 = 1;
                }
                    break;
                case NULL: {
                    alt2 = 2;
                }
                    break;
                case TRUE: {
                    alt2 = 3;
                }
                    break;
                case BEGIN_OBJ: {
                    alt2 = 4;
                }
                    break;
                case BEGIN_ARRAY: {
                    alt2 = 5;
                }
                    break;
                case NUMBER: {
                    alt2 = 6;
                }
                    break;
                case STRING: {
                    alt2 = 7;
                }
                    break;
                default:
                    NoViableAltException nvae = new NoViableAltException("", 2, 0, this.input);

                    throw nvae;
            }

            switch (alt2) {
                case 1:
                // src/com/wavemaker/json/core/json.g:92:2: FALSE
                {
                    match(this.input, FALSE, FOLLOW_FALSE_in_value149);
                    value = Boolean.FALSE;

                }
                    break;
                case 2:
                // src/com/wavemaker/json/core/json.g:93:4: NULL
                {
                    match(this.input, NULL, FOLLOW_NULL_in_value156);
                    value = null;

                }
                    break;
                case 3:
                // src/com/wavemaker/json/core/json.g:94:4: TRUE
                {
                    match(this.input, TRUE, FOLLOW_TRUE_in_value163);
                    value = Boolean.TRUE;

                }
                    break;
                case 4:
                // src/com/wavemaker/json/core/json.g:95:4: object
                {
                    pushFollow(FOLLOW_object_in_value170);
                    object3 = object();

                    this.state._fsp--;

                    value = object3;

                }
                    break;
                case 5:
                // src/com/wavemaker/json/core/json.g:96:4: array
                {
                    pushFollow(FOLLOW_array_in_value177);
                    array4 = array();

                    this.state._fsp--;

                    value = array4;

                }
                    break;
                case 6:
                // src/com/wavemaker/json/core/json.g:97:4: NUMBER
                {
                    NUMBER5 = (Token) match(this.input, NUMBER, FOLLOW_NUMBER_in_value184);

                    NumberFormat nf = NumberFormat.getInstance();
                    try {
                        value = nf.parse(NUMBER5 != null ? NUMBER5.getText() : null);
                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }

                }
                    break;
                case 7:
                // src/com/wavemaker/json/core/json.g:106:4: STRING
                {
                    STRING6 = (Token) match(this.input, STRING, FOLLOW_STRING_in_value193);
                    value = STRING6 != null ? STRING6.getText() : null;

                }
                    break;

            }
        } catch (RecognitionException re) {
            reportError(re);
            recover(this.input, re);
        } finally {
        }
        return value;
    }

    // $ANTLR end "value"

    // $ANTLR start "object"
    // src/com/wavemaker/json/core/json.g:112:1: object returns [JSONObject value] : BEGIN_OBJ ( member[value] (
    // VALUE_SEP member[value] )* )? ( VALUE_SEP )? END_OBJ ;
    public final JSONObject object() throws RecognitionException {
        JSONObject value = null;

        try {
            // src/com/wavemaker/json/core/json.g:112:35: ( BEGIN_OBJ ( member[value] ( VALUE_SEP member[value] )* )? (
            // VALUE_SEP )? END_OBJ )
            // src/com/wavemaker/json/core/json.g:113:2: BEGIN_OBJ ( member[value] ( VALUE_SEP member[value] )* )? (
            // VALUE_SEP )? END_OBJ
            {

                value = new JSONObject();

                match(this.input, BEGIN_OBJ, FOLLOW_BEGIN_OBJ_in_object213);
                // src/com/wavemaker/json/core/json.g:116:12: ( member[value] ( VALUE_SEP member[value] )* )?
                int alt4 = 2;
                int LA4_0 = this.input.LA(1);

                if (LA4_0 >= STRING && LA4_0 <= JS_IDENT) {
                    alt4 = 1;
                }
                switch (alt4) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:116:13: member[value] ( VALUE_SEP member[value] )*
                    {
                        pushFollow(FOLLOW_member_in_object216);
                        member(value);

                        this.state._fsp--;

                        // src/com/wavemaker/json/core/json.g:116:27: ( VALUE_SEP member[value] )*
                        loop3: do {
                            int alt3 = 2;
                            int LA3_0 = this.input.LA(1);

                            if (LA3_0 == VALUE_SEP) {
                                int LA3_1 = this.input.LA(2);

                                if (LA3_1 >= STRING && LA3_1 <= JS_IDENT) {
                                    alt3 = 1;
                                }

                            }

                            switch (alt3) {
                                case 1:
                                // src/com/wavemaker/json/core/json.g:116:28: VALUE_SEP member[value]
                                {
                                    match(this.input, VALUE_SEP, FOLLOW_VALUE_SEP_in_object220);
                                    pushFollow(FOLLOW_member_in_object222);
                                    member(value);

                                    this.state._fsp--;

                                }
                                    break;

                                default:
                                    break loop3;
                            }
                        } while (true);

                    }
                        break;

                }

                // src/com/wavemaker/json/core/json.g:116:56: ( VALUE_SEP )?
                int alt5 = 2;
                int LA5_0 = this.input.LA(1);

                if (LA5_0 == VALUE_SEP) {
                    alt5 = 1;
                }
                switch (alt5) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:116:56: VALUE_SEP
                    {
                        match(this.input, VALUE_SEP, FOLLOW_VALUE_SEP_in_object229);

                    }
                        break;

                }

                match(this.input, END_OBJ, FOLLOW_END_OBJ_in_object232);

            }

        } catch (RecognitionException re) {
            reportError(re);
            recover(this.input, re);
        } finally {
        }
        return value;
    }

    // $ANTLR end "object"

    // $ANTLR start "member"
    // src/com/wavemaker/json/core/json.g:118:1: member[JSONObject object] : ( STRING NAME_SEP value | JS_IDENT NAME_SEP
    // value );
    public final void member(JSONObject object) throws RecognitionException {
        Token STRING7 = null;
        Token JS_IDENT9 = null;
        Object value8 = null;

        Object value10 = null;

        try {
            // src/com/wavemaker/json/core/json.g:124:27: ( STRING NAME_SEP value | JS_IDENT NAME_SEP value )
            int alt6 = 2;
            int LA6_0 = this.input.LA(1);

            if (LA6_0 == STRING) {
                alt6 = 1;
            } else if (LA6_0 == JS_IDENT) {
                alt6 = 2;
            } else {
                NoViableAltException nvae = new NoViableAltException("", 6, 0, this.input);

                throw nvae;
            }
            switch (alt6) {
                case 1:
                // src/com/wavemaker/json/core/json.g:125:2: STRING NAME_SEP value
                {
                    STRING7 = (Token) match(this.input, STRING, FOLLOW_STRING_in_member244);
                    match(this.input, NAME_SEP, FOLLOW_NAME_SEP_in_member246);
                    pushFollow(FOLLOW_value_in_member248);
                    value8 = value();

                    this.state._fsp--;

                    object.put(STRING7 != null ? STRING7.getText() : null, value8);

                }
                    break;
                case 2:
                // src/com/wavemaker/json/core/json.g:129:2: JS_IDENT NAME_SEP value
                {
                    JS_IDENT9 = (Token) match(this.input, JS_IDENT, FOLLOW_JS_IDENT_in_member256);
                    match(this.input, NAME_SEP, FOLLOW_NAME_SEP_in_member258);
                    pushFollow(FOLLOW_value_in_member260);
                    value10 = value();

                    this.state._fsp--;

                    object.put(JS_IDENT9 != null ? JS_IDENT9.getText() : null, value10);

                }
                    break;

            }
        } catch (RecognitionException re) {
            reportError(re);
            recover(this.input, re);
        } finally {
        }
        return;
    }

    // $ANTLR end "member"

    // $ANTLR start "array"
    // src/com/wavemaker/json/core/json.g:134:1: array returns [JSONArray array] : BEGIN_ARRAY (va= value ( VALUE_SEP
    // vap= value )* ( VALUE_SEP )? )? END_ARRAY ;
    public final JSONArray array() throws RecognitionException {
        JSONArray array = null;

        Object va = null;

        Object vap = null;

        try {
            // src/com/wavemaker/json/core/json.g:142:33: ( BEGIN_ARRAY (va= value ( VALUE_SEP vap= value )* ( VALUE_SEP
            // )? )? END_ARRAY )
            // src/com/wavemaker/json/core/json.g:143:2: BEGIN_ARRAY (va= value ( VALUE_SEP vap= value )* ( VALUE_SEP )?
            // )? END_ARRAY
            {

                array = new JSONArray();

                match(this.input, BEGIN_ARRAY, FOLLOW_BEGIN_ARRAY_in_array281);
                // src/com/wavemaker/json/core/json.g:147:3: (va= value ( VALUE_SEP vap= value )* ( VALUE_SEP )? )?
                int alt9 = 2;
                int LA9_0 = this.input.LA(1);

                if (LA9_0 == BEGIN_ARRAY || LA9_0 == BEGIN_OBJ || LA9_0 >= FALSE && LA9_0 <= STRING) {
                    alt9 = 1;
                }
                switch (alt9) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:148:4: va= value ( VALUE_SEP vap= value )* ( VALUE_SEP )?
                    {
                        pushFollow(FOLLOW_value_in_array293);
                        va = value();

                        this.state._fsp--;

                        array.add(va);
                        // src/com/wavemaker/json/core/json.g:149:4: ( VALUE_SEP vap= value )*
                        loop7: do {
                            int alt7 = 2;
                            int LA7_0 = this.input.LA(1);

                            if (LA7_0 == VALUE_SEP) {
                                int LA7_1 = this.input.LA(2);

                                if (LA7_1 == BEGIN_ARRAY || LA7_1 == BEGIN_OBJ || LA7_1 >= FALSE && LA7_1 <= STRING) {
                                    alt7 = 1;
                                }

                            }

                            switch (alt7) {
                                case 1:
                                // src/com/wavemaker/json/core/json.g:149:5: VALUE_SEP vap= value
                                {
                                    match(this.input, VALUE_SEP, FOLLOW_VALUE_SEP_in_array301);
                                    pushFollow(FOLLOW_value_in_array305);
                                    vap = value();

                                    this.state._fsp--;

                                    array.add(vap);

                                }
                                    break;

                                default:
                                    break loop7;
                            }
                        } while (true);

                        // src/com/wavemaker/json/core/json.g:150:13: ( VALUE_SEP )?
                        int alt8 = 2;
                        int LA8_0 = this.input.LA(1);

                        if (LA8_0 == VALUE_SEP) {
                            alt8 = 1;
                        }
                        switch (alt8) {
                            case 1:
                            // src/com/wavemaker/json/core/json.g:150:13: VALUE_SEP
                            {
                                match(this.input, VALUE_SEP, FOLLOW_VALUE_SEP_in_array323);

                            }
                                break;

                        }

                    }
                        break;

                }

                match(this.input, END_ARRAY, FOLLOW_END_ARRAY_in_array332);

            }

        } catch (RecognitionException re) {
            reportError(re);
            recover(this.input, re);
        } finally {
        }
        return array;
    }

    // $ANTLR end "array"

    // Delegated rules

    public static final BitSet FOLLOW_object_in_json124 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_array_in_json131 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_FALSE_in_value149 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_NULL_in_value156 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_TRUE_in_value163 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_object_in_value170 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_array_in_value177 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_NUMBER_in_value184 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_STRING_in_value193 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_BEGIN_OBJ_in_object213 = new BitSet(new long[] { 0x000000000000C280L });

    public static final BitSet FOLLOW_member_in_object216 = new BitSet(new long[] { 0x0000000000000280L });

    public static final BitSet FOLLOW_VALUE_SEP_in_object220 = new BitSet(new long[] { 0x000000000000C000L });

    public static final BitSet FOLLOW_member_in_object222 = new BitSet(new long[] { 0x0000000000000280L });

    public static final BitSet FOLLOW_VALUE_SEP_in_object229 = new BitSet(new long[] { 0x0000000000000080L });

    public static final BitSet FOLLOW_END_OBJ_in_object232 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_STRING_in_member244 = new BitSet(new long[] { 0x0000000000000100L });

    public static final BitSet FOLLOW_NAME_SEP_in_member246 = new BitSet(new long[] { 0x0000000000007C50L });

    public static final BitSet FOLLOW_value_in_member248 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_JS_IDENT_in_member256 = new BitSet(new long[] { 0x0000000000000100L });

    public static final BitSet FOLLOW_NAME_SEP_in_member258 = new BitSet(new long[] { 0x0000000000007C50L });

    public static final BitSet FOLLOW_value_in_member260 = new BitSet(new long[] { 0x0000000000000002L });

    public static final BitSet FOLLOW_BEGIN_ARRAY_in_array281 = new BitSet(new long[] { 0x0000000000007C70L });

    public static final BitSet FOLLOW_value_in_array293 = new BitSet(new long[] { 0x0000000000000220L });

    public static final BitSet FOLLOW_VALUE_SEP_in_array301 = new BitSet(new long[] { 0x0000000000007C50L });

    public static final BitSet FOLLOW_value_in_array305 = new BitSet(new long[] { 0x0000000000000220L });

    public static final BitSet FOLLOW_VALUE_SEP_in_array323 = new BitSet(new long[] { 0x0000000000000020L });

    public static final BitSet FOLLOW_END_ARRAY_in_array332 = new BitSet(new long[] { 0x0000000000000002L });

}