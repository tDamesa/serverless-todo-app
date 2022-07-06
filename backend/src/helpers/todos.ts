import { TodosAccess } from './todosAccess'
import { uploadAttachment } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';

// TODO: Implement businessLogic

const todoAccess = new TodosAccess();
const logger = createLogger('todos')

export async function createToDo(request, event: APIGatewayProxyEvent){
    const todoId = uuid.v4();
    const userId = getUserId(event);
    const newTodo: TodoItem = {
        todoId: todoId,
        userId: userId,
        name: request.name,
        dueDate: request.dueDate,
        done: false,
        createdAt: new Date().toISOString(),
        attachmentUrl:`https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    }
    await todoAccess.createTodo(newTodo);
    return newTodo;
}


export async function getTodos(todoId: string){
    const todo = await todoAccess.getTodos(todoId);
    return todo;
}

// export async function getAllToDos(){
//     const todos = await todoAccess.getAllTodos();
//     return todos;
// }
export async function updateToDo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest){
    await todoAccess.updateTodo(userId, todoId, updatedTodo);
}

export async function deleteToDo(userId: string, todoId: string){
    await todoAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(todoId: string){
    return await uploadAttachment(todoId);
}