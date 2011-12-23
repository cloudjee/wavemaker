
package com.strikeiron.basicrealtimequotes;

import java.io.IOException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import com.sun.xml.ws.developer.WSBindingProvider;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.jaxws.SOAPBindingResolver;
import org.springframework.core.io.ClassPathResource;


/**
 *  Operations for service "BasicRealTimeQuotes"
 *  04/06/2009 01:53:41
 * 
 */
public class BasicRealTimeQuotes {

    public String serviceId = "BasicRealTimeQuotes";
    private QName basicRealTimeQuotesQName = new QName("http://www.strikeiron.com", "BasicRealTimeQuotes");
    private BindingProperties bindingProperties;
    private BasicRealTimeQuotesSoap basicRealTimeQuotesSoapService;

    public BasicRealTimeQuotes() {
        BasicRealTimeQuotesClient basicRealTimeQuotesClient;
        try {
            URL wsdlLocation = new ClassPathResource("com/strikeiron/basicrealtimequotes/temp.wsdl").getURL();
            basicRealTimeQuotesClient = new BasicRealTimeQuotesClient(wsdlLocation, basicRealTimeQuotesQName);
        } catch (IOException e) {
            basicRealTimeQuotesClient = new BasicRealTimeQuotesClient();
        }
        basicRealTimeQuotesSoapService = basicRealTimeQuotesClient.getBasicRealTimeQuotesSoap();
    }

    public GetOneQuoteResponse getOneQuote(GetOneQuote parameters, com.strikeiron.basicrealtimequotes.LicenseInfo licenseInfo) {
        GetOneQuoteResponse response;
        SOAPBindingResolver.setBindingProperties(((BindingProvider) basicRealTimeQuotesSoapService), bindingProperties);
        SOAPBindingResolver.setHeaders(((WSBindingProvider) basicRealTimeQuotesSoapService), licenseInfo);
        response = basicRealTimeQuotesSoapService.getOneQuote(parameters);
        return response;
    }

    public GetQuotesResponse getQuotes(GetQuotes parameters, com.strikeiron.basicrealtimequotes.LicenseInfo licenseInfo) {
        GetQuotesResponse response;
        SOAPBindingResolver.setBindingProperties(((BindingProvider) basicRealTimeQuotesSoapService), bindingProperties);
        SOAPBindingResolver.setHeaders(((WSBindingProvider) basicRealTimeQuotesSoapService), licenseInfo);
        response = basicRealTimeQuotesSoapService.getQuotes(parameters);
        return response;
    }

    public GetRemainingHitsResponse getRemainingHits(GetRemainingHits parameters, com.strikeiron.basicrealtimequotes.LicenseInfo licenseInfo) {
        GetRemainingHitsResponse response;
        SOAPBindingResolver.setBindingProperties(((BindingProvider) basicRealTimeQuotesSoapService), bindingProperties);
        SOAPBindingResolver.setHeaders(((WSBindingProvider) basicRealTimeQuotesSoapService), licenseInfo);
        response = basicRealTimeQuotesSoapService.getRemainingHits(parameters);
        return response;
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
