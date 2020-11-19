# ContractApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createContract**](ContractApi.md#createContract) | **POST** /contracts/ | 
[**deleteContractByID**](ContractApi.md#deleteContractByID) | **DELETE** /contracts/{contractID} | 
[**getContractByID**](ContractApi.md#getContractByID) | **GET** /contracts/{contractID} | 
[**getContracts**](ContractApi.md#getContracts) | **GET** /contracts/ | 
[**sendContractByID**](ContractApi.md#sendContractByID) | **PUT** /contracts/{contractID}/send/ | 
[**updateContractByID**](ContractApi.md#updateContractByID) | **PUT** /contracts/{contractID} | 


<a name="createContract"></a>
# **createContract**
> ContractResponse createContract(body)



    Create a new Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ContractRequest**](../Models/ContractRequest.md)| Contract Object Payload |

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteContractByID"></a>
# **deleteContractByID**
> ContractResponse deleteContractByID(contractID)



    Delete a Contract By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getContractByID"></a>
# **getContractByID**
> oneOf&lt;ContractResponse,RAWContractResponse&gt; getContractByID(contractID, format)



    Get a Contract By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **format** | **String**| Response format, defaults to JSON if not passed. | [optional] [default to null] [enum: JSON, RAW]

### Return type

[**oneOf&lt;ContractResponse,RAWContractResponse&gt;**](../Models/oneOf&lt;ContractResponse,RAWContractResponse&gt;.md)

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
> ContractResponse sendContractByID(contractID)



    Set State to \&quot;SEND\&quot; and POST to Blochain adapter towards TargetMSP of the Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateContractByID"></a>
# **updateContractByID**
> ContractResponse updateContractByID(contractID, body)



    Update existing Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **body** | [**ContractRequest**](../Models/ContractRequest.md)| Contract Object Payload |

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

