# SettlementApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createSettlement**](SettlementApi.md#createSettlement) | **POST** /contract/{contractID}/settlement/ | 
[**deleteSettlementByID**](SettlementApi.md#deleteSettlementByID) | **DELETE** /contract/{contractID}/settlement/{settlementID} | 
[**getSettlementByID**](SettlementApi.md#getSettlementByID) | **GET** /contract/{contractID}/settlement/{settlementID} | 
[**getSettlements**](SettlementApi.md#getSettlements) | **GET** /contract/{contractID}/settlement/ | 
[**updateSettlementByID**](SettlementApi.md#updateSettlementByID) | **PUT** /contract/{contractID}/settlement/{settlementID} | 


<a name="createSettlement"></a>
# **createSettlement**
> String createSettlement(contractID, body)



    Create a new Settlement

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **body** | **Object**| Settlement Object Payload |

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteSettlementByID"></a>
# **deleteSettlementByID**
> SuccessResponse deleteSettlementByID(contractID, settlementID)



    Delete a Settlement By its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **settlementID** | **String**| The Settlement ID | [default to null]

### Return type

[**SuccessResponse**](../Models/SuccessResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSettlementByID"></a>
# **getSettlementByID**
> Object getSettlementByID(contractID, settlementID)



    Get Settlement Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **settlementID** | **String**| The Settlement ID | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSettlements"></a>
# **getSettlements**
> String getSettlements(contractID)



    Get All Settlement of a given Contract

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

<a name="updateSettlementByID"></a>
# **updateSettlementByID**
> Object updateSettlementByID(contractID, settlementID, body)



    Update Settlement Object by its ID

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractID** | **String**| The contract ID | [default to null]
 **settlementID** | **String**| The Settlement ID | [default to null]
 **body** | **Object**| Settlement Object Payload |

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

