const ErrorHandler = (error, request, response, next) => {
    console.log('ERROR HANDLER')
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Malformatted id'})
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
  }

  export default ErrorHandler