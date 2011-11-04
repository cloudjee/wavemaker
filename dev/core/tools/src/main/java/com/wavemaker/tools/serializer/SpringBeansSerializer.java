/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.serializer;

import java.io.IOException;

import javax.xml.bind.JAXBException;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * File serializer for Spring config file.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class SpringBeansSerializer implements FileSerializer {

    @Override
    public Object readObject(FileService fileService, Resource file) throws FileSerializerException {
        try {
            return SpringConfigSupport.readBeans(file, fileService);
        } catch (JAXBException e) {
            throw new FileSerializerException(e);
        } catch (IOException e) {
            throw new FileSerializerException(e);
        }
    }

    @Override
    public void writeObject(FileService fileService, Object object, Resource file) throws FileSerializerException {
        try {
            SpringConfigSupport.writeBeans((Beans) object, file, fileService);
        } catch (JAXBException e) {
            throw new FileSerializerException(e);
        } catch (IOException e) {
            throw new FileSerializerException(e);
        }
    }
}
