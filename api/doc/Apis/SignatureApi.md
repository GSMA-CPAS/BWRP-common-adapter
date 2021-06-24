# SignatureApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createSignature**](SignatureApi.md#createSignature) | **POST** /contracts/{contractId}/signatures/ | 
[**createUsageSignature**](SignatureApi.md#createUsageSignature) | **POST** /contracts/{contractId}/usages/{usageId}/signatures/ | 
[**getSignatureById**](SignatureApi.md#getSignatureById) | **GET** /contracts/{contractId}/signatures/{signatureId} | 
[**getSignatures**](SignatureApi.md#getSignatures) | **GET** /contracts/{contractId}/signatures/ | 
[**getUsageSignatureById**](SignatureApi.md#getUsageSignatureById) | **GET** /contracts/{contractId}/usages/{usageId}/signatures/{signatureId} | 
[**getUsageSignatures**](SignatureApi.md#getUsageSignatures) | **GET** /contracts/{contractId}/usages/{usageId}/signatures/ | 


<a name="createSignature"></a>
# **createSignature**
> ContractSignatureResponse createSignature(contractId, body)



    Create/Upload Signature

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **body** | [**SignatureRequest**](../Models/SignatureRequest.md)| Signature Object Payload |

### Return type

[**ContractSignatureResponse**](../Models/ContractSignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="createUsageSignature"></a>
# **createUsageSignature**
> UsageSignatureResponse createUsageSignature(contractId, usageId, body)



    Create/Upload Signature

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The usage Id | [default to null]
 **body** | [**SignatureRequest**](../Models/SignatureRequest.md)| Signature Object Payload |

### Return type

[**UsageSignatureResponse**](../Models/UsageSignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getSignatureById"></a>
# **getSignatureById**
> ContractSignatureResponse getSignatureById(contractId, signatureId)



    Get Signature Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **signatureId** | **String**| The Signature Id | [default to null]

### Return type

[**ContractSignatureResponse**](../Models/ContractSignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSignatures"></a>
# **getSignatures**
> List getSignatures(contractId)



    Get All signatures of a given Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]

### Return type

[**List**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageSignatureById"></a>
# **getUsageSignatureById**
> UsageSignatureResponse getUsageSignatureById(contractId, usageId, signatureId)



    Get Signature Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The usage Id | [default to null]
 **signatureId** | **String**| The Signature Id | [default to null]

### Return type

[**UsageSignatureResponse**](../Models/UsageSignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsageSignatures"></a>
# **getUsageSignatures**
> List getUsageSignatures(contractId, usageId)



    Get All signatures of a given Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **usageId** | **String**| The usage Id | [default to null]

### Return type

[**List**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

