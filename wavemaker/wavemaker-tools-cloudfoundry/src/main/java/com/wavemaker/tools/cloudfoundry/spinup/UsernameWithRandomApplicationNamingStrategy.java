
package com.wavemaker.tools.cloudfoundry.spinup;

import java.security.SecureRandom;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.tools.cloudfoundry.spinup.util.HexString;

/**
 * {@link ApplicationNamingStrategy} that generates application URLs based on the logged in used combined with random
 * characters. The application name is fixed.
 * 
 * @author Phillip Webb
 */
public class UsernameWithRandomApplicationNamingStrategy implements ApplicationNamingStrategy {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("([^@]*)@.*");

    /**
     * Maximum length of the domain section (64 character, same as domain name standards)
     */
    private static final int MAX_NAME_LENGTH = 64;

    private static final Random RANDOM = new SecureRandom();

    private final String applicationName;

    /**
     * Create a new {@link UsernameWithRandomApplicationNamingStrategy} instance.
     * 
     * @param applicationName the application name
     */
    public UsernameWithRandomApplicationNamingStrategy(String applicationName) {
        this.applicationName = applicationName;
    }

    @Override
    public boolean isMatch(ApplicationDetails applicationDetails) {
        return this.applicationName.equalsIgnoreCase(applicationDetails.getName());
    }

    @Override
    public ApplicationDetails newApplicationDetails(ApplicationNamingStrategyContext context) {
        String url = context.getControllerUrl();
        url = url.replace("https", "http");
        url = url.replace("api.", generateName(context) + ".");
        return new ApplicationDetails(this.applicationName, url);
    }

    private String generateName(ApplicationNamingStrategyContext context) {
        String name = context.getUsername();
        Matcher matcher = USERNAME_PATTERN.matcher(name);
        if (matcher.matches()) {
            name = matcher.group(1);
        }
        name = replaceInvalidChars(name);
        String random = generateRandom();
        int maxNameLength = MAX_NAME_LENGTH - random.length();
        if (name.length() > maxNameLength) {
            name = name.substring(0, maxNameLength);
        }
        return (name + random).toLowerCase();
    }

    private String replaceInvalidChars(String username) {
        StringBuilder s = new StringBuilder(username.length());
        for (int i = 0; i < username.length(); i++) {
            char c = username.charAt(i);
            if (isValidDomainNameChar(c)) {
                s.append(c);
            }
        }
        return s.toString();
    }

    private String generateRandom() {
        byte[] bytes = new byte[4];
        RANDOM.nextBytes(bytes);
        return HexString.toString(bytes);
    }

    private boolean isValidDomainNameChar(char c) {
        return Character.isLetterOrDigit(c) || c == '-';
    }

}
