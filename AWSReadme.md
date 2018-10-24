All services are pointed to the US West (N. California) server.

IAM
- Create a new IAM role
- Select Roles then Create role
- Select Lambda as the service.
- Select AWSLambdaFullAcces policy.
- Create a role name.


SQS
- Create queue to send Twilio message to Lambda
- Use default settings
- Create permissions

- Create queue to receive DNC message
- Add 20 second Receive Message Wait Time
- Create permissions

- Create queue to receive user response
- Add 20 second Receive Message Wait Time
- Create permissions

- Create dead letter queue to handle messages lambda couldnt send
- Add 20 second Receive Message Wait Time
- Create permissions


Lambda

Send Message To Twilio
- Go to lambda service.
- Select Create function
- Create function name for function to send Twilio message. 
- Select previous IAM existing role.
- Zip all files in ~/server/utils/Lambda/Twilio
- In Lambda under Function code, select Upload a .zip file dropdown.
- Add environment variables.
  - accountSid
  - authToken
- Add SQS trigger for message to twilio queue
- Add SQS queue as dead letter queue

Receive Response from Twilio
- Repeat first five steps above.
- Zip  and upload all files in ~/server/utils/Lambda/TwilioResponse
- Add environment variables for SQS queues.
  - *SQS queue to send users DNC request*
  - *SQS queue to send all other users responses*
- Select API gateway trigger.
  - Create new API
  - AWS IAM Security
  - Create API Name
- Select API
- Create new Method Action POST.
- Select your Lambda function to be invoked on POST
- Click Integration Request.
- Create new Mapping Template
  - Content-Type - application/x-www-form-urlencoded
  - Use -- Template Code -- at the bottom of document.
- Set this API endpoint as the webhook for Twilio
  


-- Template Code --

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