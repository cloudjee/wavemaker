/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

public class SampleProductService {

    // public interface; this is the actual class
    public Product[] getProducts() {

        return this.prodMan.getProducts().toArray(new Product[] {});
    }

    public Product getProduct(int id) {

        Product[] prods = this.prodMan.getProducts().toArray(new Product[] {});

        for (int i = 0; i < prods.length; i++) {
            if (prods[i].getId() == id) {
                return prods[i];
            }
        }

        return null;
    }

    /**
     * Sample testing method; returns the product passed in as a parameter.
     * 
     * @param p
     * @return
     */
    public Product retProduct(Product p) {
        return p;
    }

    // bean actions below here; just to get the data in through Spring
    private ProductManager prodMan;

    public void setProductManager(ProductManager pm) {
        this.prodMan = pm;
    }

    public ProductManager getProductManager() {
        return this.prodMan;
    }

}
