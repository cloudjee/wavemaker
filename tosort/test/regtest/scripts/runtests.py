#! /usr/bin/env python

# import necessary modules
from os import system
from os import path
from datetime import date


# these variables need to be adjusted:
# bin directory of Squish
squishbin = "/home/reggie/src/squish/bin/"
# directory to which the HTML results should be written
outdir = "/home/reggie/results"
# list of test suites to execute
suites = ["/home/reggie/src/squish/examples/qt3/suite_addressbook_py",
          "/home/reggie/src/squish/examples/qt3/suite_addressbook_js"]
# list of hosts on which the suites should be executed
hosts = ["127.0.0.1"]


# this functions runs the test suite 'suite' on the host 'host' and converts the
# XML result into HTML and saves that to 'htmloutput'
def runTest(suite, host, htmloutput):
    print("run " + suite + " on " + host)
    print(squishbin + "squishrunner --host " + host + " --testsuite " + suite + " --reportgen xml,/tmp/results.xml")
    system(squishbin + "squishrunner --host " + host + " --testsuite " + suite + " --reportgen xml,/tmp/results.xml")
    system(squishbin + "../examples/regressiontesting/xmlresult2html.py /tmp/results.xml >" + htmloutput)


index = "<h2>Test runs on " + str(date.today()) + "</h2>\n<ul>\n"

# loop over all test suites and hosts and call 'runTest'
for s in suites:
    sn = path.basename(s)
    for h in hosts:
        file = outdir + "/" + str(date.today()) + "_" + sn + "_" + h + ".html"
        runTest(s, h, file)
        index += "<li><a href=\"" + file + "\">Suite '" + s + "' on host '" + h + "'</a>\n"

index += "</ul>\n"


# write links to the generated HTML reports into the index.html so one
# can view a summary of all results
if path.isfile(outdir + "/index.html"):
    ifile = open(outdir + "/index.html", "r")
    index += ifile.read()
    ifile.close()

ifile = open(outdir + "/index.html", "w")
ifile.write(index)
ifile.close()



