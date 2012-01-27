
package com.wavemaker.tools.cloudfoundry.spinup.authentication;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Tests for {@link TransportToken}.
 * 
 * @author Phillip Webb
 */
public class TransportTokenTest {

    private static final byte[] NO_BYTES = new byte[] {};

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldNeedDigest() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Digest must not be null");
        new TransportToken(null, NO_BYTES);
    }

    @Test
    public void shouldNeedEncryptedToken() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Encrypted Token must not be null");
        new TransportToken(NO_BYTES, null);
    }

    @Test
    public void shouldGetEncryptedToken() throws Exception {
        byte[] bytes = new byte[] { 0, 1, 2 };
        TransportToken t = new TransportToken(NO_BYTES, bytes);
        assertThat(t.getEncryptedToken(), is(equalTo(bytes)));
    }

    @Test
    public void shouldMatchDigest() throws Exception {
        byte[] d1 = new byte[] { 0, 1, 2 };
        byte[] d2 = new byte[] { 0, 2, 1 };
        TransportToken t = new TransportToken(d1, NO_BYTES);
        assertThat(t.isDigestMatch(d1), is(true));
        assertThat(t.isDigestMatch(d2), is(false));
    }

    @Test
    public void shouldImplementHashCodeAndEquals() throws Exception {
        TransportToken t1 = new TransportToken(new byte[] { 0, 1 }, new byte[] { 1, 2 });
        TransportToken t2 = new TransportToken(new byte[] { 0, 1 }, new byte[] { 1, 2 });
        assertThat(t1, is(not(sameInstance(t2))));
        assertThat(t1.hashCode(), is(equalTo(t2.hashCode())));
        assertThat(t1, is(equalTo(t2)));
    }

    @Test
    public void shouldEncode() throws Exception {
        TransportToken t = new TransportToken(new byte[] { 0, 1 }, new byte[] { 1, 2 });
        assertThat(t.encode(), is(equalTo("0001.0102")));
    }

    @Test
    public void shouldDecode() throws Exception {
        TransportToken token = TransportToken.decode("0001.0102");
        assertTrue(token.isDigestMatch(new byte[] { 0, 1 }));
        assertThat(token.getEncryptedToken(), is(equalTo(new byte[] { 1, 2 })));
    }

    @Test
    public void shouldNotDecodeNull() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("EncodedTransportToken must not be null");
        TransportToken.decode(null);
    }

    @Test
    public void shouldNotDecodeMalformed() throws Exception {
        this.thrown.expect(IllegalStateException.class);
        this.thrown.expectMessage("Malformed EncodedTransportToken");
        TransportToken.decode("a.b.c");
    }

}
