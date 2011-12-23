
package com.wavemaker.json.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.antlr.runtime.RecognitionException;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;

/**
 * Util methods for testing JSON
 * 
 * @author Jeremy Grelle
 */
public abstract class JsonTestUtils {

    /**
     * Compare two JSON-formatted strings; make sure the objects they return are equivalent.
     * 
     * @param expected The first JSON-format string to compare.
     * @param actual The second JSON-format string to compare.
     * @throws RecognitionException
     */
    public static void assertJSONStringsEquals(String expected, String actual) throws RecognitionException {

        JSON jo1 = JSONUnmarshaller.unmarshal(expected);
        assertTrue(jo1.isObject());
        JSONObject o1 = (JSONObject) jo1;
        JSON jo2 = JSONUnmarshaller.unmarshal(actual);
        assertTrue(jo2.isObject());
        JSONObject o2 = (JSONObject) jo2;

        assertEquals(o1, o2);
    }
}
