/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.spring;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.hibernate.lob.BlobImpl;
import org.hibernate.lob.ClobImpl;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.TestJSONSerialization.CycleA;
import com.wavemaker.json.TestJSONSerialization.CycleB;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.JSONParameterTypeField;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.server.testspring.BeanClass;
import com.wavemaker.runtime.server.testspring.ComplexScopedBean;
import com.wavemaker.runtime.service.RuntimeService;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.runtime.service.response.ErrorResponse;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;
import com.wavemaker.runtime.service.response.SuccessResponse;
import com.wavemaker.tools.data.QueryInfo;


/**
 * @author small
 * @version $Rev:22671 $ - $Date:2008-05-30 14:29:23 -0700 (Fri, 30 May 2008) $
 *
 */
public class ComplexReturnBean {

    // methods
    public static ComplexReturnBean getInstance() {

        ComplexReturnBean ret = new ComplexReturnBean();

        ret.setBc(new BeanClass());
        ret.setS("hi");
        ret.setI(12);
        ret.setIw(Integer.valueOf(13));

        return ret;
    }

    public static ComplexReturnBean[] getInstances() {

        ComplexReturnBean[] ret = new ComplexReturnBean[2];

        ret[0] = getInstance();
        ret[1] = getInstance();

        return ret;
    }

    public static Object[] getBadInstances() {

        Object[] ret = new Object[2];

        ret[0] = getInstance();
        ret[1] = "hi";

        return ret;
    }

    public static Object getInstanceWithArrays() {

        ComplexReturnBean ret = new ComplexReturnBean();
        ret.setS("hi");
        ret.setI(12);
        ret.setIw(13);
        ret.setBclist(new BeanClass[]{new BeanClass(), new BeanClass()});
        ret.setIlist(new Integer[]{Integer.valueOf(12), Integer.valueOf(13)});

        return ret;
    }

    public static ComplexScopedBean getComplexScopedBean() {

        ComplexScopedBean ret = new ComplexScopedBean();
        BeanClass bc = new BeanClass();
        bc.setName("bc");
        ret.setBc(bc);
        bc = new BeanClass();
        bc.setName("bc2");
        ret.setBc2(bc);
        ret.setStr("foo");
        return ret;
    }

    public static String getArrayArgument(String[] strs, int a) {

        String ret = ""+a;

        for (String str: strs) {
            ret += ","+str;
        }

        return ret;
    }

    public static String[] getArray(String[] input) {
        return input;
    }

    public static HasArray getComplexArray(int[] input) {

        HasArray ret = new HasArray();
        ret.setArray(input);
        return ret;
    }

    public static List<String> getList(List<String> input) {
        return input;
    }

    public static String mav8_2_updateQuery(QueryInfo qi) {

        return qi.getName()+", "+qi.getInputs().length;
    }

    public static Integer integerButReallyNull() {
        return null;
    }

    public static String stringStringArray(String a, String b, String[] foo) {

        String ret = a+b;
        for (String s: foo) {
            ret+=s;
        }
        return ret;
    }

    public static void noTranslationObject(Object o) {

        if (!(o instanceof JSONObject)) {
            throw new WMRuntimeException("o of wrong type: "+o+", "+
                    o.getClass());
        }
    }

    public static void singleParameterType(
            @JSONParameterTypeField(typeParameter=1) Object o, String type) {

        if (!(o instanceof BeanClass)) {
            throw new WMRuntimeException("Failed to convert; got instance "+o+
                    ", "+o.getClass()+", type: "+type);
        }
    }

    public static void manyParameterTypes(
            @JSONParameterTypeField(typeParameter=1) Object o, String type,
            @JSONParameterTypeField(typeParameter=1) Object o2,
            @JSONParameterTypeField(typeParameter=1) Object o3, String type2) {

        if (!(o instanceof BeanClass)) {
            throw new WMRuntimeException("Failed to convert o; got instance "+o+
                    ", "+o.getClass()+", type: "+type);
        } else if (!(o2 instanceof BeanClass)) {
            throw new WMRuntimeException("Failed to convert o2; got instance "+
                    o2+", "+o.getClass()+", type: "+type);
        } else if (!(o3 instanceof BeanClass)) {
            throw new WMRuntimeException("Failed to convert o3; got instance "+
                    o3+", "+o.getClass()+", type: "+type2);
        }
    }

    public static List<String> getStringList(List<String> arg) {

        List<String> ret = new ArrayList<String>();

        for (String foo: arg) {
            ret.add(foo+"a");
        }

        return ret;
    }

    // MAV-683
    public static List<List<String>> getNestedStringList(List<List<String>> arg) {

        List<List<String>> ret = new ArrayList<List<String>>();

        for (List<String> l: arg) {
            List<String> t = new ArrayList<String>();
            for (String s: l) {
                t.add(s);
            }
            ret.add(t);
        }

        return ret;
    }

    // MAV-683
    public static HasArray getNestedBeanStringList(HasArray arg) {

        HasArray haRet = new HasArray();
        haRet.setListListString(arg.getListListString());
        return haRet;
    }

    public static void throwAGRuntimeException() {
        throw new WMRuntimeException("the runtime exception");
    }

    public static CycleA getCycle() {

        CycleA ret = new CycleA();
        CycleB b = new CycleB();
        ret.setAString("a");
        ret.setCycleB(b);
        b.setBString("b");
        b.setCycleA(ret);

        return ret;
    }

    // MAV-538
    public static String takesLong(Long foo) {
        return "takesLong: "+foo;
    }

    public static String takesLCInt(int foo) {
        return "takesLCInt: "+foo;
    }

    // MAV-589
    public static void doTwiceWrappedException() {
        throw new WMRuntimeException(new WMRuntimeException(
                new FooException(new Exception("foo"))));
    }

    public static String testUpload(@ParamName(name="param1") String param1,
            @ParamName(name="param2") MultipartFile param2) throws IOException {
        return param1+new String(param2.getBytes());
    }

    public static void testUploadNoRet(@ParamName(name="param1") String param1,
            @ParamName(name="param2") MultipartFile param2) throws IOException {
        // do nothing
    }

    public static DownloadResponse testDownload(
            @ParamName(name="param1") String param1) {
        return new DownloadResponse(IOUtils.toInputStream(param1), "text/foo",
                "abc.txt");
    }

    public static void testDownloadNoReturn(
            @ParamName(name="param1") String param1) {
        // do nothing
    }

    // MAV-855
    public static String getExtendedCharsString() {
        return EXTENDED_CHARS_TEST_STR;
    }
    public final static String EXTENDED_CHARS_TEST_STR = "おはよございます école école école";

    // MAV-879
    public static String checkSetterList(HasArray hasArray, BeanClass bc) {

        InternalRuntime ir = InternalRuntime.getInstance();
        List<List<String>> modifiedAttrs = ir.getDeserializedProperties();

        if (2!=modifiedAttrs.size())
            throw new WMRuntimeException(""+modifiedAttrs.size());

        if (1!=modifiedAttrs.get(0).size())
            throw new WMRuntimeException(""+modifiedAttrs.get(0).size());
        if (1!=modifiedAttrs.get(1).size())
            throw new WMRuntimeException(""+modifiedAttrs.get(1).size());

        if (!"array".equals(modifiedAttrs.get(0).get(0)))
            throw new WMRuntimeException(modifiedAttrs.get(0).get(0));
        if (!"name".equals(modifiedAttrs.get(1).get(0)))
            throw new WMRuntimeException(modifiedAttrs.get(1).get(0));

        return "879";
    }

    public static String takesProperties(Properties p) {
        return "p: "+p;
    }
    
    // MAV-669
    public static File receiveFile(String filePath) {
        return new File(filePath);
    }
    public static String sendFile(File file) {
        return file.getAbsolutePath();
    }
    
    public static ConcreteSuccessResponse getConcreteSuccessResponse() {
        ConcreteSuccessResponse ret = new ConcreteSuccessResponse();
        ret.setResult("bar");
        return ret;
    }
    
    public static ConcreteFailureResponse getConcreteFailureResponse() {
        ConcreteFailureResponse ret = new ConcreteFailureResponse();
        ret.setError("bar");
        return ret;
    }
    
    // MAV-1204
    @HideFromClient
    public static String cantCall() {
        return "error";
    }
    
    // MAV-1792
    public static List<java.sql.Date> getJavaSqlDateList() {
        
        List<java.sql.Date> ret = new ArrayList<java.sql.Date>();
        ret.add(new java.sql.Date(1));
        ret.add(new java.sql.Date(2));
        return ret;
    }
    
    // MAV-1792
    public static Map<String, java.sql.Date> getJavaSqlDateMap() {
        
        Map<String, java.sql.Date> ret = new HashMap<String, java.sql.Date>();
        ret.put("foo", new java.sql.Date(1));
        ret.put("bar", new java.sql.Date(2));
        return ret;
    }
    
    /**
     * The DataService query responses return a List of Object[]; this is what
     * Hibernate returns.  So, we need to test that.
     */
    // MAV-2060
    public static Object getDatesInUntypedResponse() {
        
        List<Object> ret = new ArrayList<Object>();
        
        Object[] ret2 = new Object[]{new java.sql.Date(1), 2d, 3d};
        
        ret.add(ret2);
        
        return ret;
    }
    
    // MAV-2149
    public static LOBs getLOBs() {
        
        LOBs ret = new LOBs();
        
        ret.setClob(new ClobImpl("abcde"));
        ret.setBlob(new BlobImpl(new byte[]{1,2,3,4,5}));
        
        return ret;
    }
    
    public static String sendLOBs(LOBs lobs) {
        try {
            return IOUtils.toString(lobs.getClob().getCharacterStream())+":"+
                    Arrays.toString(
                            IOUtils.toByteArray(lobs.getBlob().getBinaryStream()));
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (SQLException e) {
            throw new WMRuntimeException(e);
        }
    }

    // MAV-2060
    public static Object getDateUntypedResponse() {
        
        return new java.sql.Date(1);
    }
    
    // MAV-2229
    public static DownloadResponse getLiveDataValue() throws Exception {
        
        ReflectServiceWire sw = (ReflectServiceWire) RuntimeAccess.getInstance().
                getServiceWire("runtimeService");
        RuntimeService s = (RuntimeService) sw.getServiceBean();
        Object o = s.read("complexRuntimeServiceBean", "java.lang.Integer", null, null, null);
        
        if (!(o instanceof TypedServiceReturn) ||
                (!(((TypedServiceReturn)o).getReturnValue() instanceof LiveDataServiceResponse))) {
            throw new Exception("bad o value: " + o + " (" + o.getClass()
                    + ")");
        } else {
            LiveDataServiceResponse ldsr = (LiveDataServiceResponse) ((TypedServiceReturn)o).getReturnValue();
            if (!(ldsr.getResult() instanceof ComplexRuntimeServiceBean)) {
                throw new Exception("bad o value: " + ldsr.getResult() +
                        " (" + ldsr.getResult().getClass() + ")");
            }
            
            ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) ldsr.getResult();
            
            ByteArrayInputStream bais = new ByteArrayInputStream(
                    ("return: "+crsb.getI()).getBytes());
            
            DownloadResponse ret = new DownloadResponse();
            ret.setContents(bais);
            return ret;
        }
    }
    
    // MAV-2241
    @SuppressWarnings("unchecked")
    public String takesUntypedMap(Map foo) {
        
        if (!(foo instanceof JSONObject)) {
            return "fail: "+foo+", "+foo.getClass();
        } else if (!foo.get("a").equals("b")) {
            return "fail: "+foo+", "+foo.getClass();
        } else {
            return "pass";
        }
    }
    
    // MAV-2244
    public String takesUntypedObject(Object foo) {
        
        if (!(foo instanceof JSONObject)) {
            return "fail: "+foo+", "+foo.getClass();
        } else if (!((JSONObject)foo).get("a").equals("b")) {
            return "fail: "+foo+", "+foo.getClass();
        } else {
            return "pass";
        }
    }
    
    // MAV-2275
    public String takesStringArray(String[] foo) {
        String ret = "";
        for (String f: foo) {
            ret+=f;
        }
        return ret;
    }
    
    // MAV-823
    public StringBuffer stringBuffer(StringBuffer buf) {
        return new StringBuffer("got "+buf.toString());
    }




    // private beans, accessors
    public static class FooException extends Exception {

        private static final long serialVersionUID = 1L;
        private final Exception wrapped;

        public FooException(Exception e) {
            this.wrapped = e;
        }
        @Override
        public String getMessage() {
            return "wrapped: "+wrapped.getMessage();
        }
        @Override
        public Exception getCause() {
            return wrapped;
        }
    }

    public static class HasArray {

        private int[] array;
        private List<List<String>> listListString;

        public int[] getArray() {
            return array;
        }

        public void setArray(int[] array) {
            this.array = array;
        }

        @Override
        public String toString() {
            return "HasArray("+array+")";
        }

        public List<List<String>> getListListString() {
            return listListString;
        }

        public void setListListString(List<List<String>> listListString) {
            this.listListString = listListString;
        }
    }

    private BeanClass bc;
    private String s;
    private Integer iw;
    private int i;
    private BeanClass[] bclist;
    private Integer[] ilist;

    public BeanClass getBc() {
        return bc;
    }
    public void setBc(BeanClass bc) {
        this.bc = bc;
    }
    public String getS() {
        return s;
    }
    public void setS(String s) {
        this.s = s;
    }
    public Integer getIw() {
        return iw;
    }
    public void setIw(Integer iw) {
        this.iw = iw;
    }
    public int getI() {
        return i;
    }
    public void setI(int i) {
        this.i = i;
    }
    public BeanClass[] getBclist() {
        return bclist;
    }
    public void setBclist(BeanClass[] bclist) {
        this.bclist = bclist;
    }
    public Integer[] getIlist() {
        return ilist;
    }
    public void setIlist(Integer[] ilist) {
        this.ilist = ilist;
    }
    
    public static class ConcreteSuccessResponse implements SuccessResponse {

        private Object result;
        
        /* (non-Javadoc)
         * @see com.wavemaker.runtime.service.response.SuccessResponse#getResult()
         */
        public Object getResult() {
            return result;
        }
        
        public void setResult(Object result) {
            this.result = result;
        }
        
        public String getRandomKey() {
            return "randomValue";
        }
    }
    
    public static class ConcreteFailureResponse implements ErrorResponse {
        
        private String error;

        /* (non-Javadoc)
         * @see com.wavemaker.runtime.service.response.ErrorResponse#getError()
         */
        public String getError() {
            return this.error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
        
        public String getOtherMessage() {
            return "otherMessage";
        }
    }

    public static class LOBs {
        
        private Clob clob;
        private Blob blob;
        public Clob getClob() {
            return clob;
        }
        public void setClob(Clob clob) {
            this.clob = clob;
        }
        public Blob getBlob() {
            return blob;
        }
        public void setBlob(Blob blob) {
            this.blob = blob;
        }
    }
}