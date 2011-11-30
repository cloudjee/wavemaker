
package org.cloudfoundry.spinup.util;

public class HexFormatException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public static final int NO_INDEX = -1;

    private final String hexString;

    private int index = NO_INDEX;

    public HexFormatException(String message, String hexString) {
        super(message);
        this.hexString = hexString;
    }

    public HexFormatException(String message, String hexString, int index) {
        super(message);
        this.hexString = hexString;
        this.index = index;
    }

    public String getHexString() {
        return this.hexString;
    }

    public int getIndex() {
        return this.index;
    }
}
