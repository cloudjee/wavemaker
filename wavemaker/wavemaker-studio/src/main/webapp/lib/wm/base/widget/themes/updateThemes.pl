#!/usr/bin/perl

print "This script does NOT regenerate your themes, it just replaces .themename with .wm_themename, and assumes you've already regenerated and copied in the updated theme files\n\n";

sub main {
my @files = `ls -1`;
chomp(@files);
for ($i = 0; $i <= $#files; $i++) {
    my $file = $files[$i];    
    if (-d $file && $file ne "wm_studio" && $file ne "default" && $file ne "wm_notheme") {
        &convert($file);                
    }
}
}
sub convert {
    my($name) = @_;        
    print "Converting $name\n";
    
    my $f = `cat $name/theme.css`;
    my $f2 = `cat $name/mtheme.css`;
    my $shortname = $name;
    $shortname =~ s/wm_//;
    $f =~ s/\.$shortname/\.$name/g;
    $f2 =~ s/\.$shortname/\.$name/g;
    open(FILE, ">$name/theme.css");
    print FILE $f;
    close(FILE);
    open(FILE, ">$name/mtheme.css");
    print FILE $f2;
    close(FILE);
}

&main();