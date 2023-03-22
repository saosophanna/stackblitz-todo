import { TodoHooker } from "@/hook/todo.hook"
import { TodoItem } from "@/models/todo.model"

export interface TodoProps {
    item: TodoItem,
    hook:TodoHooker
}

export function Todo(props: TodoProps) {
    const { item,hook } = props

    return <>
        <li className="todo-item-container">
            <h5 style={{
                "textDecoration": item.isComplated ? "line-through" : "none"
            }}>{item.todo}</h5>
            <button onClick={() => hook.handleMakeComplate(item)} className="action-button">{item.isComplated ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
            <button onClick={() => hook.handleEditTodo(item)} className="action-button">Edit</button>
            <button onClick={() => hook.handleRemoveTodo(item)} className="action-button">Remove</button>
        </li>
    </>

}