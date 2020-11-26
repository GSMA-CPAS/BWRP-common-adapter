# Documentation for Common-Adapter

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContractApi* | [**createContract**](Apis/ContractApi.md#createcontract) | **POST** /contracts/ | Create a new Contract
*ContractApi* | [**deleteContractByID**](Apis/ContractApi.md#deletecontractbyid) | **DELETE** /contracts/{contractID} | Delete a Contract By its ID
*ContractApi* | [**getContractByID**](Apis/ContractApi.md#getcontractbyid) | **GET** /contracts/{contractID} | Get a Contract By its ID
*ContractApi* | [**getContracts**](Apis/ContractApi.md#getcontracts) | **GET** /contracts/ | Show a list of all Contracts
*ContractApi* | [**sendContractByID**](Apis/ContractApi.md#sendcontractbyid) | **PUT** /contracts/{contractID}/send/ | Set State to \"SEND\" and POST to Blochain adapter towards TargetMSP of the Contract
*ContractApi* | [**updateContractByID**](Apis/ContractApi.md#updatecontractbyid) | **PUT** /contracts/{contractID} | Update existing Contract
*DiscoveryApi* | [**getDiscoveryMSP**](Apis/DiscoveryApi.md#getdiscoverymsp) | **GET** /discovery/msps/{mspid} | Show details for a specific MSP
*DiscoveryApi* | [**getDiscoveryMSPs**](Apis/DiscoveryApi.md#getdiscoverymsps) | **GET** /discovery/msps | Show a list of all MSPs
*EventApi* | [**eventReceived**](Apis/EventApi.md#eventreceived) | **POST** /contracts/event/ | Webhook callback
*SettlementApi* | [**getSettlementByID**](Apis/SettlementApi.md#getsettlementbyid) | **GET** /contracts/{contractID}/settlements/{settlementID} | Get Settlement Object by its ID
*SettlementApi* | [**getSettlements**](Apis/SettlementApi.md#getsettlements) | **GET** /contracts/{contractID}/settlements/ | Get All Settlement of a given Contract
*SignatureApi* | [**getSignatureByID**](Apis/SignatureApi.md#getsignaturebyid) | **GET** /contracts/{contractID}/signatures/{signatureID} | Get Signature Object by its ID
*SignatureApi* | [**getSignatures**](Apis/SignatureApi.md#getsignatures) | **GET** /contracts/{contractID}/signatures/ | Get All signatures of a given Contract
*SignatureApi* | [**updateSignatureByID**](Apis/SignatureApi.md#updatesignaturebyid) | **PUT** /contracts/{contractID}/signatures/{signatureID} | Update Signature Object by its ID
*StatusApi* | [**getApiStatus**](Apis/StatusApi.md#getapistatus) | **GET** /status | Show version information of the API
*UsageApi* | [**createUsage**](Apis/UsageApi.md#createusage) | **POST** /contracts/{contractID}/usages/ | Create a new Usage
*UsageApi* | [**deleteUsageByID**](Apis/UsageApi.md#deleteusagebyid) | **DELETE** /contracts/{contractID}/usages/{usageID} | Delete a Usage By its ID
*UsageApi* | [**generateUsageByID**](Apis/UsageApi.md#generateusagebyid) | **PUT** /contracts/{contractID}/usages/{usageID}/generate/ | Generate the \"Settlement\" with local calculator and POST to Blochain adapter towards TargetMSP of the calculated response.
*UsageApi* | [**getUsageByID**](Apis/UsageApi.md#getusagebyid) | **GET** /contracts/{contractID}/usages/{usageID} | Get Usage Object by its ID
*UsageApi* | [**getUsages**](Apis/UsageApi.md#getusages) | **GET** /contracts/{contractID}/usages/ | Get All usage of a given Contract
*UsageApi* | [**sendUsageByID**](Apis/UsageApi.md#sendusagebyid) | **PUT** /contracts/{contractID}/usages/{usageID}/send/ | Set State to \"SEND\" and POST to Blochain adapter towards TargetMSP of the Usage
*UsageApi* | [**updateUsageByID**](Apis/UsageApi.md#updateusagebyid) | **PUT** /contracts/{contractID}/usages/{usageID} | Update Usage Object by its ID


<a name="documentation-for-models"></a>
## Documentation for Models

 - [400ErrorResponse](./Models/400ErrorResponse.md)
 - [ContractRequest](./Models/ContractRequest.md)
 - [ContractRequestHeader](./Models/ContractRequestHeader.md)
 - [ContractRequestHeaderFromMSP](./Models/ContractRequestHeaderFromMSP.md)
 - [ContractRequestHeaderToMSP](./Models/ContractRequestHeaderToMSP.md)
 - [ContractResponse](./Models/ContractResponse.md)
 - [RAWContractResponse](./Models/RAWContractResponse.md)
 - [SignatureBase](./Models/SignatureBase.md)
 - [SignatureRequest](./Models/SignatureRequest.md)
 - [SignatureResponse](./Models/SignatureResponse.md)
 - [SuccessResponse](./Models/SuccessResponse.md)
 - [UsageRequest](./Models/UsageRequest.md)
 - [UsageResponse](./Models/UsageResponse.md)
 - [UsageResponseHeader](./Models/UsageResponseHeader.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
