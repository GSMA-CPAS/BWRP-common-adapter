# Documentation for Common-Adapter

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContractApi* | [**createContract**](Apis/ContractApi.md#createcontract) | **POST** /contracts/ | Create a new Contract
*ContractApi* | [**deleteContractById**](Apis/ContractApi.md#deletecontractbyid) | **DELETE** /contracts/{contractId} | Delete a Contract By its Id
*ContractApi* | [**getContractById**](Apis/ContractApi.md#getcontractbyid) | **GET** /contracts/{contractId} | Get a Contract By its Id
*ContractApi* | [**getContracts**](Apis/ContractApi.md#getcontracts) | **GET** /contracts/ | Show a list of all Contracts
*ContractApi* | [**sendContractById**](Apis/ContractApi.md#sendcontractbyid) | **PUT** /contracts/{contractId}/send/ | Set State to \"SEND\" and POST to Blochain adapter towards TargetMsp of the Contract
*ContractApi* | [**updateContractById**](Apis/ContractApi.md#updatecontractbyid) | **PUT** /contracts/{contractId} | Update existing Contract
*DiscoveryApi* | [**getDiscoveryMsp**](Apis/DiscoveryApi.md#getdiscoverymsp) | **GET** /discovery/msps/{mspId} | Show details for a specific Msp
*DiscoveryApi* | [**getDiscoveryMsps**](Apis/DiscoveryApi.md#getdiscoverymsps) | **GET** /discovery/msps | Show a list of all Msps
*EventApi* | [**eventReceived**](Apis/EventApi.md#eventreceived) | **POST** /contracts/event/ | Webhook callback
*SettlementApi* | [**getSettlementById**](Apis/SettlementApi.md#getsettlementbyid) | **GET** /contracts/{contractId}/settlements/{settlementId} | Get Settlement Object by its Id
*SettlementApi* | [**getSettlementDiscrepancy**](Apis/SettlementApi.md#getsettlementdiscrepancy) | **GET** /contracts/{contractId}/settlements/{settlementId}/discrepancy/ | Get the discrepancy between a settlement and a given partner settlement.
*SettlementApi* | [**getSettlements**](Apis/SettlementApi.md#getsettlements) | **GET** /contracts/{contractId}/settlements/ | Get All Settlement of a given Contract
*SettlementApi* | [**rejectSettlementById**](Apis/SettlementApi.md#rejectsettlementbyid) | **PUT** /contracts/{contractId}/settlements/{settlementId}/reject/ | Set Tag to \"REJECTED\"
*SettlementApi* | [**sendSettlementById**](Apis/SettlementApi.md#sendsettlementbyid) | **PUT** /contracts/{contractId}/settlements/{settlementId}/send/ | Set State to \"SEND\" and POST to Blockchain adapter towards TargetMsp of the Usage
*SignatureApi* | [**createSignature**](Apis/SignatureApi.md#createsignature) | **POST** /contracts/{contractId}/signatures/ | Create/Upload Signature
*SignatureApi* | [**createUsageSignature**](Apis/SignatureApi.md#createusagesignature) | **POST** /contracts/{contractId}/usages/{usageId}/signatures/ | Create/Upload Signature
*SignatureApi* | [**getSignatureById**](Apis/SignatureApi.md#getsignaturebyid) | **GET** /contracts/{contractId}/signatures/{signatureId} | Get Signature Object by its Id
*SignatureApi* | [**getSignatures**](Apis/SignatureApi.md#getsignatures) | **GET** /contracts/{contractId}/signatures/ | Get All signatures of a given Contract
*SignatureApi* | [**getUsageSignatureById**](Apis/SignatureApi.md#getusagesignaturebyid) | **GET** /contracts/{contractId}/usages/{usageId}/signatures/{signatureId} | Get Signature Object by its Id
*SignatureApi* | [**getUsageSignatures**](Apis/SignatureApi.md#getusagesignatures) | **GET** /contracts/{contractId}/usages/{usageId}/signatures/ | Get All signatures of a given Usage
*StatusApi* | [**getApiStatus**](Apis/StatusApi.md#getapistatus) | **GET** /status | Show version information of the API
*UsageApi* | [**createUsage**](Apis/UsageApi.md#createusage) | **POST** /contracts/{contractId}/usages/ | Create a new Usage
*UsageApi* | [**deleteUsageById**](Apis/UsageApi.md#deleteusagebyid) | **DELETE** /contracts/{contractId}/usages/{usageId} | Delete a Usage By its Id
*UsageApi* | [**generateUsageById**](Apis/UsageApi.md#generateusagebyid) | **PUT** /contracts/{contractId}/usages/{usageId}/generate/ | Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMsp of the calculated response.
*UsageApi* | [**getUsageById**](Apis/UsageApi.md#getusagebyid) | **GET** /contracts/{contractId}/usages/{usageId} | Get Usage Object by its Id
*UsageApi* | [**getUsageDiscrepancy**](Apis/UsageApi.md#getusagediscrepancy) | **GET** /contracts/{contractId}/usages/{usageId}/discrepancy/ | Get the discrepancy between an usage and a given partner usage.
*UsageApi* | [**getUsages**](Apis/UsageApi.md#getusages) | **GET** /contracts/{contractId}/usages/ | Get All usage of a given Contract
*UsageApi* | [**rejectUsageById**](Apis/UsageApi.md#rejectusagebyid) | **PUT** /contracts/{contractId}/usages/{usageId}/reject/ | Set Tag to \"REJECTED\"
*UsageApi* | [**sendUsageById**](Apis/UsageApi.md#sendusagebyid) | **PUT** /contracts/{contractId}/usages/{usageId}/send/ | Set State to \"SEND\" and POST to Blockchain adapter towards TargetMsp of the Usage
*UsageApi* | [**updateUsageById**](Apis/UsageApi.md#updateusagebyid) | **PUT** /contracts/{contractId}/usages/{usageId} | Update Usage Object by its Id


<a name="documentation-for-models"></a>
## Documentation for Models

 - [400ErrorResponse](./Models/400ErrorResponse.md)
 - [ContractBody](./Models/ContractBody.md)
 - [ContractBodyMspDiscount](./Models/ContractBodyMspDiscount.md)
 - [ContractBodyMspDiscountServiceGroup](./Models/ContractBodyMspDiscountServiceGroup.md)
 - [ContractBodyMspDiscountServiceGroupService](./Models/ContractBodyMspDiscountServiceGroupService.md)
 - [ContractBodyMspDiscountServiceGroupServiceRateThreshold](./Models/ContractBodyMspDiscountServiceGroupServiceRateThreshold.md)
 - [ContractRequest](./Models/ContractRequest.md)
 - [ContractRequestHeader](./Models/ContractRequestHeader.md)
 - [ContractRequestHeader2](./Models/ContractRequestHeader2.md)
 - [ContractRequestHeader2Msp](./Models/ContractRequestHeader2Msp.md)
 - [ContractRequestHeaderFromMsp](./Models/ContractRequestHeaderFromMsp.md)
 - [ContractRequestHeaderToMsp](./Models/ContractRequestHeaderToMsp.md)
 - [ContractResponse](./Models/ContractResponse.md)
 - [Event](./Models/Event.md)
 - [Msp](./Models/Msp.md)
 - [RAWContractResponse](./Models/RAWContractResponse.md)
 - [SignatureBase](./Models/SignatureBase.md)
 - [SignatureRequest](./Models/SignatureRequest.md)
 - [SignatureResponse](./Models/SignatureResponse.md)
 - [UsageBody](./Models/UsageBody.md)
 - [UsageBodyUsageItem](./Models/UsageBodyUsageItem.md)
 - [UsageRequest](./Models/UsageRequest.md)
 - [UsageRequestHeader](./Models/UsageRequestHeader.md)
 - [UsageResponse](./Models/UsageResponse.md)
 - [UsageResponseHeader](./Models/UsageResponseHeader.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
