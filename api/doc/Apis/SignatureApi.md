# SignatureApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSignatureById**](SignatureApi.md#getSignatureById) | **GET** /contracts/{contractId}/signatures/{signatureId} | 
[**getSignatures**](SignatureApi.md#getSignatures) | **GET** /contracts/{contractId}/signatures/ | 
[**updateSignatureById**](SignatureApi.md#updateSignatureById) | **PUT** /contracts/{contractId}/signatures/{signatureId} | 


<a name="getSignatureById"></a>
# **getSignatureById**
> SignatureResponse getSignatureById(contractId, signatureId)



    Get Signature Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **signatureId** | **String**| The Signature Id | [default to null]

### Return type

[**SignatureResponse**](../Models/SignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSignatures"></a>
# **getSignatures**
> String getSignatures(contractId)



    Get All signatures of a given Contract

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

<a name="updateSignatureById"></a>
# **updateSignatureById**
> SignatureResponse updateSignatureById(contractId, signatureId, body)



    Update Signature Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **signatureId** | **String**| The Signature Id | [default to null]
 **body** | [**SignatureRequest**](../Models/SignatureRequest.md)| Signature Object Payload |

### Return type

[**SignatureResponse**](../Models/SignatureResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

