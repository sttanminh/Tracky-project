import os, unittest

class ConnectionHandlerTest(unittest.TestCase):

    def test_WHEN_importConntionHandler_THEN_noError(self):

        # setup environment variable for boto
        os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'


        import src.handlers.ConnectionHandler
        self.assertTrue(True)
