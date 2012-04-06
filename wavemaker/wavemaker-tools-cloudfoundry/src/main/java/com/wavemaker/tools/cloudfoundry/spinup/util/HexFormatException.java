/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.cloudfoundry.spinup.util;

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
