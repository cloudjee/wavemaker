#! /usr/bin/env python

import xml.dom.minidom
import datetime

# The following HTML snippets can be modified to customize the look of the
# resulting page. The script substitutes the "%(title)s" parts with the data
# from the XML testresults.
htmlHeader = """\
<html>
    <head>
        <title>%(title)s</title>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    </head>
    <body>
"""

htmlFooter = """\
    </body>
</html>
"""

htmlSummary = """\
<h1>Summary</h1>
<table border="0" cellpadding="3">
    <tr>
        <td>Test cases</td><td>%(testcases)s</td>
    </tr>
    <tr>
        <td>Tests</td><td>%(tests)s</td>
    </tr>
    <tr>
        <td>Passes</td><td>%(passes)s (including %(expected_fails)s
                           expected failures)</td>
    </tr>
    <tr>
        <td>Fails</td><td>%(fails)s (including %(unexpected_passes)s
                          unexpected passes)</td>
    </tr>
    <tr>
        <td>Errors</td><td>%(errors)s</td>
    </tr>
    <tr>
        <td>Fatals</td><td>%(fatals)s</td>
    </tr>
</table>
<h1>Results</h1>
"""

htmlResultsBegin = """\
<p><b>%(filename)s</b></p>
<table border="0" cellpadding="3" width="100%%">
"""

htmlResultsEnd = """\
</table>
"""

htmlResults = {}
htmlResults['PASS'] = """\
<tr bgcolor="#80FF80">
    <td>%(result)s</td>
    <td>%(time)s</td>
    <td>%(line)s</td>
    <td>%(message)s</td>
    <td>%(detail)s</td>
</tr>
"""
htmlResults['XFAIL'] = htmlResults['PASS']
htmlResults['FAIL'] = """\
<tr bgcolor="#FF8080">
    <td>%(result)s</td>
    <td>%(time)s</td>
    <td>%(line)s</td>
    <td>%(message)s</td>
    <td>%(detail)s</td>
</tr>
"""
htmlResults['XPASS'] = htmlResults['FAIL']
htmlResults['ERROR'] = htmlResults['FAIL']
htmlResults['FATAL'] = htmlResults['FAIL']
htmlResults['default'] = """\
<tr bgcolor="#EEEEEE">
    <td>%(result)s</td>
    <td>%(time)s</td>
    <td>%(line)s</td>
    <td>%(message)s</td>
    <td>%(detail)s</td>
</tr>
"""

class ResultParser:
    """This class parses one XML test result file and stores it in Python
    structures. The attribute summary is a Python dictionary with the summary
    of the test result file. The attribute details is a list of dictionaries
    for the detailed test results."""
    def __init__(self, filename):
        self.filename = filename
        self.summary = {'testcases':         0,
                        'tests':             0,
                        'passes':            0,
                        'fails':             0,
                        'errors':            0,
                        'fatals':            0,
                        'unexpected_passes': 0,
                        'expected_fails':    0,
                        }
        self.details = []

        # parse the document
        doc = xml.dom.minidom.parse(filename)
        self.__walkNodes(doc)
        doc.unlink()

    def __walkNodes(self, node):
        """This private function walks each node in the document and processes
        the node. The walk is depth first recursive."""
        if node.nodeName == 'summary':
            for attr in self.summary.keys():
                if attr in node.attributes.keys():
                    self.summary[attr] = int(node.getAttribute(attr))
        elif node.nodeName == 'testresult':
            result = {'result':  '',
                      'time':    '',
                      'line':    '',
                      'message': '',
                      'detail':  '',
                      }
            if node.firstChild:
                result['detail'] = node.firstChild.nodeValue. \
                                   replace('\\n', '\n'). \
                                   replace('\\t', '\t')
            for attr in node.attributes.keys():
                if attr == 'time':
                    str = node.getAttribute(attr)
                    dt = str.replace('T', ' '). \
                             replace('-', ' '). \
                             replace(':', ' ').split()
                    if len(dt) == 6:
                        result[attr] = datetime.datetime(int(dt[0]), int(dt[1]),
                                                         int(dt[2]), int(dt[3]),
                                                         int(dt[4]), int(dt[5]))
                    else:
                        result[attr] = ''
                else:
                    result[attr] = node.getAttribute(attr)
            self.details.append(result)
        # walk child nodes
        child = node.firstChild
        while child:
            self.__walkNodes(child)
            child = child.nextSibling

class HtmlConverter:
    """This class converts a list of test results (as ResultParser objects) to
    HTML. The attribute html contains the HTML version of the converted
    results."""
    def __init__(self, title, results):
        summary = {'testcases':         0,
                   'tests':             0,
                   'passes':            0,
                   'fails':             0,
                   'errors':            0,
                   'fatals':            0,
                   'unexpected_passes': 0,
                   'expected_fails':    0,
                   }
        detailsHtml = ''
        for r in results:
            # aggregate the keys of the summary
            for attr in summary.keys():
                summary[attr] += r.summary.get(attr, 0)

            # convert the details to HTML
            detailsHtml += htmlResultsBegin % {'filename': r.filename}
            for d in r.details:
                # escape &, <, > and convert newlines and tab to HTML
                d['detail'] = d['detail']. \
                              replace('&', '&amp;'). \
                              replace('<', '&lt;').replace('>', '&gt;'). \
                              replace('\n', '<br>').replace('\t', '&nbsp;'*4)
                detailsHtml += htmlResults.get(d['result'],
                                               htmlResults['default']) % d
            detailsHtml += htmlResultsEnd

        # put the parts together to one HTML document
        self.html  = htmlHeader % {'title': title} + \
                     htmlSummary % summary + \
                     detailsHtml + \
                     htmlFooter

if __name__ == '__main__':
    """The following code is executed if this script was called from the
    commandline."""

    import sys
    # open input file
    if len(sys.argv) < 2:
        raise RuntimeError, 'Missing a file name argument'

    # parse the XML files
    title = ''
    results = []
    for filename in sys.argv[1:]:
        title += filename + ' '
        results.append(ResultParser(filename))

    # convert the result to HTML
    converter = HtmlConverter(title, results)
    print converter.html.encode('utf-8')
