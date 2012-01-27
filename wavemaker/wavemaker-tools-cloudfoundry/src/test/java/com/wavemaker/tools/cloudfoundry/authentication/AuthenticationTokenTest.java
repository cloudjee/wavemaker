
package com.wavemaker.tools.cloudfoundry.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;

import java.util.Arrays;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.cloudfoundry.authentication.AuthenticationToken;

/**
 * Tests for {@link AuthenticationToken}.
 * 
 * @author Phillip Webb
 */
public class AuthenticationTokenTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedBytes() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Token must not be null");
        new AuthenticationToken((byte[]) null);
    }

    @Test
    public void shouldSupportEqualsAndHashcode() throws Exception {
        byte[] b1 = new byte[] { 0, 1, 2 };
        byte[] b2 = Arrays.copyOf(b1, 3);
        AuthenticationToken t1 = new AuthenticationToken(b1);
        AuthenticationToken t2 = new AuthenticationToken(b2);
        assertThat(t1, is(not(sameInstance(t2))));
        assertThat(t1.getBytes(), is(not(sameInstance(t2.getBytes()))));
        assertThat(t1.hashCode(), is(equalTo(t2.hashCode())));
        assertThat(t1, is(equalTo(t2)));
    }
}
