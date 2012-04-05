
package com.wavemaker.tools.cloudfoundry.timeout;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpRequest;
import org.springframework.util.StringUtils;

/**
 * Encapsulates details of a {@link HttpRequest} that includes a Cloud Foundry timeout protection header.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionHttpRequest {

    /**
     * The type of request.
     */
    public enum Type {
        /**
         * The initial request.
         */
        INITIAL_REQUEST(TimeoutProtectionHttpHeader.INITIAL_REQUEST),

        /**
         * A poll request initiated following a timeout.
         */
        POLL(TimeoutProtectionHttpHeader.POLL);

        private String value;

        private Type(String header) {
            this.value = header;
        }

        String getUid(HttpServletRequest request) {
            return request.getHeader(this.value);
        }

        public String value() {
            return this.value;
        }
    }

    private final HttpServletRequest request;

    private final Type type;

    private final String uid;

    /**
     * Private constructor. Use {@link #get(ServletRequest)}.
     * 
     * @param request the request
     * @param type the type
     * @param uid the uid
     */
    private TimeoutProtectionHttpRequest(HttpServletRequest request, Type type, String uid) {
        this.request = request;
        this.type = type;
        this.uid = uid;
    }

    /**
     * Returns the underling HTTP request used when {@link #get(ServletRequest) getting} this instance.
     * 
     * @return the request
     */
    public HttpServletRequest getServletRequest() {
        return this.request;
    }

    /**
     * Return the type of request (never <tt>null</tt>).
     * 
     * @return the type of request
     */
    public Type getType() {
        return this.type;
    }

    /**
     * Return the unique ID of the request.
     * 
     * @return the uid.
     */
    public String getUid() {
        return this.uid;
    }

    /**
     * Create a {@link TimeoutProtectionHttpRequest} from the specified {@link ServletRequest} or return <tt>null</tt>
     * if not possible.
     * 
     * @param request the request
     * @return a {@link TimeoutProtectionHttpRequest} or <tt>null</tt>
     */
    public static TimeoutProtectionHttpRequest get(ServletRequest request) {
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpServletRequest = (HttpServletRequest) request;
            for (Type type : Type.values()) {
                String uid = type.getUid(httpServletRequest);
                if (StringUtils.hasLength(uid)) {
                    return new TimeoutProtectionHttpRequest(httpServletRequest, type, uid);
                }
            }
        }
        return null;
    }
}
