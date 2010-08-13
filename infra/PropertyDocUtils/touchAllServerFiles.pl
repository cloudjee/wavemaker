#!/usr/bin/perl

use LWP::Simple;

my $data = `cat package.xml`;
if (!$data) { die "Expected to have package.xml in the current directory";}
my @files = ($data =~ /\<file defaultAction="0" language=""\>(.*?)\<\/file\>/g);
foreach $f (@files) {
  $f =~ s/^PropertyDocumentation\.//;
  my $url = "http://dev.wavemaker.com/wiki/bin/PropertyDocumentation/$f"; 
print "$url\n";
  get($url)  . "\n";
  sleep(1);
}
