/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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


package com.wavemaker.tools.security.schema;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlElementRefs;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;choice maxOccurs="unbounded" minOccurs="0">
 *         &lt;element name="authentication-provider">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;choice maxOccurs="unbounded" minOccurs="0">
 *                   &lt;element ref="{http://www.springframework.org/schema/security}any-user-service"/>
 *                   &lt;element name="password-encoder">
 *                     &lt;complexType>
 *                       &lt;complexContent>
 *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                           &lt;sequence>
 *                             &lt;element name="salt-source" minOccurs="0">
 *                               &lt;complexType>
 *                                 &lt;complexContent>
 *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                     &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                     &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                     &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                   &lt;/restriction>
 *                                 &lt;/complexContent>
 *                               &lt;/complexType>
 *                             &lt;/element>
 *                           &lt;/sequence>
 *                           &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
 *                         &lt;/restriction>
 *                       &lt;/complexContent>
 *                     &lt;/complexType>
 *                   &lt;/element>
 *                 &lt;/choice>
 *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}ap.attlist"/>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="ldap-authentication-provider">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="password-compare" minOccurs="0">
 *                     &lt;complexType>
 *                       &lt;complexContent>
 *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                           &lt;sequence>
 *                             &lt;element name="password-encoder" minOccurs="0">
 *                               &lt;complexType>
 *                                 &lt;complexContent>
 *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                     &lt;sequence>
 *                                       &lt;element name="salt-source" minOccurs="0">
 *                                         &lt;complexType>
 *                                           &lt;complexContent>
 *                                             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                               &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                               &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                               &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
 *                                             &lt;/restriction>
 *                                           &lt;/complexContent>
 *                                         &lt;/complexType>
 *                                       &lt;/element>
 *                                     &lt;/sequence>
 *                                     &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
 *                                   &lt;/restriction>
 *                                 &lt;/complexContent>
 *                               &lt;/complexType>
 *                             &lt;/element>
 *                           &lt;/sequence>
 *                           &lt;attGroup ref="{http://www.springframework.org/schema/security}password-compare.attlist"/>
 *                         &lt;/restriction>
 *                       &lt;/complexContent>
 *                     &lt;/complexType>
 *                   &lt;/element>
 *                 &lt;/sequence>
 *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}ldap-ap.attlist"/>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *       &lt;/choice>
 *       &lt;attGroup ref="{http://www.springframework.org/schema/security}authman.attlist"/>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "authenticationProviderOrLdapAuthenticationProvider"
})
@XmlRootElement(name = "authentication-manager")
public class AuthenticationManager {

    @XmlElements({
        @XmlElement(name = "ldap-authentication-provider", type = AuthenticationManager.LdapAuthenticationProvider.class),
        @XmlElement(name = "authentication-provider", type = AuthenticationManager.AuthenticationProvider.class)
    })
    protected List<Object> authenticationProviderOrLdapAuthenticationProvider;
    @XmlAttribute
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlSchemaType(name = "token")
    protected String id;
    @XmlAttribute
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlSchemaType(name = "token")
    protected String alias;
    @XmlAttribute(name = "erase-credentials")
    protected Boolean eraseCredentials;

    /**
     * Gets the value of the authenticationProviderOrLdapAuthenticationProvider property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the authenticationProviderOrLdapAuthenticationProvider property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAuthenticationProviderOrLdapAuthenticationProvider().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link AuthenticationManager.LdapAuthenticationProvider }
     * {@link AuthenticationManager.AuthenticationProvider }
     * 
     * 
     */
    public List<Object> getAuthenticationProviderOrLdapAuthenticationProvider() {
        if (authenticationProviderOrLdapAuthenticationProvider == null) {
            authenticationProviderOrLdapAuthenticationProvider = new ArrayList<Object>();
        }
        return this.authenticationProviderOrLdapAuthenticationProvider;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setId(String value) {
        this.id = value;
    }

    /**
     * Gets the value of the alias property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAlias() {
        return alias;
    }

    /**
     * Sets the value of the alias property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAlias(String value) {
        this.alias = value;
    }

    /**
     * Gets the value of the eraseCredentials property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isEraseCredentials() {
        return eraseCredentials;
    }

    /**
     * Sets the value of the eraseCredentials property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setEraseCredentials(Boolean value) {
        this.eraseCredentials = value;
    }


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;choice maxOccurs="unbounded" minOccurs="0">
     *         &lt;element ref="{http://www.springframework.org/schema/security}any-user-service"/>
     *         &lt;element name="password-encoder">
     *           &lt;complexType>
     *             &lt;complexContent>
     *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                 &lt;sequence>
     *                   &lt;element name="salt-source" minOccurs="0">
     *                     &lt;complexType>
     *                       &lt;complexContent>
     *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                           &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                           &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                           &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                         &lt;/restriction>
     *                       &lt;/complexContent>
     *                     &lt;/complexType>
     *                   &lt;/element>
     *                 &lt;/sequence>
     *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
     *               &lt;/restriction>
     *             &lt;/complexContent>
     *           &lt;/complexType>
     *         &lt;/element>
     *       &lt;/choice>
     *       &lt;attGroup ref="{http://www.springframework.org/schema/security}ap.attlist"/>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "anyUserServiceOrPasswordEncoder"
    })
    public static class AuthenticationProvider {

        @XmlElementRefs({
            @XmlElementRef(name = "any-user-service", namespace = "http://www.springframework.org/schema/security", type = JAXBElement.class),
            @XmlElementRef(name = "password-encoder", namespace = "http://www.springframework.org/schema/security", type = JAXBElement.class)
        })
        protected List<JAXBElement<?>> anyUserServiceOrPasswordEncoder;
        @XmlAttribute
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String ref;
        @XmlAttribute(name = "user-service-ref")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String userServiceRef;

        /**
         * Gets the value of the anyUserServiceOrPasswordEncoder property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the anyUserServiceOrPasswordEncoder property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getAnyUserServiceOrPasswordEncoder().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link JAXBElement }{@code <}{@link JdbcUserService }{@code >}
         * {@link JAXBElement }{@code <}{@link UserService }{@code >}
         * {@link JAXBElement }{@code <}{@link Object }{@code >}
         * {@link JAXBElement }{@code <}{@link AuthenticationManager.AuthenticationProvider.PasswordEncoder }{@code >}
         * {@link JAXBElement }{@code <}{@link LdapUserService }{@code >}
         * 
         * 
         */
        public List<JAXBElement<?>> getAnyUserServiceOrPasswordEncoder() {
            if (anyUserServiceOrPasswordEncoder == null) {
                anyUserServiceOrPasswordEncoder = new ArrayList<JAXBElement<?>>();
            }
            return this.anyUserServiceOrPasswordEncoder;
        }

        /**
         * Gets the value of the ref property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getRef() {
            return ref;
        }

        /**
         * Sets the value of the ref property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setRef(String value) {
            this.ref = value;
        }

        /**
         * Gets the value of the userServiceRef property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserServiceRef() {
            return userServiceRef;
        }

        /**
         * Sets the value of the userServiceRef property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserServiceRef(String value) {
            this.userServiceRef = value;
        }


        /**
         * <p>Java class for anonymous complex type.
         * 
         * <p>The following schema fragment specifies the expected content contained within this class.
         * 
         * <pre>
         * &lt;complexType>
         *   &lt;complexContent>
         *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *       &lt;sequence>
         *         &lt;element name="salt-source" minOccurs="0">
         *           &lt;complexType>
         *             &lt;complexContent>
         *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                 &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
         *                 &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
         *                 &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
         *               &lt;/restriction>
         *             &lt;/complexContent>
         *           &lt;/complexType>
         *         &lt;/element>
         *       &lt;/sequence>
         *       &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
         *     &lt;/restriction>
         *   &lt;/complexContent>
         * &lt;/complexType>
         * </pre>
         * 
         * 
         */
        @XmlAccessorType(XmlAccessType.FIELD)
        @XmlType(name = "", propOrder = {
            "saltSource"
        })
        public static class PasswordEncoder {

            @XmlElement(name = "salt-source")
            protected AuthenticationManager.AuthenticationProvider.PasswordEncoder.SaltSource saltSource;
            @XmlAttribute
            @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
            @XmlSchemaType(name = "token")
            protected String ref;
            @XmlAttribute
            @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
            protected String hash;
            @XmlAttribute
            protected Boolean base64;

            /**
             * Gets the value of the saltSource property.
             * 
             * @return
             *     possible object is
             *     {@link AuthenticationManager.AuthenticationProvider.PasswordEncoder.SaltSource }
             *     
             */
            public AuthenticationManager.AuthenticationProvider.PasswordEncoder.SaltSource getSaltSource() {
                return saltSource;
            }

            /**
             * Sets the value of the saltSource property.
             * 
             * @param value
             *     allowed object is
             *     {@link AuthenticationManager.AuthenticationProvider.PasswordEncoder.SaltSource }
             *     
             */
            public void setSaltSource(AuthenticationManager.AuthenticationProvider.PasswordEncoder.SaltSource value) {
                this.saltSource = value;
            }

            /**
             * Gets the value of the ref property.
             * 
             * @return
             *     possible object is
             *     {@link String }
             *     
             */
            public String getRef() {
                return ref;
            }

            /**
             * Sets the value of the ref property.
             * 
             * @param value
             *     allowed object is
             *     {@link String }
             *     
             */
            public void setRef(String value) {
                this.ref = value;
            }

            /**
             * Gets the value of the hash property.
             * 
             * @return
             *     possible object is
             *     {@link String }
             *     
             */
            public String getHash() {
                return hash;
            }

            /**
             * Sets the value of the hash property.
             * 
             * @param value
             *     allowed object is
             *     {@link String }
             *     
             */
            public void setHash(String value) {
                this.hash = value;
            }

            /**
             * Gets the value of the base64 property.
             * 
             * @return
             *     possible object is
             *     {@link Boolean }
             *     
             */
            public Boolean isBase64() {
                return base64;
            }

            /**
             * Sets the value of the base64 property.
             * 
             * @param value
             *     allowed object is
             *     {@link Boolean }
             *     
             */
            public void setBase64(Boolean value) {
                this.base64 = value;
            }


            /**
             * <p>Java class for anonymous complex type.
             * 
             * <p>The following schema fragment specifies the expected content contained within this class.
             * 
             * <pre>
             * &lt;complexType>
             *   &lt;complexContent>
             *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
             *       &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
             *       &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
             *       &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
             *     &lt;/restriction>
             *   &lt;/complexContent>
             * &lt;/complexType>
             * </pre>
             * 
             * 
             */
            @XmlAccessorType(XmlAccessType.FIELD)
            @XmlType(name = "")
            public static class SaltSource {

                @XmlAttribute(name = "user-property")
                @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                @XmlSchemaType(name = "token")
                protected String userProperty;
                @XmlAttribute(name = "system-wide")
                @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                @XmlSchemaType(name = "token")
                protected String systemWide;
                @XmlAttribute
                @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                @XmlSchemaType(name = "token")
                protected String ref;

                /**
                 * Gets the value of the userProperty property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link String }
                 *     
                 */
                public String getUserProperty() {
                    return userProperty;
                }

                /**
                 * Sets the value of the userProperty property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setUserProperty(String value) {
                    this.userProperty = value;
                }

                /**
                 * Gets the value of the systemWide property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link String }
                 *     
                 */
                public String getSystemWide() {
                    return systemWide;
                }

                /**
                 * Sets the value of the systemWide property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setSystemWide(String value) {
                    this.systemWide = value;
                }

                /**
                 * Gets the value of the ref property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link String }
                 *     
                 */
                public String getRef() {
                    return ref;
                }

                /**
                 * Sets the value of the ref property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setRef(String value) {
                    this.ref = value;
                }

            }

        }

    }


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="password-compare" minOccurs="0">
     *           &lt;complexType>
     *             &lt;complexContent>
     *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                 &lt;sequence>
     *                   &lt;element name="password-encoder" minOccurs="0">
     *                     &lt;complexType>
     *                       &lt;complexContent>
     *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                           &lt;sequence>
     *                             &lt;element name="salt-source" minOccurs="0">
     *                               &lt;complexType>
     *                                 &lt;complexContent>
     *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                                     &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                                     &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                                     &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
     *                                   &lt;/restriction>
     *                                 &lt;/complexContent>
     *                               &lt;/complexType>
     *                             &lt;/element>
     *                           &lt;/sequence>
     *                           &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
     *                         &lt;/restriction>
     *                       &lt;/complexContent>
     *                     &lt;/complexType>
     *                   &lt;/element>
     *                 &lt;/sequence>
     *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}password-compare.attlist"/>
     *               &lt;/restriction>
     *             &lt;/complexContent>
     *           &lt;/complexType>
     *         &lt;/element>
     *       &lt;/sequence>
     *       &lt;attGroup ref="{http://www.springframework.org/schema/security}ldap-ap.attlist"/>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "passwordCompare"
    })
    public static class LdapAuthenticationProvider {

        @XmlElement(name = "password-compare")
        protected AuthenticationManager.LdapAuthenticationProvider.PasswordCompare passwordCompare;
        @XmlAttribute(name = "server-ref")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String serverRef;
        @XmlAttribute(name = "user-search-base")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String userSearchBase;
        @XmlAttribute(name = "user-search-filter")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String userSearchFilter;
        @XmlAttribute(name = "group-search-base")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String groupSearchBase;
        @XmlAttribute(name = "group-search-filter")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String groupSearchFilter;
        @XmlAttribute(name = "group-role-attribute")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String groupRoleAttribute;
        @XmlAttribute(name = "user-dn-pattern")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String userDnPattern;
        @XmlAttribute(name = "role-prefix")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String rolePrefix;
        @XmlAttribute(name = "user-details-class")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        protected String userDetailsClass;
        @XmlAttribute(name = "user-context-mapper-ref")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String userContextMapperRef;

        /**
         * Gets the value of the passwordCompare property.
         * 
         * @return
         *     possible object is
         *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare }
         *     
         */
        public AuthenticationManager.LdapAuthenticationProvider.PasswordCompare getPasswordCompare() {
            return passwordCompare;
        }

        /**
         * Sets the value of the passwordCompare property.
         * 
         * @param value
         *     allowed object is
         *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare }
         *     
         */
        public void setPasswordCompare(AuthenticationManager.LdapAuthenticationProvider.PasswordCompare value) {
            this.passwordCompare = value;
        }

        /**
         * Gets the value of the serverRef property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getServerRef() {
            return serverRef;
        }

        /**
         * Sets the value of the serverRef property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setServerRef(String value) {
            this.serverRef = value;
        }

        /**
         * Gets the value of the userSearchBase property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserSearchBase() {
            return userSearchBase;
        }

        /**
         * Sets the value of the userSearchBase property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserSearchBase(String value) {
            this.userSearchBase = value;
        }

        /**
         * Gets the value of the userSearchFilter property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserSearchFilter() {
            return userSearchFilter;
        }

        /**
         * Sets the value of the userSearchFilter property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserSearchFilter(String value) {
            this.userSearchFilter = value;
        }

        /**
         * Gets the value of the groupSearchBase property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getGroupSearchBase() {
            return groupSearchBase;
        }

        /**
         * Sets the value of the groupSearchBase property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setGroupSearchBase(String value) {
            this.groupSearchBase = value;
        }

        /**
         * Gets the value of the groupSearchFilter property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getGroupSearchFilter() {
            return groupSearchFilter;
        }

        /**
         * Sets the value of the groupSearchFilter property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setGroupSearchFilter(String value) {
            this.groupSearchFilter = value;
        }

        /**
         * Gets the value of the groupRoleAttribute property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getGroupRoleAttribute() {
            return groupRoleAttribute;
        }

        /**
         * Sets the value of the groupRoleAttribute property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setGroupRoleAttribute(String value) {
            this.groupRoleAttribute = value;
        }

        /**
         * Gets the value of the userDnPattern property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserDnPattern() {
            return userDnPattern;
        }

        /**
         * Sets the value of the userDnPattern property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserDnPattern(String value) {
            this.userDnPattern = value;
        }

        /**
         * Gets the value of the rolePrefix property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getRolePrefix() {
            return rolePrefix;
        }

        /**
         * Sets the value of the rolePrefix property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setRolePrefix(String value) {
            this.rolePrefix = value;
        }

        /**
         * Gets the value of the userDetailsClass property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserDetailsClass() {
            return userDetailsClass;
        }

        /**
         * Sets the value of the userDetailsClass property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserDetailsClass(String value) {
            this.userDetailsClass = value;
        }

        /**
         * Gets the value of the userContextMapperRef property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getUserContextMapperRef() {
            return userContextMapperRef;
        }

        /**
         * Sets the value of the userContextMapperRef property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setUserContextMapperRef(String value) {
            this.userContextMapperRef = value;
        }


        /**
         * <p>Java class for anonymous complex type.
         * 
         * <p>The following schema fragment specifies the expected content contained within this class.
         * 
         * <pre>
         * &lt;complexType>
         *   &lt;complexContent>
         *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *       &lt;sequence>
         *         &lt;element name="password-encoder" minOccurs="0">
         *           &lt;complexType>
         *             &lt;complexContent>
         *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                 &lt;sequence>
         *                   &lt;element name="salt-source" minOccurs="0">
         *                     &lt;complexType>
         *                       &lt;complexContent>
         *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                           &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
         *                           &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
         *                           &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
         *                         &lt;/restriction>
         *                       &lt;/complexContent>
         *                     &lt;/complexType>
         *                   &lt;/element>
         *                 &lt;/sequence>
         *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
         *               &lt;/restriction>
         *             &lt;/complexContent>
         *           &lt;/complexType>
         *         &lt;/element>
         *       &lt;/sequence>
         *       &lt;attGroup ref="{http://www.springframework.org/schema/security}password-compare.attlist"/>
         *     &lt;/restriction>
         *   &lt;/complexContent>
         * &lt;/complexType>
         * </pre>
         * 
         * 
         */
        @XmlAccessorType(XmlAccessType.FIELD)
        @XmlType(name = "", propOrder = {
            "passwordEncoder"
        })
        public static class PasswordCompare {

            @XmlElement(name = "password-encoder")
            protected AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder passwordEncoder;
            @XmlAttribute(name = "password-attribute")
            @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
            @XmlSchemaType(name = "token")
            protected String passwordAttribute;
            @XmlAttribute
            @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
            protected String hash;

            /**
             * Gets the value of the passwordEncoder property.
             * 
             * @return
             *     possible object is
             *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder }
             *     
             */
            public AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder getPasswordEncoder() {
                return passwordEncoder;
            }

            /**
             * Sets the value of the passwordEncoder property.
             * 
             * @param value
             *     allowed object is
             *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder }
             *     
             */
            public void setPasswordEncoder(AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder value) {
                this.passwordEncoder = value;
            }

            /**
             * Gets the value of the passwordAttribute property.
             * 
             * @return
             *     possible object is
             *     {@link String }
             *     
             */
            public String getPasswordAttribute() {
                return passwordAttribute;
            }

            /**
             * Sets the value of the passwordAttribute property.
             * 
             * @param value
             *     allowed object is
             *     {@link String }
             *     
             */
            public void setPasswordAttribute(String value) {
                this.passwordAttribute = value;
            }

            /**
             * Gets the value of the hash property.
             * 
             * @return
             *     possible object is
             *     {@link String }
             *     
             */
            public String getHash() {
                return hash;
            }

            /**
             * Sets the value of the hash property.
             * 
             * @param value
             *     allowed object is
             *     {@link String }
             *     
             */
            public void setHash(String value) {
                this.hash = value;
            }


            /**
             * <p>Java class for anonymous complex type.
             * 
             * <p>The following schema fragment specifies the expected content contained within this class.
             * 
             * <pre>
             * &lt;complexType>
             *   &lt;complexContent>
             *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
             *       &lt;sequence>
             *         &lt;element name="salt-source" minOccurs="0">
             *           &lt;complexType>
             *             &lt;complexContent>
             *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
             *                 &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
             *                 &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
             *                 &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
             *               &lt;/restriction>
             *             &lt;/complexContent>
             *           &lt;/complexType>
             *         &lt;/element>
             *       &lt;/sequence>
             *       &lt;attGroup ref="{http://www.springframework.org/schema/security}password-encoder.attlist"/>
             *     &lt;/restriction>
             *   &lt;/complexContent>
             * &lt;/complexType>
             * </pre>
             * 
             * 
             */
            @XmlAccessorType(XmlAccessType.FIELD)
            @XmlType(name = "", propOrder = {
                "saltSource"
            })
            public static class PasswordEncoder {

                @XmlElement(name = "salt-source")
                protected AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder.SaltSource saltSource;
                @XmlAttribute
                @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                @XmlSchemaType(name = "token")
                protected String ref;
                @XmlAttribute
                @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                protected String hash;
                @XmlAttribute
                protected Boolean base64;

                /**
                 * Gets the value of the saltSource property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder.SaltSource }
                 *     
                 */
                public AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder.SaltSource getSaltSource() {
                    return saltSource;
                }

                /**
                 * Sets the value of the saltSource property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder.SaltSource }
                 *     
                 */
                public void setSaltSource(AuthenticationManager.LdapAuthenticationProvider.PasswordCompare.PasswordEncoder.SaltSource value) {
                    this.saltSource = value;
                }

                /**
                 * Gets the value of the ref property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link String }
                 *     
                 */
                public String getRef() {
                    return ref;
                }

                /**
                 * Sets the value of the ref property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setRef(String value) {
                    this.ref = value;
                }

                /**
                 * Gets the value of the hash property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link String }
                 *     
                 */
                public String getHash() {
                    return hash;
                }

                /**
                 * Sets the value of the hash property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setHash(String value) {
                    this.hash = value;
                }

                /**
                 * Gets the value of the base64 property.
                 * 
                 * @return
                 *     possible object is
                 *     {@link Boolean }
                 *     
                 */
                public Boolean isBase64() {
                    return base64;
                }

                /**
                 * Sets the value of the base64 property.
                 * 
                 * @param value
                 *     allowed object is
                 *     {@link Boolean }
                 *     
                 */
                public void setBase64(Boolean value) {
                    this.base64 = value;
                }


                /**
                 * <p>Java class for anonymous complex type.
                 * 
                 * <p>The following schema fragment specifies the expected content contained within this class.
                 * 
                 * <pre>
                 * &lt;complexType>
                 *   &lt;complexContent>
                 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
                 *       &lt;attribute name="user-property" type="{http://www.w3.org/2001/XMLSchema}token" />
                 *       &lt;attribute name="system-wide" type="{http://www.w3.org/2001/XMLSchema}token" />
                 *       &lt;attribute name="ref" type="{http://www.w3.org/2001/XMLSchema}token" />
                 *     &lt;/restriction>
                 *   &lt;/complexContent>
                 * &lt;/complexType>
                 * </pre>
                 * 
                 * 
                 */
                @XmlAccessorType(XmlAccessType.FIELD)
                @XmlType(name = "")
                public static class SaltSource {

                    @XmlAttribute(name = "user-property")
                    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                    @XmlSchemaType(name = "token")
                    protected String userProperty;
                    @XmlAttribute(name = "system-wide")
                    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                    @XmlSchemaType(name = "token")
                    protected String systemWide;
                    @XmlAttribute
                    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
                    @XmlSchemaType(name = "token")
                    protected String ref;

                    /**
                     * Gets the value of the userProperty property.
                     * 
                     * @return
                     *     possible object is
                     *     {@link String }
                     *     
                     */
                    public String getUserProperty() {
                        return userProperty;
                    }

                    /**
                     * Sets the value of the userProperty property.
                     * 
                     * @param value
                     *     allowed object is
                     *     {@link String }
                     *     
                     */
                    public void setUserProperty(String value) {
                        this.userProperty = value;
                    }

                    /**
                     * Gets the value of the systemWide property.
                     * 
                     * @return
                     *     possible object is
                     *     {@link String }
                     *     
                     */
                    public String getSystemWide() {
                        return systemWide;
                    }

                    /**
                     * Sets the value of the systemWide property.
                     * 
                     * @param value
                     *     allowed object is
                     *     {@link String }
                     *     
                     */
                    public void setSystemWide(String value) {
                        this.systemWide = value;
                    }

                    /**
                     * Gets the value of the ref property.
                     * 
                     * @return
                     *     possible object is
                     *     {@link String }
                     *     
                     */
                    public String getRef() {
                        return ref;
                    }

                    /**
                     * Sets the value of the ref property.
                     * 
                     * @param value
                     *     allowed object is
                     *     {@link String }
                     *     
                     */
                    public void setRef(String value) {
                        this.ref = value;
                    }

                }

            }

        }

    }

}
