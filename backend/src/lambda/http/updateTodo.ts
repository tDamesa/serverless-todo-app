import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateToDo } from '../../bussinessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      const todoId = event.pathParameters!.todoId!;
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body!)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId = getUserId(event)
      const item = await updateToDo(userId, todoId, updatedTodo)
      return {
        statusCode: 200,
        body: JSON.stringify({
          item: item
        })
      }} catch (error) { 
        return { statusCode: 400, 
          body: JSON.stringify({ 
            error: error.message 
          }) 
        }}
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
