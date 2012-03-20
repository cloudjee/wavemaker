package com.wavemaker.studio.timeout.monitor;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.util.Assert;

/**
 * {@link HttpServletResponseMonitorFactory} that can be used to create a {@link HttpServletResponseMonitor} that
 * duplicates all calls to another {@link HttpServletResponse} instance.
 * 
 * @author Phillip Webb
 */
public class DuplicatingHttpServletResponseMonitorFactory extends
		BridgedHttpServletResponseMonitorFactory<HttpServletResponseMonitor> {

	private static final List<MethodHandler> METHOD_HANDLERS;
	static {
		METHOD_HANDLERS = new ArrayList<MethodHandler>();
		METHOD_HANDLERS.add(new WriteByteMethodHandler());
		METHOD_HANDLERS.add(new WriteBytesMethodHandler());
		METHOD_HANDLERS.add(new WriteBytesWithOffsetMethodHandler());
		METHOD_HANDLERS.add(new EqualsMethodHandler());
		METHOD_HANDLERS.add(new HashCodeMethodHandler());
		METHOD_HANDLERS.add(new ToStringMethodHandler());
		METHOD_HANDLERS.add(new DirectlyMappedMethodHandler());
	}

	private HttpServletResponse response;

	public DuplicatingHttpServletResponseMonitorFactory(HttpServletResponse response) {
		Assert.notNull(response, "Response must not be null");
		this.response = response;
	}

	@Override
	protected Collection<MethodHandler> getMethodHandlers() {
		return METHOD_HANDLERS;
	}

	@Override
	protected HttpServletResponseBridge newResponseBridge() {
		return new DuplicatingHttpServletResponseBridge();
	}

	private class DuplicatingHttpServletResponseBridge implements HttpServletResponseBridge {

		public void invoke(Method method, Object[] args) throws Throwable {
			method.invoke(DuplicatingHttpServletResponseMonitorFactory.this.response, args);
		}

		public OutputStream getOutputStream() throws IOException {
			return DuplicatingHttpServletResponseMonitorFactory.this.response.getOutputStream();
		}
	}

}
