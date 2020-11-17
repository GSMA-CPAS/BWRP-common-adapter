# UsageApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUsage**](UsageApi.md#createUsage) | **POST** /contracts/{contractID}/usages/ | 
[**deleteUsageByID**](UsageApi.md#deleteUsageByID) | **DELETE** /contracts/{contractID}/usages/{usageID} | 
[**generateSettlementByUsageId**](UsageApi.md#generateSettlementByUsageId) | **PUT** /contracts/{contractID}/usages/{usageID}/generate | 
[**getUsageByID**](UsageApi.md#getUsageByID) | **GET** /contracts/{contractID}/usages/{usageID} | 
[**getUsages**](UsageApi.md#getUsages) | **GET** /contracts/{contractID}/usages/ | 
[**sendUsageById**](UsageApi.md#sendUsageById) | **PUT** /contracts/{contractID}/usages/{usageID}/send | 
[**updateUsageByID**](UsageApi.md#updateUsageByID) | **PUT** /contracts/{contractID}/usages/{usageID} | 


<a name="createUsage"></a>
# **createUsage**
> String createUsage(contractID, body)



    Create a new Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **body** | **Object**| Usage Object Payload |

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteUsageByID"></a>
# **deleteUsageByID**
> SuccessResponse deleteUsageByID(contractID, usageID)



    Delete a Usage By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**SuccessResponse**](../Models/SuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="generateSettlementByUsageId"></a>
# **generateSettlementByUsageId**
> SuccessResponse generateSettlementByUsageId(contractID, usageID)



    Trigger the settlement computation

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**SuccessResponse**](../Models/SuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageByID"></a>
# **getUsageByID**
> Object getUsageByID(contractID, usageID)



    Get Usage Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsages"></a>
# **getUsages**
> String getUsages(contractID)



    Get All usage of a given Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="sendUsageById"></a>
# **sendUsageById**
> Object sendUsageById(contractID, usageID)



    Uploads the usage data to the blockchain -&gt; @MSP

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateUsageByID"></a>
# **updateUsageByID**
> Object updateUsageByID(contractID, usageID, body)



    Update Usage Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]
 **body** | **Object**| Usage Object Payload |

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

