# SignatureApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSignatureByID**](SignatureApi.md#getSignatureByID) | **GET** /contract/{contractID}/signature/{signatureID} | 
[**getSignatures**](SignatureApi.md#getSignatures) | **GET** /contract/{contractID}/signature/ | 
[**updateSignatureByID**](SignatureApi.md#updateSignatureByID) | **PUT** /contract/{contractID}/signature/{signatureID} | 


<a name="getSignatureByID"></a>
# **getSignatureByID**
> Object getSignatureByID(contractID, signatureID)



    Get Signature Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **signatureID** | **String**| The Signature ID | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSignatures"></a>
# **getSignatures**
> String getSignatures(contractID)



    Get All signatures of a given Contract

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

<a name="updateSignatureByID"></a>
# **updateSignatureByID**
> String updateSignatureByID(contractID, signatureID, body)



    Update Signature Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **signatureID** | **String**| The Signature ID | [default to null]
 **body** | **Object**| Signature Object Payload |

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

