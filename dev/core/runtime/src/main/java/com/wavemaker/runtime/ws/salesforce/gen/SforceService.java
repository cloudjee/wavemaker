/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.salesforce.gen;

import java.io.IOException;
import java.net.URL;

import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;

import org.springframework.core.io.ClassPathResource;

import com.sun.xml.ws.developer.WSBindingProvider;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.jaxws.SOAPBindingResolver;

/**
 * Operations for service "myservice" 07/16/2010 11:14:19
 */
public class SforceService {

    private final QName sforceServiceQName = new QName("urn:partner.soap.sforce.com", "SforceService");

    private BindingProperties bindingProperties;

    private final Soap soapService;

    public SforceService() throws Exception {
        SforceServiceClient sforceServiceClient;
        try {
            URL wsdlLocation = new ClassPathResource("com/wavemaker/runtime/ws/salesforce/partner.wsdl").getURL(); // salesforce
            sforceServiceClient = new SforceServiceClient(wsdlLocation, this.sforceServiceQName);
        } catch (IOException e) {
            sforceServiceClient = new SforceServiceClient();
        }
        this.soapService = sforceServiceClient.getSoap();
    }

    public ConvertLeadResponse convertLead(ConvertLead parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        ConvertLeadResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, allowFieldTruncationHeader,
            disableFeedTrackingHeader, debuggingHeader, packageVersionHeader);
        response = this.soapService.convertLead(parameters);
        return response;
    }

    public CreateResponse create(Create parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AssignmentRuleHeader assignmentRuleHeader,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader) throws Exception {
        CreateResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, assignmentRuleHeader, mruHeader,
            allowFieldTruncationHeader, disableFeedTrackingHeader, debuggingHeader, packageVersionHeader, emailHeader);
        response = this.soapService.create(parameters);
        return response;
    }

    public DeleteResponse delete(Delete parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader, UserTerritoryDeleteHeader userTerritoryDeleteHeader,
        com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader) throws Exception {
        DeleteResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader,
            userTerritoryDeleteHeader, emailHeader, allowFieldTruncationHeader, disableFeedTrackingHeader, debuggingHeader);
        response = this.soapService.delete(parameters);
        return response;
    }

    public DescribeDataCategoryGroupStructuresResponse describeDataCategoryGroupStructures(DescribeDataCategoryGroupStructures parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeDataCategoryGroupStructuresResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeDataCategoryGroupStructures(parameters);
        return response;
    }

    public DescribeDataCategoryGroupsResponse describeDataCategoryGroups(DescribeDataCategoryGroups parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeDataCategoryGroupsResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeDataCategoryGroups(parameters);
        return response;
    }

    public DescribeGlobalResponse describeGlobal(DescribeGlobal parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeGlobalResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeGlobal(parameters);
        return response;
    }

    public DescribeLayoutResponse describeLayout(DescribeLayout parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeLayoutResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeLayout(parameters);
        return response;
    }

    public DescribeSObjectResponse describeSObject(DescribeSObject parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.LocaleOptions localeOptions) throws Exception {
        DescribeSObjectResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader, localeOptions);
        response = this.soapService.describeSObject(parameters);
        return response;
    }

    public DescribeSObjectsResponse describeSObjects(DescribeSObjects parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.LocaleOptions localeOptions) throws Exception {
        DescribeSObjectsResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader, localeOptions);
        response = this.soapService.describeSObjects(parameters);
        return response;
    }

    public DescribeSoftphoneLayoutResponse describeSoftphoneLayout(DescribeSoftphoneLayout parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeSoftphoneLayoutResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeSoftphoneLayout(parameters);
        return response;
    }

    public DescribeTabsResponse describeTabs(DescribeTabs parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        DescribeTabsResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.describeTabs(parameters);
        return response;
    }

    public EmptyRecycleBinResponse emptyRecycleBin(EmptyRecycleBin parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        EmptyRecycleBinResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.emptyRecycleBin(parameters);
        return response;
    }

    public GetDeletedResponse getDeleted(GetDeleted parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        GetDeletedResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.getDeleted(parameters);
        return response;
    }

    public GetServerTimestampResponse getServerTimestamp(GetServerTimestamp parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions)
        throws Exception {
        GetServerTimestampResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.getServerTimestamp(parameters);
        return response;
    }

    public GetUpdatedResponse getUpdated(GetUpdated parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        GetUpdatedResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.getUpdated(parameters);
        return response;
    }

    public GetUserInfoResponse getUserInfo(GetUserInfo parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        GetUserInfoResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.getUserInfo(parameters);
        return response;
    }

    public InvalidateSessionsResponse invalidateSessions(InvalidateSessions parameters,
        com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions)
        throws Exception {
        InvalidateSessionsResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.invalidateSessions(parameters);
        return response;
    }

    public LoginResponse login(Login parameters, LoginScopeHeader loginScopeHeader, com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions)
        throws Exception {
        LoginResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, loginScopeHeader, callOptions);
        response = this.soapService.login(parameters);
        return response;
    }

    public LogoutResponse logout(Logout parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        LogoutResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.logout(parameters);
        return response;
    }

    public MergeResponse merge(Merge parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AssignmentRuleHeader assignmentRuleHeader,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader) throws Exception {
        MergeResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, assignmentRuleHeader, mruHeader,
            allowFieldTruncationHeader, disableFeedTrackingHeader, debuggingHeader, packageVersionHeader, emailHeader);
        response = this.soapService.merge(parameters);
        return response;
    }

    public ProcessResponse process(Process parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        ProcessResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, allowFieldTruncationHeader,
            disableFeedTrackingHeader, debuggingHeader, packageVersionHeader);
        response = this.soapService.process(parameters);
        return response;
    }

    public QueryResponse query(Query parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions, com.wavemaker.runtime.ws.salesforce.gen.QueryOptions queryOptions,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader, com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader)
        throws Exception {
        QueryResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, queryOptions, mruHeader,
            packageVersionHeader);
        response = this.soapService.query(parameters);
        return response;
    }

    public QueryAllResponse queryAll(QueryAll parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions, com.wavemaker.runtime.ws.salesforce.gen.QueryOptions queryOptions)
        throws Exception {
        QueryAllResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, queryOptions);
        response = this.soapService.queryAll(parameters);
        return response;
    }

    public QueryMoreResponse queryMore(QueryMore parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions, com.wavemaker.runtime.ws.salesforce.gen.QueryOptions queryOptions)
        throws Exception {
        QueryMoreResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, queryOptions);
        response = this.soapService.queryMore(parameters);
        return response;
    }

    public ResetPasswordResponse resetPassword(ResetPassword parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions, com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader)
        throws Exception {
        ResetPasswordResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, emailHeader);
        response = this.soapService.resetPassword(parameters);
        return response;
    }

    public RetrieveResponse retrieve(Retrieve parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions, com.wavemaker.runtime.ws.salesforce.gen.QueryOptions queryOptions,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader, com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader)
        throws Exception {
        RetrieveResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, queryOptions, mruHeader,
            packageVersionHeader);
        response = this.soapService.retrieve(parameters);
        return response;
    }

    public SearchResponse search(Search parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        SearchResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, packageVersionHeader);
        response = this.soapService.search(parameters);
        return response;
    }

    public SendEmailResponse sendEmail(SendEmail parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        SendEmailResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.sendEmail(parameters);
        return response;
    }

    public SetPasswordResponse setPassword(SetPassword parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions) throws Exception {
        SetPasswordResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions);
        response = this.soapService.setPassword(parameters);
        return response;
    }

    public UndeleteResponse undelete(Undelete parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader) throws Exception {
        UndeleteResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, allowFieldTruncationHeader,
            disableFeedTrackingHeader, debuggingHeader, packageVersionHeader);
        response = this.soapService.undelete(parameters);
        return response;
    }

    public UpdateResponse update(Update parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AssignmentRuleHeader assignmentRuleHeader,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader) throws Exception {
        UpdateResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, assignmentRuleHeader, mruHeader,
            allowFieldTruncationHeader, disableFeedTrackingHeader, debuggingHeader, packageVersionHeader, emailHeader);
        response = this.soapService.update(parameters);
        return response;
    }

    public UpsertResponse upsert(Upsert parameters, com.wavemaker.runtime.ws.salesforce.gen.SessionHeader sessionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.CallOptions callOptions,
        com.wavemaker.runtime.ws.salesforce.gen.AssignmentRuleHeader assignmentRuleHeader,
        com.wavemaker.runtime.ws.salesforce.gen.MruHeader mruHeader,
        com.wavemaker.runtime.ws.salesforce.gen.AllowFieldTruncationHeader allowFieldTruncationHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DisableFeedTrackingHeader disableFeedTrackingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.DebuggingHeader debuggingHeader,
        com.wavemaker.runtime.ws.salesforce.gen.PackageVersionHeader packageVersionHeader,
        com.wavemaker.runtime.ws.salesforce.gen.EmailHeader emailHeader) throws Exception {
        UpsertResponse response;
        SOAPBindingResolver.setBindingProperties((BindingProvider) this.soapService, this.bindingProperties);
        SOAPBindingResolver.setHeaders((WSBindingProvider) this.soapService, sessionHeader, callOptions, assignmentRuleHeader, mruHeader,
            allowFieldTruncationHeader, disableFeedTrackingHeader, debuggingHeader, packageVersionHeader, emailHeader);
        response = this.soapService.upsert(parameters);
        return response;
    }

    public BindingProperties getBindingProperties() {
        return this.bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
