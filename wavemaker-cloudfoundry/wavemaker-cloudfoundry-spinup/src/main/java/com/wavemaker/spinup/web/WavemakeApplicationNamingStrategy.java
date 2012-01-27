
package com.wavemaker.spinup.web;

import java.security.SecureRandom;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.wavemaker.tools.cloudfoundry.ApplicationDetails;
import com.wavemaker.tools.cloudfoundry.ApplicationNamingStrategy;
import com.wavemaker.tools.cloudfoundry.ApplicationNamingStrategyContext;
import com.wavemaker.tools.cloudfoundry.util.HexString;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy implements ApplicationNamingStrategy {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("([^@]*)@.*");

    private static final String APPLICATION_NAME = "wavemaker-studio";

    /**
     * Maximum length of the domain section (64 character, same as domain name standards)
     */
    private static final int MAX_NAME_LENGTH = 64;

    private static final Random RANDOM = new SecureRandom();

    @Override
    public boolean isMatch(ApplicationDetails applicationDetails) {
        return APPLICATION_NAME.equalsIgnoreCase(applicationDetails.getName());
    }

    @Override
    public ApplicationDetails newApplicationDetails(ApplicationNamingStrategyContext context) {
        String url = context.getControllerUrl();
        url = url.replace("https", "http");
        url = url.replace("api.", generateName(context) + ".");
        return new ApplicationDetails(APPLICATION_NAME, url);
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
