
package com.wavemaker.tools.compiler.io;

import javax.lang.model.element.Modifier;
import javax.lang.model.element.NestingKind;
import javax.tools.JavaFileObject;

import com.wavemaker.tools.io.File;

public class ResourceJavaFileObject extends ResourceFileObject implements JavaFileObject {

    private final Kind kind;

    public ResourceJavaFileObject(File file, Kind kind) {
        super(file);
        this.kind = kind;
    }

    @Override
    public Kind getKind() {
        return this.kind;
    }

    @Override
    public boolean isNameCompatible(String simpleName, Kind kind) {
        String name = simpleName + kind.extension;
        return kind.equals(getKind()) && getFile().getName().equals(name);
    }

    @Override
    public NestingKind getNestingKind() {
        return null;
    }

    @Override
    public Modifier getAccessLevel() {
        return null;
    }
}
