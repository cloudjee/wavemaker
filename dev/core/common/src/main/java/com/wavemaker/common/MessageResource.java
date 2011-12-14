/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.common;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.ClassUtils;

/**
 * All known resources defined in our resource bundles. These constants are meant to be used when instantiating a
 * WM(Runtime)Exception. The underlying message can be accessed using getMessage/getDetailMessage.
 * 
 * @author Simon Toens
 */
public class MessageResource {

    // input: service name, operation name, known operations
    @ResourceConstraint(numArgs = 3, hasDetailMsg = true)
    public static final MessageResource OPERATION_NOT_FOUND = new MessageResource("com.wavemaker.runtime.service$OperationNotFound");

    // input: operation name
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource DUPLICATE_OPERATION = new MessageResource("com.wavemaker.runtime.service$DuplicateOperation");

    // input:
    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource CANNOT_ROLLBACK_TX = new MessageResource("com.wavemaker.runtime.data$CannotRollback");

    // input: query name, arguments passed to the query
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource QUERY_NO_PARMS = new MessageResource("com.wavemaker.runtime.data$QueryDoesntTakeParams");

    // input: query name, required params
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource QUERY_REQUIRES_PARAMS = new MessageResource("com.wavemaker.runtime.data$QueryRequiresParams");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSONRPC_CONTROLLER_METHOD_NOT_FOUND = new MessageResource("com.wavemaker.runtime.server$MethodNotFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONRPC_CONTROLLER_BAD_PARAMS_NON_EMPTY = new MessageResource(
        "com.wavemaker.runtime.server$BadParamsNonEmpty");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONRPC_CONTROLLER_BAD_PARAMS_UNKNOWN_TYPE = new MessageResource(
        "com.wavemaker.runtime.server$BadParamsUnknownType");

    // input: service name, length of classes list
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_LISTSNOTEQUAL = new MessageResource("com.wavemaker.runtime.server$ListsNotEqual");

    // input: name of unhandled primitive type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_BADPRIMITIVETYPE = new MessageResource("com.wavemaker.runtime.server$CantHandlePrimitiveType");

    // input: value attempted to convert, type of value, destination type
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_FAILEDCONVERSION = new MessageResource("com.wavemaker.runtime.server$FailedConversion");

    // input: value attempted to convert, type of value, destination type
    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_BADNUMBERCONVERSION = new MessageResource("com.wavemaker.runtime.server$BadNumberConversion");

    // input: value, type
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_BADNUMBERFORMAT = new MessageResource("com.wavemaker.runtime.server$BadNumberFormat");

    // input: method name, class name
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_BADMETHODOVERLOAD = new MessageResource("com.wavemaker.runtime.server$BadMethodOverload");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_NONHOMOGENEOUSARRAY = new MessageResource("com.wavemaker.runtime.server$NonHomogeneousReturn");

    // input name of method, name of declaring class (maybe through
    // ((Method)obj).getDeclaringClass())
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_FAILEDINVOKE = new MessageResource("com.wavemaker.runtime.server$InvokeMethodFailed");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_NONARRAYSEQ = new MessageResource("com.wavemaker.runtime.server$NonArraySequenceConversion");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_PARAMTYPEGENERIC = new MessageResource("com.wavemaker.runtime.server$JSONParamTypeNoGenerics");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource JSONUTILS_NOGET = new MessageResource("com.wavemaker.runtime.server$JSONGetNotSupported");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource SERVER_NOMETHODORID = new MessageResource("com.wavemaker.runtime.server$NoMethodIdFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource SERVER_NOPARAMNAME = new MessageResource("com.wavemaker.runtime.server$NoParamNameFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource SERVER_NOREQUEST = new MessageResource("com.wavemaker.runtime.server$NoRequestFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource SERVER_NORESPONSE = new MessageResource("com.wavemaker.runtime.server$NoResponseFound");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSONPARAMETER_COULD_NOTLLOAD_TYPE = new MessageResource(
        "com.wavemaker.runtime.server$JSONParameterCouldNotLoadType");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource RUNTIME_UNINITIALIZED = new MessageResource("com.wavemaker.runtime.server$RuntimeUninitialized");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource BOTH_ARGUMENT_TYPES = new MessageResource("com.wavemaker.runtime.server$BothArgumentTypes");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource FAILED_TO_PARSE_REQUEST = new MessageResource("com.wavemaker.runtime.server$FailedToParseRequest");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public static final MessageResource UNKNOWN_SERVICE_DEFINITION = new MessageResource("com.wavemaker.runtime.service$UnknownServiceDefinition");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource TYPE_NOT_FOUND = new MessageResource("com.wavemaker.runtime.service$TypeNotFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource NO_SERVICE_FROM_ID_TYPE = new MessageResource("com.wavemaker.runtime.service$NoServiceFromIdType");

    // input: service id
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_SERVICE = new MessageResource("com.wavemaker.runtime.service$UnknownService");

    // input: service type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_SERVICE_TYPE = new MessageResource("com.wavemaker.runtime.service$UnknownServiceType");

    // input: service type
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource MULTIPLE_SERVICE_BEANS = new MessageResource("com.wavemaker.runtime.service$MultipleServiceBeans");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource TOO_MANY_MODULES_FOR_EXTENSION_POINT = new MessageResource("com.wavemaker.runtime.module$MoreThanOneModule");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource MODULEWIRE_MISSING_NAME = new MessageResource("com.wavemaker.runtime.module$ModuleWireMissingName");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource MODULE_UNKNOWN_RESOURCE_TYPE = new MessageResource("com.wavemaker.runtime.module$ModuleUnknownResourceType");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource MODULE_BAD_NAME = new MessageResource("com.wavemaker.runtime.module$ModuleBadName");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource MODULE_DUPLICATE = new MessageResource("com.wavemaker.runtime.module$ModuleDuplicates");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource SERVICEWIRE_ID_DUP = new MessageResource("com.wavemaker.runtime.service$DuplicateServiceIDs");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource EXPECTED_REFLECT_SW = new MessageResource("com.wavemaker.runtime.service.reflect$ExpectedReflectSW");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource MODULE_NOT_FOUND = new MessageResource("com.wavemaker.runtime.module$ModuleNotFound");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource MODULE_UNINITIALIZED = new MessageResource("com.wavemaker.runtime.module$ModuleUninitialized");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_MODULE_LOOKUP = new MessageResource("com.wavemaker.runtime.module$NoModuleLookupForURL");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource NO_MODULE_RESOURCE = new MessageResource("com.wavemaker.runtime.module$NoModuleResourceFound");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_SERVICEWIRE = new MessageResource("com.wavemaker.runtime.service$NoServiceWireForService");

    // input: service id
    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_SERVICE_GENERATOR = new MessageResource("com.wavemaker.runtime.service$NoServiceGenerator");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource LIB_DIR_NOT_DIR = new MessageResource("com.wavemaker.runtime.service$LibDirNotDir");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource WS_NULL_WSDL_URI = new MessageResource("com.wavemaker.runtime.ws$NullWsdlUri");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource WS_MISSING_TYPEMAPPER = new MessageResource("com.wavemaker.runtime.ws$MissingTypeMapper");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource WS_RPC_ENCODED_NOT_SUPPORTED = new MessageResource("com.wavemaker.runtime.ws$RpcEncodedNotSupported");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource WS_REST_WSDL_MISSING_URL = new MessageResource("com.wavemaker.runtime.ws$RestWsdlMissingUrl");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource WS_WADL_METHOD_NOT_FOUND = new MessageResource("com.wavemaker.runtime.ws$WadlMethodNotFound");

    // input: name(s) of required property(ies)
    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public static final MessageResource MISSING_SYS_PROPERTIES = new MessageResource("com.wavemaker.tools$SysPropertyNotSet");

    // input: property name, path to file
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource PROPERTY_MUST_BE_DIR = new MessageResource("com.wavemaker.tools$PropertyMustBeDir");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource PROJECTCOPY_SOURCE_DNE = new MessageResource("com.wavemaker.tools$ProjectCopySourceDNE");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource PROJECTCOPY_DEST_DE = new MessageResource("com.wavemaker.tools$ProjectCopyDestDE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource PROJECT_DNE = new MessageResource("com.wavemaker.tools$ProjectDNE");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource PROJECT_CONFLICT = new MessageResource("com.wavemaker.tools$ProjectConflict");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource PROJECT_INVALID_NAME = new MessageResource("com.wavemaker.tools$ProjectInvalidName");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource PROJECT_USERHOMEDNE = new MessageResource("com.wavemaker.tools$Project_UserHomeDNE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource PAGECP_SOURCEDNE = new MessageResource("com.wavemaker.tools$Pages_Copy_SourcePageDNE");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource PAGECP_TARGET_EXISTS = new MessageResource("com.wavemaker.tools$Pages_Copy_TargetExists");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource PROJECT_NEWER_THAN_STUDIO = new MessageResource("com.wavemaker.tools$ProjectNewerThanStudio");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_DATA_SERVICE_MGR_BEAN_FOUND = new MessageResource("com.wavemaker.tools$NoDataServiceMgrBeanFound");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource NO_PROJECT_FROM_SESSION = new MessageResource("com.wavemaker.tools$NoProjectFromSession");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource ADD_SRV_UPGRADE_NO_SPRING_FILE = new MessageResource("com.wavemaker.tools$AddServiceUpgrade_NoSpringFile");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource PROJECT_TOO_MANY_SERVICE_WIRES = new MessageResource("com.wavemaker.tools.project$TooManyServiceWires");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UTIL_FILEUTILS_PATHDNE = new MessageResource("com.wavemaker.common.util$FileUtils_PathDNE");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UTIL_FILEUTILS_PATHNOTDIR = new MessageResource("com.wavemaker.common.util$FileUtils_PathNotDir");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource NULL_CLASS = new MessageResource("com.wavemaker.common.util$NullClass");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource STUDIO_PROJECT_UNKNOWN_TYPE = new MessageResource("com.wavemaker.studio$Project_UnknownType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource STUDIO_UNKNOWN_SERVICE = new MessageResource("com.wavemaker.studio$ServiceUnknown");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource STUDIO_UNKNOWN_LOCATION = new MessageResource("com.wavemaker.studio$UnknownStaticFileLocation");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource UTIL_FILEUTILS_REACHEDROOT = new MessageResource("com.wavemaker.common.util$FileUtils_ReachedRoot");

    // input: invalid service id, reason
    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource INVALID_SERVICE_ID = new MessageResource("com.wavemaker.tools$InvalidServiceId");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource INVALID_SERVICE_DEF_NO_ID = new MessageResource("com.wavemaker.tools$InvalidServiceNoId");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource ERROR_LOADING_SERVICEDEF = new MessageResource("com.wavemaker.tools$ErrorLoadingServiceDef");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_EXTERNAL_BEAN_DEF = new MessageResource("com.wavemaker.tools.service$NoExternalBeanDef");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource NO_DESIGN_SERVICE_TYPE_FOUND = new MessageResource("com.wavemaker.tools.service$NoDesignServiceTypeFound");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_TYPE_OF_TYPE = new MessageResource("com.wavemaker.tools.service$UnknownTypeOfType");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource NO_PRIMARY_KEY = new MessageResource("com.wavemaker.tools.data$NoPrimaryKey");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_DEPLOYMENT_TARGET = new MessageResource("com.wavemaker.tools.deployment$UnknownDeploymentTarget");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_PWS_TOOLS_MANAGER = new MessageResource("com.wavemaker.tools.pwst$UnknownPwsToolsManager");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_PWS_LOGIN_MANAGER = new MessageResource("com.wavemaker.tools.pwst$UnknownPwsLoginManager");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_CLOUDSERVER_MGR = new MessageResource("com.wavemaker.tools.cloudmgr$UnknownCloudServerMgr");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource UNKNOWN_CLOUDSTORAGE_MGR = new MessageResource("com.wavemaker.tools.cloudmgr$UnknownCloudStorageMgr");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = true)
    public static final MessageResource UNSET_SCHEMA = new MessageResource("com.wavemaker.tools.data$SchemaShouldNotBeSet");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource CATALOG_SHOULD_BE_SET = new MessageResource("com.wavemaker.tools.data$CatalogShouldBeSet");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource MISMATCH_CATALOG_DBNAME = new MessageResource("com.wavemaker.tools.data$CatalogDoesNotMatchDBName");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_FAILED_PARSING = new MessageResource("com.wavemaker.json$FailedParsing");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_TYPE_UNKNOWNRAWTYPE = new MessageResource("com.wavemaker.json$Type_UnknownRawType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_TYPE_UNKNOWNPARAMTYPE = new MessageResource("com.wavemaker.json$Type_UnknownParameterType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_TYPE_NOGENERICS = new MessageResource("com.wavemaker.json$Type_NoGenerics");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_FAILED_GENERICARRAYTYPE = new MessageResource("com.wavemaker.json$FailedGenericArrayType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_FAILEDINSTANCE_MAP = new MessageResource("com.wavemaker.json$FailedInstantiationMap");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_OBJECT_REQUIRED_FOR_MAP_CONVERSION = new MessageResource("com.wavemaker.json$JSONObjectRequiredForMap");

    @ResourceConstraint(numArgs = 0, hasDetailMsg = false)
    public static final MessageResource JSON_TYPEDEF_REQUIRED = new MessageResource("com.wavemaker.json$TypeDefRequired");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_OBJECTTYPEDEF_REQUIRED = new MessageResource("com.wavemaker.json$ObjectTypeDefRequired");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_FAILEDINSTANCE_COLLECTION = new MessageResource("com.wavemaker.json$FailedInstantiationCollection");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_COLL_OR_ARRAY = new MessageResource("com.wavemaker.json$UnknownCollectionType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_COLL_IN_SET = new MessageResource("com.wavemaker.json$UnknownCollInSet");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_UNHANDLED_TYPE = new MessageResource("com.wavemaker.json$UnhandledType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_PRIM_NEWINSTANCE_ARG_REQ = new MessageResource("com.wavemaker.json$PrimitiveNewInstanceRequiresArg");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_NUMBER_TYPE = new MessageResource("com.wavemaker.json$UnknownNumberType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_FAILED_TO_CONVERT = new MessageResource("com.wavemaker.json$FailedToConvert");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_OBJECT_TYPE = new MessageResource("com.wavemaker.json$UnknownObjectType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_NO_PROP_MATCHES_KEY = new MessageResource("com.wavemaker.json$NoPropertyMatchKey");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_NO_WRITE_METHOD = new MessageResource("com.wavemaker.json$NoWriteMethod");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_PRIMITIVE_TYPE = new MessageResource("com.wavemaker.json$UnknownPrimitiveType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_RAW_TYPE_NOT_CLASS = new MessageResource("com.wavemaker.json$RawTypeNotClass");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_EXPECTED_COLLECTION = new MessageResource("com.wavemaker.json$ExpectedCollection");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_UNKNOWN_TYPE = new MessageResource("com.wavemaker.json$UnknownType");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_USE_FIELD_FOR_ARRAY = new MessageResource("com.wavemaker.json$UseFieldForArray");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource JSON_NO_GETTER_IN_TYPE = new MessageResource("com.wavemaker.json$NoGetterInType");

    @ResourceConstraint(numArgs = 3, hasDetailMsg = false)
    public static final MessageResource ERROR_GETTING_PROPERTY = new MessageResource("com.wavemaker.json$ErrorGettingProperty");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_BAD_HANDLE_TYPE = new MessageResource("com.wavemaker.json$UnexpectedHandleType");

    @ResourceConstraint(numArgs = 2, hasDetailMsg = false)
    public static final MessageResource JSON_CYCLE_FOUND = new MessageResource("com.wavemaker.json$CycleFound");

    @ResourceConstraint(numArgs = 1, hasDetailMsg = false)
    public static final MessageResource JSON_BAD_CYCLE_HANDLER = new MessageResource("com.wavemaker.json$UnknownCycleHandler");

    private static final Map<MessageResource, ResourceConstraint> annotations;
    static {

        Map<MessageResource, ResourceConstraint> m = new HashMap<MessageResource, ResourceConstraint>();

        try {
            List<Field> fields = ClassUtils.getPublicFields(MessageResource.class, MessageResource.class);
            for (Field f : fields) {
                m.put((MessageResource) f.get(null), f.getAnnotation(ResourceConstraint.class));
            }
        } catch (IllegalAccessException ex) {
            throw new AssertionError(ex);
        }

        annotations = Collections.unmodifiableMap(m);

    }

    private static final String DETAIL_KEY = "_detail";

    private static final String ID_KEY = "_id";

    private final String key;

    private MessageResource(String key) {
        if (key == null) {
            throw new IllegalArgumentException("key cannot be null");
        }
        this.key = key;
    }

    public Integer getId() {
        return Integer.parseInt(MessageResource.getMessage(this.key + MessageResource.ID_KEY, 0));
    }

    public String getMessage() {
        return getMessage((Object[]) null);
    }

    public String getMessage(Object... args) {
        return MessageResource.getMessage(this.key, getNumArgsRequired(), args);
    }

    public String getDetailMessage() {
        return getDetailMessage((Object[]) null);
    }

    public String getDetailMessage(Object... args) {
        return MessageResource.getMessage(this.key + MessageResource.DETAIL_KEY, getNumDetailArgsRequired(), args);
    }

    public String getMessageKey() {
        return this.key;
    }

    public int getNumArgsRequired() {
        return annotations.get(this).numArgs();
    }

    public int getNumDetailArgsRequired() {
        return annotations.get(this).numArgs();
    }

    public boolean hasDetailedMsg() {
        return annotations.get(this).hasDetailMsg();
    }

    private static String getMessage(String key, int numArgsRequired, Object... args) {
        if (numArgsRequired > 0) {
            if (args == null || args.length != numArgsRequired) {
                throw new IllegalArgumentException(key + ": " + "args don't match.  msg requires: " + numArgsRequired + " " + "passed in: "
                    + (args == null ? "null" : args.length));
            }
        }
        return ResourceManager.getInstance().getMessage(key, args);
    }

}
