#!/usr/bin/perl

########################################################################################################################
# INSTRUCTIONS
# MODE 1: CHECK A FOLDER (NOTE: This WILL modify files! Read the notes below before running; run svn diff AFTER running)
# perl findFilesNeedingLicenses.pl path-to-folder
#    if no path specified, searches the current folder.
#    Running this has the following actions:
#    1. Find any .js and .java file with a wavemaker copyright that doesn't indicate 2011 and updates it to 2011
#    2. Find any .js and .java file that looks like it has a non-wavemaker copyright and lists it for your review
#    3. Find any .js and .java file that lacks a copyright and prints it out so that you can figure out which
#       folders need which copyrights, and run the script in MODE #2
#
# MODE 2: ADD COPYRIGHTS
# perl findFilesNeedingLicenses.pl path-to-folder path-to-copyright
#     - If you want to run on your current directory, you will have to use ".", you can't just leave out that parameter.
#     Running this has the following actions
#    1. Find any .js and .java file with a wavemaker copyright that doesn't indicate 2011 and updates it to 2011
#    2. Find any .js and .java file that looks like it has a non-wavemaker copyright and lists it for your review
#    3. Update any .js and .java file that lacks a copyright (any file that was listed when running in MODE #1)
########################################################################################################################

my $folder = $ARGV[0] || ".";
my $copyright = $ARGV[1] || "";

@FOREIGN = ();

sub searchFolder{ 
  my ($folder,$copyright)  = @_;
  my @files = `ls -1 $folder`;
  chomp(@files);

  foreach $file (@files) {
    $file = $folder . "/" . $file;
    if (-d $file) {
      &searchFolder($file, $copyright);
    } elsif ($file =~ /\.(js|java|css)$/ && $file !~ /\/dojo\// && $file !~ /\/test\// && $file !~ /\/build\//) {
      &searchFile($file, $copyright);
    }
  }
}

sub searchFile {
  my($file, $copyright) = @_;

  if ($file =~ /\/ace/ || $file =~ /\/jsdoc-toolkit/) {
    return;
  }

  my $f = `cat $file`;

 if ($f =~ /Copyright \(C\) 20(\d\d)\-20\d\d (Infoteria Corporation and )?VMware/) {
    $f =~ s/Copyright \(C\) 20(\d\d)\-20\d\d (Infoteria Corporation and )?VMware/Copyright (C) 20$1-2012 ${2}VMware/;
    open(FILE, ">$file");
    print FILE $f;
    close(FILE);
  } elsif ($f =~ /Copyright \(C\) 20(\d\d) (Infoteria Corporation and )?VMware/ && $f !~ /Copyright \(C\) 2012 (Infoteria Corporation and )?VMware/) {
    $f =~ s/Copyright \(C\) 20(\d\d) (Infoteria Corporation and )?VMware/Copyright (C) 20$1-2012 ${2}VMware/;
    open(FILE, ">$file");
    print FILE $f;
    close(FILE);
  } elsif ($f =~ /Copyright \(C\) (\d+\-)?2012 VMware/) {
    ;
  } elsif ($f =~ /(Copyright .*)/) {
    push(@FOREIGN, "$file has foreign copyright: $1");
  } elsif ($f =~ /(Released under .*)/) {
    push(@FOREIGN, "$file has foreign copyright: $1");
  } elsif ($f =~ /(license .*)/) {
    push(@FOREIGN, "$file has foreign copyright: $1");
  } else {
    if ($copyright) {
      $f = $copyright . $f;
      open(FILE, ">$file");
      print FILE $f;
      close(FILE);
    } else {
      print $file . " needs a license\n";
    }
  }
}

if ($copyright) {
  $copyright = `cat $copyright`;
}

if (-d $folder) {
  &searchFolder($folder, $copyright);
} elsif ($folder =~ /\.(js|java|css)$/ && $folder !~ /\/dojo\// && $folder !~ /\/test\// && $folder !~ /\/build\//) {
  &searchFile($folder, $copyright);
}


print("FOREIGN COPYRIGHTS:\n" . join("\n", @FOREIGN));
