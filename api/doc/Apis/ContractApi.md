# ContractApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createContract**](ContractApi.md#createContract) | **POST** /contract/ | 
[**deleteContractByID**](ContractApi.md#deleteContractByID) | **DELETE** /contract/{contractID} | 
[**getContractByID**](ContractApi.md#getContractByID) | **GET** /contract/{contractID} | 
[**getContracts**](ContractApi.md#getContracts) | **GET** /contract/ | 
[**updateContractByID**](ContractApi.md#updateContractByID) | **PUT** /contract/{contractID} | 


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
> Object getContractByID(contractID)



    Get a Contract By its ID

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

<a name="updateContractByID"></a>
# **updateContractByID**
> Object updateContractByID(contractID, body)



    Update existing Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **body** | **Object**| Contract Object Payload |

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

