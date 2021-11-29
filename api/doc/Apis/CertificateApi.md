# CertificateApi

All URIs are relative to *http://localhost/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**setCertificateRoot**](CertificateApi.md#setCertificateRoot) | **PUT** /certificate/root | 
[**submitCertificateRevocationList**](CertificateApi.md#submitCertificateRevocationList) | **POST** /certificate/revoke | 


<a name="setCertificateRoot"></a>
# **setCertificateRoot**
> String setCertificateRoot(string)



    Upload a root certificate

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **string** | [**List**](../Models/string.md)| Set the signature root certificate. |

### Return type

[**String**](../Models/string.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: text/plain, application/json

<a name="submitCertificateRevocationList"></a>
# **submitCertificateRevocationList**
> Object submitCertificateRevocationList(body)



    Upload a certificate revocation list (CRL), revoked certificates are stored on the ledger and cannot be used for signing thereafter

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**CRL**](../Models/CRL.md)| Submit a certificate revocation list signed by a CA. |

### Return type

[**Object**](../Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: text/plain, application/json

