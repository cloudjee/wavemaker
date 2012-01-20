
package com.wavemaker.tools.deployment.cloudfoundry.archive;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.cloudfoundry.client.lib.archive.ApplicationArchive.Entry;

/**
 * Simple {@link ContentModifier} that can perform regular expression replacements given entries.
 * 
 * @author Phillip Webb
 */
public class StringReplaceContentModifier implements ContentModifier {

    private final List<String> entryNames = new ArrayList<String>();

    private final List<RegexReplacement> regexReplacements = new ArrayList<RegexReplacement>();

    @Override
    public boolean canModify(Entry entry) {
        for (String entryName : this.entryNames) {
            if (entryName.equals(entry.getName())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public InputStream modify(InputStream inputStream) throws IOException {
        String content = IOUtils.toString(inputStream);
        for (RegexReplacement regexReplacement : this.regexReplacements) {
            content = regexReplacement.apply(content);
        }
        return new ByteArrayInputStream(content.getBytes());
    }

    public StringReplaceContentModifier forEntryName(String... entryNames) {
        for (String entryName : entryNames) {
            this.entryNames.add(entryName);
        }
        return this;
    }

    public StringReplaceContentModifier replaceAll(String regex, String replacement) {
        this.regexReplacements.add(new RegexReplacement(regex, replacement));
        return this;
    }

    private static class RegexReplacement {

        private final String regex;

        private final String replacement;

        public RegexReplacement(String regex, String replacement) {
            super();
            this.regex = regex;
            this.replacement = replacement;
        }

        public String apply(String content) {
            return content.replaceAll(this.regex, this.replacement);
        }
    }

}
