# DiscoveryApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDiscoveryMsp**](DiscoveryApi.md#getDiscoveryMsp) | **GET** /discovery/msps/{mspId} | 
[**getDiscoveryMsps**](DiscoveryApi.md#getDiscoveryMsps) | **GET** /discovery/msps | 


<a name="getDiscoveryMsp"></a>
# **getDiscoveryMsp**
> String getDiscoveryMsp(mspId)



    Show details for a specific Msp

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mspId** | **String**| Name of a Msp | [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getDiscoveryMsps"></a>
# **getDiscoveryMsps**
> String getDiscoveryMsps()



    Show a list of all Msps

### Parameters
This endpoint does not need any parameter.

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

