import json
from boto3.dynamodb.types import TypeDeserializer
from enum import Enum

serializer = TypeDeserializer()

def deserialize(data):
    if isinstance(data, list):
       return [deserialize(v) for v in data]

    if isinstance(data, dict):
        try: 
            return serializer.deserialize(data)
        except TypeError:
            return { k : deserialize(v) for k, v in data.iteritems() }
    else:
        return data

class DynamoDBFormat(dict):
    def __init__(self, variable):
        self.convertVariable(variable)

    def convertVariable(self, variable):
        
        def _convertVariable(d , var):
            if type(var) is str:
                d['S'] = var
            elif type(var) is int or type(var) is float:
                d['N'] = str(var)
            elif isinstance(var, Enum):
                d['S'] = str(var.value)
            elif isinstance(var, bool):
                d['BOOL'] = var
            elif var is None or var == "":
                d['NULL'] = True
            elif isinstance(var, dict):
                value = {}
                for k in var:
                    value[k] = _convertVariable({},var[k])
                d['M'] = value 
            elif type(var) is list:
                value = []
                for v in var:
                    value.append(_convertVariable({},v))
                d['L'] = value
            else:
                raise Exception("DynamoDBFormat : Unexpected data type - " + str(type(var)) +" " + str(var))
            return d
        
        _convertVariable(self, variable)

class Response(dict):
    def __init__(self, statusCode, body, excludeHeaders = False, cookies = []):
        encodedBody = body
        if not isinstance(body, str):
            encodedBody = json.dumps(body)
        
        if not excludeHeaders:
            headers = {
                # TODO: Increase restriction for better security
                "Access-Control-Allow-Origin" : ["*"]
            }
            if len(cookies) > 0:
                headers["Set-Cookie"] = cookies
            self["multiValueHeaders"] = headers
        
        self["statusCode"] = statusCode
        self["body"] = encodedBody

