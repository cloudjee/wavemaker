package com.wavemaker.tools.data;


import net.sf.cglib.proxy.CallbackFilter;

import java.lang.reflect.Method;

public class CallbackFilterImpl implements CallbackFilter {
    @Override
    public int accept(Method method) {
        return 0;
    }

    @Override
    public boolean equals(Object o) {
        return false;
    }
}