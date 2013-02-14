README FOR ISSUECLOUD

Updated: 8/16/10 for WaveMaker 6.1.9

This is a helpg desk/bug traking application built using WaveMaker.

This project is an licensed under the WaveMaker commercial enterprise license and requires WaveMaker Enterprise Edition.

The data model for the project is in the webapproot\data directory - issuecloudv2.sql
This data dump was created by SQLYog for MySQL

To build this project:
1. Download and install MySQL
2. Download and install SQLYog
3. Download and install WaveMaker
4. Run SQLYog and restore the issuecloudv2.sql database
5. Run WaveMaker and use File->import to copy the issuecloud.zip file to the appropriate WaveMaker project directory
6. Edit the database connection parameters to connect to your MySQL or PostgreSQL database
7. Press Run in the WaveMaker studio to deploy and run the web application. The deployment will use the Tomcat server bundled with WaveMaker

For more information on WaveMaker and additional deployment options, go to dev.wavemaker.com