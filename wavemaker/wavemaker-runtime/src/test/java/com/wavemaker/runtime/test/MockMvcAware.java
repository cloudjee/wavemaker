
package com.wavemaker.runtime.test;

import org.springframework.test.web.server.MockMvc;

public interface MockMvcAware {

    public void setMockMvc(MockMvc mockMvc);
}
