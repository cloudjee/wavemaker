/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.data;

/**
 * session-per-conversation with
 * 
 * hibernate.current_session_context_class=managed
 * 
 * The bind/unbind calls are only for getting SessionFactory.getCurrentSession to work. Since we keep track of the
 * session and never access it through those calls, we don't really need to call bind/unbind. However, if we expose the
 * Hibernate API to our users, we better make sure getCurrentSession works as expected.
 * 
 * @author Simon Toens
 */
public class ConversationSessionMgr {

    // private Session session = null;
    //
    // private SessionFactory factory = null;
    //
    // private final HibernateConfigurationManager confMgr;
    //
    // ConversationSessionMgr(HibernateConfigurationManager confMgr) {
    // this.confMgr = confMgr;
    // }
    //
    // public void bind() {
    // if (session == null) {
    // session = getNewSession();
    // session.setFlushMode(FlushMode.MANUAL);
    // }
    //
    // // this cast is annoying
    // ManagedSessionContext.bind((org.hibernate.classic.Session) session);
    //
    // // tx begin reconnects the session
    // }
    //
    // public void unbind() {
    // // tx commit/rollback(?) automatically disconnects the session
    // ManagedSessionContext.unbind(session.getSessionFactory());
    // }
    //
    // public Session getNewSession() {
    // return getSessionFactory().openSession();
    // }
    //
    // public synchronized SessionFactory getSessionFactory() {
    // if (factory == null) {
    // factory = confMgr.getConfiguredConfiguration()
    // .buildSessionFactory();
    // }
    // return factory;
    // }
    //
    // public void closeSession() {
    // session.flush(); // sync with db
    // session.close(); // only calling close would be like a conversation
    // // rollback
    // session = null;
    // }
    //
    // public void dispose() {
    // closeSession();
    // factory.close();
    //
    // }
    //
    // public Session getSession() {
    // if (session == null) {
    // throw new WMRuntimeException("Call bind first");
    // }
    // return session;
    // }

}
