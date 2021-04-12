
# kong_dataset_on_discrepancy_service dependencies

This dataset is sending contract and usages using numbers to define all numerical values.

This dataset can be executed only on development-setup using :

 - Last Calculation Service "main" or "always-discount-result" branches
 - Discrepancy Service "mongo" branch
 - Common-Adapter started with COMMON_ADAPTER_DISCREPANCY_SERVICE_URL env variable

This dataset is returning errors during this tests :

 - Scenario 0001 : Get DTAG settlement discrepancy on received settlement from TMUS ( Cause: Usage discrepancy not executed before Settlement Discrepancy )
 - Scenario 0001 : Get TMUS settlement discrepancy on received settlement from DTAG ( Cause: Usage discrepancy not executed before Settlement Discrepancy )
 - Scenario 0003 : Get TMUS settlement discrepancy on local settlement with DTAG settlement as partnerSettlement ( Cause: The expected response should be the same as 'Get DTAG settlement discrepancy on TMUS settlement with local settlement as partnerSettlement')
 - Scenario 0003 : Get TMUS settlement discrepancy on DTAG settlement with local settlement as partnerSettlement ( Cause: The expected response should be the same as 'Get DTAG settlement discrepancy on local settlement with TMUS settlement as partnerSettlement')

Work in progress.
