# ContractApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createContract**](ContractApi.md#createContract) | **POST** /contracts/ | 
[**deleteContractByID**](ContractApi.md#deleteContractByID) | **DELETE** /contracts/{contractID} | 
[**getContractByID**](ContractApi.md#getContractByID) | **GET** /contracts/{contractID} | 
[**getContracts**](ContractApi.md#getContracts) | **GET** /contracts/ | 
[**sendContractByID**](ContractApi.md#sendContractByID) | **PUT** /contracts/{contractID}/send | 


<a name="createContract"></a>
# **createContract**
> String createContract(toMSP, body)



    Create a new Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **toMSP** | **String**| The Destination MSPID | [default to null]
 **body** | **Object**| Contract Object Payload |

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteContractByID"></a>
# **deleteContractByID**
> SuccessResponse deleteContractByID(contractID)



    Delete a Contract By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]

### Return type

[**SuccessResponse**](../Models/SuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getContractByID"></a>
# **getContractByID**
> Object getContractByID(contractID, format)



    Get a Contract By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **format** | **String**| The return format ( \&quot;raw\&quot; | \&quot;json\&quot; ) | [optional] [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getContracts"></a>
# **getContracts**
> String getContracts()



    Show a list of all Contracts

### Parameters
This endpoint does not need any parameter.

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="sendContractByID"></a>
# **sendContractByID**
> Object sendContractByID(contractID)



    Uploads existing Contract to blockchain -&gt; @MSP

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

