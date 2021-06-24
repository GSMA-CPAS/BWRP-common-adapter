# ContractSignatureResponse
## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**signatureId** | [**String**](string.md) |  | [default to null]
**contractId** | [**String**](string.md) |  | [default to null]
**msp** | [**String**](string.md) |  | [default to null]
**state** | [**String**](string.md) |  | [default to null]
**algorithm** | [**String**](string.md) | The algorithm used to sign | [optional] [default to null]
**certificate** | [**String**](string.md) | The certificate of the signer in pem format | [optional] [default to null]
**signature** | [**String**](string.md) | The digital signature over the document | [optional] [default to null]
**extra** | [**Object**](.md) | Additional Key/Value from \\\&quot;signature\\\&quot;-&gt;\\\&quot;\\&lt;mspId\\&gt;\\\&quot;[X]-&gt;XXX, eg name, role | [optional] [default to null]
**blockchainRef** | [**Map**](object.md) |  | [optional] [default to null]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

