
package com.wavemaker.tools.io.store;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;

public interface ResourceStore {

    JailedResourcePath getPath();

    Folder getParent(JailedResourcePath path);

    boolean exists();

    Resource rename(String name);

    void delete();

    void create();

}
