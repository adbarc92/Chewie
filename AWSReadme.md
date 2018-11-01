All services are pointed to the US West (N. California) server.

# IAM
- Create a new IAM role
- Select Roles on the left and click Create Role
- Select Lambda as the service. 
- Click Next.
- Search for and select AWSLambdaFullAcces policy. 
- Click Next
- Create a role name.
- Click Create Role


# SQS

### unsent-messages-queue
- Click Create New Queue
- Queue Name --> `unsent-messages-queue`
- Receive Message Wait Time `20`
- Click Create Queue
- Click Permissions and Add a Permission
- [x] Everybody 
- [x] All SQS Actions
- Click Add Permissions

### queue-sms-to-twilio
- Click Create New Queue
- Queue Name --> `queue-sms-to-twilio`
- [x] Use Redrive Policy
- Dead Letter Queue `unsent-messages-queue`
- Maximum Receives `2`
- Click Create Queue
- Click Permissions and Add a Permission
- [x] Everybody 
- [x] All SQS Actions
- Click Add Permissions

### twilio-dnc-to-queue
- Click Create New Queue
- Queue Name --> `twilio-dnc-to-queue`
- Receive Message Wait Time `20`
- Click Create Queue
- Click Permissions and Add a Permission
- [x] Everybody 
- [x] All SQS Actions
- Click Add Permissions

### twilio-response-to-queue
- Click Create New Queue
- Queue Name --> `twilio-response-to-queue`
- Receive Message Wait Time `20`
- Click Create Queue
- Click Permissions and Add a Permission
- [x] Everybody 
- [x] All SQS Actions
- Click Add Permissions


# Lambda

### Sending sms to Twilio
- Go to lambda.
- Select Create function
- Author from scratch
- Name --> `send-sms-to-twilio` 
- Select previous IAM existing role.
- Zip all files in `~/server/utils/Lambda/sms-twilio`
- In Lambda under Function code, Code entry type, select Upload a .zip file dropdown.
- Choose the sms-twilio .zip file
- Save
- Add environment variables.
  - `accountSid`
  - `authToken`
- Save
- Click SQS trigger.
- For SQS queue choose `queue-sms-to-twilio`
- Batch size `10`
- Click Add

##### Tests
- Go back to main page and select Select a test event...
- Configure test events
- Create new test event
- Create new Event name
- Add to test body
```javascript
{
  "Records": [
    {
      "messageAttributes": {
        "to": {
          "stringValue": "+1YOUR_PHONE_NUMBER_HERE"
        },
        "from": {
          "stringValue": "+1TWILIO_PHONE_NUMBER_HERE"
        }
      },
      "body": "Testing Lambda Function"
    }
  ]
}
```
- Save

### Receive Response from Twilio
- Go to lambda.
- Select Create function
- Author from scratch
- Name --> `receive-response-from-twilio` 
- Select previous IAM existing role.
- Zip  and upload all files in `~/server/utils/Lambda/sms-twilio-response`
- Add environment variables for SQS queues.
  - `saveUserDncQueue` --> twilio-dnc-to-queue URL
  - `saveUserResponseQueue` --> twilio-response-to-queue URL
- Select API gateway trigger.
  - Create a new API
  - AWS IAM Security
  - Create API Name
  - Click Add
- Under API Gateway
- Select API
- Click Actions and click Create Method
- Select POST
- Under Lambda Function select your Lambda
- Click Integration Request.
- Click Create new Mapping Template
  - Content-Type - `application/x-www-form-urlencoded`
  - Use -- Template Code -- at the bottom of document.
- Set this API endpoint as the webhook for Twilio

##### Tests
- Go back to main page and select Select a test event...
- Configure test events
- Create new test event to test sending to `twilio-response-to-queue`
- Create new Event name 
- Add to test body
```javascript
{
  "Body": "Testing twilio-response-to-queue",
  "To": "+15554443333",
  "From": "+19998887777"
}
```
- Save
- Configure another test event
- Create new test event to test sending to `twilio-dnc-to-queue`
- Create new Event name 
- Add to test body
```javascript
{
  "Body": "Stop",
  "To": "+15554443333",
  "From": "+19998887777"
}
```
- Save


##### Template Code

```javascript
#if ($context.httpMethod == "POST")
 #set($rawAPIData = $input.path('$'))
#elseif ($context.httpMethod == "GET")
 #set($rawAPIData = $input.params().querystring)
 #set($rawAPIData = $rawAPIData.toString())
 #set($rawAPIDataLength = $rawAPIData.length() - 1)
 #set($rawAPIData = $rawAPIData.substring(1, $rawAPIDataLength))
 #set($rawAPIData = $rawAPIData.replace(", ", "&"))
#else
 #set($rawAPIData = "")
#end

#set($countAmpersands = $rawAPIData.length() - $rawAPIData.replace("&", "").length())

#if ($countAmpersands == 0)
 #set($rawPostData = $rawAPIData + "&")
#end
 
#set($tokenisedAmpersand = $rawAPIData.split("&"))
 
#set($tokenisedEquals = [])

#foreach( $kvPair in $tokenisedAmpersand )
 #set($countEquals = $kvPair.length() - $kvPair.replace("=", "").length())
 #if ($countEquals == 1)
  #set($kvTokenised = $kvPair.split("="))
  #if ($kvTokenised[0].length() > 0)
   #set($devNull = $tokenisedEquals.add($kvPair))
  #end
 #end
#end

{
#foreach( $kvPair in $tokenisedEquals )
  #set($kvTokenised = $kvPair.split("="))
 "$util.urlDecode($kvTokenised[0])" : #if($kvTokenised[1].length() > 0)"$util.urlDecode($kvTokenised[1])"#{else}""#end#if( $foreach.hasNext ),#end
#end
}
```