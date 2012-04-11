/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudfoundry.timeout.monitor;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

/**
 * {@link HttpServletResponseMonitorFactory} that can be used to create a {@link ReplayableHttpServletResponseMonitor}
 * instance. The {@link ReplayableHttpServletResponseMonitor#getReplayableResponse() responses} returned by this
 * Implementation are {@link Serializable}.
 * 
 * @author Phillip Webb
 */
public class ReplayableHttpServletResponseMonitorFactory extends BridgedHttpServletResponseMonitorFactory {

    private static final List<MethodHandler> METHOD_HANDLERS;
    static {
        METHOD_HANDLERS = new ArrayList<MethodHandler>();
        METHOD_HANDLERS.add(new WriteByteMethodHandler());
        METHOD_HANDLERS.add(new WriteBytesMethodHandler());
        METHOD_HANDLERS.add(new WriteBytesWithOffsetMethodHandler());
        METHOD_HANDLERS.add(new ReplayMethodHandler());
        METHOD_HANDLERS.add(new EqualsMethodHandler());
        METHOD_HANDLERS.add(new HashCodeMethodHandler());
        METHOD_HANDLERS.add(new ToStringMethodHandler());
        METHOD_HANDLERS.add(new DirectlyMappedMethodHandler());
    }

    @Override
    protected Class<?> getProxyClass() {
        return ReplayableHttpServletResponseMonitor.class;
    }

    @Override
    public ReplayableHttpServletResponseMonitor getMonitor() {
        return (ReplayableHttpServletResponseMonitor) super.getMonitor();
    }

    @Override
    protected Collection<MethodHandler> getMethodHandlers() {
        return METHOD_HANDLERS;
    }

    @Override
    protected HttpServletResponseBridge newResponseBridge() {
        return new ReplayableHttpServletResponseImpl();
    }

    /**
     * Stores invocations that can subsequently be replayed. Method invocations will be stored and replayed in the order
     * that they happen with the exception of {@link OutputStream} <tt>write</tt> methods, these will be collated into a
     * single write operation.
     */
    private static class ReplayableHttpServletResponseImpl implements ReplayableHttpServletResponse, HttpServletResponseBridge, Serializable {

        private static final long serialVersionUID = 1L;

        private final List<ReplayableInvocation> replayableInvocations = new ArrayList<ReplayableInvocation>();

        /**
         * Provides access to the single output stream invocation. This will be lazily created when need and will also
         * appear as an entry in {@link #replayableInvocations}.
         */
        private ReplayableOutputStreamInvocation outputStreamInvocation;

        @Override
        public void invoke(Method method, Object[] args) throws Throwable {
            Assert.isTrue(method.getDeclaringClass().isAssignableFrom(HttpServletResponse.class), "Method must be from HttpServletResponse");
            this.replayableInvocations.add(new ReplayableMethodInvocation(method, args));
        }

        /**
         * Returns a previously create {@link OutputStream} or records an invocation and returns a new
         * {@link OutputStream}.
         * 
         * @return the output stream
         */
        @Override
        public OutputStream getOutputStream() throws IOException {
            if (this.outputStreamInvocation == null) {
                this.outputStreamInvocation = new ReplayableOutputStreamInvocation();
                this.replayableInvocations.add(this.outputStreamInvocation);
            }
            return this.outputStreamInvocation.getOutputStream();
        }

        /**
         * Replay all invocations to the specified response.
         * 
         * @param response the response used to replay invocation
         * @throws IOException
         */
        @Override
        public void replay(HttpServletResponse response) throws IOException {
            for (ReplayableInvocation replayableInvocation : this.replayableInvocations) {
                replayableInvocation.replay(response);
            }
        }
    }

    /**
     * A single {@link ReplayableInvocation}.
     */
    private static interface ReplayableInvocation extends Serializable {

        /**
         * Replay the invocation
         * 
         * @param response the response used to replay invocation
         * @throws IOException
         */
        void replay(HttpServletResponse response) throws IOException;
    }

    /**
     * A {@link ReplayableInvocation} for a method call.
     */
    private static class ReplayableMethodInvocation implements ReplayableInvocation {

        private static final long serialVersionUID = 1L;

        private final Method method;

        private final Object[] args;

        public ReplayableMethodInvocation(Method method, Object[] args) {
            this.method = method;
            this.args = args;
        }

        @Override
        public void replay(HttpServletResponse response) {
            try {
                this.method.invoke(response, this.args);
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        }
    }

    /**
     * A {@link ReplayableInvocation} for {@link OutputStream} <tt>write</tt> operations.
     */
    private static class ReplayableOutputStreamInvocation implements ReplayableInvocation {

        private static final long serialVersionUID = 1L;

        private transient ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        public OutputStream getOutputStream() {
            return this.outputStream;
        }

        @Override
        public void replay(HttpServletResponse response) throws IOException {
            ServletOutputStream servletOutputStream = response.getOutputStream();
            FileCopyUtils.copy(this.outputStream.toByteArray(), servletOutputStream);
            servletOutputStream.flush();
        }

        private void writeObject(ObjectOutputStream objectOutputStream) throws IOException {
            objectOutputStream.defaultWriteObject();
            byte[] bytes = this.outputStream.toByteArray();
            objectOutputStream.writeObject(bytes);
        }

        private void readObject(ObjectInputStream objectInputStream) throws ClassNotFoundException, IOException {
            objectInputStream.defaultReadObject();
            byte[] bytes = (byte[]) objectInputStream.readObject();
            this.outputStream = new ByteArrayOutputStream(bytes.length);
            this.outputStream.write(bytes);
        }
    }

    /**
     * {@link MethodHandler} to deal with {@link ReplayableHttpServletResponseMonitor#replay(HttpServletResponse)}.
     */
    private static class ReplayMethodHandler extends AbstractMethodHandler {

        public ReplayMethodHandler() {
            super("getReplayableResponse");
        }

        @Override
        public Object invoke(HttpServletResponseBridge bridge, Object proxy, Method method, Object[] args) throws Throwable {
            return bridge;
        }
    }
}
