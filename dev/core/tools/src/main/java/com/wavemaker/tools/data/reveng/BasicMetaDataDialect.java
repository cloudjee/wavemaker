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

package com.wavemaker.tools.data.reveng;

import java.sql.SQLException;
import java.util.Collection;
import java.util.HashSet;

import org.hibernate.cfg.reveng.dialect.MySQLMetaDataDialect;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * Use for MySQL import.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class BasicMetaDataDialect extends MySQLMetaDataDialect {

    @Override
    public boolean needQuote(String name) {

        if (name == null) {
            return false;
        }
        boolean rtn = super.needQuote(name);
        if (rtn) {
            return true;
        }

        // MAV-1932
        // try {
        // // MAV-1835
        // if (getMetaData().storesLowerCaseIdentifiers()
        // && StringUtils.hasUpperCase(name)) {
        // return true;
        // }
        // } catch (SQLException ex) {
        // throw new ConfigurationException(ex);
        // }

        Collection<Character> charsNoQuote = getCharsNoQuote();

        for (int i = 0; i < name.length(); i++) {
            Character c = Character.valueOf(name.charAt(i));
            // a-z, A-Z, 0-9 and _ don't require quoting
            // '#', '@' require quoting although some jdbc drivers say they
            // don't
            if (c.equals(Character.valueOf('_'))) {
                continue;
            }
            if (c.equals(Character.valueOf('#')) || c.equals(Character.valueOf('@'))) {
                return true;
            }
            int type = Character.getType(name.charAt(i));
            if (type == Character.UPPERCASE_LETTER || type == Character.LOWERCASE_LETTER || type == Character.DECIMAL_DIGIT_NUMBER) {
                continue;
            }

            // ask the jdbc driver what other chars don't require quoting,
            // and hope it is right
            if (!charsNoQuote.contains(c)) {
                return true;
            }
        }

        return false;
    }

    protected String getCatalogSeparator() {
        try {
            String rtn = getMetaData().getCatalogSeparator();
            if (ObjectUtils.isNullOrEmpty(rtn)) {
                rtn = ".";
            }
            return rtn;
        } catch (SQLException ex) {
            throw new ConfigurationException(ex);
        }
    }

    protected String getQuote() {
        try {
            return getMetaData().getIdentifierQuoteString().trim();
        } catch (SQLException ex) {
            throw new ConfigurationException(ex);
        }
    }

    protected String quote(String s) {
        String q = getQuote();
        if (!s.startsWith(q) && !s.endsWith(q)) {
            return q + s + q;
        }
        return s;
    }

    protected Collection<Character> getCharsNoQuote() {
        try {
            String s = getMetaData().getExtraNameCharacters();
            Collection<Character> rtn = new HashSet<Character>(s.length());
            for (int i = 0; i < s.length(); i++) {
                rtn.add(Character.valueOf(s.charAt(i)));
            }
            return rtn;
        } catch (SQLException ex) {
            throw new ConfigurationException(ex);
        }
    }

}
