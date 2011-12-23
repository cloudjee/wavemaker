#!/usr/bin/python
#
# $Rev$ - $Date$
# $Id$
#

import os
import sys
import stat

def writeLine(file):

    st = os.lstat(file)
    mode = stat.S_IMODE(st.st_mode)

    if (stat.S_ISLNK(st.st_mode)):
        print "links not supported"
        sys.exit(1)
        # fullpath = os.path.realpath(os.path.join(os.getcwd(), file))
        # realcwd = os.path.realpath(os.getcwd())
        # linkto = fullpath.replace(realcwd, '')
        # if linkto.startswith(os.sep):
        #     linkto = linkto[1:]
        # fileType = "l"
    elif (stat.S_ISDIR(st.st_mode)):
        fileType = "%dir "
    elif (stat.S_ISREG(st.st_mode)):
        fileType = ""
    else:
        print "unknown ftype"
        sys.exit(2)

    # ensure that everyone can read/execute every file
    if mode & 0100:
        mode |= 0555
    else:
        mode |= 0444
    
    destFile = '"%s%s"' % (os.sep, file)
    print '%%attr(%o,root,root) %s%s' % (mode, fileType, destFile)


def main():
    for root, dirs, files in os.walk(sys.argv[1], topdown=True):
        writeLine(root)

        for dir in dirs:
            filename=os.path.join(root, dir)
            if (os.path.islink(filename)):
                print 'found link'
                files += dir

        for file in files:
            writeLine(root+os.sep+file)

if __name__ == "__main__":
    main()
