#!/usr/bin/perl

# INVOCATION: perl turnTrackerImagesToCsv.pl <path-to-log>  > output.csv
# NOTES: Any change to server log format may break this script.

my $file = $ARGV[0];

open(FILE, $file);
while(my $line = <FILE>) {
    if ($line =~ /img\/blank.gif\?op\=/) {
	$line =~ /^([\d.]*)\s*\-\s*\-\s*\[([^\]]*)\].*\?op\=(\w+)\&v\=(.+)\&r.*\"([^"]*)\"/;

	print '"' .join( '","', ($1,$2,$3,$4,$5)) . '"' . "\n";
    }
}
