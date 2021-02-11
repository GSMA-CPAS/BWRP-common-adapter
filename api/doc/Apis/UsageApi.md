# UsageApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUsage**](UsageApi.md#createUsage) | **POST** /contracts/{contractId}/usages/ | 
[**deleteUsageById**](UsageApi.md#deleteUsageById) | **DELETE** /contracts/{contractId}/usages/{usageId} | 
[**generateUsageById**](UsageApi.md#generateUsageById) | **PUT** /contracts/{contractId}/usages/{usageId}/generate/ | 
[**getUsageById**](UsageApi.md#getUsageById) | **GET** /contracts/{contractId}/usages/{usageId} | 
[**getUsages**](UsageApi.md#getUsages) | **GET** /contracts/{contractId}/usages/ | 
[**putUsageDiscrepancy**](UsageApi.md#putUsageDiscrepancy) | **PUT** /contracts/{contractId}/usages/{usageId}/discrepancy/ | 
[**sendUsageById**](UsageApi.md#sendUsageById) | **PUT** /contracts/{contractId}/usages/{usageId}/send/ | 
[**updateUsageById**](UsageApi.md#updateUsageById) | **PUT** /contracts/{contractId}/usages/{usageId} | 


<a name="createUsage"></a>
# **createUsage**
> UsageResponse createUsage(contractId, body)



    Create a new Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **body** | [**UsageRequest**](../Models/UsageRequest.md)| Usage Object Payload |

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteUsageById"></a>
# **deleteUsageById**
> UsageResponse deleteUsageById(contractId, usageId)



    Delete a Usage By its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="generateUsageById"></a>
# **generateUsageById**
> Object generateUsageById(contractId, usageId, mode)



    Generate the \&quot;Settlement\&quot; with local calculator and POST to Blochain adapter towards TargetMsp of the calculated response.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]
 **mode** | **String**| Defaults to \&quot;preview\&quot; if not selected. Preview will only performs \&quot;calculation\&quot; and return the calculated settlement in response. if \&quot;commit\&quot;, will create the settlement and Send it live to the Blockchain to the targetMsp. | [optional] [default to null] [enum: preview, commit]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageById"></a>
# **getUsageById**
> UsageResponse getUsageById(contractId, usageId)



    Get Usage Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsages"></a>
# **getUsages**
> String getUsages(contractId)



    Get All usage of a given Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="putUsageDiscrepancy"></a>
# **putUsageDiscrepancy**
> Object putUsageDiscrepancy(contractId, usageId, settlementId)



    Create and return the discrepancy between an usage and the selected settlement.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]
 **settlementId** | **String**| The id of the settlement to compare | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="sendUsageById"></a>
# **sendUsageById**
> UsageResponse sendUsageById(contractId, usageId)



    Set State to \&quot;SEND\&quot; and POST to Blockchain adapter towards TargetMsp of the Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateUsageById"></a>
# **updateUsageById**
> UsageResponse updateUsageById(contractId, usageId, body)



    Update Usage Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]
 **body** | [**UsageRequest**](../Models/UsageRequest.md)| Usage Object Payload |

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

