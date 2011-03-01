/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
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
dojo.provide('wm.base.lib.date');
dojo.require("dojo.date.locale");

wm.convertValueToDate = function(inValue, inParams) {
    if (inValue instanceof Date) return inValue;
	var v = inValue, s = inParams || {selector: "date"};
	if (!v && v !== 0)
	{
		return null;
	}
	else if (Number(v))
	{
		return new Date(Number(v));
	}
	else if (dojo.trim(v.toLowerCase()).indexOf('today') != -1)
	{
		// this block handles cases were user might enter:
		// v = today
		// v = today + 20
		// v = 20 + today
		// case and spaces does not matter.
		if (v.indexOf('+') != -1)
		{
			var range = v.toLowerCase().split('+');
			try
			{
				var date1 = dojo.trim(range[0]);
				var date2 = dojo.trim(range[1]);
				if (date1 == 'today')
				{
					v = dojo.date.add(new Date(),"day",date2*1);
				}
				else
				{
					v = dojo.date.add(new Date(),"day",date1*1);
				}

			}
			catch (e)
			{
				// do nothing and later we will pass default today's date.
			}
		}
		else
		{
			v = new Date();
		}

		return v;
	}

	return v != Number(v) ? dojo.date.locale.parse(v, s) : new Date(Number(v));
}
