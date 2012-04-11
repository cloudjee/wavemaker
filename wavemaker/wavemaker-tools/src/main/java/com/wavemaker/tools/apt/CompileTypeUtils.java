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

package com.wavemaker.tools.apt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeKind;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.util.ElementKindVisitor6;
import javax.lang.model.util.ElementScanner6;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;

import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.ListTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.EnumPrimitiveReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ListReflectTypeDefinition;
import com.wavemaker.json.type.reflect.MapReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ObjectReflectTypeDefinition;
import com.wavemaker.json.type.reflect.PrimitiveReflectTypeDefinition;

public class CompileTypeUtils {

    public static FieldDefinition buildFieldDefinition(ProcessingEnvironment processingEnv, TypeState typeState, TypeMirror type, String name) {
        GenericFieldDefinition def = new GenericFieldDefinition();
        def.setName(name);

        if (type.getKind() == TypeKind.NULL) {
            return def;
        }

        def.setTypeDefinition(buildTypeDefinition(processingEnv, typeState, type));

        if (type.getKind() == TypeKind.ARRAY || type.getKind() == TypeKind.DECLARED && isCollection(processingEnv, (DeclaredType) type)) {
            def.setArrayTypes(buildArrayTypesList(processingEnv, typeState, type, new ArrayList<ListTypeDefinition>()));
        }

        return def;
    }

    public static List<ListTypeDefinition> buildArrayTypesList(ProcessingEnvironment processingEnv, TypeState typeState, TypeMirror type,
        ArrayList<ListTypeDefinition> listTypes) {

        if (typeState.isTypeKnown(type.toString())) {
            listTypes.add((ListTypeDefinition) typeState.getType(type.toString()));
        } else {
            ListReflectTypeDefinition listType = new ListReflectTypeDefinition();
            listType.setTypeName(type.toString());
            listTypes.add(listType);
            typeState.addType(listType);
        }

        TypeMirror componentType = componentTypeForArrayOrCollection(processingEnv, type);
        if (componentType.getKind() == TypeKind.ARRAY || componentType.getKind() == TypeKind.DECLARED
            && isCollection(processingEnv, (DeclaredType) componentType)) {
            return buildArrayTypesList(processingEnv, typeState, componentType, listTypes);
        } else {
            return listTypes;
        }
    }

    private static TypeMirror componentTypeForArrayOrCollection(ProcessingEnvironment processingEnv, TypeMirror type) {
        if (type.getKind() == TypeKind.ARRAY) {
            return ((ArrayType) type).getComponentType();
        } else {
            return ((DeclaredType) type).getTypeArguments().get(0);
        }
    }

    public static TypeDefinition buildTypeDefinition(ProcessingEnvironment processingEnv, TypeState typeState, TypeMirror type) {
        if (typeState.isTypeKnown(type.toString())) {
            return typeState.getType(type.toString());
        }

        switch (type.getKind()) {

            case DECLARED:
                return typeDefForObject(processingEnv, typeState, (DeclaredType) type);

            case ARRAY:
                return buildTypeDefinition(processingEnv, typeState, ((ArrayType) type).getComponentType());

            case BOOLEAN:
            case BYTE:
            case CHAR:
            case DOUBLE:
            case FLOAT:
            case INT:
            case LONG:
            case SHORT:
                return typeDefForPrimitive(processingEnv, typeState, type);

            default:
                throw new WMRuntimeException("Cannot convert type " + type.toString() + " to a TypeDefinition.");
        }
    }

    public static TypeDefinition typeDefForPrimitive(ProcessingEnvironment processingEnv, TypeState typeState, TypeMirror type) {
        PrimitiveReflectTypeDefinition def = new PrimitiveReflectTypeDefinition();
        def.setTypeName(type.toString());
        if (type instanceof DeclaredType) {
            ((DeclaredType) type).asElement().getSimpleName();
        } else {
            def.setShortName(type.toString());
        }
        typeState.addType(def);
        return def;
    }

    public static TypeDefinition typeDefForObject(ProcessingEnvironment processingEnv, TypeState typeState, DeclaredType type) {
        if (isPrimitiveWrapper(processingEnv, type)) {
            return typeDefForPrimitive(processingEnv, typeState, type);
        } else if (isCollection(processingEnv, type)) {
            return buildTypeDefinition(processingEnv, typeState, type.getTypeArguments().get(0));
        } else if (isMap(processingEnv, type)) {
            return typeDefForMap(processingEnv, typeState, type);
        } else if (isEnum(processingEnv, type)) {
            return typeDefForEnum(processingEnv, typeState, type);
        } else {
            return typeDefForBean(processingEnv, typeState, type);
        }
    }

    public static TypeDefinition typeDefForBean(ProcessingEnvironment processingEnv, TypeState typeState, DeclaredType type) {
        if (typeState.isTypeKnown(type.toString())) {
            return typeState.getType(type.toString());
        }

        ObjectReflectTypeDefinition def = new ObjectReflectTypeDefinition();
        def.setTypeName(type.toString());
        def.setShortName(type.asElement().getSimpleName().toString());
        typeState.addType(def);
        type.asElement().accept(new JavaBeanScanner(processingEnv), typeState);
        return def;
    }

    public static TypeDefinition typeDefForEnum(ProcessingEnvironment processingEnv, TypeState typeState, DeclaredType type) {

        if (typeState.isTypeKnown(type.toString())) {
            return typeState.getType(type.toString());
        }

        EnumPrimitiveReflectTypeDefinition def = new EnumPrimitiveReflectTypeDefinition();
        def.setTypeName(type.toString());
        def.setShortName(type.asElement().getSimpleName().toString());
        typeState.addType(def);
        return def;
    }

    public static TypeDefinition typeDefForMap(ProcessingEnvironment processingEnv, TypeState typeState, DeclaredType type) {

        if (typeState.isTypeKnown(type.toString())) {
            return typeState.getType(type.toString());
        }

        MapReflectTypeDefinition def = new MapReflectTypeDefinition();
        def.setTypeName(type.toString());
        def.setShortName(type.asElement().getSimpleName().toString());
        if (isProperties(processingEnv, type)) {
            FieldDefinition stringDef = buildFieldDefinition(processingEnv, typeState, declaredTypeForName(processingEnv, "java.lang.String"), null);
            def.setKeyFieldDefinition(stringDef);
            def.setValueFieldDefinition(stringDef);
        } else if (type.getTypeArguments().size() == 2) {
            def.setKeyFieldDefinition(buildFieldDefinition(processingEnv, typeState, type.getTypeArguments().get(0), null));
            def.setValueFieldDefinition(buildFieldDefinition(processingEnv, typeState, type.getTypeArguments().get(1), null));
        } else {
            FieldDefinition objectDef = buildFieldDefinition(processingEnv, typeState, declaredTypeForName(processingEnv, "java.lang.Object"), null);
            def.setKeyFieldDefinition(objectDef);
            def.setValueFieldDefinition(objectDef);
        }
        typeState.addType(def);
        return def;
    }

    public static boolean isCollection(ProcessingEnvironment processingEnv, DeclaredType type) {
        if (type.getTypeArguments().size() > 1) {
            return false;
        }
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        DeclaredType collectionType = types.getDeclaredType(elements.getTypeElement(Collection.class.getCanonicalName()),
            type.getTypeArguments().toArray(new TypeMirror[0]));
        return types.isSubtype(type, collectionType);
    }

    public static boolean isMap(ProcessingEnvironment processingEnv, DeclaredType type) {
        int numTypeArgs = type.getTypeArguments().size();
        if (numTypeArgs != 0 && numTypeArgs != 2) {
            return false;
        }
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        DeclaredType mapType = types.getDeclaredType(elements.getTypeElement(Map.class.getCanonicalName()),
            type.getTypeArguments().toArray(new TypeMirror[0]));
        return types.isSubtype(type, mapType);
    }

    public static boolean isProperties(ProcessingEnvironment processingEnv, DeclaredType type) {
        int numTypeArgs = type.getTypeArguments().size();
        if (numTypeArgs != 0 && numTypeArgs != 2) {
            return false;
        }
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        DeclaredType propertiesType = types.getDeclaredType(elements.getTypeElement(Properties.class.getCanonicalName()));
        return types.isSubtype(type, propertiesType);
    }

    public static boolean isEnum(ProcessingEnvironment processingEnv, DeclaredType type) {
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        return types.isSubtype(type, elements.getTypeElement(Enum.class.getCanonicalName()).asType());
    }

    public static boolean isPrimitiveWrapper(ProcessingEnvironment processingEnv, TypeMirror type) {
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        return types.isSubtype(type, elements.getTypeElement(Number.class.getCanonicalName()).asType())
            || types.isSubtype(type, elements.getTypeElement(CharSequence.class.getCanonicalName()).asType())
            || types.isSubtype(type, elements.getTypeElement(Boolean.class.getCanonicalName()).asType())
            || types.isSubtype(type, elements.getTypeElement(Character.class.getCanonicalName()).asType())
            || types.isSubtype(type, elements.getTypeElement(Byte.class.getCanonicalName()).asType());
    }

    private static DeclaredType declaredTypeForName(ProcessingEnvironment processingEnv, String className) {
        Types types = processingEnv.getTypeUtils();
        Elements elements = processingEnv.getElementUtils();
        return types.getDeclaredType(elements.getTypeElement(className));
    }

    private static class JavaBeanScanner extends ElementScanner6<TypeState, TypeState> {

        private final ProcessingEnvironment processingEnv;

        public JavaBeanScanner(ProcessingEnvironment processingEnv) {
            this.processingEnv = processingEnv;
        }

        @Override
        public TypeState scan(Element element, TypeState typeState) {
            return element.accept(new JavaBeanVisitor(this.processingEnv), typeState);
        }

    }

    private static class JavaBeanVisitor extends ElementKindVisitor6<TypeState, TypeState> {

        private final ProcessingEnvironment processingEnv;

        public JavaBeanVisitor(ProcessingEnvironment processingEnv) {
            this.processingEnv = processingEnv;
        }

        @Override
        public TypeState visitExecutableAsMethod(ExecutableElement method, TypeState typeState) {

            if (!method.getSimpleName().toString().endsWith("Class")) {

                ObjectReflectTypeDefinition def = (ObjectReflectTypeDefinition) typeState.getType(method.getEnclosingElement().asType().toString());
                if (def != null) {
                    String propName = getPropertyName(method);
                    if (!def.getFields().containsKey(propName)) {
                        if (isGetter(method)) {
                            def.getFields().put(propName,
                                CompileTypeUtils.buildFieldDefinition(this.processingEnv, typeState, method.getReturnType(), propName));
                        } else if (isSetter(method)) {
                            def.getFields().put(
                                propName,
                                CompileTypeUtils.buildFieldDefinition(this.processingEnv, typeState, method.getParameters().get(0).asType(), propName));
                        }
                    }
                }
            }

            return typeState;
        }

        private boolean isGetter(ExecutableElement method) {
            String name = method.getSimpleName().toString();
            if (!name.startsWith("is") && !name.startsWith("get")) {
                return false;
            } else if (name.startsWith("is") && name.length() > 2 && method.getReturnType().getKind() != TypeKind.BOOLEAN) {
                return false;
            } else if (name.startsWith("get") && name.length() > 3 && method.getReturnType().getKind() == TypeKind.VOID) {
                return false;
            }
            return method.getParameters().size() == 0;
        }

        private boolean isSetter(ExecutableElement method) {
            String name = method.getSimpleName().toString();
            if (!name.startsWith("set") || name.length() <= 3) {
                return false;
            } else if (method.getReturnType().getKind() == TypeKind.VOID) {
                return false;
            }
            return method.getParameters().size() == 1;
        }

        private String getPropertyName(ExecutableElement method) {
            String name = method.getSimpleName().toString();
            if (name.startsWith("is") && name.length() > 2) {
                return StringUtils.uncapitalize(name.substring(2));
            } else if ((name.startsWith("get") || name.startsWith("set")) && name.length() > 3) {
                return StringUtils.uncapitalize(name.substring(3));
            } else {
                return "";
            }
        }
    }
}
