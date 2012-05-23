
package com.wavemaker.tools.io.store;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;

public interface FolderStore extends ResourceStore {

    Resource getExisting(JailedResourcePath path);

    Folder getFolder(JailedResourcePath path);

    File getFile(JailedResourcePath path);

    Iterable<String> list();
}