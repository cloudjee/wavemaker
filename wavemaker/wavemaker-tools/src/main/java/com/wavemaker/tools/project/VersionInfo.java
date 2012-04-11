/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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
 */
public class VersionInfo implements Comparable<VersionInfo> {

    private final int major;

    private final int minor;

    private int revision;

    private String remainder;

    public VersionInfo(String versionString) {

        // Handle eclipse version
        if ("${project.version}".equals(versionString)) {
            versionString = "1000.0.0.BUILD-SNAPSHOT";
        }

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
                this.remainder = revisionStatus.substring(i - 1);
                break;
            }
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
        return this.remainder == null || ".RELEASE".equals(this.remainder);
    }

    public String getReleaseStatus() {
        if (this.remainder != null && this.remainder.startsWith(".")) {
            return this.remainder.substring(1);
        }
        return this.remainder;
    }

    @Override
    public String toString() {
        return this.getMajor() + "." + this.getMinor() + "." + this.getRevision() + (this.remainder != null ? this.remainder : "");
    }

    @Override
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

        if (this.getReleaseStatus() == null && other.getReleaseStatus() != null) {
            return 1;
        } else if (this.getReleaseStatus() != null && other.getReleaseStatus() == null) {
            return -1;
        } else {
            return this.getReleaseStatus().compareTo(other.getReleaseStatus());
        }
    }
}
