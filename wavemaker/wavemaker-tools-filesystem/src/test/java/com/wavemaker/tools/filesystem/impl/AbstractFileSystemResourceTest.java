
package com.wavemaker.tools.filesystem.impl;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;

import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

public abstract class AbstractFileSystemResourceTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Mock
    protected FileSystem<Object> fileSystem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        given(this.fileSystem.getKey(any(Path.class))).willAnswer(new Answer<Object>() {

            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                return invocation.getArguments()[0];
            }
        });
        given(this.fileSystem.getPath(any(Object.class))).willAnswer(new Answer<Path>() {

            @Override
            public Path answer(InvocationOnMock invocation) throws Throwable {
                return (Path) invocation.getArguments()[0];
            }
        });
    }

}
