
package com.wavemaker.tools.filesystem.impl;


public interface FileSystem<R> {

    boolean exists(R root, Path path);

    void deleteFolder(R root, Path path);

    void mkDirs(R root, Path path);

}
