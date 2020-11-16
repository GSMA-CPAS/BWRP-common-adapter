# Documentation for Common-Adapter

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ContractApi* | [**createContract**](Apis/ContractApi.md#createcontract) | **POST** /contract/ | Create a new Contract
*ContractApi* | [**deleteContractByID**](Apis/ContractApi.md#deletecontractbyid) | **DELETE** /contract/{contractID} | Delete a Contract By its ID
*ContractApi* | [**getContractByID**](Apis/ContractApi.md#getcontractbyid) | **GET** /contract/{contractID} | Get a Contract By its ID
*ContractApi* | [**getContracts**](Apis/ContractApi.md#getcontracts) | **GET** /contract/ | Show a list of all Contracts
*ContractApi* | [**updateContractByID**](Apis/ContractApi.md#updatecontractbyid) | **PUT** /contract/{contractID} | Update existing Contract
*DiscoveryApi* | [**getDiscoveryMSP**](Apis/DiscoveryApi.md#getdiscoverymsp) | **GET** /discovery/msps/{mspid} | Show details for a specific MSP
*DiscoveryApi* | [**getDiscoveryMSPs**](Apis/DiscoveryApi.md#getdiscoverymsps) | **GET** /discovery/msps | Show a list of all MSPs
*EventApi* | [**eventReceived**](Apis/EventApi.md#eventreceived) | **POST** /contract/event/ | Webhook callback
*SettlementApi* | [**createSettlement**](Apis/SettlementApi.md#createsettlement) | **POST** /contract/{contractID}/settlement/ | Create a new Settlement
*SettlementApi* | [**deleteSettlementByID**](Apis/SettlementApi.md#deletesettlementbyid) | **DELETE** /contract/{contractID}/settlement/{settlementID} | Delete a Settlement By its ID
*SettlementApi* | [**getSettlementByID**](Apis/SettlementApi.md#getsettlementbyid) | **GET** /contract/{contractID}/settlement/{settlementID} | Get Settlement Object by its ID
*SettlementApi* | [**getSettlements**](Apis/SettlementApi.md#getsettlements) | **GET** /contract/{contractID}/settlement/ | Get All Settlement of a given Contract
*SettlementApi* | [**updateSettlementByID**](Apis/SettlementApi.md#updatesettlementbyid) | **PUT** /contract/{contractID}/settlement/{settlementID} | Update Settlement Object by its ID
*SignatureApi* | [**getSignatureByID**](Apis/SignatureApi.md#getsignaturebyid) | **GET** /contract/{contractID}/signature/{signatureID} | Get Signature Object by its ID
*SignatureApi* | [**getSignatures**](Apis/SignatureApi.md#getsignatures) | **GET** /contract/{contractID}/signature/ | Get All signatures of a given Contract
*SignatureApi* | [**updateSignatureByID**](Apis/SignatureApi.md#updatesignaturebyid) | **PUT** /contract/{contractID}/signature/{signatureID} | Update Signature Object by its ID
*StatusApi* | [**getApiStatus**](Apis/StatusApi.md#getapistatus) | **GET** /status | Show version information of the API
*UsageApi* | [**createUsage**](Apis/UsageApi.md#createusage) | **POST** /contract/{contractID}/usage/ | Create a new Usage
*UsageApi* | [**deleteUsageByID**](Apis/UsageApi.md#deleteusagebyid) | **DELETE** /contract/{contractID}/usage/{usageID} | Delete a Usage By its ID
*UsageApi* | [**getUsageByID**](Apis/UsageApi.md#getusagebyid) | **GET** /contract/{contractID}/usage/{usageID} | Get Usage Object by its ID
*UsageApi* | [**getUsages**](Apis/UsageApi.md#getusages) | **GET** /contract/{contractID}/usage/ | Get All usage of a given Contract
*UsageApi* | [**updateUsageByID**](Apis/UsageApi.md#updateusagebyid) | **PUT** /contract/{contractID}/usage/{usageID} | Update Usage Object by its ID


<a name="documentation-for-models"></a>
## Documentation for Models

 - [400ErrorResponse](./Models/400ErrorResponse.md)
 - [SuccessResponse](./Models/SuccessResponse.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
