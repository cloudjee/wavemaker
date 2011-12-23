#!/usr/bin/python
#
# markup .java & .js files with licensing & copyrights - updates them to the
# current ASL license.
#
# $Id$
#

import datetime, re, sys, os

reflags = re.DOTALL

extensions = ['java', 'js']

current_year = str(datetime.date.today().year)
year_token = "@YEAR@"
current_header = """/*
 *  Copyright (C) """+year_token+""" WaveMaker Software, Inc.
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
"""


year_regex = """(?P<year>\d{4}|\d{4}\-\d{4})"""

# each potential header gets a regex; we match this, and replace it with the
# current_header
re_headers = [
		# old header & year regex
		re.compile("""(?P<all>/\*.*
 \* @copyright \(c\) """+year_regex+""" ActiveGrid, Inc.
 \* @license   ASL 2.0  http://apache.org/licenses/LICENSE-2.0
 \*/\s*)""", reflags),
		re.compile("""(?P<all>/\*.*
 \* Copyright \(C\) """+year_regex+""" WaveMaker Software\, Inc\.
 \*
 \* This file is part of WaveMaker Studio.
 \*
 \* WaveMaker Studio is free software: you can redistribute it and/or modify
 \* it under the terms of the GNU Affero General Public License as published by
 \* the Free Software Foundation\, version 3 of the License, only.
 \*
 \* WaveMaker Studio is distributed in the hope that it will be useful\,
 \* but WITHOUT ANY WARRANTY\; without even the implied warranty of
 \* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE\.  See the
 \* GNU Affero General Public License for more details\.
 \*
 \* You should have received a copy of the GNU Affero General Public License
 \* along with WaveMaker Studio\.  If not, see \<http://www.gnu.org/licenses/\>\.
 \*/\s*)""", reflags),
		re.compile("""(?P<all>/\*.*
 \*  Copyright \(C\) """+year_regex+""" WaveMaker Software\, Inc\.
 \*
 \*  This file is part of the WaveMaker Client Runtime\.
 \*
 \*  Licensed under the Apache License, Version 2\.0 \(the "License"\)\;
 \*  you may not use this file except in compliance with the License.
 \*  You may obtain a copy of the License at
 \*
 \*      http://www.apache.org/licenses/LICENSE-2\.0
 \*
 \*  Unless required by applicable law or agreed to in writing, software
 \*  distributed under the License is distributed on an "AS IS" BASIS\,
 \*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND\, either express or implied\.
 \*  See the License for the specific language governing permissions and
 \*  limitations under the License\.
 \*/\s*)""", reflags),
]

def getyears(current_years, matched_years):
	if current_years==matched_years:
		return current_years
	years = []

	if -1!=current_years.find('-'):
		years += [int(current_years.split('-')[0]),
				int(current_years.split('-')[1])]
	else:
		years += [int(current_years)]
	if -1!=matched_years.find('-'):
		years += [int(matched_years.split('-')[0]),
				int(matched_years.split('-')[1])]
	else:
		years += [int(matched_years)]
	
	gyear = max(years)
	lyear = min(years)

	if gyear==lyear:
		return str(gyear)
	else:
		return '%s-%s' % (lyear, gyear)



def dostuff(file):
	fd = open(file, 'r')
	contents = fd.read()
	fd.close()
	years = current_year

	# print 'c: %s' % contents
	for reh in re_headers:
		match = reh.search(contents)
		if match:
			print 'found: %s,\n\n%s' % (match.group('all'), match.group('year'))
			years = getyears(years, match.group('year'))
			contents = contents.replace(match.group('all'), '')
	print 'years: %s, %s' % (year_token, years,)
	current_header_replaced = current_header.replace(year_token, years)
	contents = '%s%s' % (current_header_replaced, contents)

	fd = open(file, 'w')
	fd.write(contents)
	fd.close()


def walk(dir):
	for root, dirs, files in os.walk(dir):
		if '.svn' in dirs:
			dirs.remove('.svn')
		for file in files:
			if file.split('.')[-1].lower() in extensions:
				print '%s' % os.path.join(root, file)
				dostuff(os.path.join(root, file))
	

def main():
	reg = re.compile(".* (?P<year>\d{4}|\d{4}\-\d{4}) .*")
	
	mo = reg.search("foo foo 2007 bar bar")
	print 'hi: %s, %s' % (mo, mo.group('year'))
	mo = reg.search("foo foo 2007-2008 bar bar")
	print 'hi: %s, %s' % (mo, mo.group('year'))

	print 'sys: %s, %s' % (sys, sys.argv)

	dirs = sys.argv[1:]
	for dir in dirs:
		walk(dir)

if __name__=='__main__':
	main()
