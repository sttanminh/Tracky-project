import unittest
from enum import Enum
from src.common.utils import DynamoDBFormat, Response, deserialize


class UtilTest(unittest.TestCase):

    def test_WHEN_SerialiseObjToDynamoDBFormat_THEN_returnCorrectFormat(self):
        class Year(Enum):
            YEAR_1 = "Year 1"
            YEAR_2 = "Year 2"
            YEAR_3 = "Year 3"
            YEAR_4 = "Year 4"
            YEAR_5 = "Year 5"
            YEAR_6 = "Year 6"
        try:
            data = {
                "float": 0.1,
                "int": 123,
                "string": "abcd",
                "enum": Year.YEAR_1,
                "none": None,
                "list": [1, "a", 1.2, None, {"ccc": 1}],
                "dict": {"a": 1, "b": 1.1, "c": "efjh"}
            }
            formatedData = DynamoDBFormat(data)
            self.assertTrue(isinstance(formatedData, dict),
                            "Formatted data should be Dictionary")
            self.assertTrue(
                type(formatedData["M"]) is dict, "Value of formatted data should be Dictionary")

            self.assertTrue("float" in formatedData["M"]
                            and "N" in formatedData["M"]["float"]
                            and formatedData["M"]["float"]["N"] == str(data["float"]), "Float value should be labeled N")

            self.assertTrue("int" in formatedData["M"]
                            and "N" in formatedData["M"]["int"]
                            and formatedData["M"]["int"]["N"] == str(data["int"]), "int value should be labeled N")

            self.assertTrue("string" in formatedData["M"]
                            and "S" in formatedData["M"]["string"]
                            and formatedData["M"]["string"]["S"] == str(data["string"]), "string value should be labeled S")

            self.assertTrue("enum" in formatedData["M"]
                            and "S" in formatedData["M"]["enum"]
                            and formatedData["M"]["enum"]["S"] == str(data["enum"].value), "enum value should be labeled S")

            self.assertTrue("list" in formatedData["M"]
                            and "L" in formatedData["M"]["list"], "list value should be labeled L")

            self.assertTrue("dict" in formatedData["M"]
                            and "M" in formatedData["M"]["dict"], "dict value should be labeled M")

            self.assertTrue("none" in formatedData["M"]
                            and "NULL" in formatedData["M"]["none"], "None value should be labeled NULL")

        except Exception:
            self.fail(
                "DynamoDBFormat should be able to handle all different format")

    def test_WHEN_deserialiseDynamoDBFormat_THEN_returnCorrectData(self):
        obj = deserialize(
            {
                "M": {
                    "numbers": {
                        "L": [
                            {
                                "N": "2"
                            },
                            {
                                "S": "string"
                            },
                            {
                                "N": "6"
                            },
                            {
                                "N": "7"
                            }
                        ]
                    },
                    "text": {
                        "S": "this is something text"
                    }
                }
            }
        )

        self.assertTrue("numbers" in obj and "text" in obj, 
                        "Missing properties after deserialising")
        self.assertTrue(type(obj["numbers"]) is list, "Should be able to deserialise list")
        self.assertEqual(len(obj["numbers"]), 4, "Deserialised list has correct number of elements")
        self.assertEqual(obj["numbers"][0], 2, "Deserialised list has correct elements type")
        self.assertEqual(obj["numbers"][1], "string", "Deserialised list has correct elements type")
        self.assertEqual(obj["text"], "this is something text", "Should be able to deserialise string")
        self.assertEqual(obj["text"], "this is something text", "Deserialised list has correct number of elements")
    
    def test_WHEN_createResponse_THEN_correctResponseGenerated(self):
        res = Response(200, "Test string body")
        self.assertEqual(res["statusCode"], 200, "Should have correct status code")
        self.assertEqual(res["body"], "Test string body", "Should have correct body")
        self.assertTrue("multiValueHeaders" in res, "Should contain headers by default")
        self.assertTrue("Access-Control-Allow-Origin" in res["multiValueHeaders"], "Should contain CORS in headers by default")
        self.assertTrue(type(res["multiValueHeaders"]["Access-Control-Allow-Origin"]) is list, "Header value should be a list (because multivalueHeaders")

        res = Response(200, {"number" : 1234})
        self.assertEqual(res["body"], '{"number": 1234}', "Body should be stringified")