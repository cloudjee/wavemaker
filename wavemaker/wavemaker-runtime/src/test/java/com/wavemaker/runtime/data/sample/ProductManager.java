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

import java.io.Serializable;
import java.util.List;

public class ProductManager implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Product> products;

    public void setProducts(List<Product> p) {
        this.products = p;
    }

    public void addProduct(Product p) {
        this.products.add(p);
    }

    public List<Product> getProducts() {
        return this.products;
    }

    public void increasePrice(int pct) {

        for (Product p : this.products) {
            double newPrice = p.getPrice().doubleValue() * (100 + pct) / 100;
            p.setPrice(new Double(newPrice));
        }

    }
}