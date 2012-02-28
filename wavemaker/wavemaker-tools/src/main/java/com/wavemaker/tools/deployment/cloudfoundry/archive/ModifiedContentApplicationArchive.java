
package com.wavemaker.tools.deployment.cloudfoundry.archive;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.cloudfoundry.client.lib.archive.AbstractApplicationArchiveEntry;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

/**
 * Decorator class that can be used to apply dynamic modifications to the content of archive {@link Entry entries}.
 * Entries are modified on construction and cached.
 * 
 * @author Phillip Webb
 */
public class ModifiedContentApplicationArchive implements ApplicationArchive {

    private final String filename;

    private final List<Entry> entries;

    /**
     * Create a new {@link ModifiedContentApplicationArchive}.
     * 
     * @param applicationArchive the underlying archive to modify
     * @param modifiers modifiers that should be applied to the archive (can be null)
     */
    public ModifiedContentApplicationArchive(ApplicationArchive applicationArchive, Collection<? extends ContentModifier> modifiers) {
        Assert.notNull(applicationArchive, "ApplicationArchive must not be null");
        if (modifiers == null) {
            modifiers = Collections.emptyList();
        }
        this.filename = applicationArchive.getFilename();
        List<Entry> entries = new ArrayList<Entry>();
        for (Entry entry : applicationArchive.getEntries()) {
            for (ContentModifier modifier : modifiers) {
                if (!entry.isDirectory() && modifier.canModify(entry)) {
                    entry = new ModifiedEntry(entry, modifier);
                }
            }
            entries.add(entry);
        }
        this.entries = Collections.unmodifiableList(entries);
    }

    /**
     * Create a new {@link ModifiedContentApplicationArchive}.
     * 
     * @param applicationArchive the underlying archive to modify
     * @param modifiers modifiers that should be applied to the archive (can be null)
     */
    public ModifiedContentApplicationArchive(ApplicationArchive applicationArchive, ContentModifier... modifiers) {
        this(applicationArchive, modifiers == null ? null : Arrays.asList(modifiers));
    }

    @Override
    public String getFilename() {
        return this.filename;
    }

    @Override
    public Iterable<Entry> getEntries() {
        return this.entries;
    }

    /**
     * Decorator that modifies an underling entry.
     */
    private static class ModifiedEntry extends AbstractApplicationArchiveEntry {

        private final Entry entry;

        private final ContentModifier modifier;

        private byte[] modifiedContent;

        public ModifiedEntry(Entry entry, ContentModifier modifier) {
            this.entry = entry;
            this.modifier = modifier;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            if (this.modifiedContent == null) {
                InputStream inputStream = this.entry.getInputStream();
                try {
                    InputStream modifiedInputStream = this.modifier.modify(inputStream);
                    this.modifiedContent = FileCopyUtils.copyToByteArray(modifiedInputStream);
                } finally {
                    inputStream.close();
                }
            }
            return new ByteArrayInputStream(this.modifiedContent);
        }

        @Override
        public String getName() {
            return this.entry.getName();
        }

        @Override
        public boolean isDirectory() {
            return this.entry.isDirectory();
        }
    }
}
