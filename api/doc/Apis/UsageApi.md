# UsageApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUsage**](UsageApi.md#createUsage) | **POST** /contracts/{contractID}/usages/ | 
[**deleteUsageByID**](UsageApi.md#deleteUsageByID) | **DELETE** /contracts/{contractID}/usages/{usageID} | 
[**generateUsageByID**](UsageApi.md#generateUsageByID) | **PUT** /contracts/{contractID}/usages/{usageID}/generate/ | 
[**getUsageByID**](UsageApi.md#getUsageByID) | **GET** /contracts/{contractID}/usages/{usageID} | 
[**getUsages**](UsageApi.md#getUsages) | **GET** /contracts/{contractID}/usages/ | 
[**sendUsageByID**](UsageApi.md#sendUsageByID) | **PUT** /contracts/{contractID}/usages/{usageID}/send/ | 
[**updateUsageByID**](UsageApi.md#updateUsageByID) | **PUT** /contracts/{contractID}/usages/{usageID} | 


<a name="createUsage"></a>
# **createUsage**
> UsageResponse createUsage(contractID, body)



    Create a new Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **body** | [**UsageRequest**](../Models/UsageRequest.md)| Usage Object Payload |

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteUsageByID"></a>
# **deleteUsageByID**
> UsageResponse deleteUsageByID(contractID, usageID)



    Delete a Usage By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="generateUsageByID"></a>
# **generateUsageByID**
> Object generateUsageByID(contractID, usageID, mode)



    Generate the \&quot;Settlement\&quot; with local calculator and POST to Blochain adapter towards TargetMSP of the calculated response.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]
 **mode** | **String**| Defaults to \&quot;preview\&quot; if not selected. Preview will only performs \&quot;calculation\&quot; and return the calculated settlement in response. if \&quot;commit\&quot;, will create the settlement and Send it live to the Blockchain to the targetMSP. | [optional] [default to null] [enum: preview, commit]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageByID"></a>
# **getUsageByID**
> UsageResponse getUsageByID(contractID, usageID)



    Get Usage Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

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

<a name="sendUsageByID"></a>
# **sendUsageByID**
> UsageResponse sendUsageByID(contractID, usageID)



    Set State to \&quot;SEND\&quot; and POST to Blochain adapter towards TargetMSP of the Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateUsageByID"></a>
# **updateUsageByID**
> UsageResponse updateUsageByID(contractID, usageID, body)



    Update Usage Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **usageID** | **String**| The Usage ID | [default to null]
 **body** | [**UsageRequest**](../Models/UsageRequest.md)| Usage Object Payload |

### Return type

[**UsageResponse**](../Models/UsageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

