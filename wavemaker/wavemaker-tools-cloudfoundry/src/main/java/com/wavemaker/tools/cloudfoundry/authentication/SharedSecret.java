
package com.wavemaker.tools.cloudfoundry.authentication;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.core.style.ToStringCreator;
import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.util.HexString;

/**
 * Represents a shared secret used by client and server to encrypt/decrypt tokens. Shared secrets should never be
 * exposed to the client.
 * 
 * @author Phillip Webb
 */
public class SharedSecret {

    private static final String DIGEST_ALGORITHM = "SHA-1";

    private static final String ENCRYPTION_ALGORITHM = "AES";

    private static final int KEY_SIZE = 128;

    private byte[] secret;

    private byte[] digestOfSecret;

    /**
     * Create a new {@link SharedSecret} instance, generating a new secret key.
     * 
     * @see #fromBytes(byte[])
     */
    public SharedSecret() {
        this(null);
    }

    /**
     * Private internal constructor.
     * 
     * @param secret the shared secret or <tt>null</tt> to create a new secret.
     * @see #fromBytes(byte[])
     */
    private SharedSecret(byte[] secret) {
        try {
            this.secret = secret == null ? generateSecret() : secret;
            this.digestOfSecret = calculateDigest(this.secret);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private byte[] generateSecret() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(ENCRYPTION_ALGORITHM);
        keyGenerator.init(KEY_SIZE);
        return keyGenerator.generateKey().getEncoded();
    }

    private byte[] calculateDigest(byte[] bytes) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance(DIGEST_ALGORITHM);
        return messageDigest.digest(bytes);
    }

    /**
     * Encrypt the specified authentication token into a transport token.
     * 
     * @param authenticationToken the authentication token
     * @return a transport token
     */
    public TransportToken encrypt(AuthenticationToken authenticationToken) {
        Assert.notNull(authenticationToken, "AuthenticationToken must not be null");
        byte[] encryptedToken = cipher(Cipher.ENCRYPT_MODE, authenticationToken.getBytes());
        return new TransportToken(this.digestOfSecret, encryptedToken);
    }

    /**
     * Decrypt the specified transport token into an authentication token
     * 
     * @param transportToken the transport token
     * @return a authentication token
     * @throws TransportTokenDigestMismatchException if the digest of the transport token does not match
     */
    public AuthenticationToken decrypt(TransportToken transportToken) throws TransportTokenDigestMismatchException {
        Assert.notNull(transportToken, "TransportToken must not be null");
        if (!transportToken.isDigestMatch(this.digestOfSecret)) {
            throw new TransportTokenDigestMismatchException("The digest of the transport does not match the shared secret");
        }
        byte[] decryptToken = cipher(Cipher.DECRYPT_MODE, transportToken.getEncryptedToken());
        return new AuthenticationToken(decryptToken);
    }

    /**
     * Perform a cipher (encrypt or decrypt) operation.
     * 
     * @param cipherMode the cipher mode (from {@link Cipher})
     * @param bytes the source bytes
     * @return the cipher bytes
     */
    private byte[] cipher(int cipherMode, byte[] bytes) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(this.secret, ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(cipherMode, keySpec);
            return cipher.doFinal(bytes);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    /**
     * @return The secret as a byte array
     * @see #fromBytes(byte[])
     */
    public byte[] getBytes() {
        return this.secret;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + Arrays.hashCode(this.digestOfSecret);
        result = prime * result + Arrays.hashCode(this.secret);
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        SharedSecret other = (SharedSecret) obj;
        return Arrays.equals(this.digestOfSecret, other.digestOfSecret) && Arrays.equals(this.secret, other.secret);
    }

    @Override
    public String toString() {
        return new ToStringCreator(this).append("secret", HexString.toString(getBytes())).toString();
    }

    /**
     * Create a new {@link SharedSecret} instance from the specified bytes.
     * 
     * @param bytes the bytes of the secret
     * @return a new {@link SharedSecret} instance.
     * @see #getBytes()
     */
    public static SharedSecret fromBytes(byte[] bytes) {
        Assert.notNull(bytes, "Bytes must not be null");
        return new SharedSecret(bytes);
    }
}
