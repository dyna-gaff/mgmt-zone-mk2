# mgmt-zone-creator

## Purpose:

Create multiple management zones based on external logic and a provided excel document. This program has a few limitations that do not have in-depth 


### To Run:

----
# ALERT: DO NOT RUN ON OVER 300 ENTRIES IN THE CSV FILE

This is a project using [Node](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

NOTE: For initial deployment the local machine will not have the proper repos installed. Running ```npm install``` will install the needed packages onto the local machine.

Pre-requisistes:
- VSCode May need to be ran as administrator
- CSV File in format below:
  
  - Split the large CSV file into multiple CSV files of different names. I did about 200 entries per file.

```
/** Eample Data
     * Data format the script will execute on. First row is assumed to be title rows and will skip that row.
     * Name, App Service Name
     * abc123, AGENCY - APPLICATION - ENVIRONMENT
     * abc124, AGENCY - APPLICATION - ENVIRONMENT
     * ..., ...
     */
```

Clone the repo:

```Git clone: https://github.com/dyna-gaff/mgmt-zone-mk2.git```

Navigate to code directory:
```cd mgmt-zone-mk2/```

Install Dependency Packages:

```npm install```

Create a file called ```.env``` to store environment variables that the script will reference during executions.

Modify .env file to have appropriate API_KEY and DATA_FILE.
Example Values:

```
DATA_FILE=file11.csv
API_KEY=dt0c01.{API_KEY}
API_URI=aua26077.dynatrace.com
```

Run the script with environment variables:

```node index.js```

Modify ```.env``` file to use the new file.

Repeat.
