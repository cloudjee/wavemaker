/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.common;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.common.util.SpringUtils;

/**
 * All known resources defined in our resource bundles. These constants are
 * meant to be used when instantiating a WM(Runtime)Exception. The underlying
 * message can be accessed using getMessage/getDetailMessage.
 * 
 * @author Simon Toens
 * 
 */
public class Resource {

    // input: service name, operation name, known operations
    @ResourceConstraint(numArgs = 3, hasDetailMsg = true)
    public final static Resource OPERATION_NOT_FOUND = new Resource(
            "com.wavemaker.runtime.service$OperationNotFound");

    // input: operation name
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource DUPLICATE_OPERATION = new Resource(
            "com.wavemaker.runtime.service$DuplicateOperation");

    // input:
    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource CANNOT_ROLLBACK_TX = new Resource(
            "com.wavemaker.runtime.data$CannotRollback");

    // input: query name, arguments passed to the query
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource QUERY_NO_PARMS = new Resource(
            "com.wavemaker.runtime.data$QueryDoesntTakeParams");

    // input: query name, required params
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource QUERY_REQUIRES_PARAMS = new Resource(
            "com.wavemaker.runtime.data$QueryRequiresParams");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource JSONRPC_CONTROLLER_METHOD_NOT_FOUND = new Resource(
            "com.wavemaker.runtime.server$MethodNotFound");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONRPC_CONTROLLER_BAD_PARAMS_NON_EMPTY =
        new Resource("com.wavemaker.runtime.server$BadParamsNonEmpty");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONRPC_CONTROLLER_BAD_PARAMS_UNKNOWN_TYPE =
        new Resource("com.wavemaker.runtime.server$BadParamsUnknownType");

    // input: service name, length of classes list
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONUTILS_LISTSNOTEQUAL = new Resource(
            "com.wavemaker.runtime.server$ListsNotEqual");

    // input: name of unhandled primitive type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSONUTILS_BADPRIMITIVETYPE = new Resource(
            "com.wavemaker.runtime.server$CantHandlePrimitiveType");

    // input: value attempted to convert, type of value, destination type
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource JSONUTILS_FAILEDCONVERSION = new Resource(
            "com.wavemaker.runtime.server$FailedConversion");

    // input: value attempted to convert, type of value, destination type
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final Resource JSONUTILS_BADNUMBERCONVERSION = new Resource(
            "com.wavemaker.runtime.server$BadNumberConversion");

    // input: value, type
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final Resource JSONUTILS_BADNUMBERFORMAT = new Resource(
            "com.wavemaker.runtime.server$BadNumberFormat");

    // input: method name, class name
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final Resource JSONUTILS_BADMETHODOVERLOAD = new Resource(
            "com.wavemaker.runtime.server$BadMethodOverload");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final Resource JSONUTILS_NONHOMOGENEOUSARRAY = new Resource(
            "com.wavemaker.runtime.server$NonHomogeneousReturn");

    // input name of method, name of declaring class (maybe through
    // ((Method)obj).getDeclaringClass())
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONUTILS_FAILEDINVOKE = new Resource(
            "com.wavemaker.runtime.server$InvokeMethodFailed");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONUTILS_NONARRAYSEQ = new Resource(
            "com.wavemaker.runtime.server$NonArraySequenceConversion");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSONUTILS_PARAMTYPEGENERIC = new Resource(
            "com.wavemaker.runtime.server$JSONParamTypeNoGenerics");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource JSONUTILS_NOGET = new Resource(
            "com.wavemaker.runtime.server$JSONGetNotSupported");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource SERVER_NOMETHODORID = new Resource(
            "com.wavemaker.runtime.server$NoMethodIdFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource SERVER_NOPARAMNAME = new Resource(
            "com.wavemaker.runtime.server$NoParamNameFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource SERVER_NOREQUEST = new Resource(
            "com.wavemaker.runtime.server$NoRequestFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource SERVER_NORESPONSE = new Resource(
            "com.wavemaker.runtime.server$NoResponseFound");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource JSONPARAMETER_COULD_NOTLLOAD_TYPE =
        new Resource("com.wavemaker.runtime.server$JSONParameterCouldNotLoadType");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource RUNTIME_UNINITIALIZED =
        new Resource("com.wavemaker.runtime.server$RuntimeUninitialized");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource BOTH_ARGUMENT_TYPES =
        new Resource("com.wavemaker.runtime.server$BothArgumentTypes");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource FAILED_TO_PARSE_REQUEST =
        new Resource("com.wavemaker.runtime.server$FailedToParseRequest");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public final static Resource UNKNOWN_SERVICE_DEFINITION =
        new Resource("com.wavemaker.runtime.service$UnknownServiceDefinition");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource TYPE_NOT_FOUND = new Resource(
            "com.wavemaker.runtime.service$TypeNotFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource NO_SERVICE_FROM_ID_TYPE = new Resource(
            "com.wavemaker.runtime.service$NoServiceFromIdType");
    
    // input: service id
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UNKNOWN_SERVICE = new Resource(
            "com.wavemaker.runtime.service$UnknownService");
    
    // input: service type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UNKNOWN_SERVICE_TYPE = new Resource(
            "com.wavemaker.runtime.service$UnknownServiceType");
    
    // input: service type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource MULTIPLE_SERVICE_BEANS = new Resource(
            "com.wavemaker.runtime.service$MultipleServiceBeans");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource TOO_MANY_MODULES_FOR_EXTENSION_POINT =
        new Resource("com.wavemaker.runtime.module$MoreThanOneModule");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource MODULEWIRE_MISSING_NAME = new Resource(
            "com.wavemaker.runtime.module$ModuleWireMissingName");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource MODULE_UNKNOWN_RESOURCE_TYPE= new Resource(
            "com.wavemaker.runtime.module$ModuleUnknownResourceType");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource MODULE_BAD_NAME= new Resource(
            "com.wavemaker.runtime.module$ModuleBadName");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource MODULE_DUPLICATE= new Resource(
            "com.wavemaker.runtime.module$ModuleDuplicates");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource SERVICEWIRE_ID_DUP= new Resource(
            "com.wavemaker.runtime.service$DuplicateServiceIDs");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource EXPECTED_REFLECT_SW = new Resource(
            "com.wavemaker.runtime.service.reflect$ExpectedReflectSW");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource MODULE_NOT_FOUND = new Resource(
            "com.wavemaker.runtime.module$ModuleNotFound");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource MODULE_UNINITIALIZED = new Resource(
            "com.wavemaker.runtime.module$ModuleUninitialized");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_MODULE_LOOKUP = new Resource(
            "com.wavemaker.runtime.module$NoModuleLookupForURL");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource NO_MODULE_RESOURCE = new Resource(
            "com.wavemaker.runtime.module$NoModuleResourceFound");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_SERVICEWIRE = new Resource(
            "com.wavemaker.runtime.service$NoServiceWireForService");
    
    
    // input: service id
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_SERVICE_GENERATOR = new Resource(
            "com.wavemaker.runtime.service$NoServiceGenerator");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource LIB_DIR_NOT_DIR = new Resource(
            "com.wavemaker.runtime.service$LibDirNotDir");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource WS_NULL_WSDL_URI = new Resource(
            "com.wavemaker.runtime.ws$NullWsdlUri");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource WS_MISSING_TYPEMAPPER = new Resource(
            "com.wavemaker.runtime.ws$MissingTypeMapper");
    
    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource WS_RPC_ENCODED_NOT_SUPPORTED = new Resource(
            "com.wavemaker.runtime.ws$RpcEncodedNotSupported");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource WS_REST_WSDL_MISSING_URL = new Resource(
            "com.wavemaker.runtime.ws$RestWsdlMissingUrl");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource WS_WADL_METHOD_NOT_FOUND = new Resource(
            "com.wavemaker.runtime.ws$WadlMethodNotFound");

    // input: name(s) of required property(ies) (String)
    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public final static Resource MISSING_SYS_PROPERTIES = new Resource(
            "com.wavemaker.tools$SysPropertyNotSet");
    
    // input: property name, path to file
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource PROPERTY_MUST_BE_DIR = new Resource(
            "com.wavemaker.tools$PropertyMustBeDir");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource PROJECTCOPY_SOURCE_DNE = new Resource(
            "com.wavemaker.tools$ProjectCopySourceDNE");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource PROJECTCOPY_DEST_DE = new Resource(
            "com.wavemaker.tools$ProjectCopyDestDE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource PROJECT_DNE = new Resource(
            "com.wavemaker.tools$ProjectDNE");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource PROJECT_CONFLICT = new Resource(
            "com.wavemaker.tools$ProjectConflict");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource PROJECT_INVALID_NAME = new Resource(
            "com.wavemaker.tools$ProjectInvalidName");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource PROJECT_USERHOMEDNE = new Resource(
            "com.wavemaker.tools$Project_UserHomeDNE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource PAGECP_SOURCEDNE = new Resource(
            "com.wavemaker.tools$Pages_Copy_SourcePageDNE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource PAGECP_TARGET_EXISTS = new Resource(
            "com.wavemaker.tools$Pages_Copy_TargetExists");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource PROJECT_NEWER_THAN_STUDIO = new Resource(
            "com.wavemaker.tools$ProjectNewerThanStudio");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_DATA_SERVICE_MGR_BEAN_FOUND = new Resource(
            "com.wavemaker.tools$NoDataServiceMgrBeanFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource NO_PROJECT_FROM_SESSION = new Resource(
            "com.wavemaker.tools$NoProjectFromSession");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource ADD_SRV_UPGRADE_NO_SPRING_FILE = new Resource(
            "com.wavemaker.tools$AddServiceUpgrade_NoSpringFile");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource PROJECT_TOO_MANY_SERVICE_WIRES = new Resource(
            "com.wavemaker.tools.project$TooManyServiceWires");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UTIL_FILEUTILS_PATHDNE = new Resource(
            "com.wavemaker.common.util$FileUtils_PathDNE");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UTIL_FILEUTILS_PATHNOTDIR = new Resource(
            "com.wavemaker.common.util$FileUtils_PathNotDir");
    
    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource NULL_CLASS = new Resource(
            "com.wavemaker.common.util$NullClass");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource STUDIO_PROJECT_UNKNOWN_TYPE = new Resource(
            "com.wavemaker.studio$Project_UnknownType");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource STUDIO_UNKNOWN_SERVICE = new Resource(
            "com.wavemaker.studio$ServiceUnknown");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource STUDIO_UNKNOWN_LOCATION = new Resource(
            "com.wavemaker.studio$UnknownStaticFileLocation");
    
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource UTIL_FILEUTILS_REACHEDROOT = new Resource(
            "com.wavemaker.common.util$FileUtils_ReachedRoot");

    // input: invalid service id, reason
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource INVALID_SERVICE_ID = new Resource(
            "com.wavemaker.tools$InvalidServiceId");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource INVALID_SERVICE_DEF_NO_ID = new Resource(
            "com.wavemaker.tools$InvalidServiceNoId");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource ERROR_LOADING_SERVICEDEF = new Resource(
            "com.wavemaker.tools$ErrorLoadingServiceDef");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_EXTERNAL_BEAN_DEF = new Resource(
            "com.wavemaker.tools.service$NoExternalBeanDef");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource NO_DESIGN_SERVICE_TYPE_FOUND = new Resource(
            "com.wavemaker.tools.service$NoDesignServiceTypeFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource UNKNOWN_TYPE_OF_TYPE = new Resource(
            "com.wavemaker.tools.service$UnknownTypeOfType");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource NO_PRIMARY_KEY = new Resource(
            "com.wavemaker.tools.data$NoPrimaryKey");
    
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UNKNOWN_DEPLOYMENT_TARGET= new Resource(
            "com.wavemaker.tools.deployment$UnknownDeploymentTarget");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UNKNOWN_CLOUDSERVER_MGR= new Resource(
            "com.wavemaker.tools.cloudmgr$UnknownCloudServerMgr");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource UNKNOWN_CLOUDSTORAGE_MGR= new Resource(
            "com.wavemaker.tools.cloudmgr$UnknownCloudStorageMgr");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public final static Resource UNSET_SCHEMA= new Resource(
            "com.wavemaker.tools.data$SchemaShouldNotBeSet");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource CATALOG_SHOULD_BE_SET = new Resource(
            "com.wavemaker.tools.data$CatalogShouldBeSet");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource MISMATCH_CATALOG_DBNAME = new Resource(
            "com.wavemaker.tools.data$CatalogDoesNotMatchDBName");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_FAILED_PARSING = new Resource(
            "com.wavemaker.json$FailedParsing");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_TYPE_UNKNOWNRAWTYPE = new Resource(
            "com.wavemaker.json$Type_UnknownRawType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_TYPE_UNKNOWNPARAMTYPE = new Resource(
            "com.wavemaker.json$Type_UnknownParameterType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_TYPE_NOGENERICS = new Resource(
            "com.wavemaker.json$Type_NoGenerics");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_FAILED_GENERICARRAYTYPE = new Resource(
            "com.wavemaker.json$FailedGenericArrayType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_FAILEDINSTANCE_MAP = new Resource(
            "com.wavemaker.json$FailedInstantiationMap");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_OBJECT_REQUIRED_FOR_MAP_CONVERSION =
            new Resource("com.wavemaker.json$JSONObjectRequiredForMap");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public final static Resource JSON_TYPEDEF_REQUIRED = new Resource(
            "com.wavemaker.json$TypeDefRequired");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_OBJECTTYPEDEF_REQUIRED = new Resource(
            "com.wavemaker.json$ObjectTypeDefRequired");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_FAILEDINSTANCE_COLLECTION = new Resource(
            "com.wavemaker.json$FailedInstantiationCollection");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_COLL_OR_ARRAY = new Resource(
            "com.wavemaker.json$UnknownCollectionType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_COLL_IN_SET = new Resource(
            "com.wavemaker.json$UnknownCollInSet");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_UNHANDLED_TYPE = new Resource(
            "com.wavemaker.json$UnhandledType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_PRIM_NEWINSTANCE_ARG_REQ = new Resource(
            "com.wavemaker.json$PrimitiveNewInstanceRequiresArg");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_NUMBER_TYPE = new Resource(
            "com.wavemaker.json$UnknownNumberType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_FAILED_TO_CONVERT = new Resource(
            "com.wavemaker.json$FailedToConvert");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_OBJECT_TYPE = new Resource(
            "com.wavemaker.json$UnknownObjectType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_NO_PROP_MATCHES_KEY = new Resource(
            "com.wavemaker.json$NoPropertyMatchKey");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_NO_WRITE_METHOD = new Resource(
            "com.wavemaker.json$NoWriteMethod");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_PRIMITIVE_TYPE = new Resource(
            "com.wavemaker.json$UnknownPrimitiveType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_RAW_TYPE_NOT_CLASS = new Resource(
            "com.wavemaker.json$RawTypeNotClass");
 
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_EXPECTED_COLLECTION = new Resource(
            "com.wavemaker.json$ExpectedCollection");
 
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_UNKNOWN_TYPE = new Resource(
            "com.wavemaker.json$UnknownType");
 
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_USE_FIELD_FOR_ARRAY = new Resource(
            "com.wavemaker.json$UseFieldForArray");
 
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource JSON_NO_GETTER_IN_TYPE = new Resource(
            "com.wavemaker.json$NoGetterInType");
 
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public final static Resource ERROR_GETTING_PROPERTY = new Resource(
            "com.wavemaker.json$ErrorGettingProperty");
 
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_BAD_HANDLE_TYPE = new Resource(
            "com.wavemaker.json$UnexpectedHandleType");
 
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public final static Resource JSON_CYCLE_FOUND = new Resource(
            "com.wavemaker.json$CycleFound");
 
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public final static Resource JSON_BAD_CYCLE_HANDLER = new Resource(
            "com.wavemaker.json$UnknownCycleHandler");
    
    
    private static final Map<Resource, ResourceConstraint> annos;
    static {

        Map<Resource, ResourceConstraint> m =
            new HashMap<Resource, ResourceConstraint>();

        try {
            List<Field> fields = ClassUtils.getPublicFields(Resource.class,
                    Resource.class);
            for (Field f : fields) {
                m.put((Resource) f.get(null), f
                        .getAnnotation(ResourceConstraint.class));
            }
        } catch (IllegalAccessException ex) {
            throw new AssertionError(ex);
        }

        annos = Collections.unmodifiableMap(m);

    }

    private static final String DETAIL_KEY = "_detail";

    private static final String ID_KEY = "_id";

    private final Object key;

    private Resource(Object key) {
        if (key == null) {
            throw new IllegalArgumentException("key cannot be null");
        }
        this.key = key;
    }

    public Integer getId() {
        return Integer.parseInt(Resource.getMessage(((String) key)
                + Resource.ID_KEY, 0));
    }

    public String getMessage() {
        return getMessage((Object[]) null);
    }

    public String getMessage(Object... args) {
        return Resource.getMessage((String) key, getNumArgsRequired(), args);
    }

    public String getDetailMessage() {
        return getDetailMessage((Object[]) null);
    }

    public String getDetailMessage(Object... args) {
        return Resource.getMessage(((String) key) + Resource.DETAIL_KEY,
                getNumDetailArgsRequired(), args);
    }

    public String getMessageKey() {
        return (String) key;
    }

    public int getNumArgsRequired() {
        return annos.get(this).numArgs();
    }

    public int getNumDetailArgsRequired() {
        return annos.get(this).numArgs();
    }

    public boolean hasDetailedMsg() {
        return annos.get(this).hasDetailMsg();
    }

    private static String getMessage(String key, int numArgsRequired,
            Object... args) {
        if (numArgsRequired > 0) {
            if (args == null || args.length != numArgsRequired) {
                throw new IllegalArgumentException(key + ": "
                        + "args don't match.  msg requires: " + numArgsRequired
                        + " " + "passed in: "
                        + (args == null ? "null" : args.length));
            }
        }
        if (ResourceManager.getInstance() == null) {
            SpringUtils.throwSpringNotInitializedError(ResourceManager.class);
        }
        return ResourceManager.getInstance().getMessage(key, args);
    }

}
