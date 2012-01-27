
package com.wavemaker.tools.cloudfoundry.util;

/**
 * Exception thrown for strings that are not valid hexadecimal.
 * 
 * @author Phillip Webb
 */
public class HexFormatException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public static final int NO_INDEX = -1;

    private final String hexString;

    private int index = NO_INDEX;

    /**
     * Create a new {@link HexFormatException} instance.
     * 
     * @param message the message
     * @param hexString the hex string
     */
    public HexFormatException(String message, String hexString) {
        super(message);
        this.hexString = hexString;
    }

    /**
     * Create a new {@link HexFormatException} instance.
     * 
     * @param message the message
     * @param hexString the hex string
     * @param index the index where the error occurred or {@link #NO_INDEX}.
     */
    public HexFormatException(String message, String hexString, int index) {
        super(message);
        this.hexString = hexString;
        this.index = index;
    }

    /**
     * Returns the invalid hex that caused the error.
     * 
     * @return The hex string
     */
    public String getHexString() {
        return this.hexString;
    }

    /**
     * Returns the index of the hex string where the 1st error occurs or {@link #NO_INDEX}.
     * 
     * @return the index or {@link #NO_INDEX}
     */
    public int getIndex() {
        return this.index;
    }
}
