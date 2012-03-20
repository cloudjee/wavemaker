package com.wavemaker.studio.timeout.monitor;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.ReflectionUtils.MethodCallback;

/**
 * Base of any {@link HttpServletResponseMonitorFactory} that eventually provides a bridge back to a native
 * {@link HttpServletResponse}.
 * 
 * @param <T> The {@link HttpServletResponseMonitor} type
 * @see ReplayableHttpServletResponseMonitorFactory
 * @see DuplicatingHttpServletResponseMonitorFactory
 * 
 * @author Phillip Webb
 */
public abstract class BridgedHttpServletResponseMonitorFactory<T extends HttpServletResponseMonitor> implements
		HttpServletResponseMonitorFactory<T> {

	@SuppressWarnings("unchecked")
	public T getMonitor() {
		return (T) Proxy.newProxyInstance(getClass().getClassLoader(), new Class<?>[] { getProxyClass() },
				new InvocationHandlerImpl());
	}

	@SuppressWarnings("unchecked")
	protected Class<? extends T> getProxyClass() {
		return (Class<? extends T>) GenericTypeResolver.resolveTypeArgument(getClass(),
				BridgedHttpServletResponseMonitorFactory.class);
	}

	protected abstract Collection<MethodHandler> getMethodHandlers();

	protected abstract HttpServletResponseBridge newResponseBridge();

	/**
	 * Proxy {@link InvocationHandler} used to implement {@link ReplayableHttpServletResponseMonitor}.
	 */
	private class InvocationHandlerImpl implements InvocationHandler {

		private HttpServletResponseBridge bridge = newResponseBridge();

		public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
			MethodHandler methodHandler = getMethodHandler(method);
			return methodHandler.invoke(this.bridge, proxy, method, args);
		}

		private MethodHandler getMethodHandler(Method method) {
			for (MethodHandler methodHandler : getMethodHandlers()) {
				if (methodHandler.canHandle(method)) {
					return methodHandler;
				}
			}
			throw new UnsupportedOperationException("Unsupported method " + method.getName());
		}
	}

	protected static interface HttpServletResponseBridge {

		void invoke(Method method, Object[] args) throws Throwable;

		OutputStream getOutputStream() throws IOException;

	}

	/**
	 * Strategy interface used by the invocation handler to handle method calls.
	 */
	protected static interface MethodHandler {

		boolean canHandle(Method method);

		Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args) throws Throwable;
	}

	/**
	 * Convenient based class for {@link MethodHandler} implementations.
	 */
	protected static abstract class AbstractMethodHandler implements MethodHandler {

		private String methodName;
		private Class<?>[] params;

		public AbstractMethodHandler(String methodName, Class<?>... params) {
			this.methodName = methodName;
			this.params = params;
		}

		public boolean canHandle(Method method) {
			return method.getName().equals(this.methodName) && Arrays.equals(method.getParameterTypes(), this.params);
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link HttpServletResponseMonitor#write(int)}.
	 */
	protected static class WriteByteMethodHandler extends AbstractMethodHandler {

		public WriteByteMethodHandler() {
			super("write", int.class);
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			bridge.getOutputStream().write((Integer) args[0]);
			return null;
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link HttpServletResponseMonitor#write(byte[])}.
	 */
	protected static class WriteBytesMethodHandler extends AbstractMethodHandler {

		public WriteBytesMethodHandler() {
			super("write", byte[].class);
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			bridge.getOutputStream().write((byte[]) args[0]);
			return null;
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link HttpServletResponseMonitor#write(byte[], int, int)}.
	 */
	protected static class WriteBytesWithOffsetMethodHandler extends AbstractMethodHandler {

		public WriteBytesWithOffsetMethodHandler() {
			super("write", byte[].class, int.class, int.class);
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			bridge.getOutputStream().write((byte[]) args[0], (Integer) args[1], (Integer) args[2]);
			return null;
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link Object#equals(Object)}.
	 */
	protected static class EqualsMethodHandler extends AbstractMethodHandler {

		public EqualsMethodHandler() {
			super("equals", Object.class);
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			return proxy == args[0];
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link Object#hashCode()}.
	 */
	protected static class HashCodeMethodHandler extends AbstractMethodHandler {
		public HashCodeMethodHandler() {
			super("hashCode");
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			return new Integer(System.identityHashCode(proxy));
		}
	}

	/**
	 * {@link MethodHandler} to deal with {@link Object#toString()}.
	 */
	protected static class ToStringMethodHandler extends AbstractMethodHandler {

		public ToStringMethodHandler() {
			super("toString");
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			return proxy.getClass().getName() + '@' + Integer.toHexString(proxy.hashCode());
		}
	}

	/**
	 * {@link MethodHandler} to deal with all {@link HttpServletResponseMonitor} methods that can be directly mapped to
	 * {@link HttpServletResponse}.
	 */
	protected static class DirectlyMappedMethodHandler implements MethodHandler {

		private static final Map<Method, Method> MAPPINGS;
		static {
			MAPPINGS = new HashMap<Method, Method>();
			ReflectionUtils.doWithMethods(ReplayableHttpServletResponseMonitor.class, new MethodCallback() {

				public void doWith(Method method) throws IllegalArgumentException, IllegalAccessException {
					Method foundMethod = ReflectionUtils.findMethod(HttpServletResponse.class, method.getName(),
							method.getParameterTypes());
					if (foundMethod != null) {
						MAPPINGS.put(method, foundMethod);
					}
				}
			});
		}

		public boolean canHandle(Method method) {
			return MAPPINGS.containsKey(method);
		}

		public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args)
				throws Throwable {
			bridge.invoke(MAPPINGS.get(method), args);
			return null;
		}
	}
}
