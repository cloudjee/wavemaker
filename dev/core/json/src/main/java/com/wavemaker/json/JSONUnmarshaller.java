/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.json;

import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.CommonTokenStream;
import org.antlr.runtime.RecognitionException;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.core.jsonLexer;
import com.wavemaker.json.core.jsonParser;

/**
 * @author Matt Small
 */
public class JSONUnmarshaller {

    /**
     * Transform a JSON-formatted string into an object hierarchy. Takes the type at the head of the hierarchy.
     * 
     * @param jsonString
     * @return
     * @throws RecognitionException
     * @throws RecognitionException
     */
    public static JSON unmarshal(String jsonString) {
        return unmarshal(jsonString, new JSONState());
    }

    /**
     * Transform a JSON-formatted string into an object hierarchy. Takes the type at the head of the hierarchy.
     * 
     * @param jsonString
     * @param jsonConfig
     * @return
     * @throws RecognitionException
     * @throws RecognitionException
     */
    public static JSON unmarshal(String jsonString, JSONState jsonConfig) {

        ANTLRStringStream stringStream = new ANTLRStringStream(jsonString);
        jsonLexer lex = new jsonLexer(stringStream);
        CommonTokenStream tokens = new CommonTokenStream(lex);
        jsonParser parser = new jsonParser(tokens);

        JSON jsonRet;
        try {
            jsonRet = parser.json();
        } catch (RecognitionException e) {
            throw new WMRuntimeException(MessageResource.JSON_FAILED_PARSING, e, jsonString);
        }

        return jsonRet;
    }
}