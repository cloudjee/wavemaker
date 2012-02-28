
package com.wavemaker.tools.deployment.cloudfoundry.archive;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.cloudfoundry.client.lib.archive.AbstractApplicationArchiveEntry;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.ApplicationArchive.Entry;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.ArgumentMatcher;
import org.springframework.util.FileCopyUtils;

/**
 * Tests for {@link ModifiedContentApplicationArchive}.
 * 
 * @author Phillip Webb
 */
public class ModifiedContentApplicationArchiveTest {

    private static final Collection<ContentModifier> NULL_MODIFIERS_COLLECTION = null;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedApplicationArchive() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("ApplicationArchive must not be null");
        new ModifiedContentApplicationArchive(null, NULL_MODIFIERS_COLLECTION);
    }

    @Test
    public void shouldSupportNullModifiersCollection() throws Exception {
        ModifiedContentApplicationArchive archive = new ModifiedContentApplicationArchive(mockArchive(), NULL_MODIFIERS_COLLECTION);
        assertThat(archive.getEntries().iterator().hasNext(), is(true));
    }

    @Test
    public void shouldSupportNullModifiersArray() throws Exception {
        ModifiedContentApplicationArchive archive = new ModifiedContentApplicationArchive(mockArchive());
        List<Entry> entries = getEntriesAsList(archive);
        assertThat(entries.size(), is(4));
    }

    @Test
    public void shouldNeverAttemptToModifyDirectory() throws Exception {
        ContentModifier modifier = mock(ContentModifier.class);
        ModifiedContentApplicationArchive archive = new ModifiedContentApplicationArchive(mockArchive(), modifier);
        List<Entry> entries = getEntriesAsList(archive);
        assertThat(entries.size(), is(4));
        verify(modifier, never()).canModify(isDirectoryEntry());
    }

    @Test
    public void shouldGetFilename() throws Exception {
        ApplicationArchive mockArchive = mockArchive();
        ModifiedContentApplicationArchive archive = new ModifiedContentApplicationArchive(mockArchive);
        assertThat(archive.getFilename(), is(equalTo(mockArchive.getFilename())));
    }

    @Test
    public void shouldModifyContentOfEntries() throws Exception {
        Modifier m1 = new Modifier("a/a", "Content AA", "Modified Content AA");
        Modifier m2 = new Modifier("a/c", "Content AC", "Modified Content AC");
        ModifiedContentApplicationArchive archive = new ModifiedContentApplicationArchive(mockArchive(), m1, m2);
        List<Entry> entries = getEntriesAsList(archive);
        assertThat(entries.size(), is(4));
        assertThat(getEntryContent(entries.get(1)), is("Modified Content AA"));
        assertThat(getEntryContent(entries.get(2)), is("Content AB"));
        assertThat(getEntryContent(entries.get(3)), is("Modified Content AC"));
    }

    private ApplicationArchive mockArchive() {
        ApplicationArchive archive = mock(ApplicationArchive.class);
        given(archive.getFilename()).willReturn("filename");
        List<Entry> entries = new ArrayList<Entry>();
        entries.add(mockEntry(true, "a", null));
        entries.add(mockEntry(false, "a/a", "Content AA"));
        entries.add(mockEntry(false, "a/b", "Content AB"));
        entries.add(mockEntry(false, "a/c", "Content AC"));
        given(archive.getEntries()).willReturn(entries);
        return archive;
    }

    private Entry mockEntry(final boolean dir, final String name, final String content) {
        return new AbstractApplicationArchiveEntry() {

            @Override
            public boolean isDirectory() {
                return dir;
            }

            @Override
            public String getName() {
                return name;
            }

            @Override
            public InputStream getInputStream() throws IOException {
                return content == null ? null : new ByteArrayInputStream(content.getBytes());
            }
        };
    }

    private List<Entry> getEntriesAsList(ModifiedContentApplicationArchive archive) {
        List<Entry> entries = new ArrayList<ApplicationArchive.Entry>();
        for (Entry entry : archive.getEntries()) {
            entries.add(entry);
        }
        return entries;
    }

    private String getEntryContent(Entry entry) throws IOException {
        return FileCopyUtils.copyToString(new InputStreamReader(entry.getInputStream()));
    }

    private static Entry isDirectoryEntry() {
        return argThat(new ArgumentMatcher<ApplicationArchive.Entry>() {

            @Override
            public boolean matches(Object argument) {
                return ((Entry) argument).isDirectory();
            }
        });
    }

    private static class Modifier implements ContentModifier {

        private final String entryName;

        private final String expectedContent;

        private final String modifiedContent;

        public Modifier(String entryName, String expectedContent, String modifiedContent) {
            this.entryName = entryName;
            this.expectedContent = expectedContent;
            this.modifiedContent = modifiedContent;
        }

        @Override
        public boolean canModify(Entry entry) {
            return this.entryName.equals(entry.getName());
        }

        @Override
        public InputStream modify(InputStream inputStream) {
            try {
                String existingContent = FileCopyUtils.copyToString(new InputStreamReader(inputStream));
                assertThat(existingContent, is(equalTo(this.expectedContent)));
                return new ByteArrayInputStream(this.modifiedContent.getBytes());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
