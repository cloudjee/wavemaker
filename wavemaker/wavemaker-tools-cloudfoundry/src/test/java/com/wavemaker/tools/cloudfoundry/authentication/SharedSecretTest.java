
package com.wavemaker.tools.cloudfoundry.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.cloudfoundry.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.authentication.TransportToken;
import com.wavemaker.tools.cloudfoundry.authentication.TransportTokenDigestMismatchException;

/**
 * Tests for {@link SharedSecret}.
 * 
 * @author Phillip Webb
 */
public class SharedSecretTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private final AuthenticationToken source = new AuthenticationToken("AuthenticationToken".getBytes());

    @Test
    public void shouldCreateGenerated() throws Exception {
        SharedSecret s1 = new SharedSecret();
        SharedSecret s2 = new SharedSecret();
        assertFalse("Arrays should not match", Arrays.equals(s1.getBytes(), s2.getBytes()));
    }

    @Test
    public void shouldCreateFromBytes() throws Exception {
        byte[] bytes = new SharedSecret().getBytes();
        SharedSecret secret = SharedSecret.fromBytes(bytes);
        assertTrue("Bytes should match", Arrays.equals(bytes, secret.getBytes()));
    }

    @Test
    public void shouldEncryptAndDecrypt() throws Exception {
        SharedSecret secret = new SharedSecret();
        TransportToken transportToken = secret.encrypt(this.source);
        AuthenticationToken decrypted = secret.decrypt(transportToken);
        assertThat(this.source, is(equalTo(decrypted)));
    }

    @Test
    public void shouldAlwaysCreateDifferentEncryptedValues() throws Exception {
        TransportToken t1 = new SharedSecret().encrypt(this.source);
        TransportToken t2 = new SharedSecret().encrypt(this.source);
        assertThat(t1, is(not(equalTo(t2))));
    }

    @Test
    public void shouldThrowMessageDigestException() throws Exception {
        TransportToken t = new SharedSecret().encrypt(this.source);
        this.thrown.expect(TransportTokenDigestMismatchException.class);
        new SharedSecret().decrypt(t);
    }
}
