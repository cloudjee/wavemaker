
package org.cloudfoundry.spinup.web;

import org.cloudfoundry.spinup.SpinupService;
import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/spinup")
public class SpinupController {

    private SpinupService service;

    private SharedSecretPropagation propagation;

    @RequestMapping("/service")
    public @ResponseBody
    String service() {
        SharedSecret secret = new SharedSecret();
        LoginCredentials credentials = new LoginCredentials("pwebb@vmware.com", "");
        this.service.start(secret, credentials);
        return "OK";
    }

    @RequestMapping("/info")
    public @ResponseBody
    String info() {
        return this.propagation.getForSelf().toString();
    }

    @Autowired
    public void setService(SpinupService service) {
        this.service = service;
    }

    @Autowired
    public void setPropagation(SharedSecretPropagation propagation) {
        this.propagation = propagation;
    }

}
