# SettlementApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSettlementByID**](SettlementApi.md#getSettlementByID) | **GET** /contracts/{contractID}/settlements/{settlementID} | 
[**getSettlements**](SettlementApi.md#getSettlements) | **GET** /contracts/{contractID}/settlements/ | 


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

