#!/usr/bin/perl

my $className = $ARGV[0];
my $classFile = "PropertyDocumentation/${className}.xml";
die "invalid class name" unless (-e $classFile) ;

my $propertyName = $ARGV[1];
my $propertyFile = "PropertyDocumentation/${className}_${propertyName}.xml";

my $classFileContents = `cat $propertyFile`;
$classFileContents =~ /\<SuperClass\>(.*?)\<\/SuperClass/;
$classFileContents =~ s/\<Synopsis\>[^\<\>]*\<\/Synopsis/\<Synopsis\>\<\/Synopsis/g;
$classFileContents =~ s/\<Details\>[^\<\>]*\<\/Details/\<Details\>\<\/Details/g;

&findSubclassesAndAddProperty($className, $propertyName, $classFileContents);


sub findSubclassesAndAddProperty {
  my ($className, $propertyName, $classFileContents) = @_;
  my (@files) = `grep -l "<SuperClass>$className</SuperClass>" PropertyDocumentation/*.xml`;
#  print("SUBCLASSES OF $className:" . join("\n",@files) . "\n\n");
  foreach $file (@files) {
    my ($subclassName) = ($file =~ /\/(.*)\.xml/);
    &createFile($subclassName,$className,$propertyName,$classFileContents);
    &findSubclassesAndAddProperty($subclassName, $propertyName, $classFileContents);
  }

}

sub createFile {
  my ($classname,$superclassName,$prop,$propContents)  = @_;
  $propContents =~ s/${superclassName}_${prop}/${classname}_${prop}/g;
  $propContents =~ s/\<ClassName\>.*?\<\/ClassName/\<ClassName\>$classname\<\/ClassName/g;

  my $filename = "PropertyDocumentation/${classname}_${prop}.xml";
  unless (-e $filename) {
  open(OUTPUTFILE, ">$filename");
  print OUTPUTFILE $propContents;
  close(OUTPUTFILE);
  print "Created PropertyDocumentation/${classname}_${prop}.xml\n";
  #6
  my $packages = `cat package.xml`;
  $packages =~ s/\<files\>/\<files\>\n\<file defaultAction="0" language=""\>PropertyDocumentation.${classname}_${prop}\<\/file\>/;
  open(OUTPUTFILE, ">package.xml");
  print OUTPUTFILE $packages;
  close(OUTPUTFILE);  
}
}
