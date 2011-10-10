// $ANTLR 3.1.1 src/com/wavemaker/json/core/json.g 2011-08-19 11:24:08

package com.wavemaker.json.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.antlr.runtime.BaseRecognizer;
import org.antlr.runtime.CharStream;
import org.antlr.runtime.CommonToken;
import org.antlr.runtime.DFA;
import org.antlr.runtime.EarlyExitException;
import org.antlr.runtime.Lexer;
import org.antlr.runtime.MismatchedSetException;
import org.antlr.runtime.NoViableAltException;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.RecognizerSharedState;
import org.antlr.runtime.Token;
import org.apache.commons.lang.StringEscapeUtils;

public class jsonLexer extends Lexer {

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

    public static final int EOF = -1;

    public static final int END_ARRAY = 5;

    public static final int TRUE = 12;

    public static final int FRAC = 18;

    public static final int ZERO = 25;

    public static final int DIGIT19 = 22;

    public static final int DECIMAL_POINT = 20;

    public static final int QUOTATION_MARK = 26;

    public static final int ESCAPE = 29;

    public static final int EXP = 19;

    public static final int BEGIN_OBJ = 6;

    public static final int VALUE_SEP = 9;

    public static final int END_OBJ = 7;

    public static final int BEGIN_ARRAY = 4;

    public static final int PLUS = 24;

    public static final int DIGIT = 21;

    public static final int FALSE = 10;

    public static final int JS_IDENT = 15;

    public static final int STRING = 14;

    public static final int HEXDIGIT = 30;

    // these only exist to remove unused import warnings
    Class<?> IGNORE_listClass = List.class;

    Class<?> IGNORE_arrayListClass = ArrayList.class;

    Class<?> IGNORE_stackClass = Stack.class;

    // delegates
    // delegators

    public jsonLexer() {
        ;
    }

    public jsonLexer(CharStream input) {
        this(input, new RecognizerSharedState());
    }

    public jsonLexer(CharStream input, RecognizerSharedState state) {
        super(input, state);

    }

    @Override
    public String getGrammarFileName() {
        return "src/com/wavemaker/json/core/json.g";
    }

    // $ANTLR start "BEGIN_ARRAY"
    public final void mBEGIN_ARRAY() throws RecognitionException {
        try {
            int _type = BEGIN_ARRAY;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:15:13: ( '[' )
            // src/com/wavemaker/json/core/json.g:15:15: '['
            {
                match('[');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "BEGIN_ARRAY"

    // $ANTLR start "END_ARRAY"
    public final void mEND_ARRAY() throws RecognitionException {
        try {
            int _type = END_ARRAY;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:16:11: ( ']' )
            // src/com/wavemaker/json/core/json.g:16:13: ']'
            {
                match(']');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "END_ARRAY"

    // $ANTLR start "BEGIN_OBJ"
    public final void mBEGIN_OBJ() throws RecognitionException {
        try {
            int _type = BEGIN_OBJ;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:17:11: ( '{' )
            // src/com/wavemaker/json/core/json.g:17:13: '{'
            {
                match('{');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "BEGIN_OBJ"

    // $ANTLR start "END_OBJ"
    public final void mEND_OBJ() throws RecognitionException {
        try {
            int _type = END_OBJ;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:18:9: ( '}' )
            // src/com/wavemaker/json/core/json.g:18:11: '}'
            {
                match('}');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "END_OBJ"

    // $ANTLR start "NAME_SEP"
    public final void mNAME_SEP() throws RecognitionException {
        try {
            int _type = NAME_SEP;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:19:10: ( ':' )
            // src/com/wavemaker/json/core/json.g:19:12: ':'
            {
                match(':');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "NAME_SEP"

    // $ANTLR start "VALUE_SEP"
    public final void mVALUE_SEP() throws RecognitionException {
        try {
            int _type = VALUE_SEP;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:20:11: ( ',' )
            // src/com/wavemaker/json/core/json.g:20:13: ','
            {
                match(',');

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "VALUE_SEP"

    // $ANTLR start "NULL"
    public final void mNULL() throws RecognitionException {
        try {
            int _type = NULL;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:160:6: ( 'null' )
            // src/com/wavemaker/json/core/json.g:160:8: 'null'
            {
                match("null");

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "NULL"

    // $ANTLR start "TRUE"
    public final void mTRUE() throws RecognitionException {
        try {
            int _type = TRUE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:163:6: ( 'true' )
            // src/com/wavemaker/json/core/json.g:163:8: 'true'
            {
                match("true");

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "TRUE"

    // $ANTLR start "FALSE"
    public final void mFALSE() throws RecognitionException {
        try {
            int _type = FALSE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:166:7: ( 'false' )
            // src/com/wavemaker/json/core/json.g:166:9: 'false'
            {
                match("false");

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "FALSE"

    // $ANTLR start "NUMBER"
    public final void mNUMBER() throws RecognitionException {
        try {
            int _type = NUMBER;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            Token MINUS1 = null;
            Token INT2 = null;
            Token FRAC3 = null;
            Token EXP4 = null;

            // src/com/wavemaker/json/core/json.g:180:8: ( ( MINUS )? INT ( FRAC )? ( EXP )? )
            // src/com/wavemaker/json/core/json.g:180:10: ( MINUS )? INT ( FRAC )? ( EXP )?
            {
                // src/com/wavemaker/json/core/json.g:180:10: ( MINUS )?
                int alt1 = 2;
                int LA1_0 = this.input.LA(1);

                if (LA1_0 == '-') {
                    alt1 = 1;
                }
                switch (alt1) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:180:10: MINUS
                    {
                        int MINUS1Start104 = getCharIndex();
                        mMINUS();
                        MINUS1 = new CommonToken(this.input, Token.INVALID_TOKEN_TYPE, Token.DEFAULT_CHANNEL, MINUS1Start104, getCharIndex() - 1);

                    }
                        break;

                }

                int INT2Start107 = getCharIndex();
                mINT();
                INT2 = new CommonToken(this.input, Token.INVALID_TOKEN_TYPE, Token.DEFAULT_CHANNEL, INT2Start107, getCharIndex() - 1);
                // src/com/wavemaker/json/core/json.g:180:21: ( FRAC )?
                int alt2 = 2;
                int LA2_0 = this.input.LA(1);

                if (LA2_0 == '.') {
                    alt2 = 1;
                }
                switch (alt2) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:180:21: FRAC
                    {
                        int FRAC3Start109 = getCharIndex();
                        mFRAC();
                        FRAC3 = new CommonToken(this.input, Token.INVALID_TOKEN_TYPE, Token.DEFAULT_CHANNEL, FRAC3Start109, getCharIndex() - 1);

                    }
                        break;

                }

                // src/com/wavemaker/json/core/json.g:180:27: ( EXP )?
                int alt3 = 2;
                int LA3_0 = this.input.LA(1);

                if (LA3_0 == 'E' || LA3_0 == 'e') {
                    alt3 = 1;
                }
                switch (alt3) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:180:27: EXP
                    {
                        int EXP4Start112 = getCharIndex();
                        mEXP();
                        EXP4 = new CommonToken(this.input, Token.INVALID_TOKEN_TYPE, Token.DEFAULT_CHANNEL, EXP4Start112, getCharIndex() - 1);

                    }
                        break;

                }

                String retStr = (null != MINUS1 ? MINUS1 != null ? MINUS1.getText() : null : "") + (INT2 != null ? INT2.getText() : null);
                if (null != FRAC3) {
                    retStr = retStr + (FRAC3 != null ? FRAC3.getText() : null);
                }
                if (null != EXP4) {
                    retStr = retStr + (EXP4 != null ? EXP4.getText() : null);
                }
                setText(retStr);

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "NUMBER"

    // $ANTLR start "DECIMAL_POINT"
    public final void mDECIMAL_POINT() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:193:2: ( '.' )
            // src/com/wavemaker/json/core/json.g:193:4: '.'
            {
                match('.');

            }

        } finally {
        }
    }

    // $ANTLR end "DECIMAL_POINT"

    // $ANTLR start "DIGIT"
    public final void mDIGIT() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:195:2: ( '0' .. '9' )
            // src/com/wavemaker/json/core/json.g:195:4: '0' .. '9'
            {
                matchRange('0', '9');

            }

        } finally {
        }
    }

    // $ANTLR end "DIGIT"

    // $ANTLR start "DIGIT19"
    public final void mDIGIT19() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:197:2: ( '1' .. '9' )
            // src/com/wavemaker/json/core/json.g:197:4: '1' .. '9'
            {
                matchRange('1', '9');

            }

        } finally {
        }
    }

    // $ANTLR end "DIGIT19"

    // $ANTLR start "E"
    public final void mE() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:199:2: ( 'e' | 'E' )
            // src/com/wavemaker/json/core/json.g:
            {
                if (this.input.LA(1) == 'E' || this.input.LA(1) == 'e') {
                    this.input.consume();

                } else {
                    MismatchedSetException mse = new MismatchedSetException(null, this.input);
                    recover(mse);
                    throw mse;
                }

            }

        } finally {
        }
    }

    // $ANTLR end "E"

    // $ANTLR start "EXP"
    public final void mEXP() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:201:2: ( E ( MINUS | PLUS )? ( DIGIT )+ )
            // src/com/wavemaker/json/core/json.g:201:4: E ( MINUS | PLUS )? ( DIGIT )+
            {
                mE();
                // src/com/wavemaker/json/core/json.g:201:6: ( MINUS | PLUS )?
                int alt4 = 2;
                int LA4_0 = this.input.LA(1);

                if (LA4_0 == '+' || LA4_0 == '-') {
                    alt4 = 1;
                }
                switch (alt4) {
                    case 1:
                    // src/com/wavemaker/json/core/json.g:
                    {
                        if (this.input.LA(1) == '+' || this.input.LA(1) == '-') {
                            this.input.consume();

                        } else {
                            MismatchedSetException mse = new MismatchedSetException(null, this.input);
                            recover(mse);
                            throw mse;
                        }

                    }
                        break;

                }

                // src/com/wavemaker/json/core/json.g:201:22: ( DIGIT )+
                int cnt5 = 0;
                loop5: do {
                    int alt5 = 2;
                    int LA5_0 = this.input.LA(1);

                    if (LA5_0 >= '0' && LA5_0 <= '9') {
                        alt5 = 1;
                    }

                    switch (alt5) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:201:22: DIGIT
                        {
                            mDIGIT();

                        }
                            break;

                        default:
                            if (cnt5 >= 1) {
                                break loop5;
                            }
                            EarlyExitException eee = new EarlyExitException(5, this.input);
                            throw eee;
                    }
                    cnt5++;
                } while (true);

            }

        } finally {
        }
    }

    // $ANTLR end "EXP"

    // $ANTLR start "FRAC"
    public final void mFRAC() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:203:2: ( DECIMAL_POINT ( DIGIT )+ )
            // src/com/wavemaker/json/core/json.g:203:4: DECIMAL_POINT ( DIGIT )+
            {
                mDECIMAL_POINT();
                // src/com/wavemaker/json/core/json.g:203:18: ( DIGIT )+
                int cnt6 = 0;
                loop6: do {
                    int alt6 = 2;
                    int LA6_0 = this.input.LA(1);

                    if (LA6_0 >= '0' && LA6_0 <= '9') {
                        alt6 = 1;
                    }

                    switch (alt6) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:203:18: DIGIT
                        {
                            mDIGIT();

                        }
                            break;

                        default:
                            if (cnt6 >= 1) {
                                break loop6;
                            }
                            EarlyExitException eee = new EarlyExitException(6, this.input);
                            throw eee;
                    }
                    cnt6++;
                } while (true);

            }

        } finally {
        }
    }

    // $ANTLR end "FRAC"

    // $ANTLR start "INT"
    public final void mINT() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:205:2: ( ZERO | ( DIGIT19 ( DIGIT )* ) )
            int alt8 = 2;
            int LA8_0 = this.input.LA(1);

            if (LA8_0 == '0') {
                alt8 = 1;
            } else if (LA8_0 >= '1' && LA8_0 <= '9') {
                alt8 = 2;
            } else {
                NoViableAltException nvae = new NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1:
                // src/com/wavemaker/json/core/json.g:205:4: ZERO
                {
                    mZERO();

                }
                    break;
                case 2:
                // src/com/wavemaker/json/core/json.g:205:11: ( DIGIT19 ( DIGIT )* )
                {
                    // src/com/wavemaker/json/core/json.g:205:11: ( DIGIT19 ( DIGIT )* )
                    // src/com/wavemaker/json/core/json.g:205:12: DIGIT19 ( DIGIT )*
                    {
                        mDIGIT19();
                        // src/com/wavemaker/json/core/json.g:205:20: ( DIGIT )*
                        loop7: do {
                            int alt7 = 2;
                            int LA7_0 = this.input.LA(1);

                            if (LA7_0 >= '0' && LA7_0 <= '9') {
                                alt7 = 1;
                            }

                            switch (alt7) {
                                case 1:
                                // src/com/wavemaker/json/core/json.g:205:20: DIGIT
                                {
                                    mDIGIT();

                                }
                                    break;

                                default:
                                    break loop7;
                            }
                        } while (true);

                    }

                }
                    break;

            }
        } finally {
        }
    }

    // $ANTLR end "INT"

    // $ANTLR start "MINUS"
    public final void mMINUS() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:207:2: ( '-' )
            // src/com/wavemaker/json/core/json.g:207:4: '-'
            {
                match('-');

            }

        } finally {
        }
    }

    // $ANTLR end "MINUS"

    // $ANTLR start "PLUS"
    public final void mPLUS() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:209:2: ( '+' )
            // src/com/wavemaker/json/core/json.g:209:4: '+'
            {
                match('+');

            }

        } finally {
        }
    }

    // $ANTLR end "PLUS"

    // $ANTLR start "ZERO"
    public final void mZERO() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:211:2: ( '0' )
            // src/com/wavemaker/json/core/json.g:211:4: '0'
            {
                match('0');

            }

        } finally {
        }
    }

    // $ANTLR end "ZERO"

    // $ANTLR start "STRING"
    public final void mSTRING() throws RecognitionException {
        try {
            int _type = STRING;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:230:8: ( QUOTATION_MARK ( CHAR )* QUOTATION_MARK )
            // src/com/wavemaker/json/core/json.g:230:10: QUOTATION_MARK ( CHAR )* QUOTATION_MARK
            {
                mQUOTATION_MARK();
                // src/com/wavemaker/json/core/json.g:230:25: ( CHAR )*
                loop9: do {
                    int alt9 = 2;
                    int LA9_0 = this.input.LA(1);

                    if (LA9_0 >= ' ' && LA9_0 <= '!' || LA9_0 >= '#' && LA9_0 <= '\uFFFF') {
                        alt9 = 1;
                    }

                    switch (alt9) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:230:25: CHAR
                        {
                            mCHAR();

                        }
                            break;

                        default:
                            break loop9;
                    }
                } while (true);

                mQUOTATION_MARK();

                setText(StringEscapeUtils.unescapeJava(getText().substring(1, getText().length() - 1)));

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "STRING"

    // $ANTLR start "CHAR"
    public final void mCHAR() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:237:2: ( UNESCAPED | ESCAPE ( '\"' | '\\\\' | '/' | 'b' | 'f' | 'n' |
            // 'r' | 't' | 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT ) )
            int alt11 = 2;
            int LA11_0 = this.input.LA(1);

            if (LA11_0 >= ' ' && LA11_0 <= '!' || LA11_0 >= '#' && LA11_0 <= '[' || LA11_0 >= ']' && LA11_0 <= '\uFFFF') {
                alt11 = 1;
            } else if (LA11_0 == '\\') {
                alt11 = 2;
            } else {
                NoViableAltException nvae = new NoViableAltException("", 11, 0, this.input);

                throw nvae;
            }
            switch (alt11) {
                case 1:
                // src/com/wavemaker/json/core/json.g:237:4: UNESCAPED
                {
                    mUNESCAPED();

                }
                    break;
                case 2:
                // src/com/wavemaker/json/core/json.g:237:16: ESCAPE ( '\"' | '\\\\' | '/' | 'b' | 'f' | 'n' | 'r' | 't'
                // | 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT )
                {
                    mESCAPE();
                    // src/com/wavemaker/json/core/json.g:237:23: ( '\"' | '\\\\' | '/' | 'b' | 'f' | 'n' | 'r' | 't' |
                    // 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT )
                    int alt10 = 9;
                    switch (this.input.LA(1)) {
                        case '\"': {
                            alt10 = 1;
                        }
                            break;
                        case '\\': {
                            alt10 = 2;
                        }
                            break;
                        case '/': {
                            alt10 = 3;
                        }
                            break;
                        case 'b': {
                            alt10 = 4;
                        }
                            break;
                        case 'f': {
                            alt10 = 5;
                        }
                            break;
                        case 'n': {
                            alt10 = 6;
                        }
                            break;
                        case 'r': {
                            alt10 = 7;
                        }
                            break;
                        case 't': {
                            alt10 = 8;
                        }
                            break;
                        case 'u': {
                            alt10 = 9;
                        }
                            break;
                        default:
                            NoViableAltException nvae = new NoViableAltException("", 10, 0, this.input);

                            throw nvae;
                    }

                    switch (alt10) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:237:25: '\"'
                        {
                            match('\"');

                        }
                            break;
                        case 2:
                        // src/com/wavemaker/json/core/json.g:237:31: '\\\\'
                        {
                            match('\\');

                        }
                            break;
                        case 3:
                        // src/com/wavemaker/json/core/json.g:237:38: '/'
                        {
                            match('/');

                        }
                            break;
                        case 4:
                        // src/com/wavemaker/json/core/json.g:237:44: 'b'
                        {
                            match('b');

                        }
                            break;
                        case 5:
                        // src/com/wavemaker/json/core/json.g:237:50: 'f'
                        {
                            match('f');

                        }
                            break;
                        case 6:
                        // src/com/wavemaker/json/core/json.g:237:56: 'n'
                        {
                            match('n');

                        }
                            break;
                        case 7:
                        // src/com/wavemaker/json/core/json.g:237:62: 'r'
                        {
                            match('r');

                        }
                            break;
                        case 8:
                        // src/com/wavemaker/json/core/json.g:237:68: 't'
                        {
                            match('t');

                        }
                            break;
                        case 9:
                        // src/com/wavemaker/json/core/json.g:237:74: 'u' HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT
                        {
                            match('u');
                            mHEXDIGIT();
                            mHEXDIGIT();
                            mHEXDIGIT();
                            mHEXDIGIT();

                        }
                            break;

                    }

                }
                    break;

            }
        } finally {
        }
    }

    // $ANTLR end "CHAR"

    // $ANTLR start "ESCAPE"
    public final void mESCAPE() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:239:2: ( '\\\\' )
            // src/com/wavemaker/json/core/json.g:239:4: '\\\\'
            {
                match('\\');

            }

        } finally {
        }
    }

    // $ANTLR end "ESCAPE"

    // $ANTLR start "QUOTATION_MARK"
    public final void mQUOTATION_MARK() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:241:2: ( '\"' )
            // src/com/wavemaker/json/core/json.g:241:4: '\"'
            {
                match('\"');

            }

        } finally {
        }
    }

    // $ANTLR end "QUOTATION_MARK"

    // $ANTLR start "UNESCAPED"
    public final void mUNESCAPED() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:243:2: ( '\ ' .. '\\u0021' | '\\u0023' .. '\\u005B' | '\\u005D' ..
            // '\\uFFFF' )
            // src/com/wavemaker/json/core/json.g:
            {
                if (this.input.LA(1) >= ' ' && this.input.LA(1) <= '!' || this.input.LA(1) >= '#' && this.input.LA(1) <= '['
                    || this.input.LA(1) >= ']' && this.input.LA(1) <= '\uFFFF') {
                    this.input.consume();

                } else {
                    MismatchedSetException mse = new MismatchedSetException(null, this.input);
                    recover(mse);
                    throw mse;
                }

            }

        } finally {
        }
    }

    // $ANTLR end "UNESCAPED"

    // $ANTLR start "HEXDIGIT"
    public final void mHEXDIGIT() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:245:2: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
            // src/com/wavemaker/json/core/json.g:
            {
                if (this.input.LA(1) >= '0' && this.input.LA(1) <= '9' || this.input.LA(1) >= 'A' && this.input.LA(1) <= 'F'
                    || this.input.LA(1) >= 'a' && this.input.LA(1) <= 'f') {
                    this.input.consume();

                } else {
                    MismatchedSetException mse = new MismatchedSetException(null, this.input);
                    recover(mse);
                    throw mse;
                }

            }

        } finally {
        }
    }

    // $ANTLR end "HEXDIGIT"

    // $ANTLR start "WHITESPACE"
    public final void mWHITESPACE() throws RecognitionException {
        try {
            int _type = WHITESPACE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:248:12: ( ( ' ' | '\\t' | '\\r' | '\\n' )+ )
            // src/com/wavemaker/json/core/json.g:248:14: ( ' ' | '\\t' | '\\r' | '\\n' )+
            {
                // src/com/wavemaker/json/core/json.g:248:14: ( ' ' | '\\t' | '\\r' | '\\n' )+
                int cnt12 = 0;
                loop12: do {
                    int alt12 = 2;
                    int LA12_0 = this.input.LA(1);

                    if (LA12_0 >= '\t' && LA12_0 <= '\n' || LA12_0 == '\r' || LA12_0 == ' ') {
                        alt12 = 1;
                    }

                    switch (alt12) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:
                        {
                            if (this.input.LA(1) >= '\t' && this.input.LA(1) <= '\n' || this.input.LA(1) == '\r' || this.input.LA(1) == ' ') {
                                this.input.consume();

                            } else {
                                MismatchedSetException mse = new MismatchedSetException(null, this.input);
                                recover(mse);
                                throw mse;
                            }

                        }
                            break;

                        default:
                            if (cnt12 >= 1) {
                                break loop12;
                            }
                            EarlyExitException eee = new EarlyExitException(12, this.input);
                            throw eee;
                    }
                    cnt12++;
                } while (true);

                _channel = HIDDEN;

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "WHITESPACE"

    // $ANTLR start "JS_IDENT_FIRST"
    public final void mJS_IDENT_FIRST() throws RecognitionException {
        try {
            // src/com/wavemaker/json/core/json.g:255:5: ( 'A' .. 'Z' | 'a' .. 'z' | '$' | '_' )
            // src/com/wavemaker/json/core/json.g:
            {
                if (this.input.LA(1) == '$' || this.input.LA(1) >= 'A' && this.input.LA(1) <= 'Z' || this.input.LA(1) == '_'
                    || this.input.LA(1) >= 'a' && this.input.LA(1) <= 'z') {
                    this.input.consume();

                } else {
                    MismatchedSetException mse = new MismatchedSetException(null, this.input);
                    recover(mse);
                    throw mse;
                }

            }

        } finally {
        }
    }

    // $ANTLR end "JS_IDENT_FIRST"

    // $ANTLR start "JS_IDENT"
    public final void mJS_IDENT() throws RecognitionException {
        try {
            int _type = JS_IDENT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // src/com/wavemaker/json/core/json.g:256:13: ( JS_IDENT_FIRST ( JS_IDENT_FIRST | DIGIT )* )
            // src/com/wavemaker/json/core/json.g:256:17: JS_IDENT_FIRST ( JS_IDENT_FIRST | DIGIT )*
            {
                mJS_IDENT_FIRST();
                // src/com/wavemaker/json/core/json.g:256:32: ( JS_IDENT_FIRST | DIGIT )*
                loop13: do {
                    int alt13 = 2;
                    int LA13_0 = this.input.LA(1);

                    if (LA13_0 == '$' || LA13_0 >= '0' && LA13_0 <= '9' || LA13_0 >= 'A' && LA13_0 <= 'Z' || LA13_0 == '_' || LA13_0 >= 'a'
                        && LA13_0 <= 'z') {
                        alt13 = 1;
                    }

                    switch (alt13) {
                        case 1:
                        // src/com/wavemaker/json/core/json.g:
                        {
                            if (this.input.LA(1) == '$' || this.input.LA(1) >= '0' && this.input.LA(1) <= '9' || this.input.LA(1) >= 'A'
                                && this.input.LA(1) <= 'Z' || this.input.LA(1) == '_' || this.input.LA(1) >= 'a' && this.input.LA(1) <= 'z') {
                                this.input.consume();

                            } else {
                                MismatchedSetException mse = new MismatchedSetException(null, this.input);
                                recover(mse);
                                throw mse;
                            }

                        }
                            break;

                        default:
                            break loop13;
                    }
                } while (true);

                setText(StringEscapeUtils.unescapeJava(getText()));

            }

            this.state.type = _type;
            this.state.channel = _channel;
        } finally {
        }
    }

    // $ANTLR end "JS_IDENT"

    @Override
    public void mTokens() throws RecognitionException {
        // src/com/wavemaker/json/core/json.g:1:8: ( BEGIN_ARRAY | END_ARRAY | BEGIN_OBJ | END_OBJ | NAME_SEP |
        // VALUE_SEP | NULL | TRUE | FALSE | NUMBER | STRING | WHITESPACE | JS_IDENT )
        int alt14 = 13;
        alt14 = this.dfa14.predict(this.input);
        switch (alt14) {
            case 1:
            // src/com/wavemaker/json/core/json.g:1:10: BEGIN_ARRAY
            {
                mBEGIN_ARRAY();

            }
                break;
            case 2:
            // src/com/wavemaker/json/core/json.g:1:22: END_ARRAY
            {
                mEND_ARRAY();

            }
                break;
            case 3:
            // src/com/wavemaker/json/core/json.g:1:32: BEGIN_OBJ
            {
                mBEGIN_OBJ();

            }
                break;
            case 4:
            // src/com/wavemaker/json/core/json.g:1:42: END_OBJ
            {
                mEND_OBJ();

            }
                break;
            case 5:
            // src/com/wavemaker/json/core/json.g:1:50: NAME_SEP
            {
                mNAME_SEP();

            }
                break;
            case 6:
            // src/com/wavemaker/json/core/json.g:1:59: VALUE_SEP
            {
                mVALUE_SEP();

            }
                break;
            case 7:
            // src/com/wavemaker/json/core/json.g:1:69: NULL
            {
                mNULL();

            }
                break;
            case 8:
            // src/com/wavemaker/json/core/json.g:1:74: TRUE
            {
                mTRUE();

            }
                break;
            case 9:
            // src/com/wavemaker/json/core/json.g:1:79: FALSE
            {
                mFALSE();

            }
                break;
            case 10:
            // src/com/wavemaker/json/core/json.g:1:85: NUMBER
            {
                mNUMBER();

            }
                break;
            case 11:
            // src/com/wavemaker/json/core/json.g:1:92: STRING
            {
                mSTRING();

            }
                break;
            case 12:
            // src/com/wavemaker/json/core/json.g:1:99: WHITESPACE
            {
                mWHITESPACE();

            }
                break;
            case 13:
            // src/com/wavemaker/json/core/json.g:1:110: JS_IDENT
            {
                mJS_IDENT();

            }
                break;

        }

    }

    protected DFA14 dfa14 = new DFA14(this);

    static final String DFA14_eotS = "\7\uffff\3\15\4\uffff\6\15\1\27\1\30\1\15\2\uffff\1\32\1\uffff";

    static final String DFA14_eofS = "\33\uffff";

    static final String DFA14_minS = "\1\11\6\uffff\1\165\1\162\1\141\4\uffff\1\154\1\165\2\154\1\145" + "\1\163\2\44\1\145\2\uffff\1\44\1\uffff";

    static final String DFA14_maxS = "\1\175\6\uffff\1\165\1\162\1\141\4\uffff\1\154\1\165\2\154\1\145" + "\1\163\2\172\1\145\2\uffff\1\172\1\uffff";

    static final String DFA14_acceptS = "\1\uffff\1\1\1\2\1\3\1\4\1\5\1\6\3\uffff\1\12\1\13\1\14\1\15\11" + "\uffff\1\7\1\10\1\uffff\1\11";

    static final String DFA14_specialS = "\33\uffff}>";

    static final String[] DFA14_transitionS = {
        "\2\14\2\uffff\1\14\22\uffff\1\14\1\uffff\1\13\1\uffff\1\15\7" + "\uffff\1\6\1\12\2\uffff\12\12\1\5\6\uffff\32\15\1\1\1\uffff"
            + "\1\2\1\uffff\1\15\1\uffff\5\15\1\11\7\15\1\7\5\15\1\10\6\15" + "\1\3\1\uffff\1\4", "", "", "", "", "", "", "\1\16", "\1\17", "\1\20",
        "", "", "", "", "\1\21", "\1\22", "\1\23", "\1\24", "\1\25", "\1\26", "\1\15\13\uffff\12\15\7\uffff\32\15\4\uffff\1\15\1\uffff\32" + "\15",
        "\1\15\13\uffff\12\15\7\uffff\32\15\4\uffff\1\15\1\uffff\32" + "\15", "\1\31", "", "",
        "\1\15\13\uffff\12\15\7\uffff\32\15\4\uffff\1\15\1\uffff\32" + "\15", "" };

    static final short[] DFA14_eot = DFA.unpackEncodedString(DFA14_eotS);

    static final short[] DFA14_eof = DFA.unpackEncodedString(DFA14_eofS);

    static final char[] DFA14_min = DFA.unpackEncodedStringToUnsignedChars(DFA14_minS);

    static final char[] DFA14_max = DFA.unpackEncodedStringToUnsignedChars(DFA14_maxS);

    static final short[] DFA14_accept = DFA.unpackEncodedString(DFA14_acceptS);

    static final short[] DFA14_special = DFA.unpackEncodedString(DFA14_specialS);

    static final short[][] DFA14_transition;

    static {
        int numStates = DFA14_transitionS.length;
        DFA14_transition = new short[numStates][];
        for (int i = 0; i < numStates; i++) {
            DFA14_transition[i] = DFA.unpackEncodedString(DFA14_transitionS[i]);
        }
    }

    class DFA14 extends DFA {

        public DFA14(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 14;
            this.eot = DFA14_eot;
            this.eof = DFA14_eof;
            this.min = DFA14_min;
            this.max = DFA14_max;
            this.accept = DFA14_accept;
            this.special = DFA14_special;
            this.transition = DFA14_transition;
        }

        @Override
        public String getDescription() {
            return "1:1: Tokens : ( BEGIN_ARRAY | END_ARRAY | BEGIN_OBJ | END_OBJ | NAME_SEP | VALUE_SEP | NULL | TRUE | FALSE | NUMBER | STRING | WHITESPACE | JS_IDENT );";
        }
    }

}