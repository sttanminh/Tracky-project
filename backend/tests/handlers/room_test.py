import os, unittest

class RoomHandlerTest(unittest.TestCase):

    def test_WHEN_importRoomHandler_THEN_noError(self):

        # setup environment variable for boto
        os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

        import src.handlers.RoomHandler
        self.assertTrue(True)
