# UsageApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUsage**](UsageApi.md#createUsage) | **POST** /contracts/{contractId}/usages/ | 
[**deleteUsageById**](UsageApi.md#deleteUsageById) | **DELETE** /contracts/{contractId}/usages/{usageId} | 
[**generateUsageById**](UsageApi.md#generateUsageById) | **PUT** /contracts/{contractId}/usages/{usageId}/generate/ | 
[**getUsageById**](UsageApi.md#getUsageById) | **GET** /contracts/{contractId}/usages/{usageId} | 
[**getUsageDiscrepancy**](UsageApi.md#getUsageDiscrepancy) | **GET** /contracts/{contractId}/usages/{usageId}/discrepancy/ | 
[**getUsages**](UsageApi.md#getUsages) | **GET** /contracts/{contractId}/usages/ | 
[**rejectUsageById**](UsageApi.md#rejectUsageById) | **PUT** /contracts/{contractId}/usages/{usageId}/reject/ | 
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
 **mode** | **String**| By default, for undefined mode, will calculate and store a new settlement. If \&quot;preview\&quot; mode is selected, will not store the calculated settlement. If \&quot;commit\&quot; mode is selected, will store and send the calculated settlement. | [optional] [default to null] [enum: preview, commit]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageById"></a>
# **getUsageById**
> oneOf&lt;UsageResponse,RAWUsageResponse&gt; getUsageById(contractId, usageId, format)



    Get Usage Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]
 **format** | **String**| Response format, defaults to JSON if not passed. | [optional] [default to null] [enum: JSON, RAW]

### Return type

[**oneOf&lt;UsageResponse,RAWUsageResponse&gt;**](../Models/oneOf&lt;UsageResponse,RAWUsageResponse&gt;.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageDiscrepancy"></a>
# **getUsageDiscrepancy**
> Object getUsageDiscrepancy(contractId, usageId, partnerUsageId)



    Get the discrepancy between an usage and a given partner usage.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The Usage Id | [default to null]
 **partnerUsageId** | **String**| The id of the partner usage to compare | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsages"></a>
# **getUsages**
> String getUsages(contractId, states)



    Get All usage of a given Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **states** | [**List**](../Models/String.md)| One or more states | [optional] [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="rejectUsageById"></a>
# **rejectUsageById**
> UsageResponse rejectUsageById(contractId, usageId)



    Set Tag to \&quot;REJECTED\&quot;

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

