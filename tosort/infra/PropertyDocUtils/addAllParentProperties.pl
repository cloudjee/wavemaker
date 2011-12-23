#!/usr/bin/perl

my $className = $ARGV[0];
my $classFile = "PropertyDocumentation/${className}.xml";
die "invalid class name" unless (-e $classFile) ;

my $classFileContents = `cat $classFile`;
$classFileContents =~ /\<SuperClass\>(.*?)\<\/SuperClass/;
my $superclassName = $1;

my @parentPropFiles = `ls PropertyDocumentation/${superclassName}_*.xml`;
chomp(@parentPropFiles);

foreach $prop (@parentPropFiles) {
  &addProperty($prop, $className, $superclassName);
}

sub addProperty {
  my($propfile, $classname, $superclassName) = @_;
  my ($prop) = ($propfile =~ /${superclassName}_(.*)\.xml/);

  # 1. Copy the file
  # 2. Change ALL ${superclassName}_${prop}
  # 3. Change <ClassName>$superclassName</ClassName>
  # 4. Delete <Synopsis>....</Synopsis>
  # 5. Change <property>
  #     <Details></Details>
  #     </property>
  #     WARNING: More than one <Details></Details>, maybe look for the one with no < and > in it.
  # 6. Add new file to package.xml; append right after <files>


  # 1.
  my $propContents = `cat $propfile`;
  
  #2
  $propContents =~ s/${superclassName}_${prop}/${classname}_${prop}/g;

  #3
  $propContents =~ s/\<ClassName\>.*?\<\/ClassName/\<ClassName\>$classname\<\/ClassName/g;

  # 4 
  $propContents =~ s/\<Synopsis\>[^\<\>]*\<\/Synopsis/\<Synopsis\>\<\/Synopsis/g;

  # 5
  $propContents =~ s/\<Details\>[^\<\>]*\<\/Details/\<Details\>\<\/Details/g;

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
