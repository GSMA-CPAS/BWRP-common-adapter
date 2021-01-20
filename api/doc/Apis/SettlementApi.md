# SettlementApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSettlementById**](SettlementApi.md#getSettlementById) | **GET** /contracts/{contractId}/settlements/{settlementId} | 
[**getSettlements**](SettlementApi.md#getSettlements) | **GET** /contracts/{contractId}/settlements/ | 
[**sendSettlementById**](SettlementApi.md#sendSettlementById) | **PUT** /contracts/{contractId}/settlements/{settlementId}/send/ | 


<a name="getSettlementById"></a>
# **getSettlementById**
> Object getSettlementById(contractId, settlementId)



    Get Settlement Object by its Id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **settlementId** | **String**| The Settlement Id | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSettlements"></a>
# **getSettlements**
> String getSettlements(contractId)



    Get All Settlement of a given Contract

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

<a name="sendSettlementById"></a>
# **sendSettlementById**
> Object sendSettlementById(contractId, settlementId)



    Set State to \&quot;SEND\&quot; and POST to Blockchain adapter towards TargetMsp of the Usage

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contractId** | **String**| The contract Id | [default to null]
 **settlementId** | **String**| The Settlement Id | [default to null]

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

