/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.data.sample;

import java.util.List;

import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.events.ServletEventListener;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author Matt Small
 */
public class SampleProductServiceEventListener implements ServletEventListener {

    private final Product p;

    public SampleProductServiceEventListener() {

        this.p = new Product("pmelProduct", 12399.8, 10);
    }

    @Override
    public void endRequest(ServiceWire serviceWire) {

        Object service = ((ReflectServiceWire) serviceWire).getServiceBean();

        ProductManager pm = ((SampleProductService) service).getProductManager();

        List<Product> products = pm.getProducts();
        products.remove(this.p);
        pm.setProducts(products);
    }

    @Override
    public void startRequest(ServiceWire serviceWire) {

        Object service = ((ReflectServiceWire) serviceWire).getServiceBean();

        ProductManager pm = ((SampleProductService) service).getProductManager();

        pm.addProduct(this.p);
    }

}
