/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data.sample.sakila;

import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.QueryOptions;

import java.util.Date;
import java.util.List;

public class Sakila2Extension extends Sakila {

    public Sakila2Extension() {}

    public Sakila2Extension(DataServiceManager ds) {
        super(ds);
    }

    public Actor getActorById(Short id) {
        return super.getActorById(id);
    }    

    public List<Actor> getActorList(Actor qbeInstance, 
                                    QueryOptions queryOptions) 
    {
        return super.getActorList(qbeInstance, queryOptions);
    }

    public void updateActor(Actor actor) {
        actor.setLastUpdate(new Date());
        super.updateActor(actor);
    }    
}
