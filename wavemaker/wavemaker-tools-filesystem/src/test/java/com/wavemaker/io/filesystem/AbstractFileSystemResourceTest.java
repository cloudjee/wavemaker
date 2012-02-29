
package com.wavemaker.io.filesystem;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;

import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.wavemaker.io.ResourcePath;

public abstract class AbstractFileSystemResourceTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    protected FileSystem<Object> fileSystem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        given(this.fileSystem.getKey(any(ResourcePath.class))).willAnswer(new Answer<Object>() {

            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                return invocation.getArguments()[0];
            }
        });
        given(this.fileSystem.getPath(any(Object.class))).willAnswer(new Answer<ResourcePath>() {

            @Override
            public ResourcePath answer(InvocationOnMock invocation) throws Throwable {
                return (ResourcePath) invocation.getArguments()[0];
            }
        });
    }
}
