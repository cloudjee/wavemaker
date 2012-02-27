
package com.wavemaker.tools.cloudfoundry.spinup.util;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import com.wavemaker.tools.cloudfoundry.spinup.util.HexFormatException;
import com.wavemaker.tools.cloudfoundry.spinup.util.HexString;

/**
 * Tests for {@link HexString}.
 * 
 * @author Phillip Webb
 */
public class HexStringTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private static final String STRING = "000102030405060708090A0B0C0D0E0F10FF";

    private static final byte[] BYTES = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
        0x10, (byte) 0xFF };

    @Test
    public void shouldConvertToString() throws Exception {
        String s = HexString.toString(BYTES);
        assertThat(s, is(equalTo(STRING)));
    }

    @Test
    public void shouldConvertToChars() throws Exception {
        char[] c = HexString.toChars(BYTES);
        assertThat(c, is(equalTo(STRING.toCharArray())));
    }

    @Test
    public void shouldConvertToBytes() throws Exception {
        byte[] b = HexString.toBytes(STRING);
        assertThat(b, is(equalTo(BYTES)));
    }

    @Test
    public void shouldNotAllowNullBytesOnToString() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Bytes must not be null");
        HexString.toString(null);
    }

    @Test
    public void shouldNotAllowNullBytesOnToChars() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("Bytes must not be null");
        HexString.toChars(null);
    }

    @Test
    public void shouldNotAllowNullStringOnToBytes() throws Exception {
        this.thrown.expect(IllegalArgumentException.class);
        this.thrown.expectMessage("HexString must not be null");
        HexString.toBytes(null);
    }

    @Test
    public void shouldOnlySuportEvenString() throws Exception {
        this.thrown.expect(HexFormatException.class);
        this.thrown.expectMessage("Hexadecimal strings must contain an even number of characters");
        HexString.toBytes("AAA");
    }

    @Test
    public void shouldThrowOnNonHexChar() throws Exception {
        this.thrown.expect(HexFormatException.class);
        this.thrown.expectMessage("Illegal character 'G' in hexadecimal string at position 3");
        HexString.toBytes("AAEGBB");
    }

    @Test
    public void shouldCreateFromString() throws Exception {
        HexString hexString = new HexString(STRING);
        assertThat(hexString.toString(), is(equalTo(STRING)));
        assertThat(hexString.getBytes(), is(equalTo(BYTES)));
    }

    @Test
    public void shouldCreateFromBytes() throws Exception {
        HexString hexString = HexString.valueOf(BYTES);
        assertThat(hexString.toString(), is(equalTo(STRING)));
        assertThat(hexString.getBytes(), is(equalTo(BYTES)));
    }

    @Test
    public void shouldImplementHashCodeAndEquals() throws Exception {
        HexString h1 = new HexString(STRING);
        HexString h2 = new HexString(STRING);
        HexString h3 = new HexString("0000");
        assertThat(h1.hashCode(), is(equalTo(h2.hashCode())));
        assertThat(h1, is(equalTo(h2)));
        assertThat(h1, is(equalTo(h2)));
        assertThat(h1.hashCode(), is(not(equalTo(h3.hashCode()))));
        assertThat(h1, is(not(equalTo(h3))));
    }
}
