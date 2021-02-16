# ContractApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createContract**](ContractApi.md#createContract) | **POST** /contracts/ | 
[**deleteContractById**](ContractApi.md#deleteContractById) | **DELETE** /contracts/{contractId} | 
[**getContractById**](ContractApi.md#getContractById) | **GET** /contracts/{contractId} | 
[**getContracts**](ContractApi.md#getContracts) | **GET** /contracts/ | 
[**sendContractById**](ContractApi.md#sendContractById) | **PUT** /contracts/{contractId}/send/ | 
[**updateContractById**](ContractApi.md#updateContractById) | **PUT** /contracts/{contractId} | 


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

<a name="deleteContractById"></a>
# **deleteContractById**
> ContractResponse deleteContractById(contractId)



    Delete a Contract By its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getContractById"></a>
# **getContractById**
> oneOf&lt;ContractResponse,RAWContractResponse&gt; getContractById(contractId, format)



    Get a Contract By its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
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
> String getContracts(withMSPs, states)



    Show a list of all Contracts

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **withMSPs** | [**List**](../Models/String.md)| One or more MSPs | [optional] [default to null]
 **states** | [**List**](../Models/String.md)| One or more states | [optional] [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="sendContractById"></a>
# **sendContractById**
> ContractResponse sendContractById(contractId)



    Set State to \&quot;SEND\&quot; and POST to Blochain adapter towards TargetMsp of the Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateContractById"></a>
# **updateContractById**
> ContractResponse updateContractById(contractId, body)



    Update existing Contract

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **body** | [**ContractRequest**](../Models/ContractRequest.md)| Contract Object Payload |

### Return type

[**ContractResponse**](../Models/ContractResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

