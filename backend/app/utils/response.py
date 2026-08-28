def api_response(success: bool, message: str, data=None, error=None):
    return {
        "success": success,
        "message": message,
        "data":    data,
        "error":   error
    }
