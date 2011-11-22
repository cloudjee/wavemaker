
package org.cloudfoundry.spinup.deploy;

public interface ApplicationNamer {

    boolean isMatch(String name);

    String createNew();

}
