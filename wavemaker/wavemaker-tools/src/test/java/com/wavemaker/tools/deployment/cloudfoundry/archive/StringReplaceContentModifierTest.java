
package com.wavemaker.tools.deployment.cloudfoundry.archive;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.cloudfoundry.client.lib.archive.ApplicationArchive.Entry;
import org.junit.Test;
import org.springframework.util.FileCopyUtils;

/**
 * Tests for {@link StringReplaceContentModifier}.
 * 
 * @author Phillip Webb
 */
public class StringReplaceContentModifierTest {

    @Test
    public void shouldModifyMatchingEntries() throws Exception {
        StringReplaceContentModifier modifier = new StringReplaceContentModifier().forEntryName("a", "c");
        assertThat(modifier.canModify(mockEntry("a")), is(true));
        assertThat(modifier.canModify(mockEntry("b")), is(false));
        assertThat(modifier.canModify(mockEntry("c")), is(true));
    }

    @Test
    public void shouldModifyContent() throws Exception {
        StringReplaceContentModifier modifier = new StringReplaceContentModifier().forEntryName("a").replaceAll("a", "b").replaceAll("b", "c");
        Entry entry = mockEntry("a");
        given(entry.getInputStream()).willReturn(new ByteArrayInputStream("abc".getBytes()));
        InputStream modified = modifier.modify(entry.getInputStream());
        String actual = FileCopyUtils.copyToString(new InputStreamReader(modified));
        assertThat(actual, is("ccc"));
    }

    private Entry mockEntry(String name) {
        Entry entry = mock(Entry.class);
        given(entry.getName()).willReturn(name);
        return entry;
    }

}
