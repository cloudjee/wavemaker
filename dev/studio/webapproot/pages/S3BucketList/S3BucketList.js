/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

dojo.declare("S3BucketList", wm.Page, {
  start: function() {
  },
  copyWarButtonClick: function(inSender, inEvent) {
  },
  cancelButtonClick: function(inSender, inEvent) {
    this.owner.owner.dismiss();
  },
  dismissThis: function() {
    this.owner.owner.dismiss();   
  },
  deleteButtonClick: function(inSender, inEvent) {
    
  },
  deleteWarButtonClick: function(inSender, inEvent) {
    
  },
  newButtonClick: function(inSender, inEvent) {
    
  },
  _end: 0
});