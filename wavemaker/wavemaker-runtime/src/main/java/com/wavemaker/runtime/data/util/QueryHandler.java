/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.util;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.mapping.PersistentClass;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;

/**
 * This class wraps Hibernate APIs to incorporate the tenant ID in the DB queries.
 * 
 * @author Seung Lee
 */
public class QueryHandler implements InvocationHandler {

    private Object target;

    private boolean tenantAdded;

    private final Configuration cfg;

    public QueryHandler(Configuration cfg) {
        this.cfg = cfg;
    }

    public QueryHandler(Object target, Configuration cfg) {
        this.target = target;
        this.cfg = cfg;
    }

    @Override
    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
        String methodName = m.getName();

        if (methodName == null || methodName.length() == 0) {
            return null;
        }

        if (!methodName.equals("save") && !methodName.equals("update") && !methodName.equals("delete") && !methodName.equals("contains")
            && !methodName.equals("getNamedQuery") && !methodName.equals("get") && !methodName.equals("createQuery")
            && !methodName.equals("createSQLQuery")) {
            return m.invoke(this.target, args);
        }

        String setterName;

        WMAppContext wmApp = WMAppContext.getInstance();
        String tFldName = wmApp.getTenantFieldName();
        int tid = RuntimeAccess.getInstance().getTenantId();
        boolean tidExists = true;

        if (tid == -1) {
            tid = wmApp.getDefaultTenantID();
        }

        String qryStr;
        this.tenantAdded = false;
        if (methodName.equalsIgnoreCase("createQuery")) {
            qryStr = modifySQL(args[0], tFldName, tid);
            Query qry = (Query) m.invoke(this.target, qryStr);
            if (this.tenantAdded) {
                qry.setInteger("wmtidval", tid);
            }
            return qry;
        } else if (methodName.equalsIgnoreCase("createSQLQuery")) {
            qryStr = modifySQL(args[0], tFldName, tid);
            SQLQuery sqlqry = (SQLQuery) m.invoke(this.target, qryStr);
            if (this.tenantAdded) {
                sqlqry.setInteger("wmtidval", tid);
            }
            return sqlqry;
        } else if (methodName.equalsIgnoreCase("getNamedQuery")) {
            Map namedQueries = this.cfg.getNamedQueries();
            NamedQueryDefinition qd = (NamedQueryDefinition) namedQueries.get(args[0]);
            qryStr = qd.getQuery();
            Query qry = (Query) m.invoke(this.target, args);
            if (qryStr.contains("wmtidval")) {
                qry.setInteger("wmtidval", tid);
            }
            return qry;
        } else if (methodName.equalsIgnoreCase("get")) {
            Object o = m.invoke(this.target, args);
            Class<?> cls = o.getClass();
            String t = tFldName.substring(0, 1).toUpperCase();
            String getterName = "get" + t + tFldName.substring(1);
            Method getter = null;
            int val;
            try {
                getter = cls.getMethod(getterName);
            } catch (NoSuchMethodException ne) {
                tidExists = false;
            }
            if (tidExists) {
                val = (Integer) getter.invoke(o);
                if (tid != val) {
                    System.out.println("*** Security Viloation - Tenant ID mismatch ***");
                    System.out.println("*** Tenant ID passed = " + tid + ", Tenant ID of Target Record = " + val + " ***");
                    return null;
                }
            }
            return o;
        } else { // save, update, delete, contains
            Object o = args[0];
            Class<?> cls = o.getClass();
            String s = tFldName.substring(0, 1).toUpperCase();
            setterName = "set" + s + tFldName.substring(1);
            Method setter = null;
            try {
                setter = cls.getMethod(setterName, Integer.class);
            } catch (NoSuchMethodException ne) {
                tidExists = false;
            }
            if (tidExists) {
                setter.invoke(o, tid);
            }

            return m.invoke(this.target, args);
        }
    }

    public static List<String> parseSQL(String qryStr) {
        List<String> words = new ArrayList<String>();

        // First, break the query into word elements

        StringBuffer token = new StringBuffer();
        String twoLetters = null;
        boolean holdIt = false;

        for (int i = 0; i < qryStr.length(); i++) {
            String aLetter = qryStr.substring(i, i + 1);
            if (holdIt) {
                if (twoLetters.equals("<") && (aLetter.equals("=") || aLetter.equals(">")) || twoLetters.equals(">") && aLetter.equals("=")
                    || twoLetters.equals("|") && aLetter.equals("|") || twoLetters.equals("\r") && aLetter.equals("\n")) {
                    twoLetters = twoLetters + aLetter;
                    words.add(twoLetters);
                } else {
                    if (isDelimiter(aLetter)) {
                        words.add(twoLetters);
                        words.add(aLetter);
                    } else if (aLetter.equals(" ")) {
                        words.add(twoLetters);
                    }
                }
                holdIt = false;
            } else {
                if (aLetter.equals("<") || aLetter.equals(">") || aLetter.equals("|") || aLetter.equals("\r")) {
                    holdIt = true;
                    twoLetters = aLetter;
                    if (token.length() > 0) {
                        words.add(token.toString());
                        token.setLength(0);
                    }
                } else if (isDelimiter(aLetter)) {
                    if (token.length() > 0) {
                        words.add(token.toString());
                        token.setLength(0);
                    }
                    words.add(aLetter);
                } else if (aLetter.equals(" ")) {
                    if (token.length() > 0) {
                        words.add(token.toString());
                        token.setLength(0);
                    }
                } else {
                    token.append(aLetter);
                }
            }
        }

        if (token.length() > 0) {
            words.add(token.toString());
        }

        return words;
    }

    public String modifySQL(Object o, String fieldName, int tid) {
        // String qryStr = o.toString();
        List<String> words = parseSQL(o.toString());

        /*
         * ArrayList<String> words = new ArrayList<String>();
         * 
         * //First, break the query into word elements
         * 
         * StringBuffer token = new StringBuffer(); String twoLetters = null; boolean holdIt = false;
         * 
         * for (int i=0; i<qryStr.length(); i++) { String aLetter = qryStr.substring(i, i+1); if (holdIt) { if
         * ((twoLetters.equals("<") && (aLetter.equals("=") || aLetter.equals(">"))) || (twoLetters.equals(">") &&
         * aLetter.equals("=")) || (twoLetters.equals("|") && aLetter.equals("|")) || (twoLetters.equals("\r") &&
         * aLetter.equals("\n"))) { twoLetters = twoLetters + aLetter; words.add(twoLetters); } else { if
         * (isDelimiter(aLetter)) { words.add(twoLetters); words.add(aLetter); } else if (aLetter.equals(" ")) {
         * words.add(twoLetters); } } holdIt = false; } else { if (aLetter.equals("<") || aLetter.equals(">") ||
         * aLetter.equals("|") || aLetter.equals("\r")) { holdIt = true; twoLetters = aLetter; if (token.length() > 0) {
         * words.add(token.toString()); token.setLength(0); } } else if (isDelimiter(aLetter)) { if (token.length() > 0)
         * { words.add(token.toString()); token.setLength(0); } words.add(aLetter); } else if (aLetter.equals(" ")) { if
         * (token.length() > 0) { words.add(token.toString()); token.setLength(0); } } else { token.append(aLetter); } }
         * }
         * 
         * if (token.length() > 0) words.add(token.toString());
         */

        // Process the array of words

        int len = words.size();

        String word;
        int qid = -1;
        HashMap<Integer, SingleQuery> tm = new HashMap<Integer, SingleQuery>();

        String aliasName;
        int tidInsertPosition = 0;
        int openingInsertPosition = 0;

        boolean queryEndProcessed = false; // to catch a case that a single query is enclosed with multiple parenthesis
        boolean fieldInserted = false;
        boolean valueInserted = false;
        boolean addTIDValueForInsert = false;
        boolean inInsertFldList = false;
        boolean inInsertValueList = false;
        boolean firstStatement = true;

        StringBuffer sb = new StringBuffer();
        SingleQuery sq = null;

        for (int i = 0; i < len; i++) {
            word = words.get(i);
            if (byPassChar(word)) {
                sb.append(word);
                continue;
            } else if (word.equalsIgnoreCase("select")) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                if (qid > -1) {
                    tm.put(qid, sq);
                }
                qid++;
                sq = new SingleQuery("select", qid, true);
                queryEndProcessed = false;
                if (inInsertFldList) {
                    tidInsertPosition = sb.length() + 1;
                    inInsertFldList = false;
                    addTIDValueForInsert = true;
                }

            } else if (word.equalsIgnoreCase("from")) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                if (sq == null || !sq.inQuery) {
                    if (qid > -1) {
                        tm.put(qid, sq);
                    }
                    qid++;
                    sq = new SingleQuery("select", qid, true);
                }
                sq.inFrom = true;
                queryEndProcessed = false;
                sq.aliasNum = 0;

            } else if (word.equalsIgnoreCase("update") && firstStatement) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                qid++;
                sq = new SingleQuery("update", qid, true);
                queryEndProcessed = false;
                sq.inUpdate = true;
                sq.aliasNum = 0;

            } else if (word.equalsIgnoreCase("set")) {
                sb = sq.appendTableAlias(sb, words, i, fieldName);
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                sq.inSet = true;
                sq.inUpdate = false;

            } else if (word.equalsIgnoreCase("delete") && firstStatement) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                qid++;
                sq = new SingleQuery("delete", qid, true);
                queryEndProcessed = false;
                sq.inDelete = true;
                sq.aliasNum = 0;

            } else if (word.equalsIgnoreCase("insert") && words.get(i + 1).equalsIgnoreCase("into") && i == 0) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                qid++;
                sq = new SingleQuery("insert", qid, true);
                queryEndProcessed = false;

            } else if (word.equalsIgnoreCase("into") && words.get(i - 1).equalsIgnoreCase("insert")) {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                sq.inInsert = true;
                sq.aliasNum = 0;

            } else if (word.equalsIgnoreCase("where")) {
                sb = sq.appendTableAlias(sb, words, i, fieldName);
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                openingInsertPosition = sb.length() + 1;
                if (tidInsertPosition >= openingInsertPosition) {
                    tidInsertPosition++;
                }
                sq.inWhere = true;
                sq.inFrom = false;
                sq.inUpdate = false;
                sq.inSet = false;
                sq.inDelete = false;

            } else if ((word.equalsIgnoreCase("group") || word.equalsIgnoreCase("order")) // group by / order by
                && words.get(i + 1).equalsIgnoreCase("by")) {
                if (!sq.tenantProcessed) {
                    if (sq.tableAliases.size() > 0) {
                        if (sq.inWhere) {
                            sb.insert(openingInsertPosition, "(");
                            if (tidInsertPosition >= openingInsertPosition) {
                                tidInsertPosition++;
                            }
                            sb.append(") and (");
                            sb.append(insertTenantID(sq, fieldName));
                            sb.append(")");
                        } else {
                            sb.append(" where ");
                            sb.append(insertTenantID(sq, fieldName));
                        }
                    }
                    sq.tenantProcessed = true;
                }
                sb = sq.appendTableAlias(sb, words, i, fieldName);
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                sq.inFrom = false;
                sq.inWhere = false;
                sq.inSet = false;

            } else if (word.equalsIgnoreCase("(")) {
                if (sq.inInsert && !inInsertFldList && !inInsertValueList) {
                    sq.inInsert = false;
                    inInsertFldList = true;
                }
                sq.openings = sq.openings + 1;
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);

            } else if (word.equalsIgnoreCase(")")) { // end of the current query statement
                if (sq.openings <= 0) {
                    if (!queryEndProcessed) {
                        sb = sq.appendTableAlias(sb, words, i, fieldName);
                        if (!sq.tenantProcessed) {
                            if (sq.tableAliases.size() > 0) {
                                if (sq.inWhere) {
                                    sb.insert(openingInsertPosition, "(");
                                    if (tidInsertPosition >= openingInsertPosition) {
                                        tidInsertPosition++;
                                    }
                                    sb.append(") and (");
                                    sb.append(insertTenantID(sq, fieldName));
                                    sb.append(")");
                                } else {
                                    sb.append(" where ");
                                    sb.append(insertTenantID(sq, fieldName));
                                }
                            }
                            sq.tenantProcessed = true;
                        }

                        sq.inFrom = false;
                        sq.inWhere = false;
                        sq.inUpdate = false;
                        sq.inSet = false;
                        sq.inDelete = false;
                        sq.inInsert = false;
                        sq.inQuery = false;

                        qid--;

                        sq = tm.get(qid); // get parent sql object
                        queryEndProcessed = true;
                    }
                } else {
                    sq.openings = sq.openings - 1;
                }
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);

            } else if (word.equalsIgnoreCase("values")) {
                if (inInsertFldList) {
                    inInsertFldList = false;
                    inInsertValueList = true;
                }
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
            } else if (word.equalsIgnoreCase("inner")
                || // misc key words that must turn off inForm flag
                word.equalsIgnoreCase("left") || word.equalsIgnoreCase("right") || word.equalsIgnoreCase("full") || word.equalsIgnoreCase("join")
                || word.equalsIgnoreCase("fetch")) {
                sb = sq.appendTableAlias(sb, words, i, fieldName);
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
                sq.inFrom = false;

            } else if (sq.queryType.equalsIgnoreCase("select") && sq.inFrom || sq.queryType.equalsIgnoreCase("update") && sq.inUpdate
                || sq.queryType.equalsIgnoreCase("delete") && sq.inDelete) { // populate table names array
                if (!word.equalsIgnoreCase("as") && !word.equalsIgnoreCase("\r\n") && !word.equalsIgnoreCase("\n") && !word.equalsIgnoreCase(",")) {
                    if (sq.alias) {
                        sq.addAliasNames(words, i, fieldName, word);
                        sq.alias = false;
                        sq.qryIncludeAlias = true;
                    } else {
                        sq.alias = true;
                    }
                }

                if (word.equalsIgnoreCase(",")) {
                    sb = sq.appendTableAlias(sb, words, i, fieldName);
                }

                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
            } else if (inInsertFldList && !fieldInserted) { // add tid in the field list
                sb.append(fieldName);
                sb.append(", ");
                fieldInserted = true;
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
            } else if (inInsertValueList && !valueInserted) {
                sb.append(tid);
                sb.append(", ");
                valueInserted = true;
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
            } else {
                if (appendSpace(sb.toString(), word)) {
                    sb.append(" ");
                }
                sb.append(word);
            }
            firstStatement = false;
        }

        if (sq.inFrom && !sq.qryIncludeAlias) {
            aliasName = "table" + sq.aliasNum++;
            if (appendSpace(sb.toString(), aliasName)) {
                sb.append(" ");
            }
            sb.append(aliasName);
            sq.addAliasNames(words, len - 1, fieldName, aliasName);
        }

        if (!sq.tenantProcessed) {
            if (sq.tableAliases.size() > 0) {
                if (sq.inWhere) {
                    sb.insert(openingInsertPosition, "(");
                    if (tidInsertPosition >= openingInsertPosition) {
                        tidInsertPosition++;
                    }
                    sb.append(") and (");
                    sb.append(insertTenantID(sq, fieldName));
                    sb.append(")");
                } else {
                    sb.append(" where ");
                    sb.append(insertTenantID(sq, fieldName));
                }
            }
            sq.tenantProcessed = true;
        }

        if (addTIDValueForInsert) { // add tid value in the field list
            String tidfld = sq.tableAliases.get(0) + "." + fieldName + ", ";
            sb.insert(tidInsertPosition, tidfld);
        }

        return sb.toString();
    }

    private String insertTenantID(SingleQuery sq, String tField) {
        StringBuffer sb = new StringBuffer();
        int cnt = 0;
        for (String table : sq.tableAliases) {
            if (cnt > 0) {
                sb.append(" and ");
            }
            sb.append(table);
            sb.append(".");
            sb.append(tField);
            sb.append(" = :wmtidval");
            this.tenantAdded = true;
            cnt++;
        }

        return sb.toString();
    }

    public static boolean isDelimiter(String val) {
        // String[] list = {"+", "-", "*", "/", "=", "<=", ">=", "<>", "<", ">",
        // "!=", "||", "(", ")", "\r\n", "\n", ","};
        String[] list = { "+", "-", "*", "/", "=", "<", ">", "!=", "(", ")", "\n", ",", "\r" };

        for (String s : list) {
            if (s.equalsIgnoreCase(val)) {
                return true;
            }
        }

        return false;
    }

    private boolean byPassChar(String val) {
        String[] list = { "+", "-", "*", "/", "=", "<", ">", "!=", "\n", "\r" };

        for (String s : list) {
            if (s.equalsIgnoreCase(val)) {
                return true;
            }
        }

        return false;
    }

    private boolean appendSpace(String str, String word) {
        if (str.length() == 0 || str.endsWith("(") || str.endsWith(" ")) {
            return false;
        }
        if (word.startsWith(")") || word.startsWith(",") || word.startsWith(" ")) {
            return false;
        }
        return true;
    }

    private boolean tenantFieldExists(String className, String fldName) {

        try {
            Iterator classList = this.cfg.getClassMappings();
            while (classList.hasNext()) {
                Class cls = ((PersistentClass) classList.next()).getMappedClass();
                String clsName = StringUtils.getClassName(cls.getName());
                if (clsName.equals(StringUtils.getClassName(className))) {
                    String s = fldName.substring(0, 1).toUpperCase();
                    String setterName = "set" + s + fldName.substring(1);
                    cls.getMethod(setterName, Integer.class);
                    return true;
                }
            }
        } catch (NoSuchMethodException ne) {
            return false;
        }
        return false;
    }

    private int getFirstNoneDelimiterPosBackward(int pos, List<String> words) {
        for (int i = pos; i > -1; i--) {
            if (!isDelimiter(words.get(i))) {
                return i;
            }
        }

        return -1;
    }

    class SingleQuery {

        String queryType;

        int parentQueryId;

        int queryId;

        int openings = 0; // number of left parenthesis

        boolean inFrom = false;

        boolean inWhere = false;

        boolean inQuery = false;

        boolean inSet = false;

        boolean inUpdate = false;

        boolean inDelete = false;

        boolean inInsert = false;

        boolean tenantProcessed = false;

        boolean alias = false;

        int aliasNum = 0;

        boolean qryIncludeAlias = false;

        ArrayList<String> tableAliases = new ArrayList<String>();

        private SingleQuery(String qtype, int qid, boolean flag) {
            this.queryType = qtype;
            this.queryId = qid;
            this.inQuery = flag;
        }

        private void addAliasNames(List<String> words, int indx, String fieldName, String alias) {
            String tableClassName;
            int indx1 = getFirstNoneDelimiterPosBackward(indx, words);
            if (indx1 < 0) {
                return;
            }
            int indx2 = getFirstNoneDelimiterPosBackward(indx1 - 1, words);
            if (indx2 < 0) {
                return;
            }
            int indx3 = getFirstNoneDelimiterPosBackward(indx2 - 1, words);

            String val1 = words.get(indx1);
            String val2 = words.get(indx2);

            if (indx3 < 0) {
                if (!val2.equalsIgnoreCase("from")) {
                    tableClassName = val2;
                } else {
                    tableClassName = val1;
                }
            } else if (val2.equalsIgnoreCase("as")) {
                tableClassName = words.get(indx3);
            } else {
                if (!val2.equalsIgnoreCase("from")) {
                    tableClassName = val2;
                } else {
                    tableClassName = val1;
                }
            }

            if (tenantFieldExists(tableClassName, fieldName)) {
                this.tableAliases.add(alias);
            }
        }

        private StringBuffer appendTableAlias(StringBuffer sb, List<String> words, int indx, String fieldName) {
            if ((this.queryType.equalsIgnoreCase("select") && this.inFrom || this.queryType.equalsIgnoreCase("insert") && this.inInsert
                || this.queryType.equalsIgnoreCase("update") && this.inUpdate || this.queryType.equalsIgnoreCase("delete") && this.inDelete)
                && !this.qryIncludeAlias) {
                String tableClassName;
                if (words.get(indx - 1).equalsIgnoreCase("as")) {
                    tableClassName = words.get(indx - 2);
                } else {
                    tableClassName = words.get(indx - 1);
                }

                if (tenantFieldExists(tableClassName, fieldName)) {
                    String aliasName = "table" + this.aliasNum++;
                    if (appendSpace(sb.toString(), aliasName)) {
                        sb.append(" ");
                    }
                    sb.append(aliasName);
                    this.tableAliases.add(aliasName);
                    this.alias = false;
                }
            }
            return sb;
        }
    }
}
