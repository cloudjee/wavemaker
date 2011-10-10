/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

/**
 * Contains info on the current version. Assumes versions are of the format: major.minor.revision[releaseStatus], where
 * the release status can be something like ALPHA or BETA.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public class VersionInfo implements Comparable<VersionInfo> {

    private final int major;

    private final int minor;

    private int revision;

    private boolean isRelease;

    private String releaseStatus;

    public VersionInfo(String versionString) {

        int firstDot = versionString.indexOf('.');
        int secondDot = versionString.indexOf('.', firstDot + 1);

        String major = versionString.substring(0, firstDot);
        String minor = versionString.substring(firstDot + 1, secondDot);
        String revisionStatus = versionString.substring(secondDot + 1);

        this.major = Integer.parseInt(major);
        this.minor = Integer.parseInt(minor);

        this.revision = Integer.parseInt(revisionStatus.substring(0, 1));
        for (int i = 1; i < revisionStatus.length(); i++) {

            try {
                this.revision = Integer.parseInt(revisionStatus.substring(0, i));
            } catch (NumberFormatException e) {
                this.releaseStatus = revisionStatus.substring(i - 1);
                break;
            }
        }

        if (null != this.releaseStatus) {
            this.isRelease = false;
        } else {
            this.isRelease = true;
        }
    }

    public int getMajor() {
        return this.major;
    }

    public int getMinor() {
        return this.minor;
    }

    public int getRevision() {
        return this.revision;
    }

    /**
     * Return true iff this is not an alpha or beta release.
     */
    public boolean isRelease() {
        return this.isRelease;
    }

    public String getReleaseStatus() {
        return this.releaseStatus;
    }

    @Override
    public String toString() {
        return this.getMajor() + "." + this.getMinor() + "." + this.getRevision() + (null != this.getReleaseStatus() ? this.getReleaseStatus() : "");
    }

    public int compareTo(VersionInfo o) {

        VersionInfo other = o;

        int majorDiff = this.getMajor() - other.getMajor();
        if (0 != majorDiff) {
            return majorDiff;
        }

        int minorDiff = this.getMinor() - other.getMinor();
        if (0 != minorDiff) {
            return minorDiff;
        }

        int revisionDiff = this.getRevision() - other.getRevision();
        if (0 != revisionDiff) {
            return revisionDiff;
        }

        if (this.isRelease() && other.isRelease()) {
            return 0;
        }

        if (null == this.getReleaseStatus() && null != other.getReleaseStatus()) {
            return 1;
        } else if (null != this.getReleaseStatus() && null == other.getReleaseStatus()) {
            return -1;
        } else {
            return this.getReleaseStatus().compareTo(other.getReleaseStatus());
        }
    }
}
