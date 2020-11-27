# SignatureResponse
## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**signatureId** | [**String**](string.md) | signatureId from \\\&quot;contract\&quot;-&gt;\\\&quot;signature\\\&quot;-&gt;\\\&quot;\\&lt;mspId\\&gt;\\\&quot;[X]-&gt;\\\&quot;id\\\&quot; | [default to null]
**algorithm** | [**String**](string.md) | The algorithm used to sign | [default to null]
**certificate** | [**String**](string.md) | The certificate of the signer in pem format | [default to null]
**signature** | [**String**](string.md) | The digital signature over the document | [default to null]
**extra** | [**Object**](.md) | Additional Key/Value from \\\&quot;contract\&quot;-&gt;\\\&quot;signature\\\&quot;-&gt;\\\&quot;\\&lt;mspId\\&gt;\\\&quot;[X]-&gt;XXX, eg name, role | [default to null]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

