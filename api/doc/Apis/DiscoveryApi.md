# DiscoveryApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDiscoveryMSP**](DiscoveryApi.md#getDiscoveryMSP) | **GET** /discovery/msps/{mspid} | 
[**getDiscoveryMSPs**](DiscoveryApi.md#getDiscoveryMSPs) | **GET** /discovery/msps | 


<a name="getDiscoveryMSP"></a>
# **getDiscoveryMSP**
> String getDiscoveryMSP(mspid)



    Show details for a specific MSP

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mspid** | **String**| Name of a MSP | [default to null]

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getDiscoveryMSPs"></a>
# **getDiscoveryMSPs**
> String getDiscoveryMSPs()



    Show a list of all MSPs

### Parameters
This endpoint does not need any parameter.

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

